import { memo } from 'react'

// Компонент подвала приложения
export const Footer = memo(() => {
  return (
    <footer className="bg-surface border-border fixed bottom-0 z-9999 w-full border-t px-4 py-[0.2rem]">
      <p className="text-text-muted text-sm">
        © 2024 Приложение. Все права защищены.
      </p>
    </footer>
  )
})

Footer.displayName = 'Footer'
