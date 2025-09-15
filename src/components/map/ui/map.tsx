'use client'

import type { LngLat } from '@yandex/ymaps3-types'
import { useYandexMaps } from '@/hooks/use-yandex-maps'
import type { MapProps } from '../types'

export const Map: React.FC<MapProps> = ({ coords, controls, className }) => {
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

  const location = {
    center: coords,
    zoom: 11
  }

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

      {/* {events.map(event => (
        <YMapMarker
          coordinates={
            [
              event.coordinates?.coordinates[0],
              event.coordinates?.coordinates[1]
            ] as LngLat
          }
          draggable={false}
          zIndex={2}
          key={event.id}
          onClick={() => handleMarkerClick(event.id as string)}
        >
          <div className="marker">
            <Image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="image"
              src={`/api/image?id=${event.main_image as string}`}
              width={63}
              height={63}
              alt=""
            />
          </div>
        </YMapMarker>
      ))} */}
    </YMap>
  )
}
