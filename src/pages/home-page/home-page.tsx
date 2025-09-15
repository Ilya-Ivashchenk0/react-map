import { Button } from '@/components/button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Map } from '@/components/map'
import { ModeSwitcher } from '@/components/mode-switcher'
import { NameColorForm } from '@/components/name-color-form'
import type { ModeType, Polygon, Marker, PolygonColor } from '@/types'
import type { LngLat } from '@yandex/ymaps3-types'
import { useMemo, useState, useCallback } from 'react'

export const HomePage = () => {
  const [mode, setMode] = useState<ModeType>('default')
  const [mapCenter] = useState<LngLat>([30.314809, 59.938848])

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

  const location = useMemo(
    () => ({
      center: mapCenter,
      zoom: 10
    }),
    [mapCenter]
  )

  // Функция для получения цветовых значений
  const getColorValue = (color: PolygonColor): string => {
    const colors = {
      blue: '#3b82f6',
      red: '#ef4444',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
      pink: '#ec4899'
    }
    return colors[color]
  }

  // Обработчики для полигонов
  const handlePolygonStart = useCallback(() => {
    setCurrentPolygon([])
    setIsDrawing(true)
  }, [])

  const handlePolygonSave = useCallback(() => {
    if (currentPolygon && currentPolygon.length >= 3) {
      // Сохраняем полигон во временное состояние и открываем модальное окно
      setPendingPolygon(currentPolygon)
      setPolygonName(`Полигон ${polygons.length + 1}`)
      setPolygonColor('blue')
      setIsPolygonModalOpen(true)
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [currentPolygon, polygons.length])

  const handlePolygonModalSave = useCallback(() => {
    if (pendingPolygon && polygonName.trim()) {
      const newPolygon: Polygon = {
        id: `polygon-${Date.now()}`,
        points: pendingPolygon,
        isClosed: true,
        color: polygonColor,
        name: polygonName.trim(),
        createdAt: new Date()
      }
      setPolygons(prev => [...prev, newPolygon])
      setPendingPolygon(null)
      setIsPolygonModalOpen(false)
      setPolygonName('')
    }
  }, [pendingPolygon, polygonName, polygonColor])

  const handlePolygonModalClose = useCallback(() => {
    setIsPolygonModalOpen(false)
    setPendingPolygon(null)
    setPolygonName('')
  }, [])

  const handlePolygonClear = useCallback(() => {
    setCurrentPolygon(null)
    setIsDrawing(false)
  }, [])

  const handlePolygonSelect = useCallback((id: string | null) => {
    setSelectedPolygonId(id)
  }, [])

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

  const handleMarkerSave = useCallback(() => {
    if (pendingMarkerCoords && markerName.trim()) {
      const newMarker: Marker = {
        id: `marker-${Date.now()}`,
        coordinates: pendingMarkerCoords,
        title: markerName.trim(),
        color: markerColor
      }
      setMarkers(prev => [...prev, newMarker])
      setIsMarkerFormOpen(false)
      setPendingMarkerCoords(null)
      setMarkerName('')
    }
  }, [pendingMarkerCoords, markerName, markerColor])

  const handleMarkerCancel = useCallback(() => {
    setIsMarkerFormOpen(false)
    setPendingMarkerCoords(null)
    setMarkerName('')
  }, [])

  // Обработчик смены режима
  const handleModeChange = useCallback((newMode: ModeType) => {
    setMode(newMode)
    // Очищаем текущий полигон при смене режима
    if (newMode !== 'polygon') {
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [])

  // Автоматическое завершение рисования при отпускании мыши
  const handlePolygonAutoFinish = useCallback(() => {
    if (currentPolygon && currentPolygon.length >= 3) {
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
        {mode === 'polygon' && polygons.length > 0 && (
          <div className="absolute top-4 right-4 z-10 max-w-xs rounded-lg bg-white p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">Полигоны</h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {polygons.map(polygon => (
                <div
                  key={polygon.id}
                  className={`m-1 cursor-pointer rounded p-2 transition-colors ${
                    selectedPolygonId === polygon.id
                      ? 'bg-blue-100 outline-2 outline-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() =>
                    handlePolygonSelect(
                      selectedPolygonId === polygon.id ? null : polygon.id
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: getColorValue(polygon.color) }}
                    />
                    <span className="text-sm font-medium">{polygon.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {polygon.points.length} точек
                  </div>
                </div>
              ))}
              <Button
                className="mt-4"
                variant="danger"
                onClick={() => {
                  setPolygons([])
                  setMode('default')
                }}
              >
                Сбросить
              </Button>
            </div>
          </div>
        )}

        {/* Список маркеров */}
        {mode === 'markers' && markers.length > 0 && (
          <div className="absolute top-4 right-4 z-10 max-w-xs rounded-lg bg-white p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">Маркеры</h3>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {markers.map(marker => (
                <div
                  key={marker.id}
                  className="rounded bg-gray-50 p-2 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: getColorValue(marker.color) }}
                    />
                    <span className="text-sm font-medium">{marker.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="mt-4"
              variant="danger"
              onClick={() => {
                setMarkers([])
                setMode('default')
              }}
            >
              Сбросить
            </Button>
          </div>
        )}

        {/* Форма создания маркера */}
        {isMarkerFormOpen && (
          <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <NameColorForm
              title="Создание маркера"
              name={markerName}
              color={markerColor}
              onNameChange={setMarkerName}
              onColorChange={setMarkerColor}
              onSave={handleMarkerSave}
              onCancel={handleMarkerCancel}
              saveButtonText="Сохранить"
              cancelButtonText="Отмена"
            />
          </div>
        )}
      </main>
      <Footer />

      {/* Модальное окно для настройки полигона */}
      <NameColorForm
        title="Настройки полигона"
        name={polygonName}
        color={polygonColor}
        onNameChange={setPolygonName}
        onColorChange={setPolygonColor}
        onSave={handlePolygonModalSave}
        onCancel={handlePolygonModalClose}
        isModal={true}
        isOpen={isPolygonModalOpen}
        saveButtonText="Сохранить"
        cancelButtonText="Отмена"
      />
    </div>
  )
}
