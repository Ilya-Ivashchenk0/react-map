import { type FC, memo } from 'react'
import type { ModeSwitcherProps } from './types'
import type { ModeType } from '@/types'

const modes: { value: ModeType; label: string }[] = [
  { value: 'default', label: 'Просмотр' },
  { value: 'polygon', label: 'Полигон' },
  { value: 'markers', label: 'Маркеры' }
]

// Компонент переключения режимов работы карты
export const ModeSwitcher: FC<ModeSwitcherProps> = memo(
  ({ className = '', currentMode = 'default', onModeChange, ...props }) => {
    return (
      <div
        className={`flex flex-wrap justify-center gap-2 py-2 ${className}`}
        {...props}
      >
        {modes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onModeChange?.(value)}
            className={`rounded px-4 py-2 transition-colors ${
              currentMode === value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    )
  }
)

ModeSwitcher.displayName = 'ModeSwitcher'
