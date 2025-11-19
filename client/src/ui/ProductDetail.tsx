import { useMemo, useState } from 'react'
import type { ProductData } from '../data/products'

type Props = {
  product: ProductData
  onClose: () => void
  onAdd: (p: ProductData, size?: string) => void
}

export function ProductDetail({ product, onClose, onAdd }: Props) {
  const [idx, setIdx] = useState(0)
  const [size, setSize] = useState<string | undefined>(undefined)
  const inStock = useMemo(() => {
    if (!product.sizes || !product.stock) return true
    if (!size) return true
    return (product.stock[size] || 0) > 0
  }, [product, size])

  return (
    <div className="pd">
      <div className="pd__overlay" onClick={onClose} />
      <div className="pd__sheet">
        <header className="pd__header">
          <button className="back" onClick={onClose}>Назад</button>
          <div className="ttl">{product.title}</div>
        </header>
        <div className="pd__gallery">
          <div className="slides">
            {product.images.map((src, i) => (
              <div key={i} className={`slide ${i===idx?'active':''}`}>
                <img src={`${src}&w=1200`} loading="lazy" alt={product.title} />
              </div>
            ))}
          </div>
          <div className="thumbs">
            {product.images.map((src, i) => (
              <button key={i} className={i===idx?'on':''} onClick={() => setIdx(i)}>
                <img src={`${src}&w=200`} loading="lazy" alt="" />
              </button>
            ))}
          </div>
        </div>
        {product.sizes && (
          <div className="pd__sizes">
            {product.sizes.map(s => (
              <button className={`size ${size===s?'on':''}`} key={s} onClick={() => setSize(s)}>
                {s}
                {product.stock && <span className="qty">{product.stock[s] ?? 0}</span>}
              </button>
            ))}
          </div>
        )}
        <div className="pd__buy">
          <div className="price">{product.price.toLocaleString('ru-RU')} ₽</div>
          <button className="btn-primary" disabled={!inStock} onClick={() => onAdd(product, size)}>В корзину</button>
        </div>
      </div>
    </div>
  )
}



