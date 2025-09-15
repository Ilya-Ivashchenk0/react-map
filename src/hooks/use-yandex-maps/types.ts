import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapControls,
  YMapListener,
  YMapFeature,
  YMapLayer,
  YMapFeatureDataSource
} from '@yandex/ymaps3-types/react'
import {
  YMapZoomControl,
  YMapGeolocationControl
} from '@yandex/ymaps3-types/packages/controls/react'
import { YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer/react'
import { clusterByGrid } from '@yandex/ymaps3-types/packages/clusterer'

export interface YandexMapModules {
  YMap: typeof YMap
  YMapDefaultSchemeLayer: typeof YMapDefaultSchemeLayer
  YMapDefaultFeaturesLayer: typeof YMapDefaultFeaturesLayer
  YMapMarker: typeof YMapMarker
  YMapControls: typeof YMapControls
  YMapListener: typeof YMapListener
  YMapFeature: typeof YMapFeature
  YMapLayer: typeof YMapLayer
  YMapFeatureDataSource: typeof YMapFeatureDataSource
  YMapZoomControl: typeof YMapZoomControl
  YMapGeolocationControl: typeof YMapGeolocationControl
  YMapClusterer: typeof YMapClusterer
  clusterByGrid: typeof clusterByGrid
}
