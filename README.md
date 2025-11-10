# AvaStore - Telegram Marketplace Mini App

Маркетплейс в виде Telegram мини-приложения, аналогичный Wildberries и Ozon.

## 🚀 Технологии

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite
- **База данных**: PostgreSQL
- **Telegram Bot**: node-telegram-bot-api
- **Деплой**: Render

## ✨ Возможности

- 🛍️ Каталог товаров с фильтрацией и поиском
- 🛒 Корзина покупок
- 📦 Система заказов
- 👤 Профиль пользователя
- 🔐 Аутентификация через Telegram
- 📱 Адаптивный дизайн для Telegram Mini App
- 🎨 Поддержка тем Telegram

## 📁 Структура проекта

```
avastore/
├── backend/          # Backend API (Node.js + Express + TypeScript)
├── frontend/         # Telegram Mini App (React + TypeScript + Vite)
├── package.json      # Root package.json для workspace
├── render.yaml       # Конфигурация для Render
└── README.md
```

## 🛠 Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd avastore
```

2. Установите зависимости:
```bash
npm run install:all
```

3. Настройте переменные окружения:
   - Скопируйте `backend/.env.example` в `backend/.env` и заполните
   - Создайте `frontend/.env` с `VITE_API_URL=http://localhost:3000`

4. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE avastore;
```

5. Запустите проект:
```bash
npm run dev
```

Подробные инструкции см. в [SETUP.md](./SETUP.md)

## 📝 Переменные окружения

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/avastore
TELEGRAM_BOT_TOKEN=your_bot_token
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🚢 Деплой на Render

Проект готов к деплою на Render. Подробные инструкции см. в [DEPLOY.md](./DEPLOY.md)

### Быстрый деплой

1. Загрузите `render.yaml` в Render Dashboard
2. Настройте Environment Variables
3. Дождитесь деплоя

## 📚 Документация

- [SETUP.md](./SETUP.md) - Инструкция по настройке проекта
- [DEPLOY.md](./DEPLOY.md) - Инструкция по деплою на Render

## 🎯 API Endpoints

### Auth
- `POST /api/auth/telegram` - Аутентификация через Telegram
- `GET /api/auth/me` - Получить текущего пользователя

### Products
- `GET /api/products` - Список товаров (с фильтрами)
- `GET /api/products/:id` - Детали товара
- `POST /api/products` - Создать товар (требует auth)
- `PUT /api/products/:id` - Обновить товар (требует auth)

### Cart
- `GET /api/users/cart` - Получить корзину (требует auth)
- `POST /api/users/cart` - Добавить в корзину (требует auth)
- `PUT /api/users/cart/:id` - Обновить количество (требует auth)
- `DELETE /api/users/cart/:id` - Удалить из корзины (требует auth)

### Orders
- `GET /api/orders` - Список заказов (требует auth)
- `GET /api/orders/:id` - Детали заказа (требует auth)
- `POST /api/orders` - Создать заказ (требует auth)

### Categories
- `GET /api/categories` - Список категорий
- `GET /api/categories/:id` - Детали категории

## 🔧 Разработка

```bash
# Установка всех зависимостей
npm run install:all

# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Запуск только backend
npm run dev:backend

# Запуск только frontend
npm run dev:frontend
```

## 📄 Лицензия

MIT
