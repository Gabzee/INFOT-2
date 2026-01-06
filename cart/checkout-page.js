// Global variables
let cart = [];
let selectedPaymentMethod = null;
const DELIVERY_FEE = 50;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayOrderSummary();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Redirect to cart if empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'cart-page.html';
    }
}

// Display order summary
function displayOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    let subtotal = 0;
    
    if (!summaryItems) return;
    
    summaryItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
            <span class="item-price">₱${itemTotal.toFixed(2)}</span>
        `;
        summaryItems.appendChild(itemDiv);
    });
    
    const total = subtotal + DELIVERY_FEE;
    
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
}

// Select payment method
function selectPayment(method, event) {
    // Remove selected class from all payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
    selectedPaymentMethod = method;
    
    console.log('Payment method selected:', method);
}

// Validate form
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!firstName || !lastName) {
        alert('Please enter your full name');
        return false;
    }
    
    if (!phone) {
        alert('Please enter your phone number');
        return false;
    }
    
    if (!email) {
        alert('Please enter your email address');
        return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!address) {
        alert('Please enter your delivery address');
        return false;
    }
    
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return false;
    }
    
    return true;
}

// Generate random order number
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `FB${timestamp}${random}`.substring(0, 15);
}

// Place order
function placeOrder() {
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const orderData = {
        orderNumber: generateOrderNumber(),
        customer: {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            notes: document.getElementById('notes').value.trim()
        },
        items: cart,
        paymentMethod: selectedPaymentMethod,
        subtotal: calculateSubtotal(),
        deliveryFee: DELIVERY_FEE,
        total: calculateSubtotal() + DELIVERY_FEE,
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage
    saveOrder(orderData);
    
    // Show success modal
    showSuccessModal(orderData.orderNumber);
    
    // Clear cart
    localStorage.removeItem('cart');
    cart = [];
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Save order to localStorage
function saveOrder(orderData) {
    let orders = localStorage.getItem('orders');
    orders = orders ? JSON.parse(orders) : [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Show success modal
function showSuccessModal(orderNumber) {
    const modal = document.getElementById('successModal');
    const orderNumberSpan = document.getElementById('orderNumber');
    
    if (modal && orderNumberSpan) {
        orderNumberSpan.textContent = orderNumber;
        modal.style.display = 'flex';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        window.location.href = '../Home/Home-page.html';
    }
});