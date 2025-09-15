import type { DrawingStyle, LngLat, BehaviorType } from '@yandex/ymaps3-types'
import { useYandexMaps } from '@/hooks/use-yandex-maps'
import type { MapProps } from '../types'
import { useCallback, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/button'

// Константа для оптимизации - пропускаем каждую N-ю точку
const POINT_SKIP_INTERVAL = 10

export const Map: React.FC<MapProps> = ({
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

  const handlePointerDown = useCallback(
    (_obj: any, event: any) => {
      if (mode !== 'polygon' || !isDrawing) return
      event.stopPropagation()
      setIsPointerDown(true)
      pointCounterRef.current = 0 // Сбрасываем счетчик при начале рисования
      const coords: LngLat | undefined = event?.coordinates
      if (!coords || !Array.isArray(coords) || coords.length !== 2) return
      onPolygonPointAdd(coords as [number, number])
    },
    [mode, isDrawing, onPolygonPointAdd]
  )

  const handlePointerMove = useCallback(
    (_obj: any, event: any) => {
      if (mode !== 'polygon' || !isDrawing || !isPointerDown) return
      event.stopPropagation()
      const coords: LngLat | undefined = event?.coordinates
      if (!coords || !Array.isArray(coords) || coords.length !== 2) return

      // Увеличиваем счетчик
      pointCounterRef.current += 1

      // Добавляем точку только каждую N-ю или если это первая точка
      if (pointCounterRef.current % POINT_SKIP_INTERVAL === 0 || pointCounterRef.current === 1) {
        // Дополнительная проверка на расстояние от последней точки
        if (currentPolygon && currentPolygon.length > 0) {
          const last = currentPolygon[currentPolygon.length - 1]
          const dx = Math.abs(coords[0] - last[0])
          const dy = Math.abs(coords[1] - last[1])
          // Если точка слишком близко к последней, не добавляем
          if (dx < 0.00001 && dy < 0.00001) return
        }

        onPolygonPointAdd(coords as [number, number])
      }
    },
    [mode, isDrawing, isPointerDown, currentPolygon, onPolygonPointAdd]
  )

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

  // Геометрия для текущего рисуемого полигона (только линия)
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

  // Функция для получения цветовых значений
  const getColorValue = (color: string): string => {
    const colors = {
      blue: '#3b82f6',
      red: '#ef4444',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
      pink: '#ec4899'
    }
    return colors[color as keyof typeof colors] || '#3b82f6'
  }

  // Стили
  const lineStyle: DrawingStyle = useMemo(
    () => ({
      stroke: [{ color: getColorValue(selectedColor), width: 2 }],
      simplificationRate: 0
    }),
    [selectedColor]
  )

  const getPolygonStyle = (color: string): DrawingStyle => ({
    fill: `${getColorValue(color)}80`, // Добавляем прозрачность
    stroke: [{ color: getColorValue(color), width: 2 }],
    simplificationRate: 0
  })

  if (!yandexMapModules) {
    return <div>Загрузка карты...</div>
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
              stroke: [{
                color: getColorValue(polygon.color),
                width: isSelected ? 4 : 2
              }]
            }}
          />
        )
      })}

      {/* Отображение текущего рисуемого полигона как линии */}
      {currentPolygonLineGeometry && (
        <YMapFeature geometry={currentPolygonLineGeometry} style={lineStyle} />
      )}

      {/* Отображение маркеров */}
      {markers.map((marker) => (
        <YMapMarker key={marker.id} coordinates={marker.coordinates}>
          <div className="bg-red-500 text-white px-2 py-1 rounded text-sm shadow-lg">
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
          <div className="pointer-events-none absolute top-4 left-1/2 z-99 -translate-x-1/2">
            <div className="pointer-events-auto flex gap-2">
              {mode === 'polygon' && !isDrawing && (
                <Button onClick={onPolygonStart}>Рисовать полигон</Button>
              )}
              {mode === 'polygon' && currentPolygon && currentPolygon.length >= 3 && (
                <Button onClick={onPolygonSave} variant="accent">
                  Сохранить
                </Button>
              )}
              {mode === 'polygon' && (isDrawing || currentPolygon) && (
                <Button onClick={onPolygonClear} variant="secondary">
                  Очистить
                </Button>
              )}
              {mode === 'markers' && (
                <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded shadow">
                  Кликните на карту для добавления маркера
                </div>
              )}
            </div>
          </div>

        </>
      )}

    </YMap>
  )
}
