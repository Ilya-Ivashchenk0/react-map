import type { ModeType, Polygon, Marker, PolygonColor } from '@/types'
import type { YMapLocationRequest } from '@yandex/ymaps3-types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface MapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  mode: ModeType
  location: YMapLocationRequest
  controls: boolean
  polygons: Polygon[]
  markers: Marker[]
  currentPolygon: [number, number][] | null
  isDrawing: boolean
  selectedPolygonId: string | null
  selectedColor: PolygonColor
  onPolygonStart: () => void
  onPolygonSave: () => void
  onPolygonClear: () => void
  onPolygonPointAdd: (point: [number, number]) => void
  onMarkerAdd: (coordinates: [number, number]) => void
  onPolygonSelect: (id: string | null) => void
  onPolygonAutoFinish?: () => void
}
