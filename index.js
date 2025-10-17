require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Telegram Shop Bot запущен!');

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  const keyboard = {
    reply_markup: {
      keyboard: [
        [{
          text: "🛍️ Открыть магазин",
          web_app: { url: process.env.SHOP_URL }
        }]
      ],
      resize_keyboard: true
    }
  };

  bot.sendMessage(chatId, 
    `Привет, ${userName}! 👋

Добро пожаловать в наш Telegram магазин! 🛍️

Нажмите кнопку ниже чтобы открыть магазин прямо в Telegram:`, 
    keyboard
  );
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    `📖 **Помощь по магазину**

• 🛍️ Нажмите "Открыть магазин" для покупок
• 💬 По вопросам пишите @username
• 🔄 Перезапустите бота командой /start

Наш сайт: ${process.env.SHOP_URL}`
  );
});

// Обработка данных из Web App
bot.on('message', async (msg) => {
  if (msg.web_app_data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      console.log('Данные из Web App:', data);
      
      if (data.type === 'order') {
        await processOrder(msg, data);
      }
      
    } catch (error) {
      console.error('Ошибка обработки Web App данных:', error);
      bot.sendMessage(msg.chat.id, '❌ Ошибка обработки заказа');
    }
  }
});

// Обработка заказа
async function processOrder(msg, orderData) {
  const chatId = msg.chat.id;
  const user = msg.from;

  try {
    // Формируем сообщение о заказе
    const orderMessage = `
🛒 **Новый заказ #${orderData.orderId}**

**Покупатель:** ${user.first_name} ${user.last_name || ''}
**Username:** @${user.username || 'не указан'}
**ID:** ${user.id}

**Товары:**
${orderData.items.map(item => `• ${item.name} × ${item.quantity} = ${item.price * item.quantity} ₽`).join('\n')}

**💰 Итого:** ${orderData.total} ₽

**📅 Дата:** ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Отправляем уведомление администратору
    if (process.env.ADMIN_CHAT_ID) {
      await bot.sendMessage(process.env.ADMIN_CHAT_ID, orderMessage, { parse_mode: 'Markdown' });
    }

    // Подтверждение пользователю
    await bot.sendMessage(chatId,
      `✅ **Заказ #${orderData.orderId} принят!**

Спасибо за покупку! 🎉

Ваш заказ:
${orderData.items.map(item => `• ${item.name} × ${item.quantity}`).join('\n')}

**Итого: ${orderData.total} ₽**

Мы свяжемся с вами в ближайшее время для подтверждения заказа. 📞`,
      { parse_mode: 'Markdown' }
    );

    console.log(`Заказ #${orderData.orderId} обработан для пользователя ${user.id}`);

  } catch (error) {
    console.error('Ошибка обработки заказа:', error);
    await bot.sendMessage(chatId, 
      '❌ Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже или свяжитесь с поддержкой.'
    );
  }
}

// Команда для администраторов
bot.onText(/\/admin/, (msg) => {
  const userId = msg.from.id;
  
  if (userId.toString() === process.env.ADMIN_ID) {
    bot.sendMessage(msg.chat.id, '👑 **Панель администратора**', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          {
            text: "📊 Открыть админку",
            web_app: { url: `${process.env.SHOP_URL}/admin` }
          }
        ]]
      }
    });
  } else {
    bot.sendMessage(msg.chat.id, '⛔ У вас нет доступа к этой команде.');
  }
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error);
});

console.log('✅ Бот успешно запущен и ожидает сообщений...');
