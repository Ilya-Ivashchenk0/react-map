export type ModeType = 'default' | 'polygon' | 'markers'

export type PolygonColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink'

export interface Polygon {
  id: string
  points: [number, number][]
  isClosed: boolean
  color: PolygonColor
  name: string
  createdAt: Date
}

export interface Marker {
  id: string
  coordinates: [number, number]
  title?: string
}

export interface MapState {
  polygons: Polygon[]
  markers: Marker[]
  currentPolygon: [number, number][] | null
  isDrawing: boolean
  selectedPolygonId: string | null
  selectedColor: PolygonColor
}
