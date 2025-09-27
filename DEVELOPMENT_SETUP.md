# AddisBot Development Setup Guide

## 🚨 Important: HTTPS Requirement for Mini Apps

**Telegram Mini Apps require HTTPS URLs** - this is why you're seeing the error. Here are your options:

## 🔧 Quick Fix for Development

### Option 1: Test Bot Without Mini App (Recommended for Development)

Your bot is now configured to automatically detect development mode and work without the Mini App button when using localhost URLs.

**Just start your bot normally:**
```bash
npm start
```

The bot will work perfectly for testing the traditional order flow!

### Option 2: Use ngrok for HTTPS (For Mini App Testing)

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   ```

2. **Start your server:**
   ```bash
   npm run server
   ```

3. **In another terminal, create HTTPS tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Update your .env file:**
   ```env
   MINI_APP_URL=https://your-ngrok-url.ngrok.io
   ```

5. **Restart your bot:**
   ```bash
   npm start
   ```

## 🎯 Current Status

### ✅ What's Working:
- **Bot functionality** - All order flows work perfectly
- **Admin notifications** - Orders are sent to admin
- **Contact integration** - Phone links now use WhatsApp
- **Multi-language support** - English & Amharic
- **Order management** - Complete order system

### 🔧 What's Fixed:
1. **HTTPS Issue** - Bot now detects development mode
2. **Phone URL Issue** - Now uses WhatsApp links instead of tel:
3. **Development Workflow** - Clean setup for local testing

## 🚀 Testing Your Bot

### 1. Start the Bot:
```bash
npm start
```

### 2. Test Order Flow:
1. Send `/start` to your bot
2. Choose language (EN/አማ)
3. Select order type (Food/Flour)
4. Complete the order process
5. Check admin notifications

### 3. Test Mini App (if using ngrok):
1. Set up ngrok as described above
2. Update MINI_APP_URL in .env
3. Restart bot
4. Click "🚀 Open Mini App" button

## 🌐 Production Deployment

When you're ready for production:

### 1. Deploy to a hosting service:
- **Heroku** (recommended for beginners)
- **Vercel** (great for static sites)
- **Railway** (simple Node.js deployment)
- **DigitalOcean** (full control)

### 2. Set environment variables:
```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_ID=your_admin_telegram_username
ADMIN_PHONE=+251911234567
MINI_APP_URL=https://your-production-domain.com
PORT=3000
NODE_ENV=production
```

### 3. Configure your bot with BotFather:
```
/setmenubutton
@your_bot_name
https://your-production-domain.com
```

## 🎉 Your Bot is Ready!

**For Development:** Just run `npm start` and test the traditional bot flow!

**For Mini App:** Use ngrok or deploy to production with HTTPS.

The bot works perfectly in both modes and provides an excellent ordering experience for your customers!

## 📞 Support

If you need help with deployment or have questions, the codebase is well-documented and ready for production use.

---

**Happy coding! 🚀**
