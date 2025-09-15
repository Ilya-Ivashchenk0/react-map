import type { ModeType } from '@/types'

export interface ModeSwitcherProps {
  className?: string
  currentMode?: ModeType
  onModeChange?: (mode: ModeType) => void
}
