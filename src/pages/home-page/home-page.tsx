import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Map } from '@/components/map'
import type { ModeType } from '@/types'
import type { LngLat } from '@yandex/ymaps3-types'
import { useCallback, useState } from 'react'

export const HomePage = () => {
  const [mode, setMode] = useState<ModeType>('default')

  const location = {
    center: [30.314809, 59.938848],
    zoom: 10
  }

  // const geometry = {
  //   type: 'LineString',
  //   coordinates: [
  //     [30.2919, 59.9313],
  //     [30.2936, 59.9279],
  //     [30.2895, 59.9282],
  //     [30.2858, 59.9293],
  //     [30.2919, 59.9313]
  //   ]
  // };

  // const lineStyle = {
  //   simplificationRate: 0,
  //   stroke: [{color: '##fb64b6', dash: [8, 8], width: 2}]
  // }

  // const [points, setPoints] = useState<LngLat[]>([]);

  // const [isPolygon, setIsPolygon] = useState(false);

  // const handleMapClick = useCallback((e: any) => {
  //   if (isPolygon) return;
  //   const coords: LngLat = e.get('coords');
  //   setPoints((prev) => [...prev, coords]);
  // }, [isPolygon]);

  // const closePolygon = useCallback(() => {
  //   if (points.length < 3) return;
  //   setIsPolygon(true);
  // }, [points]);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-1">
        <div className="absolute inset-0 ">
          <Map
            mode={mode}
            location={location}
            controls
            className="h-full w-full"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
