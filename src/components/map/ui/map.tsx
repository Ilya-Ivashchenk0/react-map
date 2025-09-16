import type { DrawingStyle, LngLat, BehaviorType } from '@yandex/ymaps3-types'
import { useYandexMaps } from '@/hooks/use-yandex-maps'
import type { MapProps } from '../types'
import { useCallback, useMemo, useState, useRef, memo } from 'react'
import { Button } from '@/components/button'
import { getColorValue } from '@/config/constants/colors'
import { MAP_DEFAULTS, MESSAGES, PERFORMANCE } from '@/config/constants/app'
import type { PolygonColor } from '@/types'

// Основной компонент карты с поддержкой рисования полигонов и размещения маркеров
export const Map: React.FC<MapProps> = memo(
  ({
    mode,
    location,
    controls,
    className,
    polygons,
    markers,
    currentPolygon,
    isDrawing,
    selectedPolygonId,
    selectedColor,
    onPolygonStart,
    onPolygonSave,
    onPolygonClear,
    onPolygonPointAdd,
    onMarkerAdd,
    onPolygonSelect,
    onPolygonAutoFinish
  }) => {
    const yandexMapModules = useYandexMaps()
    const [isPointerDown, setIsPointerDown] = useState(false)
    const pointCounterRef = useRef(0)

    const mapBehaviors = useMemo((): BehaviorType[] => {
      if (isDrawing && mode === 'polygon') {
        return ['scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt']
      }
      return ['drag', 'scrollZoom', 'dblClick', 'mouseRotate', 'mouseTilt']
    }, [isDrawing, mode])

    // Обработчик клика по карте
    const handleMapClick = useCallback(
      (_obj: any, event: any) => {
        const coords: LngLat | undefined = event?.coordinates
        if (!coords || !Array.isArray(coords) || coords.length !== 2) return

        if (mode === 'markers') {
          onMarkerAdd(coords as [number, number])
        } else if (mode === 'polygon' && isDrawing) {
          onPolygonPointAdd(coords as [number, number])
        } else if (mode === 'polygon' && !isDrawing) {
          // Сбрасываем выбор полигона при клике на пустое место
          onPolygonSelect(null)
        }
      },
      [mode, isDrawing, onMarkerAdd, onPolygonPointAdd, onPolygonSelect]
    )

    // Обработчик нажатия мыши для начала рисования полигона
    const handlePointerDown = useCallback(
      (_obj: any, event: any) => {
        if (mode !== 'polygon' || !isDrawing) return
        event.stopPropagation()
        setIsPointerDown(true)
        pointCounterRef.current = 0
        const coords: LngLat | undefined = event?.coordinates
        if (!coords || !Array.isArray(coords) || coords.length !== 2) return
        onPolygonPointAdd(coords as [number, number])
      },
      [mode, isDrawing, onPolygonPointAdd]
    )

    // Обработчик движения мыши для рисования полигона
    const handlePointerMove = useCallback(
      (_obj: any, event: any) => {
        if (mode !== 'polygon' || !isDrawing || !isPointerDown) return
        event.stopPropagation()
        const coords: LngLat | undefined = event?.coordinates
        if (!coords || !Array.isArray(coords) || coords.length !== 2) return

        pointCounterRef.current += 1

        if (
          pointCounterRef.current % MAP_DEFAULTS.POINT_SKIP_INTERVAL === 0 ||
          pointCounterRef.current === 1
        ) {
          if (currentPolygon && currentPolygon.length > 0) {
            const last = currentPolygon[currentPolygon.length - 1]
            const dx = Math.abs(coords[0] - last[0])
            const dy = Math.abs(coords[1] - last[1])
            if (
              dx < PERFORMANCE.MIN_POINT_DISTANCE &&
              dy < PERFORMANCE.MIN_POINT_DISTANCE
            )
              return
          }

          onPolygonPointAdd(coords as [number, number])
        }
      },
      [mode, isDrawing, isPointerDown, currentPolygon, onPolygonPointAdd]
    )

    // Обработчик отпускания мыши для завершения рисования полигона
    const handlePointerUp = useCallback(
      (_obj: any, event: any) => {
        if (mode !== 'polygon' || !isDrawing) return
        event.stopPropagation()
        setIsPointerDown(false)
        pointCounterRef.current = 0 // Сбрасываем счетчик при отпускании мыши

        // Автоматически завершаем рисование при отпускании мыши
        if (currentPolygon && currentPolygon.length >= 3) {
          onPolygonAutoFinish?.()
        }
      },
      [mode, isDrawing, currentPolygon, onPolygonAutoFinish]
    )

    // Геометрия для текущего рисуемого полигона
    const currentPolygonLineGeometry = useMemo(() => {
      if (!currentPolygon || currentPolygon.length < 2) return null
      return {
        type: 'LineString' as const,
        coordinates: currentPolygon
      }
    }, [currentPolygon])

    // Геометрия для завершенных полигонов
    const completedPolygonsGeometry = useMemo(() => {
      return polygons.map(polygon => ({
        type: 'Polygon' as const,
        coordinates: [polygon.points]
      }))
    }, [polygons])

    // Стили для текущего рисуемого полигона
    const lineStyle: DrawingStyle = useMemo(
      () => ({
        stroke: [{ color: getColorValue(selectedColor), width: 2 }],
        simplificationRate: 0
      }),
      [selectedColor]
    )

    // Функция для получения стилей полигона по цвету
    const getPolygonStyle = useCallback(
      (color: string): DrawingStyle => ({
        fill: `${getColorValue(color as PolygonColor)}80`, // Добавляем прозрачность
        stroke: [{ color: getColorValue(color as PolygonColor), width: 2 }],
        simplificationRate: 0
      }),
      []
    )

    if (!yandexMapModules) {
      return <div>{MESSAGES.LOADING_MAP}</div>
    }

    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapControls,
      YMapListener,
      YMapFeature,
      YMapZoomControl,
      YMapGeolocationControl,
      YMapMarker
    } = yandexMapModules

    return (
      <YMap
        className={className}
        location={location}
        mode="vector"
        copyrights={false}
        behaviors={mapBehaviors}
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <YMapListener
          onClick={handleMapClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {/* Отображение завершенных полигонов */}
        {completedPolygonsGeometry.map((geometry, index) => {
          const polygon = polygons[index]
          const isSelected = selectedPolygonId === polygon.id
          const style = getPolygonStyle(polygon.color)

          return (
            <YMapFeature
              key={`polygon-${index}`}
              geometry={geometry}
              style={{
                ...style,
                stroke: [
                  {
                    color: getColorValue(polygon.color),
                    width: isSelected ? 4 : 2
                  }
                ]
              }}
            />
          )
        })}

        {/* Отображение текущего рисуемого полигона как линии */}
        {currentPolygonLineGeometry && (
          <YMapFeature
            geometry={currentPolygonLineGeometry}
            style={lineStyle}
          />
        )}

        {/* Отображение маркеров */}
        {markers.map(marker => (
          <YMapMarker key={marker.id} coordinates={marker.coordinates}>
            <div
              className="rounded px-2 py-1 text-sm font-medium text-white shadow-lg"
              style={{ backgroundColor: getColorValue(marker.color) }}
            >
              {marker.title}
            </div>
          </YMapMarker>
        ))}

        {controls && (
          <>
            <YMapControls position="left">
              <YMapGeolocationControl />
            </YMapControls>
            <YMapControls position="right">
              <YMapZoomControl />
            </YMapControls>
            <div className="pointer-events-none absolute top-20 left-1/2 z-99 -translate-x-1/2">
              <div className="pointer-events-auto flex gap-2">
                {mode === 'polygon' && !isDrawing && (
                  <Button onClick={onPolygonStart}>
                    {MESSAGES.DRAW_POLYGON_BUTTON}
                  </Button>
                )}
                {mode === 'polygon' &&
                  currentPolygon &&
                  currentPolygon.length >= MAP_DEFAULTS.MIN_POLYGON_POINTS && (
                    <Button onClick={onPolygonSave} variant="accent">
                      {MESSAGES.SAVE_BUTTON}
                    </Button>
                  )}
                {mode === 'polygon' && (isDrawing || currentPolygon) && (
                  <Button onClick={onPolygonClear} variant="secondary">
                    {MESSAGES.CLEAR_BUTTON}
                  </Button>
                )}
                {mode === 'markers' && (
                  <div className="rounded bg-white px-3 py-2 text-sm text-gray-600 shadow">
                    {MESSAGES.ADD_MARKER_HINT}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </YMap>
    )
  }
)

Map.displayName = 'Map'
