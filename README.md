# 🤖 Telegram Bot для интернет-магазина

Бот для управления Telegram Web App магазином. Отправляет уведомления о заказах и предоставляет интерфейс для покупателей.

## 🚀 Быстрый старт

### 1. Создание бота
1. Напишите [@BotFather](https://t.me/BotFather) в Telegram
2. Используйте команду `/newbot`
3. Задайте имя и username бота
4. Сохраните полученный токен

### 2. Получение ID
1. **Ваш User ID:** Напишите [@userinfobot](https://t.me/userinfobot)
2. **Chat ID канала:** Добавьте [@RawDataBot](https://t.me/RawDataBot) в канал

### 3. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```env
TELEGRAM_BOT_TOKEN=6123456789:AAEdfghjk123456789
ADMIN_ID=658942011
ADMIN_CHAT_ID=-100158942011
SHOP_URL=https://1cvit.netlify.app
NODE_ENV=production
