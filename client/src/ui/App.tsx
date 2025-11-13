import { useEffect, useMemo, useState } from 'react'
import { Marketplace } from './Marketplace'
import { Profile } from './Profile'
import { Cart, type CartItem } from './Cart'
import type { Product } from './Marketplace'
import { Catalog } from './Catalog'
import { ProductDetail } from './ProductDetail'
import type { ProductData } from '../data/products'

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
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [openProduct, setOpenProduct] = useState<ProductData | null>(null)

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
    // Restore cart
    try { const saved = localStorage.getItem('ava_cart'); if (saved) setCart(JSON.parse(saved)) } catch {}

    const t = setTimeout(() => setReady(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // Persist cart
  useEffect(() => {
    try { localStorage.setItem('ava_cart', JSON.stringify(cart)) } catch {}
  }, [cart])

  // Cart handlers
  const addToCart = (p: Product) => {
    setCart(prev => {
      const cur = prev[p.id]
      const nextQty = (cur?.qty || 0) + 1
      return { ...prev, [p.id]: { ...p, qty: nextQty } }
    })
    setTab('cart')
  }
  const addToCartWithSize = (p: ProductData, size?: string) => {
    const id = size ? `${p.id}_${size}` : p.id
    setCart(prev => {
      const cur = prev[id]
      const nextQty = (cur?.qty || 0) + 1
      return { ...prev, [id]: { ...p, id, title: size ? `${p.title} • ${size}` : p.title, qty: nextQty } as any }
    })
    setTab('cart'); setOpenProduct(null)
  }
  const inc = (id: string) => setCart(prev => ({ ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } }))
  const dec = (id: string) => setCart(prev => {
    const item = prev[id]
    if (!item) return prev
    const nextQty = item.qty - 1
    const copy = { ...prev }
    if (nextQty <= 0) { delete (copy as any)[id] } else { copy[id] = { ...item, qty: nextQty } }
    return copy
  })
  const clear = () => setCart({})
  const cartItems: CartItem[] = Object.values(cart)
  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0)

  // Expose add to cart for Marketplace internal button
  ;(window as any).__onAddToCart = addToCart
  ;(window as any).__onOpenProduct = (p: ProductData) => setOpenProduct(p)

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
          </div>
          <div className="brand">avastore</div>
        </div>
      )
    }
    return (
      <div className="page">
        {tab === 'home' && <Marketplace />}
        {tab === 'profile' && <Profile displayName={displayName} username={username} photoUrl={photoUrl} />}
        {tab === 'cart' && <Cart items={cartItems} onInc={inc} onDec={dec} onClear={clear} onSelectAll={() => {}} />}
        {tab === 'catalog' && <Catalog />}
      </div>
    )
  }, [isTelegram, ready, verified, userId, username, tab, displayName, photoUrl, cartItems])

  return (
    <div className="container">
      <div className="background">
        <div className="grain" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
      </div>
      {content}
      {openProduct && (
        <ProductDetail product={openProduct} onClose={() => setOpenProduct(null)} onAdd={addToCartWithSize} />
      )}
      {ready && (
        <nav className="wb-bottom">
          <a className={tab==='home' ? 'active' : ''} onClick={() => setTab('home')}><span className="i home" />Главная</a>
          <a className={tab==='catalog' ? 'active' : ''} onClick={() => setTab('catalog')}><span className="i catalog" />Каталог</a>
          <a className={tab==='cart' ? 'active' : ''} onClick={() => setTab('cart')}><span className="i cart" />Корзина{cartCount>0 && <span className="badge">{cartCount}</span>}</a>
          <a className={tab==='profile' ? 'active' : ''} onClick={() => setTab('profile')}><span className="i profile" />Профиль</a>
        </nav>
      )}
    </div>
  )
}


