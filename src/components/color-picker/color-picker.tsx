import type { FC } from 'react'
import { memo } from 'react'
import type { PolygonColor } from '@/types'
import { COLOR_MAP, AVAILABLE_COLORS } from '@/config/constants/colors'

interface ColorPickerProps {
  selectedColor: PolygonColor
  onColorChange: (color: PolygonColor) => void
  className?: string
}

const colorOptions = AVAILABLE_COLORS.map(color => ({
  color,
  hex: COLOR_MAP[color].hex,
  name: COLOR_MAP[color].name
}))

// Компонент выбора цвета для полигонов и маркеров
export const ColorPicker: FC<ColorPickerProps> = memo(
  ({ selectedColor, onColorChange, className = '' }) => {
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
)

ColorPicker.displayName = 'ColorPicker'
