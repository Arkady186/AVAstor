import { useMemo } from 'react'

type Product = {
  id: string
  title: string
  price: number
  image: string
  rating: number
  badge?: string
}

const products: Product[] = [
  { id: '1', title: 'Худи oversize', price: 3490, image: 'https://images.unsplash.com/photo-1548883354-7622d3fc52c6?q=80&w=1200&auto=format&fit=crop', rating: 4.8, badge: 'NEW' },
  { id: '2', title: 'Кроссовки белые', price: 5990, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop', rating: 4.7 },
  { id: '3', title: 'Джинсы карго', price: 4590, image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop', rating: 4.6 },
  { id: '4', title: 'Футболка basic', price: 1490, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop', rating: 4.5 },
  { id: '5', title: 'Пальто шерстяное', price: 9990, image: 'https://images.unsplash.com/photo-1517026575980-3e1e2c899271?q=80&w=1200&auto=format&fit=crop', rating: 4.9, badge: 'TOP' },
  { id: '6', title: 'Сумка шоппер', price: 1990, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop', rating: 4.4 },
]

const categories = ['Новинки', 'Одежда', 'Обувь', 'Аксессуары', 'Спорт', 'Sale']

const stories = [
  { id: 's1', title: 'Весна', image: 'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=600&auto=format&fit=crop' },
  { id: 's2', title: 'Луки', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
  { id: 's3', title: 'Деним', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=600&auto=format&fit=crop' },
  { id: 's4', title: 'Спорт', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop' },
  { id: 's5', title: 'Аксесс.', image: 'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=600&auto=format&fit=crop' },
]

const banners = [
  { id: 'b1', title: 'Скидки недели', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop' },
  { id: 'b2', title: 'Коллекция basic', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop' },
  { id: 'b3', title: 'Выбор стилистов', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop' },
]

function IconHome() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
}
function IconCatalog() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>)
}
function IconCart() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 5h2l1.6 9.1a2 2 0 0 0 2 1.7h5.8a2 2 0 0 0 2-1.6L20 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="17" cy="20" r="1.5" fill="currentColor"/></svg>)
}
function IconProfile() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>)
}

export function Marketplace() {
  const cards = useMemo(() => products, [])
  return (
    <div className="market market--purple market--white">
      <header className="wb-header">
        <div className="wb-title">avastore</div>
        <div className="wb-actions">
          <button className="wb-ico bell" aria-label="Уведомления" />
          <button className="wb-ico cart" aria-label="Корзина" />
        </div>
        <div className="wb-search">
          <span className="ico search" />
          <input placeholder="Поиск" />
          <span className="ico mic" />
          <span className="ico scan" />
          <span className="ico cam" />
        </div>
      </header>

      <section className="wb-stories">
        {stories.map(s => (
          <div className="wb-story" key={s.id}>
            <div className="wb-story__img" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="wb-story__ttl">{s.title}</div>
          </div>
        ))}
      </section>

      <section className="wb-banners">
        {banners.map(b => (
          <div className="wb-banner" key={b.id}>
            <div className="wb-banner__img" style={{ backgroundImage: `url(${b.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="wb-banner__dots"><i/><i/><i/></div>
          </div>
        ))}
      </section>

      <div className="market__chips">
        {categories.map(c => (
          <button className="chip" key={c}>{c}</button>
        ))}
      </div>

      <main className="market__grid">
        {cards.map(p => (
          <article className="cardv2" key={p.id}>
            {p.badge && <div className="cardv2__badge">{p.badge}</div>}
            <div className="cardv2__img" style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="cardv2__title">{p.title}</div>
            <div className="cardv2__meta">
              <div className="price">{p.price.toLocaleString('ru-RU')} ₽</div>
              <div className="rating">★ {p.rating.toFixed(1)}</div>
            </div>
            <button className="btn-primary">В корзину</button>
          </article>
        ))}
      </main>

      <nav className="wb-bottom">
        <a className="active"><IconHome />Главная</a>
        <a><IconCatalog />Каталог</a>
        <a><IconCart />Корзина</a>
        <a><IconProfile />Профиль</a>
      </nav>
    </div>
  )
}


