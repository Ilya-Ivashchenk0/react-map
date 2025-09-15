import { useState, type FC } from 'react'
import type { ModeSwitcherProps } from './types'
import type { ModeType } from '@/types'

export const ModeSwitcher: FC<ModeSwitcherProps> = ({
  className = '',
  currentMode = 'default',
  ...props
}) => {
  const modes = ['default', 'polygons', 'lines', 'markers'] as ModeType[]

  const [mode, setMode] = useState<ModeType>(currentMode)

  return (
    <div
      className={`flex flex-wrap justify-center gap-2 py-2 ${className}`}
      {...props}
    >
      {modes.map(currentMode => (
        <button
          key={currentMode}
          onClick={() => setMode(currentMode)}
          className={`rounded px-4 py-2 ${mode === currentMode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {currentMode}
        </button>
      ))}
    </div>
  )
}
