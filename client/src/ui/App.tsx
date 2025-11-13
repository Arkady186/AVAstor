import { useEffect, useMemo, useState } from 'react'
import { Marketplace } from './Marketplace'
import { Profile } from './Profile'

function isInTelegramWebApp(): boolean {
  const tg = (window as any).Telegram?.WebApp
  return Boolean(tg)
}

export default function App() {
  const [isTelegram, setIsTelegram] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [verified, setVerified] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const [tab, setTab] = useState<'home' | 'profile' | 'catalog' | 'cart'>('home')

  useEffect(() => {
    setIsTelegram(isInTelegramWebApp())
    try {
      const tg = (window as any).Telegram?.WebApp
      tg?.ready?.()
      tg?.expand?.()
      tg?.MainButton?.hide?.()
      const unsafe = (window as any).Telegram?.WebApp?.initDataUnsafe
      if (unsafe?.user) {
        setUserId(unsafe.user.id ?? null)
        setUsername(unsafe.user.username ?? null)
        setDisplayName([unsafe.user.first_name, unsafe.user.last_name].filter(Boolean).join(' ') || null)
        setPhotoUrl(unsafe.user.photo_url ?? null)
      }
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
                setDisplayName(j.user.first_name ? [j.user.first_name, j.user.last_name].filter(Boolean).join(' ') : displayName)
              }
            }
          })
          .catch(() => {})
      }
    } catch {}
    const t = setTimeout(() => setReady(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const content = useMemo(() => {
    if (!ready) {
      return (
        <div className="loader">
          <div className="spinner"> 
            <div></div><div></div><div></div><div></div>
          </div>
          <div className="brand">avastore</div>
          <div className="subtitle">{verified && (userId ? `Добро пожаловать, ${username ? '@'+username : 'user '+userId}` : 'Проверка завершена')} { !verified && 'Загружаем коллекцию...' }</div>
        </div>
      )
    }
    return (
      <div className="loader">
        {tab === 'home' && <Marketplace />}
        {tab === 'profile' && <Profile displayName={displayName} username={username} photoUrl={photoUrl} />}
        {tab !== 'home' && tab !== 'profile' && <Marketplace />}
      </div>
    )
  }, [isTelegram, ready, verified, userId, username, tab, displayName, photoUrl])

  return (
    <div className="container">
      <div className="background">
        <div className="grain" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>
      {content}
      {ready && (
        <nav className="wb-bottom">
          <a className={tab==='home' ? 'active' : ''} onClick={() => setTab('home')}><span className="i home" />Главная</a>
          <a className={tab==='catalog' ? 'active' : ''} onClick={() => setTab('catalog')}><span className="i catalog" />Каталог</a>
          <a className={tab==='cart' ? 'active' : ''} onClick={() => setTab('cart')}><span className="i cart" />Корзина</a>
          <a className={tab==='profile' ? 'active' : ''} onClick={() => setTab('profile')}><span className="i profile" />Профиль</a>
        </nav>
      )}
    </div>
  )
}


