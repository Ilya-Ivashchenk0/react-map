import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Map } from '@/components/map'
import { ModeSwitcher } from '@/components/mode-switcher'
import { NameColorForm } from '@/components/name-color-form'
import type { ModeType, Polygon, Marker, PolygonColor } from '@/types'
import type { LngLat } from '@yandex/ymaps3-types'
import { useMemo, useState, useCallback, memo } from 'react'
import { MAP_DEFAULTS, MESSAGES, UI_CONFIG } from '@/config/constants/app'
import {
  createPolygon,
  createMarker,
  validatePolygon,
  validateMarker
} from '@/utils/data'
import { PolygonMarkerList } from '@/components/polygon-marker-list'

// Главная страница приложения с картой и управлением полигонами/маркерами
export const HomePage = memo(() => {
  // Основные состояния приложения
  const [mode, setMode] = useState<ModeType>('default')
  const [mapCenter] = useState<LngLat>(MAP_DEFAULTS.DEFAULT_CENTER)

  // Состояние для полигонов и маркеров
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [markers, setMarkers] = useState<Marker[]>([])
  const [currentPolygon, setCurrentPolygon] = useState<
    [number, number][] | null
  >(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
    null
  )
  const [selectedColor] = useState<PolygonColor>('blue')

  // Состояние для модального окна полигона
  const [isPolygonModalOpen, setIsPolygonModalOpen] = useState(false)
  const [pendingPolygon, setPendingPolygon] = useState<
    [number, number][] | null
  >(null)
  const [polygonName, setPolygonName] = useState('')
  const [polygonColor, setPolygonColor] = useState<PolygonColor>('blue')

  // Состояние для создания маркера
  const [isMarkerFormOpen, setIsMarkerFormOpen] = useState(false)
  const [pendingMarkerCoords, setPendingMarkerCoords] = useState<
    [number, number] | null
  >(null)
  const [markerName, setMarkerName] = useState('')
  const [markerColor, setMarkerColor] = useState<PolygonColor>('blue')

  // Настройки расположения карты
  const location = useMemo(
    () => ({
      center: mapCenter,
      zoom: MAP_DEFAULTS.DEFAULT_ZOOM
    }),
    [mapCenter]
  )

  // Обработчики для полигонов
  const handlePolygonStart = useCallback(() => {
    setCurrentPolygon([])
    setIsDrawing(true)
  }, [])

  // Обработчик сохранения полигона
  const handlePolygonSave = useCallback(() => {
    if (
      currentPolygon &&
      currentPolygon.length >= MAP_DEFAULTS.MIN_POLYGON_POINTS
    ) {
      // Сохраняем полигон во временное состояние и открываем модальное окно
      setPendingPolygon(currentPolygon)
      setPolygonName(`Полигон ${polygons.length + 1}`)
      setPolygonColor('blue')
      setIsPolygonModalOpen(true)
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [currentPolygon, polygons.length])

  // Обработчик сохранения полигона из модального окна
  const handlePolygonModalSave = useCallback(() => {
    if (pendingPolygon && polygonName.trim()) {
      const newPolygon = createPolygon(
        pendingPolygon,
        polygonName.trim(),
        polygonColor
      )

      if (validatePolygon(newPolygon)) {
        setPolygons(prev => [...prev, newPolygon])
        setPendingPolygon(null)
        setIsPolygonModalOpen(false)
        setPolygonName('')
      }
    }
  }, [pendingPolygon, polygonName, polygonColor])

  // Обработчик закрытия модального окна полигона
  const handlePolygonModalClose = useCallback(() => {
    setIsPolygonModalOpen(false)
    setPendingPolygon(null)
    setPolygonName('')
  }, [])

  // Обработчик очистки текущего полигона
  const handlePolygonClear = useCallback(() => {
    setCurrentPolygon(null)
    setIsDrawing(false)
  }, [])

  // Обработчик выбора полигона
  const handlePolygonSelect = useCallback((id: string | null) => {
    setSelectedPolygonId(id)
  }, [])

  // Обработчик добавления точки к полигону
  const handlePolygonPointAdd = useCallback(
    (point: [number, number]) => {
      if (mode === 'polygon' && isDrawing) {
        setCurrentPolygon(prev => (prev ? [...prev, point] : [point]))
      }
    },
    [mode, isDrawing]
  )

  // Обработчики для маркеров
  const handleMarkerAdd = useCallback(
    (coordinates: [number, number]) => {
      if (mode === 'markers') {
        setPendingMarkerCoords(coordinates)
        setMarkerName(`Маркер ${markers.length + 1}`)
        setMarkerColor('blue')
        setIsMarkerFormOpen(true)
      }
    },
    [mode, markers.length]
  )

  // Обработчик сохранения маркера
  const handleMarkerSave = useCallback(() => {
    if (pendingMarkerCoords && markerName.trim()) {
      const newMarker = createMarker(
        pendingMarkerCoords,
        markerName.trim(),
        markerColor
      )

      if (validateMarker(newMarker)) {
        setMarkers(prev => [...prev, newMarker])
        setIsMarkerFormOpen(false)
        setPendingMarkerCoords(null)
        setMarkerName('')
      }
    }
  }, [pendingMarkerCoords, markerName, markerColor])

  // Обработчик отмены создания маркера
  const handleMarkerCancel = useCallback(() => {
    setIsMarkerFormOpen(false)
    setPendingMarkerCoords(null)
    setMarkerName('')
  }, [])

  // Обработчик смены режима работы карты
  const handleModeChange = useCallback((newMode: ModeType) => {
    setMode(newMode)
    // Очищаем текущий полигон при смене режима
    if (newMode !== 'polygon') {
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [])

  // Обработчик автоматического завершения рисования полигона
  const handlePolygonAutoFinish = useCallback(() => {
    if (
      currentPolygon &&
      currentPolygon.length >= MAP_DEFAULTS.MIN_POLYGON_POINTS
    ) {
      // Сохраняем полигон во временное состояние и открываем модальное окно
      setPendingPolygon(currentPolygon)
      setPolygonName(`Полигон ${polygons.length + 1}`)
      setPolygonColor('blue')
      setIsPolygonModalOpen(true)
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [currentPolygon, polygons.length])

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1">
        <div className="absolute inset-0">
          <Map
            mode={mode}
            location={location}
            controls
            className="h-full w-full"
            polygons={polygons}
            markers={markers}
            currentPolygon={currentPolygon}
            isDrawing={isDrawing}
            selectedPolygonId={selectedPolygonId}
            selectedColor={selectedColor}
            onPolygonStart={handlePolygonStart}
            onPolygonSave={handlePolygonSave}
            onPolygonClear={handlePolygonClear}
            onPolygonPointAdd={handlePolygonPointAdd}
            onMarkerAdd={handleMarkerAdd}
            onPolygonSelect={handlePolygonSelect}
            onPolygonAutoFinish={handlePolygonAutoFinish}
          />
        </div>
        <div className="absolute top-2 left-2 z-10">
          <ModeSwitcher
            currentMode={mode}
            onModeChange={handleModeChange}
            className="rounded-lg bg-white p-2 shadow-lg"
          />
        </div>

        {/* Список полигонов */}
        {mode === 'polygon' && (
          <PolygonMarkerList
            type="polygon"
            items={polygons}
            selectedId={selectedPolygonId}
            onSelect={handlePolygonSelect}
            onReset={() => {
              setPolygons([])
              setMode('default')
            }}
            title={MESSAGES.POLYGON_LIST_TITLE}
          />
        )}

        {/* Список маркеров */}
        {mode === 'markers' && (
          <PolygonMarkerList
            type="marker"
            items={markers}
            onReset={() => {
              setMarkers([])
              setMode('default')
            }}
            title={MESSAGES.MARKER_LIST_TITLE}
          />
        )}

        {/* Форма создания маркера */}
        {isMarkerFormOpen && (
          <div
            className={`absolute top-1/2 left-1/2 ${UI_CONFIG.MODAL_Z_INDEX} -translate-x-1/2 -translate-y-1/2`}
          >
            <NameColorForm
              title={MESSAGES.MARKER_TITLE}
              name={markerName}
              color={markerColor}
              onNameChange={setMarkerName}
              onColorChange={setMarkerColor}
              onSave={handleMarkerSave}
              onCancel={handleMarkerCancel}
              saveButtonText={MESSAGES.SAVE_BUTTON}
              cancelButtonText={MESSAGES.CANCEL_BUTTON}
            />
          </div>
        )}
      </main>
      <Footer />

      {/* Модальное окно для настройки полигона */}
      <NameColorForm
        title={MESSAGES.POLYGON_TITLE}
        name={polygonName}
        color={polygonColor}
        onNameChange={setPolygonName}
        onColorChange={setPolygonColor}
        onSave={handlePolygonModalSave}
        onCancel={handlePolygonModalClose}
        isModal={true}
        isOpen={isPolygonModalOpen}
        saveButtonText={MESSAGES.SAVE_BUTTON}
        cancelButtonText={MESSAGES.CANCEL_BUTTON}
      />
    </div>
  )
})

HomePage.displayName = 'HomePage'
