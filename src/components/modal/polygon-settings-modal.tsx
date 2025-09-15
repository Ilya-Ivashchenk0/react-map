import { useState, useEffect, type FC } from 'react'
import type { PolygonColor } from '@/types'
import { Button } from '@/components/button'

interface PolygonSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, color: PolygonColor) => void
  defaultColor?: PolygonColor
  defaultName?: string
}

export const PolygonSettingsModal: FC<PolygonSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultColor = 'blue',
  defaultName = ''
}) => {
  const [name, setName] = useState(defaultName)
  const [selectedColor, setSelectedColor] = useState<PolygonColor>(defaultColor)

  // Сброс состояния при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setName(defaultName)
      setSelectedColor(defaultColor)
    }
  }, [isOpen, defaultName, defaultColor])

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedColor)
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onKeyDown={handleKeyPress}
      >
        <h2 className="text-xl font-semibold mb-4">Настройки полигона</h2>

        {/* Название */}
        <div className="mb-4">
          <label htmlFor="polygon-name" className="block text-sm font-medium text-gray-700 mb-2">
            Название полигона
          </label>
          <input
            id="polygon-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Выбор цвета */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет полигона
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'pink'] as PolygonColor[]).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: getColorValue(color) }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            variant="accent"
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  )
}
