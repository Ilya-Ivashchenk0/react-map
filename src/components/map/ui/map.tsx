import type { DrawingStyle, LngLat } from '@yandex/ymaps3-types'
import { useYandexMaps } from '@/hooks/use-yandex-maps'
import type { MapProps } from '../types'
import { useCallback, useMemo, useState } from 'react'

export const Map: React.FC<MapProps> = ({
  mode,
  location,
  controls,
  className
}) => {
  const yandexMapModules = useYandexMaps()

  if (!yandexMapModules) {
    return <div>Загрузка карты...</div>
  }

  // const handleMarkerClick = (id: string) => {
  //   console.log(id)
  // }

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapControls,
    YMapListener,
    YMapFeature,
    YMapLayer,
    YMapFeatureDataSource,
    YMapZoomControl,
    YMapGeolocationControl,
    YMapClusterer,
    clusterByGrid
  } = yandexMapModules

  return (
    <YMap
      className={className}
      location={location}
      mode="vector"
      copyrights={false}
    >
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      {controls && (
        <>
          <YMapControls position="left">
            <YMapGeolocationControl />
          </YMapControls>
          <YMapControls position="right">
            <YMapZoomControl />
          </YMapControls>
        </>
      )}

      {/* <YMapFeature
        geometry={{
          type: 'Polygon',
          coordinates: [linesCoords]
        }}
        style={polygonStyle}
      /> */}

      {/* <YMapFeature geometry={geometry} style={style} /> */}
    </YMap>
  )
}
