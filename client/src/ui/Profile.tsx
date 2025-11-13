import { useEffect, useState, useMemo } from 'react'

type ProfileProps = {
  displayName?: string | null
  username?: string | null
  photoUrl?: string | null
}

// Create a simple SVG placeholder as data URI (using encodeURIComponent instead of btoa)
const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="160" fill="#6a2bbb"/>
    <circle cx="80" cy="60" r="25" fill="white" opacity="0.9"/>
    <path d="M 50 120 Q 50 100 80 100 Q 110 100 110 120" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
  </svg>
`)

export function Profile({ displayName, username, photoUrl }: ProfileProps) {
  console.log('[Profile] Received props:', { displayName, username, photoUrl })
  
  // Telegram avatar fallback chain: photo_url -> username -> default
  const avatar = useMemo(() => {
    if (photoUrl) return photoUrl
    if (username) return `https://t.me/i/userpic/160/${username}.jpg`
    return DEFAULT_AVATAR
  }, [photoUrl, username])
  
  // Show name or username, never "Гость" if we have any data
  const name = displayName || (username ? `@${username}` : null) || 'Гость'
  
  console.log('[Profile] Computed:', { name, avatar })
  
  const [avatarSrc, setAvatarSrc] = useState(() => avatar)
  const [avatarError, setAvatarError] = useState(false)
  
  useEffect(() => {
    setAvatarSrc(avatar)
    setAvatarError(false)
  }, [avatar])
  
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarError) {
      // Already tried fallback, stop trying
      e.currentTarget.style.display = 'none'
      return
    }
    
    const target = e.currentTarget as HTMLImageElement
    setAvatarError(true)
    
    // Try Telegram userpic if we have username and current src is not userpic
    if (username && !target.src.includes('userpic')) {
      const userpicUrl = `https://t.me/i/userpic/160/${username}.jpg`
      target.src = userpicUrl
    } else {
      // Use default SVG placeholder
      target.src = DEFAULT_AVATAR
    }
  }
  
  return (
    <div className="profile market market--white profile-page">
      <div className="profile-top">
        {!avatarError && (
          <img 
            className="profile-avatar" 
            src={avatarSrc} 
            alt="avatar" 
            onError={handleAvatarError}
          />
        )}
        {avatarError && (
          <div className="profile-avatar profile-avatar-placeholder">
            <svg width="64" height="64" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
              <rect width="160" height="160" fill="#6a2bbb"/>
              <circle cx="80" cy="60" r="25" fill="white" opacity="0.9"/>
              <path d="M 50 120 Q 50 100 80 100 Q 110 100 110 120" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        )}
        <div className="profile-name-section">
          <div className="profile-name">{name}</div>
          {username && <div className="profile-username">@{username}</div>}
          <div className="profile-settings">Данные и настройки &gt;</div>
        </div>
      </div>

      <section className="profile-banners">
        <div className="profile-banner club">
          <div className="banner-text">клуб</div>
          <div className="banner-badge">6</div>
          <div className="banner-dot">2</div>
        </div>
        <div className="profile-banner discount">
          <div className="banner-text">Скидка &gt;</div>
          <div className="banner-text-small">до 40 %</div>
        </div>
        <div className="profile-banner payment">
          <div className="banner-text">Оплата при получении</div>
          <div className="banner-text-small">до 500 000 ₽</div>
        </div>
      </section>

      <section className="profile-bank">
        <div className="bank-info">
          <div className="bank-amount">0 ₽ &gt;</div>
          <div className="bank-label">avastore Банк</div>
        </div>
        <button className="bank-topup">Пополнить</button>
      </section>

      <section className="profile-orders">
        <div className="order-section">
          <div className="order-title">Заказы</div>
          <div className="order-subtitle">Ближайшие: не ожидаются</div>
        </div>
        <div className="order-section">
          <div className="order-title">Покупки</div>
          <div className="order-subtitle">Здесь можно купить что-то заново</div>
        </div>
        <div className="order-section">
          <div className="order-title">Лист ожидания</div>
          <div className="order-subtitle">В наличии: 0/0</div>
        </div>
        <div className="order-section">
          <div className="order-title">Отложенные</div>
        </div>
        <div className="order-section">
          <div className="order-title">Лотерейные билеты</div>
        </div>
      </section>

    </div>
  )
}
