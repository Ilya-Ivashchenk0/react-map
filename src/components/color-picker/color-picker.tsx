import type { FC } from 'react'
import type { PolygonColor } from '@/types'

interface ColorPickerProps {
  selectedColor: PolygonColor
  onColorChange: (color: PolygonColor) => void
  className?: string
}

const colorOptions: { color: PolygonColor; hex: string; name: string }[] = [
  { color: 'blue', hex: '#3b82f6', name: 'Синий' },
  { color: 'red', hex: '#ef4444', name: 'Красный' },
  { color: 'green', hex: '#10b981', name: 'Зеленый' },
  { color: 'yellow', hex: '#f59e0b', name: 'Желтый' },
  { color: 'purple', hex: '#8b5cf6', name: 'Фиолетовый' },
  { color: 'orange', hex: '#f97316', name: 'Оранжевый' },
  { color: 'pink', hex: '#ec4899', name: 'Розовый' }
]

export const ColorPicker: FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {colorOptions.map(option => (
        <button
          key={option.color}
          onClick={() => onColorChange(option.color)}
          className={`h-8 w-8 rounded-full border-2 transition-all ${
            selectedColor === option.color
              ? 'scale-110 border-gray-800'
              : 'border-gray-300 hover:border-gray-500'
          }`}
          style={{ backgroundColor: option.hex }}
          title={option.name}
        />
      ))}
    </div>
  )
}
