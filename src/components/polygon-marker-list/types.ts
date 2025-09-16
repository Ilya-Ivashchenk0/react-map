import type { Marker, Polygon } from '@/types'

export interface PolygonMarkerListProps {
  type: 'polygon' | 'marker'
  items: Polygon[] | Marker[]
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  onReset: () => void
  title: string
}
