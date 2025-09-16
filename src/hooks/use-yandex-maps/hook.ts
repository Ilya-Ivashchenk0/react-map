import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import type { YandexMapModules } from './types'

// Хук для загрузки и инициализации модулей Yandex Maps API
export const useYandexMaps = (): YandexMapModules | undefined => {
  const [ymapsModules, setYmapsModules] = useState<YandexMapModules>()

  // Функция загрузки модулей Yandex Maps API
  const loadModules = useCallback(async (): Promise<
    YandexMapModules | undefined
  > => {
    const ymaps3 = (window as any).ymaps3

    if (!ymaps3) return

    await ymaps3.ready

    try {
      const ymaps3Reactify = await ymaps3.import('@yandex/ymaps3-reactify')
      const ymapsCluster = await ymaps3.import('@yandex/ymaps3-clusterer@0.0.1')
      const { clusterByGrid } = await ymaps3.import(
        '@yandex/ymaps3-clusterer@0.0.1'
      )
      const ymaps3Controls = await ymaps3.import(
        '@yandex/ymaps3-controls@0.0.1'
      )

      const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM)
      const { YMapZoomControl, YMapGeolocationControl } =
        reactify.module(ymaps3Controls)
      const { YMapClusterer } = reactify.module(ymapsCluster)

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapControls,
        YMapListener,
        YMapFeature,
        YMapLayer,
        YMapFeatureDataSource
      } = reactify.module(ymaps3)

      return {
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
      }
    } catch (err) {
      console.error('Ошибка загрузки модулей Yandex Maps:', err)
    }
  }, [])

  useEffect(() => {
    loadModules()
      .then(modules => setYmapsModules(modules))
      .catch(err => console.error('Ошибка инициализации карты:', err))
  }, [loadModules])

  return ymapsModules
}
