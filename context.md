# AddisBot – Food & Flour Ordering Telegram Bot

## 📌 Overview

This project is a Telegram bot built with Node.js using the Telegraf framework.
It allows customers to:

- Order Food for events (birthdays, weddings, etc.) by number of people.
- Buy Flour (different types, sold in kilograms).
- Choose language (English or Amharic) when starting.
- Choose Pay Now (with transaction ID) or Pay Later.
- Provide event/due date and delivery location.
- Notify the Admin automatically about all new orders.

## 📌 Features

### 🌐 Language Selection
- `/start` asks the user to choose English or አማርኛ (Amharic).
- Bot menus and flows adapt to the chosen language.

### 🍲 Food Ordering
- Ask how many people.
- Calculate price (150 ETB per person).
- Ask if the user wants to Pay Now or Pay Later.
- If Pay Now → ask for Transaction ID.
- If Pay Later → continue order.
- Ask for event type (Birthday, Wedding, etc.).
- Ask for event date (DD/MM/YYYY).
- Ask for delivery location.
- Confirm order and notify admin.

### 🌾 Flour Ordering
- Ask for flour type (options: White, Whole Grain, Barley, etc.).
- Ask for quantity in kilograms.
- Calculate price (70 ETB per Kg).
- Ask if the user wants to Pay Now or Pay Later.
- If Pay Now → ask for Transaction ID.
- If Pay Later → continue order.
- Ask for delivery location.
- Confirm order and notify admin.

### 👨‍💼 Admin Notifications
Admin receives a summary of each order with:
- Customer details (username, name, ID)
- Order details (food/flour, price, event/date, location)
- Payment info (Pay Later / Paid with TX ID)

### 🛠️ Other Commands
- `/cancel` → cancels an ongoing order.
- `/start` → restart and choose language again.

## 📌 Technical Details

- **Language**: JavaScript (Node.js)
- **Framework**: Telegraf
- **Environment Variables** (from .env):
  - `BOT_TOKEN` → Telegram bot token
  - `ADMIN_ID` → Telegram chat ID of the admin

## 📌 Project Structure

```
AddisBot/
├── bot.js         # main bot code
├── .env           # secrets (BOT_TOKEN, ADMIN_ID)
├── package.json
└── context.md     # this file
```

## 📌 Requirements

- Node.js 18+
- Dependencies:
  ```json
  {
    "dependencies": {
      "telegraf": "^4.15.0",
      "dotenv": "^16.4.0"
    }
  }
  ```

## 📌 Running the Bot

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   BOT_TOKEN=your_bot_token_here
   ADMIN_ID=your_admin_telegram_id_here
   ```

3. Run the bot:
   ```bash
   npm start
   ```

## 📌 Acceptance Criteria

- ✅ Bot works fully in both English and Amharic.
- ✅ Food and Flour ordering flows calculate total price, include event/due date, and support Pay Now / Pay Later.
- ✅ Admin receives notifications for every order.
- ✅ Code is well-structured and easy to extend (database integration later).

## 📌 Bot Flow

1. User starts with `/start` command
2. Language selection (English/Amharic)
3. Main menu (Food/Flour order)
4. Order-specific flow:
   - **Food**: People count → Payment method → Event details → Location → Confirmation
   - **Flour**: Type selection → Quantity → Payment method → Location → Confirmation
5. Admin notification sent automatically
6. Order confirmation to user

## 📌 Pricing

- **Food**: 150 ETB per person
- **Flour**: 70 ETB per kilogram

## 📌 Supported Flour Types

- White Flour
- Whole Grain Flour  
- Barley Flour
