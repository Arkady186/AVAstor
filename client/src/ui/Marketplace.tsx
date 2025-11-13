import { useMemo } from 'react'

export type Product = {
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
            <button className="btn-primary" onClick={() => (window as any).__onAddToCart?.(p)}>В корзину</button>
          </article>
        ))}
      </main>
    </div>
  )
}


