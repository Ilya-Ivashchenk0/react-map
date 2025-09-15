export type ModeType = 'default' | 'polygons' | 'lines' | 'markers'

export interface ModeSwitcherProps {
  className?: string
  currentMode?: ModeType
}
