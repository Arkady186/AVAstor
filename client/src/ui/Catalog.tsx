import { useState } from 'react'

const categories = [
  { id: 'women', name: 'Женщинам', icon: '👗' },
  { id: 'shoes', name: 'Обувь', icon: '👢' },
  { id: 'kids', name: 'Детям', icon: '🚲' },
  { id: 'men', name: 'Мужчинам', icon: '🧥' },
  { id: 'home', name: 'Дом', icon: '🏠' },
  { id: 'beauty', name: 'Красота', icon: '💄' },
  { id: 'accessories', name: 'Аксессуары', icon: '👜' },
  { id: 'electronics', name: 'Электроника', icon: '💻' },
  { id: 'toys', name: 'Игрушки', icon: '🧱' },
  { id: 'furniture', name: 'Мебель', icon: '🛋️' },
  { id: 'food', name: 'Продукты', icon: '🥤' },
  { id: 'flowers', name: 'Цветы', icon: '🌸' },
  { id: 'appliances', name: 'Бытовая техника', icon: '🔧' },
  { id: 'cargo', name: 'Грузовая', icon: '📦' },
  { id: 'pets', name: 'Зоотовары', icon: '🐾' },
  { id: 'sport', name: 'Спорт', icon: '⚽' },
  { id: 'auto', name: 'Автотовары', icon: '🚗' },
  { id: 'vehicles', name: 'Транспортные средства', icon: '🚙' },
  { id: 'books', name: 'Книги', icon: '📚' },
  { id: 'jewelry', name: 'Ювелирные изделия', icon: '💍' },
  { id: 'repair', name: 'Для ремонта', icon: '🔨' },
  { id: 'garden', name: 'Сад и дача', icon: '🌳' },
  { id: 'health', name: 'Здоровье', icon: '💊' },
  { id: 'adaptive', name: 'Адаптивные товары', icon: '♿' },
  { id: 'medicine', name: 'Лекарственные препараты', icon: '🏥' },
  { id: 'stationery', name: 'Канцтовары', icon: '✏️' },
  { id: 'madeinru', name: 'Сделано в России', icon: '🇷🇺' },
  { id: 'culture', name: 'Культурный код', icon: '🎨' },
  { id: 'promo', name: 'Акции', icon: '🏷️' },
  { id: 'digital', name: 'Цифровые товары', icon: '💿' },
  { id: 'insurance', name: 'Страховки', icon: '🛡️' },
]

export function Catalog() {
  const [query, setQuery] = useState('')
  return (
    <div className="market market--white catalog-page">
      <div className="catalog-header">
        <div className="catalog-search">
          <span className="ico search" />
          <input placeholder="Поиск" value={query} onChange={e => setQuery(e.target.value)} />
          <span className="ico cam" />
        </div>
      </div>

      <main className="catalog-grid">
        {categories.map(cat => (
          <button className="catalog-tile" key={cat.id}>
            <div className="catalog-icon">{cat.icon}</div>
            <div className="catalog-name">{cat.name}</div>
          </button>
        ))}
      </main>
    </div>
  )
}
