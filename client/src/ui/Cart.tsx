import type { Product } from './Marketplace'

export type CartItem = Product & { qty: number }

type CartProps = {
  items: CartItem[]
  onInc: (id: string) => void
  onDec: (id: string) => void
  onClear: () => void
}

export function Cart({ items, onInc, onDec, onClear }: CartProps) {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0)
  return (
    <div className="cart market market--white">
      <header className="cart__header">
        <div className="title">Корзина</div>
        {items.length > 0 && <button className="link" onClick={onClear}>Очистить</button>}
      </header>
      {items.length === 0 ? (
        <div className="empty">Ваша корзина пуста</div>
      ) : (
        <>
          <ul className="cart__list">
            {items.map(it => (
              <li className="cart__row" key={it.id}>
                <div className="thumb" style={{ backgroundImage: `url(${it.image})` }} />
                <div className="info">
                  <div className="t">{it.title}</div>
                  <div className="p">{it.price.toLocaleString('ru-RU')} ₽</div>
                </div>
                <div className="qty">
                  <button onClick={() => onDec(it.id)}>-</button>
                  <div>{it.qty}</div>
                  <button onClick={() => onInc(it.id)}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart__total">
            <div>Итого</div>
            <div className="sum">{total.toLocaleString('ru-RU')} ₽</div>
          </div>
          <button className="btn-primary wide">Оформить заказ</button>
        </>
      )}
    </div>
  )
}


