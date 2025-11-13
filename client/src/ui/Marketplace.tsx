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
  { id: '1', title: 'Худи oversize', price: 3490, image: '', rating: 4.8, badge: 'NEW' },
  { id: '2', title: 'Кроссовки белые', price: 5990, image: '', rating: 4.7 },
  { id: '3', title: 'Джинсы карго', price: 4590, image: '', rating: 4.6 },
  { id: '4', title: 'Футболка basic', price: 1490, image: '', rating: 4.5 },
  { id: '5', title: 'Пальто шерстяное', price: 9990, image: '', rating: 4.9, badge: 'TOP' },
  { id: '6', title: 'Сумка шоппер', price: 1990, image: '', rating: 4.4 },
]

const categories = ['Новинки', 'Одежда', 'Обувь', 'Аксессуары', 'Спорт', 'Sale']

export function Marketplace() {
  const cards = useMemo(() => products, [])
  return (
    <div className="market">
      <header className="market__header">
        <div className="market__brand">avastore</div>
        <div className="market__search">
          <input placeholder="Поиск товаров" />
        </div>
      </header>
      <div className="market__chips">
        {categories.map(c => (
          <button className="chip" key={c}>{c}</button>
        ))}
      </div>
      <main className="market__grid">
        {cards.map(p => (
          <article className="cardv2" key={p.id}>
            {p.badge && <div className="cardv2__badge">{p.badge}</div>}
            <div className="cardv2__img" />
            <div className="cardv2__title">{p.title}</div>
            <div className="cardv2__meta">
              <div className="price">{p.price.toLocaleString('ru-RU')} ₽</div>
              <div className="rating">★ {p.rating.toFixed(1)}</div>
            </div>
            <button className="btn-primary">В корзину</button>
          </article>
        ))}
      </main>
      <footer className="market__footer">
        <div>© avastore</div>
        <nav>
          <a>Профиль</a>
          <a>Корзина</a>
          <a>Каталог</a>
        </nav>
      </footer>
    </div>
  )
}


