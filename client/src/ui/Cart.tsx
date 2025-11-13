import { useState } from 'react'
import type { Product } from './Marketplace'

export type CartItem = Product & { qty: number }

type CartProps = {
  items: CartItem[]
  onInc: (id: string) => void
  onDec: (id: string) => void
  onClear: () => void
  onSelectAll: (selected: boolean) => void
}

const cartProducts: CartItem[] = [
  {
    id: '1',
    title: 'Пудра для объема волос ALPHA сильной фиксации, 10 г',
    price: 698,
    originalPrice: 1037,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a55eea0c44?q=80&w=400&auto=format&fit=crop',
    rating: 4.5,
    qty: 1,
    discount: 33,
  },
  {
    id: '2',
    title: 'Ремешок для Apple Watch 38, 40, 41 мм 1-10 SE',
    price: 494,
    originalPrice: 2150,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=400&auto=format&fit=crop',
    rating: 4.3,
    qty: 1,
    discount: 77,
  },
]

export function Cart({ items, onInc, onDec, onClear, onSelectAll }: CartProps) {
  const [selectedAll, setSelectedAll] = useState(false)
  const [address] = useState('Улица Рашида Нежметдинова 11к3')
  const displayItems = items.length > 0 ? items : cartProducts
  const total = displayItems.reduce((s, it) => s + it.price * it.qty, 0)
  const totalQty = displayItems.reduce((s, it) => s + it.qty, 0)

  const handleSelectAll = () => {
    const next = !selectedAll
    setSelectedAll(next)
    if (onSelectAll) onSelectAll(next)
  }

  return (
    <div className="cart market market--white cart-page">
      <div className="cart-top">
        <button className="cart-percent">%</button>
        <div className="cart-address">
          {address} <span>▼</span>
        </div>
      </div>

      <div className="cart-actions">
        <label className="cart-select-all">
          <input type="checkbox" checked={selectedAll} onChange={handleSelectAll} />
          Выбрать все
        </label>
        <button className="cart-actions-btn">Действия</button>
      </div>

      <div className="cart-delivery">
        Доставка по клику из пункта выдачи — 0 ₽ →
      </div>

      <div className="cart-items">
        {displayItems.map(p => (
          <div className="cart-item" key={p.id}>
            <input type="checkbox" className="cart-check" defaultChecked />
            {p.discount && (
              <div className="cart-timer">01:09:56 ДО КОНЦА АКЦИИ</div>
            )}
            <div className="cart-item-img" style={{ backgroundImage: `url(${p.image})` }} />
            <div className="cart-item-info">
              <div className="cart-item-price">
                <span className="cart-price-new">{p.price} ₽</span>
                {p.originalPrice && <span className="cart-price-old">{p.originalPrice} ₽</span>}
              </div>
              <div className="cart-item-title">✓ {p.title}</div>
              <div className="cart-item-delivery">Доставим завтра</div>
              <div className="cart-item-refund">Бесплатный отказ при получении</div>
              <div className="cart-item-actions">
                <div className="cart-qty">
                  <button onClick={() => onDec(p.id)}>-</button>
                  <span>{p.qty}</span>
                  <button onClick={() => onInc(p.id)}>+</button>
                </div>
                <button className="cart-buy">Купить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <button className="cart-checkout">К оформлению</button>
        <div className="cart-summary">
          {totalQty} шт., {total.toLocaleString('ru-RU')} ₽ с avastore Кошельком
        </div>
      </div>
    </div>
  )
}
