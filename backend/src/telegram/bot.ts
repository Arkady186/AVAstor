import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

let bot: TelegramBot | null = null;

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN not provided, bot will not be initialized');
    return;
  }

  bot = new TelegramBot(token, { polling: true });

  // Start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '🛍️ Открыть магазин',
            web_app: { url: process.env.FRONTEND_URL || 'http://localhost:5173' },
          },
        ],
      ],
    };

    bot?.sendMessage(chatId, 'Добро пожаловать в AvaStore! 🛍️\n\nНажмите кнопку ниже, чтобы открыть магазин:', {
      reply_markup: keyboard,
    });
  });

  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot?.sendMessage(
      chatId,
      '📖 Помощь по AvaStore:\n\n' +
        '/start - Начать работу с ботом\n' +
        '/help - Показать эту справку\n\n' +
        'Используйте кнопку "Открыть магазин" для доступа к каталогу товаров.'
    );
  });

  // Handle callback queries
  bot.on('callback_query', (query) => {
    const chatId = query.message?.chat.id;
    if (chatId) {
      bot?.answerCallbackQuery(query.id);
    }
  });

  console.log('✅ Telegram bot is running');
}

export function getBot(): TelegramBot | null {
  return bot;
}

