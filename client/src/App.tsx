import { useState, useEffect } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { BasketballGame } from './components/BasketballGame'

function isInTelegramWebApp(): boolean {
  const tg = (window as any).Telegram?.WebApp
  return Boolean(tg)
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isTelegram, setIsTelegram] = useState(false)

  useEffect(() => {
    setIsTelegram(isInTelegramWebApp())
    
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.ready?.()
      tg.expand?.()
      tg.MainButton?.hide?.()
    }

    // Показываем заставку 3 секунды
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return <BasketballGame />
}

