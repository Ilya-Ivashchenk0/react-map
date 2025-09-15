import type { LngLat } from '@yandex/ymaps3-types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface MapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  coords: LngLat
  controls: boolean
}
