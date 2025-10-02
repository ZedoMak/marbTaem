// Telegram WebApp API
// Next button fixes deployed
const tg = window.Telegram.WebApp;

// App state
let currentLanguage = 'en';
let orderData = {};
let currentStep = '';
let currentOrderType = '';

// Translations
const translations = {
    en: {
        'welcome.title': 'Welcome to MARB TAEM!',
        'welcome.subtitle': 'Choose what you\'d like to order',
        'food.title': 'Order Food',
        'food.description': 'Delicious Ethiopian cuisine for events',
        'food.price': '150 ETB per person',
        'flour.title': 'Order Flour',
        'flour.description': 'Fresh flours',
        'flour.price': '200 ETB per kg',
        'food.people.title': 'How many people will be served?',
        'food.price.preview': 'Total: ',
        'food.event.title': 'What type of event is this for?',
        'food.event.birthday': 'Birthday Party',
        'food.event.wedding': 'Wedding',
        'food.event.business': 'Business Meeting',
        'food.event.family': 'Family Gathering',
        'food.event.other': 'Other',
        'food.date.title': 'When is the event?',
        'food.date.help': 'Please select the event date',
        'location.title': 'Delivery Location',
        'location.help': 'Please provide detailed address for delivery',
        'flour.type.title': 'What type of flour would you like?',
        'flour.type.white': 'White Flour',
        'flour.type.white.desc': 'Premium white flour for baking',
        'flour.type.whole': 'Whole Grain Flour',
        'flour.type.whole.desc': 'Nutritious whole grain flour',
        'flour.type.barley': 'Barley Flour',
        'flour.type.barley.desc': 'Traditional barley flour',
        'flour.quantity.title': 'How many kilograms do you need?',
        'flour.price.preview': 'Total: ',
        'summary.title': 'Order Summary',
        'summary.subtotal': 'Subtotal',
        'summary.total': 'Total',
        'summary.orderid': 'Order ID: ',
        'success.title': 'Order Received!',
        'success.message': 'Your order has been submitted successfully',
        'success.contact.title': 'Contact us to complete your order:',
        'success.contact.telegram': 'Message Admin',
        'success.contact.phone': 'Call Admin',
        'success.orderid': 'Order ID: ',
        'success.neworder': 'Place New Order',
        'common.next': 'Next',
        'common.back': 'Back',
        'common.cancel': 'Cancel',
        'common.confirm': 'Confirm Order'
    },
    am: {
        'welcome.title': 'እንኳን ደህና መጡ AddisBot!',
        'welcome.subtitle': 'ምን መምዘዝ ይፈልጋሉ?',
        'food.title': 'ምግብ አዘዝ',
        'food.description': 'ለዝግጅቶች ጣፋጭ የኢትዮጵያ ምግብ',
        'food.price': '150 ETB በአንድ ሰው',
        'flour.title': 'ዱቄት አዘዝ',
        'flour.description': 'ለመጠቅለል ትኩስ ዱቄት',
        'flour.price': '70 ETB በአንድ ኪሎ',
        'food.people.title': 'ለስንት ሰዎች ይዘጋጃል?',
        'food.price.preview': 'አጠቃላይ: ',
        'food.event.title': 'ይህ ምን ዓይነት ዝግጅት ነው?',
        'food.event.birthday': 'የልደት ዝግጅት',
        'food.event.wedding': 'ጋብቻ',
        'food.event.business': 'የንግድ ስብሰባ',
        'food.event.family': 'የቤተሰብ ስብሰባ',
        'food.event.other': 'ሌላ',
        'food.date.title': 'ዝግጅቱ መቼ ነው?',
        'food.date.help': 'እባክዎ የዝግጅቱን ቀን ይምረጡ',
        'location.title': 'የማድረሻ ቦታ',
        'location.help': 'እባክዎ ለማድረሻ ዝርዝር አድራሻ ይስጡ',
        'flour.type.title': 'ምን ዓይነት ዱቄት ይፈልጋሉ?',
        'flour.type.white': 'ነጭ ዱቄት',
        'flour.type.white.desc': 'ለመጠቅለል ተስፋ የሚሰጥ ነጭ ዱቄት',
        'flour.type.whole': 'ሙሉ እህል ዱቄት',
        'flour.type.whole.desc': 'ጤናማ ሙሉ እህል ዱቄት',
        'flour.type.barley': 'ስንዴ ዱቄት',
        'flour.type.barley.desc': 'ባህላዊ ስንዴ ዱቄት',
        'flour.quantity.title': 'ስንት ኪሎ ግራም ያስፈልግዎታል?',
        'flour.price.preview': 'አጠቃላይ: ',
        'summary.title': 'የትዕዛዝ ማጠቃለያ',
        'summary.subtotal': 'ንዑስ ድምር',
        'summary.total': 'አጠቃላይ',
        'summary.orderid': 'የትዕዛዝ መለያ: ',
        'success.title': 'ትዕዛዝ ተቀብለናል!',
        'success.message': 'ትዕዛዝዎ በተሳካ ሁኔታ ቀርቧል',
        'success.contact.title': 'ትዕዛዝዎን ለማጠናቀቅ እንገናኝ:',
        'success.contact.telegram': 'አስተዳዳሪ ይጻፉ',
        'success.contact.phone': 'አስተዳዳሪ ይደውሉ',
        'success.orderid': 'የትዕዛዝ መለያ: ',
        'success.neworder': 'አዲስ ትዕዛዝ ያስገቡ',
        'common.next': 'ቀጥል',
        'common.back': 'ተመለስ',
        'common.cancel': 'ይሰርዝ',
        'common.confirm': 'ትዕዛዝ አረጋግጥ'
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram WebApp
    tg.ready();
    tg.expand();
    
    // Set theme colors
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f8f9fa');
    
    // Hide loading screen and show app
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }, 500);
    }, 1500);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('event-date').setAttribute('min', today);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Apply translations
    applyTranslations();
});

// Initialize event listeners
function initializeEventListeners() {
    // Language switcher
    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-am').addEventListener('click', () => switchLanguage('am'));
    
    // Order type selection
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const orderType = e.currentTarget.getAttribute('data-order');
            startOrder(orderType);
        });
    });
    
    // Food order listeners
    const peopleCountInput = document.getElementById('people-count');
    peopleCountInput.addEventListener('input', updateFoodPrice);
    
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const value = e.currentTarget.getAttribute('data-people') || e.currentTarget.getAttribute('data-quantity');
            if (value) {
                if (currentOrderType === 'food') {
                    peopleCountInput.value = value;
                    updateFoodPrice();
                } else {
                    document.getElementById('flour-quantity').value = value;
                    updateFlourPrice();
                }
            }
        });
    });
    
    // Event type selection
    document.querySelectorAll('.event-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.event-option').forEach(opt => opt.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            
            const eventType = e.currentTarget.getAttribute('data-event');
            if (eventType === 'Other') {
                document.querySelector('.custom-event').style.display = 'block';
                document.getElementById('custom-event').focus();
            } else {
                document.querySelector('.custom-event').style.display = 'none';
                orderData.eventType = eventType;
            }
            
            updateNextButton();
        });
    });
    
    // Custom event input
    document.getElementById('custom-event').addEventListener('input', (e) => {
        orderData.eventType = e.target.value;
        updateNextButton();
    });
    
    // Flour type selection
    document.querySelectorAll('.flour-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.flour-option').forEach(opt => opt.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            orderData.flourType = e.currentTarget.getAttribute('data-type');
            updateNextButton();
        });
    });
    
    // Flour quantity input
    document.getElementById('flour-quantity').addEventListener('input', updateFlourPrice);
    
    // Date input
    document.getElementById('event-date').addEventListener('change', (e) => {
        orderData.eventDate = e.target.value;
        updateNextButton();
    });
    
    // Location inputs
    document.getElementById('delivery-location').addEventListener('input', (e) => {
        orderData.location = e.target.value;
        updateNextButton();
    });
    
    document.getElementById('flour-delivery-location').addEventListener('input', (e) => {
        orderData.location = e.target.value;
        updateNextButton();
    });
    
    // Next button listeners
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!btn.disabled) {
                nextStep();
            } else {
                // Provide feedback when disabled
                const container = btn.closest('.step-content');
                if (container) {
                    container.classList.remove('shake');
                    // force reflow to restart animation
                    void container.offsetWidth;
                    container.classList.add('shake');
                }
                if (window.Telegram && window.Telegram.WebApp && tg.HapticFeedback) {
                    try { tg.HapticFeedback.notificationOccurred('error'); } catch (_) {}
                }
            }
        });
    });
    
    // Back button listeners
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if this is a screen header back button
            if (btn.closest('.screen-header')) {
                showScreen('welcome-screen');
            } else {
                prevStep();
            }
        });
    });
}

// Switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Apply translations
    applyTranslations();
}

// Apply translations
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Start order process
function startOrder(orderType) {
    currentOrderType = orderType;
    orderData = { type: orderType };
    
    if (orderType === 'food') {
        showScreen('food-screen');
        currentStep = 'people';
        updateProgress();
    } else {
        showScreen('flour-screen');
        currentStep = 'flour-type';
        updateProgress();
    }
}

// Show specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Reset form steps if needed
    if (screenId === 'welcome-screen') {
        resetOrder();
    } else {
        // Update next button state for form screens
        updateNextButton();
    }
}

// Next step
function nextStep() {
    if (currentOrderType === 'food') {
        const steps = ['people', 'event-type', 'event-date', 'location'];
        const currentIndex = steps.indexOf(currentStep);
        
        if (currentIndex < steps.length - 1) {
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            currentStep = steps[currentIndex + 1];
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            updateNextButton();
            updateProgress();
        } else if (currentIndex === steps.length - 1) {
            // Last step - show order summary
            showOrderSummary();
        }
    } else {
        const steps = ['flour-type', 'quantity', 'flour-location'];
        const currentIndex = steps.indexOf(currentStep);
        
        if (currentIndex < steps.length - 1) {
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            currentStep = steps[currentIndex + 1];
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            updateNextButton();
            updateProgress();
        } else if (currentIndex === steps.length - 1) {
            // Last step - show order summary
            showOrderSummary();
        }
    }
}

// Previous step
function prevStep() {
    if (currentOrderType === 'food') {
        const steps = ['people', 'event-type', 'event-date', 'location'];
        const currentIndex = steps.indexOf(currentStep);
        
        if (currentIndex > 0) {
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            currentStep = steps[currentIndex - 1];
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            updateNextButton();
            updateProgress();
        } else {
            // Go back to welcome screen
            showScreen('welcome-screen');
        }
    } else {
        const steps = ['flour-type', 'quantity', 'flour-location'];
        const currentIndex = steps.indexOf(currentStep);
        
        if (currentIndex > 0) {
            document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
            currentStep = steps[currentIndex - 1];
            document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
            updateNextButton();
            updateProgress();
        } else {
            // Go back to welcome screen
            showScreen('welcome-screen');
        }
    }
}

// Update food price
function updateFoodPrice() {
    const peopleCount = parseInt(document.getElementById('people-count').value) || 0;
    const price = peopleCount * 150;
    
    document.getElementById('food-price-preview').textContent = `${price} ETB`;
    
    if (peopleCount > 0) {
        orderData.people = peopleCount;
        orderData.totalPrice = price;
        updateNextButton();
    }
}

// Update flour price
function updateFlourPrice() {
    const quantity = parseFloat(document.getElementById('flour-quantity').value) || 0;
    const price = quantity * 70;
    
    document.getElementById('flour-price-preview').textContent = `${price} ETB`;
    
    if (quantity > 0) {
        orderData.quantity = quantity;
        orderData.totalPrice = price;
        updateNextButton();
    }
}

// Update next button state
function updateNextButton() {
    // Resolve the current step element explicitly by data-step
    const stepElement = currentStep
        ? document.querySelector(`.form-step[data-step="${currentStep}"]`)
        : document.querySelector('.form-step.active');
    const nextBtn = stepElement ? stepElement.querySelector('.next-btn') : document.querySelector('.next-btn');
    if (!nextBtn) return;
    
    let canProceed = false;
    
    if (currentOrderType === 'food') {
        switch (currentStep) {
            case 'people':
                canProceed = orderData.people > 0;
                break;
            case 'event-type':
                canProceed = !!(orderData.eventType && orderData.eventType.length > 0);
                break;
            case 'event-date':
                canProceed = !!(orderData.eventDate && orderData.eventDate.length > 0);
                break;
            case 'location':
                canProceed = !!(orderData.location && orderData.location.length > 0);
                break;
        }
    } else {
        switch (currentStep) {
            case 'flour-type':
                canProceed = !!(orderData.flourType && orderData.flourType.length > 0);
                break;
            case 'quantity':
                canProceed = orderData.quantity > 0;
                break;
            case 'flour-location':
                canProceed = !!(orderData.location && orderData.location.length > 0);
                break;
        }
    }
    
    nextBtn.disabled = !canProceed;
    
    // Update button appearance for the active step only
    if (canProceed) {
        nextBtn.classList.remove('disabled');
    } else {
        nextBtn.classList.add('disabled');
    }
}

// Update progress dots
function updateProgress() {
    const foodProgress = document.getElementById('food-progress');
    const flourProgress = document.getElementById('flour-progress');
    const isFood = currentOrderType === 'food';
    const steps = isFood ? ['people', 'event-type', 'event-date', 'location'] : ['flour-type', 'quantity', 'flour-location'];
    const container = isFood ? foodProgress : flourProgress;
    if (!container) return;
    const index = steps.indexOf(currentStep);
    container.querySelectorAll('.step-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.classList.toggle('completed', i < index);
    });
}

// Show order summary
function showOrderSummary() {
    // Generate order ID
    orderData.orderId = generateOrderId();
    
    // Update summary content
    const summaryIcon = document.getElementById('summary-icon');
    const summaryTitle = document.getElementById('summary-title');
    const summaryDetails = document.getElementById('summary-details');
    const summaryLocation = document.getElementById('summary-location');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const summaryOrderId = document.getElementById('summary-order-id');
    
    if (orderData.type === 'food') {
        summaryIcon.className = 'fas fa-hamburger';
        summaryTitle.textContent = currentLanguage === 'en' ? 'Food Order' : 'የምግብ ትዕዛዝ';
        summaryDetails.innerHTML = `
            <div>👥 ${currentLanguage === 'en' ? 'People' : 'ሰዎች'}: ${orderData.people}</div>
            <div>🎉 ${currentLanguage === 'en' ? 'Event' : 'ዝግጅት'}: ${orderData.eventType}</div>
            <div>📅 ${currentLanguage === 'en' ? 'Date' : 'ቀን'}: ${formatDate(orderData.eventDate)}</div>
        `;
    } else {
        summaryIcon.className = 'fas fa-seedling';
        summaryTitle.textContent = currentLanguage === 'en' ? 'Flour Order' : 'የዱቄት ትዕዛዝ';
        summaryDetails.innerHTML = `
            <div>📦 ${currentLanguage === 'en' ? 'Type' : 'ዓይነት'}: ${orderData.flourType}</div>
            <div>⚖️ ${currentLanguage === 'en' ? 'Quantity' : 'ብዛት'}: ${orderData.quantity} kg</div>
        `;
    }
    
    summaryLocation.textContent = orderData.location;
    summarySubtotal.textContent = `${orderData.totalPrice} ETB`;
    summaryTotal.textContent = `${orderData.totalPrice} ETB`;
    summaryOrderId.textContent = orderData.orderId;
    
    showScreen('summary-screen');
}

// Submit order
function submitOrder() {
    // Send data to backend
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...orderData,
            language: currentLanguage,
            userData: tg.initDataUnsafe.user
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update success screen
            document.getElementById('success-order-id').textContent = orderData.orderId;
            
            // Set contact links
            const telegramContact = document.getElementById('telegram-contact');
            const phoneContact = document.getElementById('phone-contact');
            
            telegramContact.href = `https://t.me/${data.adminUsername}`;
            phoneContact.href = `tel:${data.adminPhone}`;
            
            showScreen('success-screen');
            
            // Send data to Telegram
            tg.sendData(JSON.stringify({
                type: 'order_submitted',
                orderData: orderData
            }));
        } else {
            alert('Error submitting order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting order. Please try again.');
    });
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'am-ET');
}

// Go back to order
function goBackToOrder() {
    if (currentOrderType === 'food') {
        showScreen('food-screen');
    } else {
        showScreen('flour-screen');
    }
}

// Reset order
function resetOrder() {
    orderData = {};
    currentStep = '';
    currentOrderType = '';
    
    // Reset form inputs
    document.getElementById('people-count').value = '';
    document.getElementById('flour-quantity').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('delivery-location').value = '';
    document.getElementById('flour-delivery-location').value = '';
    document.getElementById('custom-event').value = '';
    
    // Reset selections
    document.querySelectorAll('.event-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.flour-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));
    
    // Hide custom event input
    document.querySelector('.custom-event').style.display = 'none';
    
    // Reset form steps
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    if (document.querySelector('.form-step')) {
        document.querySelector('.form-step').classList.add('active');
    }
    
    // Reset prices
    document.getElementById('food-price-preview').textContent = '0 ETB';
    document.getElementById('flour-price-preview').textContent = '0 ETB';
}

// Close app
function closeApp() {
    tg.close();
}

// Main button click handler
tg.MainButton.text = "Close App";
tg.MainButton.show();
tg.MainButton.onClick(closeApp);

// Back button handler
tg.BackButton.onClick(() => {
    if (document.getElementById('summary-screen').classList.contains('active')) {
        goBackToOrder();
    } else if (document.getElementById('success-screen').classList.contains('active')) {
        showScreen('welcome-screen');
    } else {
        showScreen('welcome-screen');
    }
});

// Show back button when not on welcome screen
function updateBackButton() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'welcome-screen') {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
}

// Update back button visibility when screens change
const originalShowScreen = showScreen;
showScreen = function(screenId) {
    originalShowScreen(screenId);
    updateBackButton();
};
