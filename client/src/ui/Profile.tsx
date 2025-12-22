import { useEffect, useState, useMemo } from 'react'
import type { Appointment } from '../data/studio'

type ProfileProps = {
  displayName?: string | null
  username?: string | null
  photoUrl?: string | null
  appointments?: Appointment[]
}

const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="160" fill="#1a1a1a"/>
    <circle cx="80" cy="60" r="25" fill="white" opacity="0.9"/>
    <path d="M 50 120 Q 50 100 80 100 Q 110 100 110 120" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
  </svg>
`)

export function Profile({ displayName, username, photoUrl, appointments = [] }: ProfileProps) {
  const avatar = useMemo(() => {
    if (photoUrl) return photoUrl
    if (username) return `https://t.me/i/userpic/320/${username}.jpg`
    return DEFAULT_AVATAR
  }, [photoUrl, username])

  const [avatarSrc, setAvatarSrc] = useState(() => avatar)
  const [avatarError, setAvatarError] = useState(false)

  useEffect(() => {
    setAvatarSrc(avatar)
    setAvatarError(false)
  }, [avatar])

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarError) {
      e.currentTarget.style.display = 'none'
      return
    }
    const target = e.currentTarget as HTMLImageElement
    setAvatarError(true)
    if (username && !target.src.includes('userpic')) {
      target.src = `https://t.me/i/userpic/320/${username}.jpg`
    } else {
      target.src = DEFAULT_AVATAR
    }
  }

  const name = displayName || (username ? `@${username}` : null) || 'Гость'
  const upcomingAppointments = appointments.filter(a => 
    a.status === 'pending' || a.status === 'confirmed'
  )
  const completedAppointments = appointments.filter(a => a.status === 'completed')

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
              <rect width="160" height="160" fill="#1a1a1a"/>
              <circle cx="80" cy="60" r="25" fill="white" opacity="0.9"/>
              <path d="M 50 120 Q 50 100 80 100 Q 110 100 110 120" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
            </svg>
          </div>
        )}
        <div className="profile-name-section">
          <div className="profile-name">{name}</div>
          {username && <div className="profile-username">@{username}</div>}
          {!username && displayName && (
            <div className="profile-username" style={{ opacity: 0.6, fontStyle: 'italic' }}>
              Username не указан
            </div>
          )}
        </div>
      </div>

      <section className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-icon">📅</div>
          <div className="profile-stat-info">
            <div className="profile-stat-value">{upcomingAppointments.length}</div>
            <div className="profile-stat-label">Ближайшие записи</div>
          </div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon">✅</div>
          <div className="profile-stat-info">
            <div className="profile-stat-value">{completedAppointments.length}</div>
            <div className="profile-stat-label">Завершено сеансов</div>
          </div>
        </div>
      </section>

      <section className="profile-banners">
        <div className="profile-banner club">
          <div className="banner-text">Бонусная программа</div>
          <div className="banner-text-small">Копите баллы за каждую татуировку</div>
        </div>
        <div className="profile-banner discount">
          <div className="banner-text">Скидка постоянным клиентам</div>
          <div className="banner-text-small">до 15%</div>
        </div>
      </section>

      <section className="profile-orders">
        <div className="order-section">
          <div className="order-title">Ближайшие записи</div>
          <div className="order-subtitle">
            {upcomingAppointments.length > 0
              ? `${upcomingAppointments.length} записей`
              : 'Нет предстоящих записей'}
          </div>
        </div>
        <div className="order-section">
          <div className="order-title">История сеансов</div>
          <div className="order-subtitle">
            {completedAppointments.length > 0
              ? `${completedAppointments.length} завершённых сеансов`
              : 'Пока нет завершённых сеансов'}
          </div>
        </div>
        <div className="order-section">
          <div className="order-title">Мои татуировки</div>
          <div className="order-subtitle">Фотографии ваших татуировок</div>
        </div>
        <div className="order-section">
          <div className="order-title">Избранные мастера</div>
          <div className="order-subtitle">Список ваших любимых мастеров</div>
        </div>
        <div className="order-section">
          <div className="order-title">Настройки</div>
          <div className="order-subtitle">Уведомления и предпочтения</div>
        </div>
      </section>
    </div>
  )
}
