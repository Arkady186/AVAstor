export type TattooStyle = 
  | 'Реализм' 
  | 'Минимализм' 
  | 'Олдскул' 
  | 'Ньюскул' 
  | 'Японский' 
  | 'Геометрия' 
  | 'Акварель' 
  | 'Трайбл' 
  | 'Блэкворк' 
  | 'Лайнворк'
  | 'Портреты'
  | 'Цветные'
  | 'Ботаника'

export type Master = {
  id: string
  name: string
  specialization: TattooStyle[]
  experience: number
  rating: number
  reviews: number
  avatar: string
  portfolio: string[]
  bio: string
  pricePerHour: number
  available: boolean
}

export type Service = {
  id: string
  title: string
  description: string
  price: number
  duration: number // в минутах
  category: 'Татуировка' | 'Пирсинг' | 'Коррекция' | 'Консультация' | 'Обучение'
  image: string
}

export type PortfolioItem = {
  id: string
  title: string
  style: TattooStyle
  masterId: string
  masterName: string
  images: string[]
  description?: string
  date: string
  likes: number
}

export type Appointment = {
  id: string
  masterId: string
  masterName: string
  serviceId: string
  serviceTitle: string
  date: string // ISO date
  time: string // HH:mm
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

export const MASTERS: Master[] = [
  {
    id: 'm1',
    name: 'Алексей Воронов',
    specialization: ['Реализм', 'Портреты', 'Блэкворк'],
    experience: 8,
    rating: 4.9,
    reviews: 127,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    bio: 'Специализируюсь на реалистичных портретах и черно-белых работах. Опыт 8 лет.',
    pricePerHour: 5000,
    available: true,
  },
  {
    id: 'm2',
    name: 'Мария Соколова',
    specialization: ['Минимализм', 'Геометрия', 'Лайнворк'],
    experience: 6,
    rating: 4.8,
    reviews: 89,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    bio: 'Мастер тонких линий и геометрических композиций. Создаю элегантные минималистичные тату.',
    pricePerHour: 4500,
    available: true,
  },
  {
    id: 'm3',
    name: 'Дмитрий Орлов',
    specialization: ['Олдскул', 'Ньюскул', 'Японский'],
    experience: 10,
    rating: 5.0,
    reviews: 203,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    bio: 'Классические и современные стили. Опыт работы 10 лет, более 500 выполненных работ.',
    pricePerHour: 6000,
    available: true,
  },
  {
    id: 'm4',
    name: 'Елена Петрова',
    specialization: ['Акварель', 'Цветные', 'Ботаника'],
    experience: 5,
    rating: 4.7,
    reviews: 64,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    bio: 'Создаю яркие акварельные татуировки с цветочными и природными мотивами.',
    pricePerHour: 5000,
    available: true,
  },
]

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Татуировка (малая)',
    description: 'Татуировка до 10 см²',
    price: 3000,
    duration: 60,
    category: 'Татуировка',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
  {
    id: 's2',
    title: 'Татуировка (средняя)',
    description: 'Татуировка 10-30 см²',
    price: 8000,
    duration: 120,
    category: 'Татуировка',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
  {
    id: 's3',
    title: 'Татуировка (большая)',
    description: 'Татуировка от 30 см²',
    price: 15000,
    duration: 240,
    category: 'Татуировка',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
  {
    id: 's4',
    title: 'Коррекция татуировки',
    description: 'Исправление или перекрытие старой татуировки',
    price: 5000,
    duration: 90,
    category: 'Коррекция',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
  {
    id: 's5',
    title: 'Консультация',
    description: 'Обсуждение эскиза, выбор стиля и мастера',
    price: 0,
    duration: 30,
    category: 'Консультация',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
  {
    id: 's6',
    title: 'Пирсинг',
    description: 'Прокол ушей, носа, бровей и других частей тела',
    price: 2000,
    duration: 30,
    category: 'Пирсинг',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=400&h=300&fit=crop',
  },
]

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Портрет в реализме',
    style: 'Реализм',
    masterId: 'm1',
    masterName: 'Алексей Воронов',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    description: 'Реалистичный портрет на предплечье',
    date: '2024-01-15',
    likes: 234,
  },
  {
    id: 'p2',
    title: 'Геометрическая композиция',
    style: 'Геометрия',
    masterId: 'm2',
    masterName: 'Мария Соколова',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    description: 'Минималистичная геометрия на руке',
    date: '2024-01-20',
    likes: 189,
  },
  {
    id: 'p3',
    title: 'Японский дракон',
    style: 'Японский',
    masterId: 'm3',
    masterName: 'Дмитрий Орлов',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    date: '2024-01-18',
    likes: 312,
  },
  {
    id: 'p4',
    title: 'Акварельные цветы',
    style: 'Акварель',
    masterId: 'm4',
    masterName: 'Елена Петрова',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    description: 'Яркая акварельная композиция с розами',
    date: '2024-01-22',
    likes: 267,
  },
  {
    id: 'p5',
    title: 'Минималистичный лайнворк',
    style: 'Лайнворк',
    masterId: 'm2',
    masterName: 'Мария Соколова',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    date: '2024-01-25',
    likes: 145,
  },
  {
    id: 'p6',
    title: 'Олдскул якорь',
    style: 'Олдскул',
    masterId: 'm3',
    masterName: 'Дмитрий Орлов',
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d9f344f67?w=800&h=600&fit=crop',
    ],
    date: '2024-01-28',
    likes: 198,
  },
]

