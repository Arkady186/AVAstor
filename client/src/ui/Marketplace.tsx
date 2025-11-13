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

const stories = [
  { id: 's1', title: 'Весна' },
  { id: 's2', title: 'Луки' },
  { id: 's3', title: 'Деним' },
  { id: 's4', title: 'Спорт' },
  { id: 's5', title: 'Аксесс.' },
]

const banners = [
  { id: 'b1', title: 'Скидки недели' },
  { id: 'b2', title: 'Коллекция basic' },
  { id: 'b3', title: 'Выбор стилистов' },
]

export function Marketplace() {
  const cards = useMemo(() => products, [])
  return (
    <div className="market market--purple">
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
            <div className="wb-story__img" />
            <div className="wb-story__ttl">{s.title}</div>
          </div>
        ))}
      </section>

      <section className="wb-banners">
        {banners.map(b => (
          <div className="wb-banner" key={b.id}>
            <div className="wb-banner__img" />
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

      <nav className="wb-bottom">
        <a className="active"><span className="i home" />Главная</a>
        <a><span className="i catalog" />Каталог</a>
        <a><span className="i cart" />Корзина</a>
        <a><span className="i profile" />Профиль</a>
      </nav>
    </div>
  )
}


