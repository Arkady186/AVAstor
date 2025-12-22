import { useEffect, useMemo, useState } from 'react'
import { Marketplace } from './Marketplace'
import { Profile } from './Profile'
import { Cart } from './Cart'
import { Catalog } from './Catalog'
import { Booking } from './Booking'
import { MasterDetail } from './MasterDetail'
import { PortfolioDetail } from './PortfolioDetail'
import type { Master, PortfolioItem, Appointment } from '../data/studio'

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
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [openMaster, setOpenMaster] = useState<Master | null>(null)
  const [openPortfolio, setOpenPortfolio] = useState<PortfolioItem | null>(null)
  const [showBooking, setShowBooking] = useState<boolean>(false)
  const [bookingMaster, setBookingMaster] = useState<Master | null>(null)

  useEffect(() => {
    setIsTelegram(isInTelegramWebApp())
    
    const loadTelegramData = () => {
      try {
        const tg = (window as any).Telegram?.WebApp
        if (!tg) {
          return
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[App] Telegram WebApp found')
        }
        
        tg.ready?.()
        tg.expand?.()
        tg.MainButton?.hide?.()
        
        const unsafe = tg.initDataUnsafe
        
        if (unsafe?.user) {
          const user = unsafe.user
          
          setUserId(user.id ?? null)
          setUsername(user.username ?? null)
          
          const firstName = user.first_name || ''
          const lastName = user.last_name || ''
          const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
          const display = fullName || user.username || (user.id ? `User ${user.id}` : null)
          setDisplayName(display)
          
          if (user.photo_url) {
            setPhotoUrl(user.photo_url)
          } else if (user.username) {
            const telegramAvatar = `https://t.me/i/userpic/320/${user.username}.jpg`
            setPhotoUrl(telegramAvatar)
          }
        }
      
        if (tg.initData) {
          fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData }),
          })
            .then(r => r.json())
            .then((j) => {
              if (j?.ok && j.user) {
                setVerified(true)
                if (j.user.first_name || j.user.username) {
                  const fullName = j.user.first_name ? [j.user.first_name, j.user.last_name].filter(Boolean).join(' ') : null
                  setDisplayName(fullName || j.user.username || displayName || `User ${j.user.id}`)
                }
                if (j.user.username && !username) {
                  setUsername(j.user.username)
                }
                if (j.user.photo_url) {
                  setPhotoUrl(j.user.photo_url)
                } else if (j.user.username && !photoUrl) {
                  setPhotoUrl(`https://t.me/i/userpic/320/${j.user.username}.jpg`)
                }
              }
            })
            .catch(() => {})
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[App] Error getting Telegram data:', e)
        }
      }
    }
    
    loadTelegramData()
    
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      const retryTimeout = setTimeout(() => {
        loadTelegramData()
      }, 500)
      
      const handleReady = () => {
        loadTelegramData()
      }
      
      tg.onEvent?.('ready', handleReady)
      
      return () => {
        clearTimeout(retryTimeout)
        if (tg) {
          tg.offEvent?.('ready', handleReady)
        }
      }
    }
    
    return () => {}
  }, [])
  
  useEffect(() => {
    // Restore appointments from localStorage
    try {
      const saved = localStorage.getItem('ink_appointments')
      if (saved) {
        setAppointments(JSON.parse(saved))
      }
    } catch {}
    
    // Minimal loading time
    const t = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // Persist appointments
  useEffect(() => {
    try {
      localStorage.setItem('ink_appointments', JSON.stringify(appointments))
    } catch {}
  }, [appointments])

  const handleBookAppointment = () => {
    setShowBooking(true)
  }

  const handleConfirmBooking = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `appt_${Date.now()}`,
      status: 'pending',
    }
    setAppointments(prev => [...prev, newAppointment])
    setShowBooking(false)
    setTab('cart')
  }

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    ))
  }

  const handleOpenMaster = (master: Master) => {
    setOpenMaster(master)
  }

  const handleBookWithMaster = (master: Master) => {
    setBookingMaster(master)
    setOpenMaster(null)
    setShowBooking(true)
  }

  const content = useMemo(() => {
    if (!ready) {
      return (
        <div className="loader">
          <div className="loader-animation">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
            <div className="brand">INK&ARTstudio</div>
          </div>
          {userId && (
            <div className="loader-user-id">ID: {userId}</div>
          )}
        </div>
      )
    }
    return (
      <div className="page">
        {tab === 'home' && (
          <Marketplace
            onOpenMaster={handleOpenMaster}
            onOpenPortfolio={setOpenPortfolio}
            onBookAppointment={handleBookAppointment}
          />
        )}
        {tab === 'profile' && (
          <Profile
            displayName={displayName}
            username={username}
            photoUrl={photoUrl}
            appointments={appointments}
          />
        )}
        {tab === 'cart' && (
          <Cart
            appointments={appointments}
            onCancel={handleCancelAppointment}
          />
        )}
        {tab === 'catalog' && (
          <Catalog
            onOpenMaster={handleOpenMaster}
            onOpenService={() => handleBookAppointment()}
            onOpenPortfolio={setOpenPortfolio}
            onBookAppointment={handleBookAppointment}
          />
        )}
      </div>
    )
  }, [isTelegram, ready, verified, userId, username, tab, displayName, photoUrl, appointments])

  const upcomingCount = appointments.filter(a => 
    a.status === 'pending' || a.status === 'confirmed'
  ).length

  return (
    <div className="container">
      <div className="background">
        <div className="grain" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>
      {content}
      {openMaster && (
        <MasterDetail
          master={openMaster}
          onClose={() => setOpenMaster(null)}
          onBook={handleBookWithMaster}
        />
      )}
      {openPortfolio && (
        <PortfolioDetail
          item={openPortfolio}
          onClose={() => setOpenPortfolio(null)}
        />
      )}
      {showBooking && (
        <Booking
          onClose={() => {
            setShowBooking(false)
            setBookingMaster(null)
          }}
          onConfirm={handleConfirmBooking}
        />
      )}
      <nav className="wb-bottom" style={{ display: ready ? 'grid' : 'none' }}>
        <a className={tab==='home' ? 'active' : ''} onClick={() => setTab('home')}>
          <span className="i home" />Главная
        </a>
        <a className={tab==='catalog' ? 'active' : ''} onClick={() => setTab('catalog')}>
          <span className="i catalog" />Каталог
        </a>
        <a className={tab==='cart' ? 'active' : ''} onClick={() => setTab('cart')}>
          <span className="i cart" />Записи
          {upcomingCount > 0 && <span className="badge">{upcomingCount}</span>}
        </a>
        <a className={tab==='profile' ? 'active' : ''} onClick={() => setTab('profile')}>
          <span className="i profile" />Профиль
        </a>
      </nav>
    </div>
  )
}
