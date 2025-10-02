require('dotenv').config();
console.log("BOT_TOKEN:", process.env.BOT_TOKEN);
console.log("CHAPA_TEST:", process.env.CHAPA_TEST);

const { Telegraf, Markup } = require('telegraf');


const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_USER_NAME = process.env.ADMIN_USER_NAME;
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+251911234567'; // Default phone number

// User sessions to track order state
const userSessions = new Map();

// Language texts
const texts = {
  en: {
    welcome: 'Welcome to AddisBot! 🌟\nPlease choose your language:',
    chooseLanguage: 'Choose Language',
    english: 'English 🇺🇸',
    amharic: 'አማርኛ 🇪🇹',
    mainMenu: 'What would you like to order?',
    foodOrder: '🍲 Order Food',
    flourOrder: '🌾 Order Flour',
    cancel: '❌ Cancel',
    howManyPeople: 'How many people will be served?',
    flourType: 'What type of flour would you like?',
    whiteFlour: 'White Flour',
    wholeGrain: 'Whole Grain Flour',
    barley: 'Barley Flour',
    quantity: 'How many kilograms do you need?',
    orderComplete: '✅ Order received! Please contact us to complete your order.',
    contactAdmin: '📞 Contact Admin',
    adminPhone: '📱 Call Admin',
    orderInstructions: 'To complete your order, please contact us using the information below:',
    miniAppWelcome: '🎉 Experience our new Mini App for a better ordering experience!',
    openApp: '🚀 Open Mini App',
    eventType: 'What type of event is this for?',
    eventDate: 'When is the event? (DD/MM/YYYY)',
    deliveryLocation: 'Please provide the delivery location:',
    orderSummary: '📋 Order Summary',
    totalPrice: 'Total Price',
    confirmOrder: '✅ Confirm Order',
    orderConfirmed: '✅ Order confirmed! We will contact you soon.',
    orderCancelled: '❌ Order cancelled.',
    invalidNumber: 'Please enter a valid number.',
    invalidDate: 'Please enter a valid date in DD/MM/YYYY format.',
    adminNotification: '🔔 New Order Received!'
  },
  am: {
    welcome: 'እንኳን ደህና መጡ AddisBot! 🌟\nእባክዎ ቋንቋዎን ይምረጡ:',
    chooseLanguage: 'ቋንቋ ይምረጡ',
    english: 'English 🇺🇸',
    amharic: 'አማርኛ 🇪🇹',
    mainMenu: 'ምን መምዘዝ ይፈልጋሉ?',
    foodOrder: '🍲 ምግብ አዘዝ',
    flourOrder: '🌾 ዱቄት አዘዝ',
    cancel: '❌ ይሰርዝ',
    howManyPeople: 'ለስንት ሰዎች ይዘጋጃል?',
    flourType: 'ምን ዓይነት ዱቄት ይፈልጋሉ?',
    whiteFlour: 'ነጭ ዱቄት',
    wholeGrain: 'ሙሉ እህል ዱቄት',
    barley: 'ስንዴ ዱቄት',
    quantity: 'ስንት ኪሎ ግራም ያስፈልግዎታል?',
    orderComplete: '✅ ትዕዛዝ ተቀብለናል! ትዕዛዝዎን ለማጠናቀቅ እባክዎ እንገናኝ።',
    contactAdmin: '📞 አስተዳዳሪ አግኝ',
    adminPhone: '📱 አስተዳዳሪ ይደውሉ',
    orderInstructions: 'ትዕዛዝዎን ለማጠናቀቅ፣ እባክዎ ከዚህ በታች ባለው መረጃ ይገናኙን።',
    miniAppWelcome: '🎉 የተሻለ የትዕዛዝ ልምድ ለማግኘት አዲሱን ሚኒ አፕ ይሞክሩ!',
    openApp: '🚀 ሚኒ አፕ ክፈት',
    eventType: 'ይህ ምን ዓይነት ዝግጅት ነው?',
    eventDate: 'ዝግጅቱ መቼ ነው? (DD/MM/YYYY)',
    deliveryLocation: 'እባክዎ የማድረሻ ቦታ ይስጡ:',
    orderSummary: '📋 የትዕዛዝ ማጠቃለያ',
    totalPrice: 'አጠቃላይ ዋጋ',
    confirmOrder: '✅ ትዕዛዝ አረጋግጥ',
    orderConfirmed: '✅ ትዕዛዝ ተረጋግጧል! በቅርብ ጊዜ እንገናኝዎታለን።',
    orderCancelled: '❌ ትዕዛዝ ተሰርዟል።',
    invalidNumber: 'እባክዎ ትክክለኛ ቁጥር ያስገቡ።',
    invalidDate: 'እባክዎ ትክክለኛ ቀን በDD/MM/YYYY ቅርጸት ያስገቡ።',
    adminNotification: '🔔 አዲስ ትዕዛዝ ደርሷል!'
  }
};

// Initialize user session
function initUserSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      language: null,
      orderType: null,
      orderData: {},
      step: 'language_selection'
    });
  }
  return userSessions.get(userId);
}

// Get text based on user language
function getText(userId, key) {
  const session = userSessions.get(userId);
  const lang = session?.language || 'en';
  return texts[lang][key] || texts.en[key];
}

// Format price
function formatPrice(amount, currency = 'ETB') {
  return `${amount} ${currency}`;
}

// Validate date format
function isValidDate(dateString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

// Generate order ID
function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

// Send admin notification
async function notifyAdmin(user, orderData, lang) {
  const text = getText(user.id, 'adminNotification');
  const t = texts[lang];
  
  let message = `${text}\n\n`;
  message += `👤 Customer: ${user.first_name} ${user.last_name || ''} (@${user.username || 'no_username'})\n`;
  message += `🆔 User ID: ${user.id}\n\n`;
  
  if (orderData.type === 'food') {
    message += `🍲 Food Order\n`;
    message += `👥 People: ${orderData.people}\n`;
    message += `💰 Price: ${formatPrice(orderData.people * 150)}\n`;
    message += `🎉 Event: ${orderData.eventType}\n`;
    message += `📅 Date: ${orderData.eventDate}\n`;
  } else if (orderData.type === 'flour') {
    message += `🌾 Flour Order\n`;
    message += `📦 Type: ${orderData.flourType}\n`;
    message += `⚖️ Quantity: ${orderData.quantity} kg\n`;
    message += `💰 Price: ${formatPrice(orderData.quantity * 70)}\n`;
  }
  
  message += `📍 Location: ${orderData.location}\n`;
  message += `🆔 Order ID: ${orderData.orderId}\n`;
  
  try {
    await bot.telegram.sendMessage(ADMIN_ID, message);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// Start command
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  initUserSession(userId);
  
  // Check if we're in development mode (no HTTPS URL)
  const isDevelopment = !process.env.MINI_APP_URL || process.env.MINI_APP_URL.includes('localhost');
  
  const welcomeText = isDevelopment 
    ? getText(userId, 'welcome')
    : `${getText(userId, 'welcome')}\n\n${getText(userId, 'miniAppWelcome')}`;
  
  const keyboard = isDevelopment 
    ? [
        [Markup.button.callback(getText(userId, 'english'), 'lang_en')],
        [Markup.button.callback(getText(userId, 'amharic'), 'lang_am')]
      ]
    : [
        [Markup.button.webApp(getText(userId, 'openApp'), process.env.MINI_APP_URL)],
        [Markup.button.callback(getText(userId, 'english'), 'lang_en')],
        [Markup.button.callback(getText(userId, 'amharic'), 'lang_am')]
      ];
  
  await ctx.reply(welcomeText, Markup.inlineKeyboard(keyboard));
});

// Cancel command
bot.command('cancel', async (ctx) => {
  const userId = ctx.from.id;
  userSessions.delete(userId);
  await ctx.reply(getText(userId, 'orderCancelled'));
});

// Test Mini App command
bot.command('test_app', async (ctx) => {
  const userId = ctx.from.id;
  
  await ctx.reply('🧪 Testing Mini App Access', 
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Open Mini App (Test)', `${process.env.MINI_APP_URL || 'https://your-domain.com'}`)],
      [Markup.button.callback('📱 Traditional Order', 'order_food')]
    ])
  );
});


// Language selection
bot.action('lang_en', async (ctx) => {
  const userId = ctx.from.id;
  const session = initUserSession(userId);
  session.language = 'en';
  session.step = 'main_menu';
  
  await ctx.answerCbQuery();
  
  // Check if we're in development mode (no HTTPS URL)
  const isDevelopment = !process.env.MINI_APP_URL || process.env.MINI_APP_URL.includes('localhost');
  
  const keyboard = isDevelopment 
    ? [
        [Markup.button.callback(getText(userId, 'foodOrder'), 'order_food')],
        [Markup.button.callback(getText(userId, 'flourOrder'), 'order_flour')]
      ]
    : [
        [Markup.button.webApp(getText(userId, 'openApp'), process.env.MINI_APP_URL)],
        [Markup.button.callback(getText(userId, 'foodOrder'), 'order_food')],
        [Markup.button.callback(getText(userId, 'flourOrder'), 'order_flour')]
      ];
  
  await ctx.editMessageText(getText(userId, 'mainMenu'), Markup.inlineKeyboard(keyboard));
});

bot.action('lang_am', async (ctx) => {
  const userId = ctx.from.id;
  const session = initUserSession(userId);
  session.language = 'am';
  session.step = 'main_menu';
  
  await ctx.answerCbQuery();
  
  // Check if we're in development mode (no HTTPS URL)
  const isDevelopment = !process.env.MINI_APP_URL || process.env.MINI_APP_URL.includes('localhost');
  
  const keyboard = isDevelopment 
    ? [
        [Markup.button.callback(getText(userId, 'foodOrder'), 'order_food')],
        [Markup.button.callback(getText(userId, 'flourOrder'), 'order_flour')]
      ]
    : [
        [Markup.button.webApp(getText(userId, 'openApp'), process.env.MINI_APP_URL)],
        [Markup.button.callback(getText(userId, 'foodOrder'), 'order_food')],
        [Markup.button.callback(getText(userId, 'flourOrder'), 'order_flour')]
      ];
  
  await ctx.editMessageText(getText(userId, 'mainMenu'), Markup.inlineKeyboard(keyboard));
});

// Food ordering flow
bot.action('order_food', async (ctx) => {
  const userId = ctx.from.id;
  const session = initUserSession(userId);
  session.orderType = 'food';
  session.orderData = { type: 'food' };
  session.step = 'food_people';
  
  await ctx.answerCbQuery();
  await ctx.editMessageText(getText(userId, 'howManyPeople'));
});

// Flour ordering flow
bot.action('order_flour', async (ctx) => {
  const userId = ctx.from.id;
  const session = initUserSession(userId);
  session.orderType = 'flour';
  session.orderData = { type: 'flour' };
  session.step = 'flour_type';
  
  await ctx.answerCbQuery();
  await ctx.editMessageText(getText(userId, 'flourType'),
    Markup.inlineKeyboard([
      [Markup.button.callback(getText(userId, 'porridge flour'), 'flour_porridge')],
      [Markup.button.callback(getText(userId, 'soup flour'), 'flour_soup')],
      [Markup.button.callback(getText(userId, 'barley'), 'flour_barley')]
    ])
  );
});

// Flour type selection
bot.action(/^flour_(white|whole|barley)$/, async (ctx) => {
  const userId = ctx.from.id;
  const session = userSessions.get(userId);
  const flourType = ctx.match[1];
  
  const typeNames = {
    porridge: getText(userId, 'porridgeFlour'),
    soup: getText(userId, 'soupFlour'),
    barley: getText(userId, 'barley')
  };
  
  session.orderData.flourType = typeNames[flourType];
  session.step = 'flour_quantity';
  
  await ctx.answerCbQuery();
  await ctx.editMessageText(getText(userId, 'quantity'));
});

// Handle text messages for order flow
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const session = userSessions.get(userId);
  const text = ctx.message.text;
  
  if (!session) return;
  
  switch (session.step) {
    case 'food_people':
      const people = parseInt(text);
      if (isNaN(people) || people < 1) {
        await ctx.reply(getText(userId, 'invalidNumber'));
        return;
      }
      
      session.orderData.people = people;
      session.orderData.totalPrice = people * 150;
      session.step = 'event_type';
      
      await ctx.reply(getText(userId, 'eventType'));
      break;
      
    case 'flour_quantity':
      const quantity = parseFloat(text);
      if (isNaN(quantity) || quantity < 1) {
        await ctx.reply(getText(userId, 'invalidNumber'));
        return;
      }
      
      session.orderData.quantity = quantity;
      session.orderData.totalPrice = quantity * 70;
      session.step = 'delivery_location';
      
      await ctx.reply(getText(userId, 'deliveryLocation'));
      break;
      
      
    case 'event_type':
      session.orderData.eventType = text;
      session.step = 'event_date';
      await ctx.reply(getText(userId, 'eventDate'));
      break;
      
    case 'event_date':
      if (!isValidDate(text)) {
        await ctx.reply(getText(userId, 'invalidDate'));
        return;
      }
      session.orderData.eventDate = text;
      session.step = 'delivery_location';
      await ctx.reply(getText(userId, 'deliveryLocation'));
      break;
      
    case 'delivery_location':
      session.orderData.location = text;
      session.orderData.orderId = generateOrderId();
      session.step = 'confirm_order';
      
      // Create order summary
      let summary = `${getText(userId, 'orderSummary')}\n\n`;
      
      if (session.orderData.type === 'food') {
        summary += `🍲 ${getText(userId, 'foodOrder')}\n`;
        summary += `👥 People: ${session.orderData.people}\n`;
        summary += `🎉 Event: ${session.orderData.eventType}\n`;
        summary += `📅 Date: ${session.orderData.eventDate}\n`;
      } else {
        summary += `🌾 ${getText(userId, 'flourOrder')}\n`;
        summary += `📦 Type: ${session.orderData.flourType}\n`;
        summary += `⚖️ Quantity: ${session.orderData.quantity} kg\n`;
      }
      
      summary += `📍 Location: ${session.orderData.location}\n`;
      summary += `🆔 Order ID: ${session.orderData.orderId}\n`;
      summary += `💰 ${getText(userId, 'totalPrice')}: ${formatPrice(session.orderData.totalPrice)}`;
      
      await ctx.reply(summary,
        Markup.inlineKeyboard([
          [Markup.button.callback(getText(userId, 'confirmOrder'), 'confirm_order')],
          [Markup.button.callback(getText(userId, 'cancel'), 'cancel_order')]
        ])
      );
      break;
  }
});


// Order confirmation
bot.action('confirm_order', async (ctx) => {
  const userId = ctx.from.id;
  const session = userSessions.get(userId);
  
  await ctx.answerCbQuery();
  
  // Send admin notification first
  await notifyAdmin(ctx.from, session.orderData, session.language);
  
  // Show order completion message with contact information
  const completionMessage = `${getText(userId, 'orderComplete')}\n\n${getText(userId, 'orderInstructions')}\n\n📞 ${getText(userId, 'contactAdmin')}: @${ADMIN_ID}\n📱 ${getText(userId, 'adminPhone')}: ${ADMIN_PHONE}\n\n🆔 ${getText(userId, 'orderSummary')}: ${session.orderData.orderId}`;
  
  await ctx.editMessageText(completionMessage,
    Markup.inlineKeyboard([
      [Markup.button.url(getText(userId, 'contactAdmin'), `https://t.me/${ADMIN_USER_NAME}`)],
      [Markup.button.url(getText(userId, 'adminPhone'), `https://wa.me/${ADMIN_PHONE.replace('+', '')}`)]
    ])
  );
  
  // Clear session
  userSessions.delete(userId);
});

bot.action('cancel_order', async (ctx) => {
  const userId = ctx.from.id;
  userSessions.delete(userId);
  
  await ctx.answerCbQuery();
  await ctx.editMessageText(getText(userId, 'orderCancelled'));
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Sorry, an error occurred. Please try again.');
});

// Start the bot
console.log('Starting AddisBot...');

async function safeLaunch(retry = 0) {
  try {
    // Remove webhook (if any) and drop pending updates before polling
    await bot.telegram.deleteWebhook({ drop_pending_updates: true }).catch(() => {});
    await bot.launch({
      dropPendingUpdates: true,
      polling: { timeout: 50 }
    });
    console.log('Bot is running!');
    console.log('Orders will be sent to admin for manual processing');
  } catch (err) {
    const isConflict = err && err.response && err.response.error_code === 409;
    if (isConflict && retry < 3) {
      const delayMs = 1000 * (retry + 1);
      console.warn(`Another instance is polling (409). Retrying in ${delayMs}ms...`);
      try { bot.stop('RETRY'); } catch (_) {}
      setTimeout(() => safeLaunch(retry + 1), delayMs);
    } else {
      console.error('Failed to start bot:', err);
      console.error('Hint: Ensure no other process is running this bot token. Close other terminals or deployments.');
    }
  }
}

safeLaunch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
