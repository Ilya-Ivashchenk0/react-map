import type { PolygonColor } from '@/types'

// Константы цветов для полигонов и маркеров
export const COLOR_MAP: Record<PolygonColor, { hex: string; name: string }> = {
  blue: { hex: '#3b82f6', name: 'Синий' },
  red: { hex: '#ef4444', name: 'Красный' },
  green: { hex: '#10b981', name: 'Зеленый' },
  yellow: { hex: '#f59e0b', name: 'Желтый' },
  purple: { hex: '#8b5cf6', name: 'Фиолетовый' },
  orange: { hex: '#f97316', name: 'Оранжевый' },
  pink: { hex: '#ec4899', name: 'Розовый' }
}

export const getColorValue = (color: PolygonColor): string => {
  return COLOR_MAP[color].hex
}

export const getColorName = (color: PolygonColor): string => {
  return COLOR_MAP[color].name
}

export const AVAILABLE_COLORS: PolygonColor[] = Object.keys(
  COLOR_MAP
) as PolygonColor[]
