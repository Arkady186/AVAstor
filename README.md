## Telegram Mini App: Лоадер магазина одежды

Мини-приложение Telegram, показывающее красивую загрузку магазина одежды. Открывается только внутри Telegram (в браузере — блокирует доступ).

### Локальный запуск

1. Установите Node.js 18+
2. Установите зависимости и соберите клиент:
   - В корне `miniapp`: `npm install`
3. Запуск сервера: `npm start`
4. Откройте `http://localhost:10000` (из браузера увидите блок-экран — это ожидаемо).

### Развёртывание через GitHub + Render

1. Создайте приватный репозиторий на GitHub и запушьте папку `miniapp` в корень репо.
2. На Render создайте Web Service:
   - Connect → выберите ваш репозиторий
   - Root Directory: `miniapp`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Environment: Node, `NODE_VERSION=18`
3. После билда получите домен вида `https://<service>.onrender.com` и добавьте его в BotFather в полях `Inline mode > Web App` или в кнопке.

### Проверка, что открыто в Telegram

- На стороне клиента: проверка наличия `window.Telegram.WebApp`, иначе — блок-экран.
- На стороне сервера: проверка User-Agent на `Telegram` и отдача блок-экранов для обычных браузеров.

### Переменные окружения (на будущее)

Скопируйте `.env.example` в `.env` и заполните при необходимости:

- `BOT_TOKEN` — токен бота (для будущей проверки подписи initData)
- `APP_BASE_URL` — базовый URL приложения на Render


