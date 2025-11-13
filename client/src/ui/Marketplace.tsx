import { useMemo } from 'react'

export type Product = {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  badge?: string
  discount?: number
}

const products: Product[] = [
  { id: '1', title: 'Футболка с принтом', price: 1082, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', rating: 4.8, discount: 61 },
  { id: '2', title: 'Набор тканевых масок', price: 544, originalPrice: 4660, image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=600&auto=format&fit=crop', rating: 4.7, discount: 87 },
  { id: '3', title: 'Кроссовки белые', price: 5990, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', rating: 4.7 },
  { id: '4', title: 'Джинсы карго', price: 4590, image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=600&auto=format&fit=crop', rating: 4.6 },
]

const services = [
  { id: 'wibes', name: 'wibes', icon: '🎵' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'eapteka', name: 'Еаптека', icon: '💊' },
  { id: 'rivgosh', name: 'РИВ ГОШ', icon: '💄' },
  { id: 'pec', name: 'Pec', icon: '📦' },
]

export function Marketplace() {
  const cards = useMemo(() => products, [])
  return (
    <div className="market market--white home-page">
      <div className="home-header">
        <div className="home-search">
          <span className="ico search" />
          <input placeholder="Поиск" />
          <span className="ico cam" />
        </div>
      </div>


      <section className="ad-banner">
        <div className="ad-content">РИВ ГОШ теперь на avastore</div>
        <div className="ad-label">Реклама</div>
      </section>

      <section className="recommended">
        <h2 className="section-title">Подобрали для вас</h2>
        <div className="rec-grid">
          {cards.map(p => (
            <article className="rec-card" key={p.id}>
              <div className="rec-actions">
                <button className="rec-icon">🔍</button>
                <button className="rec-icon">♡</button>
              </div>
              <div className="rec-img" style={{ backgroundImage: `url(${p.image})` }} />
              {p.discount && (
                <div className="rec-badge">-{p.discount}% АКЦИЯ 11.11</div>
              )}
              <div className="rec-price">
                {p.originalPrice && <span className="rec-old">{p.originalPrice.toLocaleString('ru-RU')} ₽</span>}
                <span className="rec-new">{p.price.toLocaleString('ru-RU')} ₽</span>
              </div>
              <button className="rec-cart">🛒</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
