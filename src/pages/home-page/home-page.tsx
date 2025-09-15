import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Map } from '@/components/map'
import { ModeSwitcher } from '@/components/mode-switcher'

export const HomePage = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      {/* <ModeSwitcher /> */}

      <main className="relative flex-1">
        <div className="absolute inset-0">
          <Map
            coords={[30.314809, 59.938848]}
            controls
            className="h-full w-full"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
