import { useEffect, useMemo, useState } from 'react'

function isInTelegramWebApp(): boolean {
  const tg = (window as any).Telegram?.WebApp
  return Boolean(tg)
}

export default function App() {
  const [isTelegram, setIsTelegram] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [verified, setVerified] = useState<boolean>(false)

  useEffect(() => {
    setIsTelegram(isInTelegramWebApp())
    try {
      const tg = (window as any).Telegram?.WebApp
      tg?.ready?.()
      tg?.expand?.()
      tg?.MainButton?.hide?.()
      if (tg?.initData) {
        fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: tg.initData }),
        })
          .then(r => r.json())
          .then((j) => {
            if (j?.ok) {
              setVerified(true)
              if (j.user) {
                setUserId(j.user.id ?? null)
                setUsername(j.user.username ?? null)
              }
            }
          })
          .catch(() => {})
      }
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
        <div className="subtitle">{verified && (userId ? `Добро пожаловать, ${username ? '@'+username : 'user '+userId}` : 'Проверка завершена')} { !verified && 'Загружаем коллекцию...' }</div>
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


