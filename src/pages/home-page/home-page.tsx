import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Map } from '@/components/map'
import { ModeSwitcher } from '@/components/mode-switcher'
import { PolygonSettingsModal } from '@/components/modal'
import type { ModeType, Polygon, Marker, PolygonColor } from '@/types'
import type { LngLat } from '@yandex/ymaps3-types'
import { useMemo, useState, useCallback } from 'react'

export const HomePage = () => {
  const [mode, setMode] = useState<ModeType>('default')
  const [mapCenter] = useState<LngLat>([30.314809, 59.938848])

  // Состояние для полигонов и маркеров
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [markers, setMarkers] = useState<Marker[]>([])
  const [currentPolygon, setCurrentPolygon] = useState<[number, number][] | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null)
  const [selectedColor] = useState<PolygonColor>('blue')

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPolygon, setPendingPolygon] = useState<[number, number][] | null>(null)

  const location = useMemo(() => ({
    center: mapCenter,
    zoom: 10
  }), [mapCenter])

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
      setIsModalOpen(true)
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [currentPolygon])

  const handleModalSave = useCallback((name: string, color: PolygonColor) => {
    if (pendingPolygon) {
      const newPolygon: Polygon = {
        id: `polygon-${Date.now()}`,
        points: pendingPolygon,
        isClosed: true,
        color,
        name,
        createdAt: new Date()
      }
      setPolygons(prev => [...prev, newPolygon])
      setPendingPolygon(null)
      setIsModalOpen(false)
    }
  }, [pendingPolygon])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setPendingPolygon(null)
  }, [])

  const handlePolygonClear = useCallback(() => {
    setCurrentPolygon(null)
    setIsDrawing(false)
  }, [])

  const handlePolygonSelect = useCallback((id: string | null) => {
    setSelectedPolygonId(id)
  }, [])


  const handlePolygonPointAdd = useCallback((point: [number, number]) => {
    if (mode === 'polygon' && isDrawing) {
      setCurrentPolygon(prev => prev ? [...prev, point] : [point])
    }
  }, [mode, isDrawing])

  // Обработчики для маркеров
  const handleMarkerAdd = useCallback((coordinates: [number, number]) => {
    if (mode === 'markers') {
      const newMarker: Marker = {
        id: `marker-${Date.now()}`,
        coordinates,
        title: `Маркер ${markers.length + 1}`
      }
      setMarkers(prev => [...prev, newMarker])
    }
  }, [mode, markers.length])

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
      setIsModalOpen(true)
      setCurrentPolygon(null)
      setIsDrawing(false)
    }
  }, [currentPolygon])

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
        <div className="absolute top-4 left-4 z-10">
          <ModeSwitcher
            currentMode={mode}
            onModeChange={handleModeChange}
            className="bg-white rounded-lg shadow-lg p-2"
          />
        </div>

        {/* Список полигонов */}
        {mode === 'polygon' && polygons.length > 0 && (
          <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h3 className="text-lg font-semibold mb-3">Полигоны</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {polygons.map((polygon) => (
                <div
                  key={polygon.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedPolygonId === polygon.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handlePolygonSelect(
                    selectedPolygonId === polygon.id ? null : polygon.id
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getColorValue(polygon.color) }}
                    />
                    <span className="text-sm font-medium">{polygon.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {polygon.points.length} точек
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Модальное окно для настройки полигона */}
      <PolygonSettingsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        defaultColor={selectedColor}
        defaultName={`Полигон ${polygons.length + 1}`}
      />
    </div>
  )
}
