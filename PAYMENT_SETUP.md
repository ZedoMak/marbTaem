# AddisBot Order Management System

## Overview
The bot now collects food and flour orders and directs customers to contact the admin directly for payment and order completion.

## Environment Variables Required

Add these to your `.env` file:

```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_ID=your_admin_telegram_username
ADMIN_PHONE=+251911234567  # Optional, defaults to +251911234567
```

## How the Order Flow Works

1. **Customer places order**: The bot collects all order details (food/flour, quantities, event details, location)
2. **Order confirmation**: Customer reviews their order summary
3. **Contact information**: Customer receives admin contact details to complete the order
4. **Admin notification**: Admin receives order details with customer information

## Commands Available

- `/start` - Start the bot and select language
- `/cancel` - Cancel current order

## Order Features

### For Customers:
- Easy order placement in English or Amharic
- Order summary with unique order ID
- Direct contact with admin via Telegram or phone
- Clear instructions for order completion

### For Admins:
- Automatic notifications when orders are placed
- Complete customer and order information
- Unique order IDs for tracking
- Direct contact information for customers

## Order Information Collected

### Food Orders:
- Number of people to serve
- Event type (birthday, wedding, etc.)
- Event date
- Delivery location
- Total price calculation

### Flour Orders:
- Flour type (white, whole grain, barley)
- Quantity in kilograms
- Delivery location
- Total price calculation

## Contact Integration

- **Telegram Contact**: Direct link to admin's Telegram profile
- **Phone Contact**: Direct phone call link
- **Order ID**: Unique identifier for tracking

## Testing

1. Test complete order flow for both food and flour
2. Verify admin notifications are received
3. Check contact links work correctly
4. Test order cancellation functionality

## Next Steps - Mini App Conversion

This bot is designed to be easily converted to a Telegram Mini App:
- Order data collection is already structured
- User sessions are managed
- Multi-language support is implemented
- Contact integration is ready

## Security Notes

- Never commit sensitive information to version control
- Validate order data before processing
- Monitor admin notifications for spam

## Support

If you encounter issues:
1. Check your bot token is correct
2. Verify ADMIN_ID is a valid Telegram username
3. Check ADMIN_PHONE format is correct
4. Review bot logs for error messages
