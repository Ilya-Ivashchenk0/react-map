import { memo } from 'react'

// Компонент заголовка приложения
export const Header = memo(() => {
  return (
    <header className="bg-surface border-border border-b p-4">
      <h1 className="text-text-primary text-2xl font-bold">React Map</h1>
      <p className="text-text-secondary">
        Приложение является примером использования инструментов Yandex Maps API
        в React
      </p>
    </header>
  )
})

Header.displayName = 'Header'
