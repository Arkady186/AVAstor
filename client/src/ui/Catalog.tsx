import { useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCTS, type ProductData } from '../data/products'

type Filters = {
  q: string
  category: string | 'Все'
  brand: string | 'Все'
  size: string | 'Все'
  price: [number, number] // min,max
  sort: 'Популярные' | 'Дешевле' | 'Дороже'
}

const allBrands = Array.from(new Set(PRODUCTS.map(p => p.brand)))
const allCategories = Array.from(new Set(PRODUCTS.map(p => p.category)))

function useSearchHistory() {
  const KEY = 'ava_search_history'
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })
  const push = (q: string) => {
    const next = [q, ...history.filter(x => x !== q)].slice(0, 5)
    setHistory(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  }
  return { history, push }
}

export function Catalog() {
  const [filters, setFilters] = useState<Filters>({
    q: '',
    category: 'Все',
    brand: 'Все',
    size: 'Все',
    price: [0, 20000],
    sort: 'Популярные',
  })
  const [limit, setLimit] = useState(8)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { history, push } = useSearchHistory()

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setLimit(prev => prev + 6) })
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const brands = useMemo(() => ['Все', ...allBrands], [])
  const categories = useMemo(() => ['Все', ...allCategories], [])

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice()
    if (filters.q.trim()) {
      const q = filters.q.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q))
    }
    if (filters.category !== 'Все') list = list.filter(p => p.category === filters.category)
    if (filters.brand !== 'Все') list = list.filter(p => p.brand === filters.brand)
    if (filters.size !== 'Все') list = list.filter(p => (p.sizes || []).includes(filters.size as any))
    list = list.filter(p => p.price >= filters.price[0] && p.price <= filters.price[1])
    if (filters.sort === 'Дешевле') list.sort((a, b) => a.price - b.price)
    if (filters.sort === 'Дороже') list.sort((a, b) => b.price - a.price)
    return list
  }, [filters])

  const show = filtered.slice(0, limit)

  const synonyms: Record<string, string[]> = {
    'кроссовки': ['кеды', 'sneakers', 'обувь'],
    'футболка': ['лонгслив', 't-shirt'],
  }
  const suggestions = useMemo(() => {
    if (!filters.q) return history
    const base = Object.entries(synonyms).find(([k, v]) => k.includes(filters.q.toLowerCase()) || v.some(s => s.includes(filters.q.toLowerCase())))
    return base ? [base[0], ...base[1]].slice(0, 5) : history
  }, [filters.q, history])

  return (
    <div className="market market--white">
      <header className="wb-header">
        <div className="wb-title">Каталог</div>
        <div className="wb-search">
          <span className="ico search" />
          <input
            placeholder="Поиск"
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter' && filters.q) push(filters.q) }}
          />
          <span className="ico mic" />
          <span className="ico scan" />
          <span className="ico cam" />
        </div>
        {suggestions.length > 0 && (
          <div className="suggest">
            {suggestions.map(s => (
              <button key={s} onClick={() => setFilters({ ...filters, q: s })}>{s}</button>
            ))}
          </div>
        )}
      </header>

      <div className="filters">
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value as any })}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value as any })}>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filters.size} onChange={e => setFilters({ ...filters, size: e.target.value as any })}>
          {['Все','XS','S','M','L','XL'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value as any })}>
          {['Популярные','Дешевле','Дороже'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <main className="market__grid">
        {show.map(p => (
          <article className="cardv2" key={p.id} onClick={() => (window as any).__onOpenProduct?.(p)}>
            <div className="cardv2__img">
              <img src={`${p.images[0]}&w=600`} loading="lazy" alt={p.title} />
            </div>
            <div className="cardv2__title">{p.title}</div>
            <div className="cardv2__meta">
              <div className="price">{p.price.toLocaleString('ru-RU')} ₽</div>
              <div className="rating">★ {(p.rating || 4.5).toFixed(1)}</div>
            </div>
            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); (window as any).__onAddToCart?.(p)}}>В корзину</button>
          </article>
        ))}
      </main>
      <div ref={loaderRef} style={{ height: 1 }} />
    </div>
  )
}


