import { useEffect, useMemo, useState } from 'react'

function isInTelegramWebApp(): boolean {
  const tg = (window as any).Telegram?.WebApp
  return Boolean(tg)
}

export default function App() {
  const [isTelegram, setIsTelegram] = useState<boolean>(false)

  useEffect(() => {
    setIsTelegram(isInTelegramWebApp())
    try {
      const tg = (window as any).Telegram?.WebApp
      tg?.ready?.()
      tg?.expand?.()
      tg?.MainButton?.hide?.()
    } catch {}
  }, [])

  const content = useMemo(() => {
    if (!isTelegram && !import.meta.env.DEV) {
      return (
        <div className="block">
          <div className="card">
            <h1>Откройте в Telegram</h1>
            <p>Это мини‑приложение доступно только внутри Telegram.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="loader">
        <div className="spinner"> 
          <div></div><div></div><div></div><div></div>
        </div>
        <div className="brand">avastore</div>
        <div className="subtitle">Загружаем коллекцию...</div>
      </div>
    )
  }, [isTelegram])

  return (
    <div className="container">
      <div className="background">
        <div className="grain" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>
      {content}
    </div>
  )
}


