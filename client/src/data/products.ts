export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL'

export type ProductData = {
  id: string
  title: string
  brand: string
  category: 'Одежда' | 'Обувь' | 'Аксессуары' | 'Спорт'
  price: number
  images: string[]
  sizes?: Size[]
  stock?: Record<string, number> // size -> qty
  rating?: number
}

export const PRODUCTS: ProductData[] = [
  {
    id: 'p1',
    title: 'Худи oversize',
    brand: 'Avastore',
    category: 'Одежда',
    price: 3490,
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d3fc52c6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511356727535-7d5b0ae1d8f0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 10, M: 8, L: 4, XL: 2 },
    rating: 4.8,
  },
  {
    id: 'p2',
    title: 'Кроссовки белые',
    brand: 'RunFree',
    category: 'Обувь',
    price: 5990,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=1200&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 6, M: 12, L: 9, XL: 1 },
    rating: 4.7,
  },
  {
    id: 'p3',
    title: 'Джинсы карго',
    brand: 'Denimo',
    category: 'Одежда',
    price: 4590,
    images: [
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520974735194-8d8d8c5d8a2b?q=80&w=1200&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 5, M: 11, L: 7, XL: 0 },
    rating: 4.6,
  },
  {
    id: 'p4',
    title: 'Футболка basic',
    brand: 'Avastore',
    category: 'Одежда',
    price: 1490,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991163-8f7e95f1f0ad?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520974735194-8d8d8c5d8a2b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 14, S: 20, M: 15, L: 9, XL: 3 },
    rating: 4.5,
  },
  {
    id: 'p5',
    title: 'Пальто шерстяное',
    brand: 'NordWear',
    category: 'Одежда',
    price: 9990,
    images: [
      'https://images.unsplash.com/photo-1517026575980-3e1e2c899271?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1200&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L'],
    stock: { S: 2, M: 3, L: 4 },
    rating: 4.9,
  },
  {
    id: 'p6',
    title: 'Сумка шоппер',
    brand: 'Avastore',
    category: 'Аксессуары',
    price: 1990,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922284-7b6836c78c47?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520974735194-8d8d8c5d8a2b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop',
    ],
    rating: 4.4,
  },
]


