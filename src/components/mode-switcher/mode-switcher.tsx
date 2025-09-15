import { type FC } from 'react'
import type { ModeSwitcherProps } from './types'
import type { ModeType } from '@/types'

export const ModeSwitcher: FC<ModeSwitcherProps> = ({
  className = '',
  currentMode = 'default',
  onModeChange,
  ...props
}) => {
  const modes: { value: ModeType; label: string }[] = [
    { value: 'default', label: 'Просмотр' },
    { value: 'polygon', label: 'Полигон' },
    { value: 'markers', label: 'Маркеры' }
  ]

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
