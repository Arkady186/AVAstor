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

export function Cart({ items, onInc, onDec, onClear, onSelectAll }: CartProps) {
  const [selectedAll, setSelectedAll] = useState(false)
  const displayItems = items.length > 0 ? items : []
  const total = displayItems.reduce((s, it) => s + it.price * it.qty, 0)
  const totalQty = displayItems.reduce((s, it) => s + it.qty, 0)

  const handleSelectAll = () => {
    const next = !selectedAll
    setSelectedAll(next)
    if (onSelectAll) onSelectAll(next)
  }

  return (
    <div className="cart market market--white cart-page">

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

      {displayItems.length === 0 ? (
        <div className="cart-empty">Ваша корзина пуста</div>
      ) : (
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
      )}

      <div className="cart-footer">
        <button className="cart-checkout">К оформлению</button>
        <div className="cart-summary">
          {totalQty} шт., {total.toLocaleString('ru-RU')} ₽ с avastore Кошельком
        </div>
      </div>
    </div>
  )
}
