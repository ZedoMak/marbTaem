# AddisBot - Telegram Food Ordering Bot

A modern Telegram bot for ordering Ethiopian food with a beautiful Mini App interface.

## Features

- 🍽️ **Food Ordering**: Order traditional Ethiopian dishes
- 🌾 **Flour Orders**: Order different types of flour
- 🌍 **Multi-language**: English and Amharic support
- 📱 **Mini App**: Beautiful web interface for better UX
- 💬 **Admin Contact**: Direct contact with restaurant owner
- 📋 **Order Management**: Complete order tracking system

## Tech Stack

- **Backend**: Node.js, Telegraf.js
- **Frontend**: HTML, CSS, JavaScript
- **Server**: Express.js
- **Deployment**: Railway

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AddisBot.git
   cd AddisBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file with:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   ADMIN_USERNAME=your_telegram_username
   ADMIN_PHONE=+251911234567
   MINI_APP_URL=https://your-domain.com
   ```

4. **Run the bot**
   ```bash
   # Development mode
   npm run dev:full
   
   # Production mode
   npm start
   ```

## Commands

- `/start` - Start the bot
- `/test_app` - Test Mini App access
- `/cancel` - Cancel current order

## Mini App

The bot includes a beautiful Mini App interface that provides:
- Modern UI/UX design
- Smooth order flow
- Real-time order tracking
- Multi-language support

## Deployment

This bot is deployed on Railway for easy scaling and management.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
