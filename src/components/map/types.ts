import type { ModeType } from '@/types'
import type { YMapLocationRequest } from '@yandex/ymaps3-types'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface MapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  mode: ModeType
  location: YMapLocationRequest
  controls: boolean
}
