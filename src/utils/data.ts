import type { Polygon, Marker } from '@/types'

// Утилиты для работы с данными

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const createPolygon = (
  points: [number, number][],
  name: string,
  color: string
): Polygon => {
  return {
    id: generateId('polygon'),
    points,
    isClosed: true,
    color: color as any,
    name,
    createdAt: new Date()
  }
}

export const createMarker = (
  coordinates: [number, number],
  title: string,
  color: string
): Marker => {
  return {
    id: generateId('marker'),
    coordinates,
    title,
    color: color as any
  }
}

export const validatePolygon = (polygon: Partial<Polygon>): boolean => {
  return !!(
    polygon.points &&
    polygon.points.length >= 3 &&
    polygon.name &&
    polygon.name.trim().length > 0 &&
    polygon.color
  )
}

export const validateMarker = (marker: Partial<Marker>): boolean => {
  return !!(
    marker.coordinates &&
    marker.coordinates.length === 2 &&
    marker.title &&
    marker.title.trim().length > 0 &&
    marker.color
  )
}