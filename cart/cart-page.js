
let cart = [];
const DELIVERY_FEE = 50;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    loadCart();
    displayCart();
    updateSummary();
});


function loadCart() {
    
    const savedCart = localStorage.getItem('cart');
    const savedCartItems = localStorage.getItem('cartItems');
    const savedFoodBuddyCart = localStorage.getItem('foodbuddyCart');
    
    console.log('Checking localStorage...');
    console.log('cart:', savedCart);
    console.log('cartItems:', savedCartItems);
    console.log('foodbuddyCart:', savedFoodBuddyCart);
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            console.log('Loaded cart:', cart);
        } catch (e) {
            console.error('Error parsing cart:', e);
            cart = [];
        }
    } else if (savedCartItems) {
        try {
            cart = JSON.parse(savedCartItems);
            console.log('Loaded from cartItems:', cart);
        } catch (e) {
            console.error('Error parsing cartItems:', e);
            cart = [];
        }
    } else if (savedFoodBuddyCart) {
        try {
            cart = JSON.parse(savedFoodBuddyCart);
            console.log('Loaded from foodbuddyCart:', cart);
        } catch (e) {
            console.error('Error parsing foodbuddyCart:', e);
            cart = [];
        }
    }
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
        console.warn('Cart is not an array, resetting');
        cart = [];
    }
    
    console.log('Final cart array:', cart);
    console.log('Cart length:', cart.length);
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved:', cart);
}


function displayCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (!cartItemsList) {
        console.error('cartItemsList element not found');
        return;
    }
    
    console.log('Displaying cart with', cart.length, 'items');
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some delicious food items to get started!</p>
                <button class="browse-menu-btn" onclick="window.location.href='../Home/Home-page.html'">Browse Menu</button>
            </div>
        `;
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        console.log('Displaying item:', item);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="item-image">
                <img src="${item.image || item.img || '../images/placeholder.jpg'}" alt="${item.name}" onerror="this.src='../images/placeholder.jpg'">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name || 'Unnamed Item'}</h3>
                <p class="item-description">${item.description || item.desc || ''}</p>
                <p class="item-price">₱${(item.price || 0).toFixed(2)}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                </div>
                <p class="item-total">₱${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeItem(${index})">🗑️ Remove</button>
            </div>
        `;
        cartItemsList.appendChild(itemDiv);
    });
}


function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        saveCart();
        displayCart();
        updateSummary();
    }
}


function decreaseQuantity(index) {
    if (cart[index]) {
        const currentQty = cart[index].quantity || 1;
        
        if (currentQty > 1) {
            cart[index].quantity = currentQty - 1;
            saveCart();
            displayCart();
            updateSummary();
        } else {
            
            if (confirm('Remove this item from cart?')) {
                removeItem(index);
            }
        }
    }
}


function removeItem(index) {
    if (confirm('Are you sure you want to remove this item?')) {
        cart.splice(index, 1);
        saveCart();
        displayCart();
        updateSummary();
        showNotification('Item removed from cart');
    }
}


function updateSummary() {
    const subtotal = calculateSubtotal();
    const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);
    
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}


function calculateSubtotal() {
    return cart.reduce((sum, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
    }, 0);
}


function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout-page.html';
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


window.debugCart = function() {
    console.log('=== CART DEBUG INFO ===');
    console.log('Current cart array:', cart);
    console.log('Cart length:', cart.length);
    console.log('localStorage.cart:', localStorage.getItem('cart'));
    console.log('All localStorage:', localStorage);
    console.log('=====================');
};


const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Cart page script loaded successfully');