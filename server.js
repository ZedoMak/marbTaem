require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store orders in memory (in production i'll use a database)
const orders = new Map();

// Verify Telegram WebApp data
function verifyTelegramWebAppData(initData, botToken) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    // Create secret key
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // Calculate hash
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    return calculatedHash === hash;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to submit orders
app.post('/api/orders', async (req, res) => {
    try {
        const { orderData, language, userData } = req.body;
        
        // Verify Telegram WebApp data if provided
        if (req.headers['x-telegram-init-data']) {
            const isValid = verifyTelegramWebAppData(req.headers['x-telegram-init-data'], process.env.BOT_TOKEN);
            if (!isValid) {
                return res.status(401).json({ success: false, error: 'Invalid Telegram data' });
            }
        }
        
        // Generate order ID if not provided
        if (!orderData.orderId) {
            orderData.orderId = generateOrderId();
        }
        
        // Add timestamp and user data
        orderData.timestamp = new Date().toISOString();
        orderData.userData = userData;
        orderData.language = language;
        
        // Store order
        orders.set(orderData.orderId, orderData);
        
        // In the near future i'll use a database so i'll save the order to the database and send notification to the admin
        // 1. Save to database
        // 2. Send notification to admin
        // 3. Send confirmation email/SMS
        
        console.log('New order received:', orderData);
        
        // Send notification to admin via bot
        await sendAdminNotification(orderData);
        
        res.json({
            success: true,
            orderId: orderData.orderId,
            adminUsername: process.env.ADMIN_ID,
            adminPhone: process.env.ADMIN_PHONE || '+251911234567'
        });
        
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// API endpoint to get orders (for admin)
app.get('/api/orders', (req, res) => {
    try {
        const ordersList = Array.from(orders.values()).reverse(); // Most recent first
        res.json({ success: true, orders: ordersList });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// API endpoint to get specific order
app.get('/api/orders/:orderId', (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = orders.get(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        res.json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Send admin notification
async function sendAdminNotification(orderData) {
    try {
        const { Telegraf } = require('telegraf');
        const bot = new Telegraf(process.env.BOT_TOKEN);
        
        const message = formatAdminMessage(orderData);
        
        await bot.telegram.sendMessage(process.env.ADMIN_ID, message, {
            parse_mode: 'HTML'
        });
        
        console.log('Admin notification sent for order:', orderData.orderId);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

// Format admin notification message
function formatAdminMessage(orderData) {
    const { type, people, quantity, flourType, eventType, eventDate, location, totalPrice, orderId, timestamp } = orderData;
    
    let message = `🔔 <b>New Order Received!</b>\n\n`;
    message += `🆔 <b>Order ID:</b> ${orderId}\n`;
    message += `📅 <b>Time:</b> ${new Date(timestamp).toLocaleString()}\n\n`;
    
    if (type === 'food') {
        message += `🍲 <b>Food Order</b>\n`;
        message += `👥 <b>People:</b> ${people}\n`;
        message += `🎉 <b>Event:</b> ${eventType}\n`;
        message += `📅 <b>Date:</b> ${new Date(eventDate).toLocaleDateString()}\n`;
    } else {
        message += `🌾 <b>Flour Order</b>\n`;
        message += `📦 <b>Type:</b> ${flourType}\n`;
        message += `⚖️ <b>Quantity:</b> ${quantity} kg\n`;
    }
    
    message += `📍 <b>Location:</b> ${location}\n`;
    message += `💰 <b>Total:</b> ${totalPrice} ETB\n\n`;
    
    if (orderData.userData) {
        message += `👤 <b>Customer:</b> ${orderData.userData.first_name} ${orderData.userData.last_name || ''}\n`;
        if (orderData.userData.username) {
            message += `🔗 <b>Username:</b> @${orderData.userData.username}\n`;
        }
        message += `🆔 <b>User ID:</b> ${orderData.userData.id}\n`;
    }
    
    return message;
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        ordersCount: orders.size
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AddisBot Mini App server running on port ${PORT}`);
    console.log(`📱 Mini App URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Orders stored in memory: ${orders.size}`);
});

module.exports = app;
