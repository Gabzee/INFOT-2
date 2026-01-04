// Get cart from localStorage
function getCart() {
  const cartData = localStorage.getItem("foodBuddyCart");
  return cartData ? JSON.parse(cartData) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("foodBuddyCart", JSON.stringify(cart));
}

// Render cart items
function renderCart() {
  const cart = getCart();
  const cartItemsList = document.getElementById("cartItemsList");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious Filipino dishes to get started!</p>
      </div>
    `;
  } else {
    cartItemsList.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
                : `<div class="item-image">Image</div>`
            }
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-description">${item.description}</div>
              <div class="item-price">₱${item.price}.00 each</div>
            </div>
            <div class="item-controls">
              <div class="quantity-control">
                <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                <span class="item-qty">${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQty(${index})">+</button>
              </div>
              <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
          </div>
        `
      )
      .join("");
  }

  // Checkout button is ALWAYS enabled
  checkoutBtn.disabled = false;

  updateSummary();
  addClearCartButton();
}

// Update order summary
function updateSummary() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  document.getElementById("subtotal").textContent = `₱${subtotal.toFixed(2)}`;
  document.getElementById("deliveryFee").textContent = `₱${deliveryFee.toFixed(
    2
  )}`;
  document.getElementById("total").textContent = `₱${total.toFixed(2)}`;
}

// Increase quantity
function increaseQty(index) {
  const cart = getCart();
  cart[index].quantity++;
  saveCart(cart);
  renderCart();
}

// Decrease quantity
function decreaseQty(index) {
  const cart = getCart();
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    saveCart(cart);
    renderCart();
  }
}

// Remove item
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Clear entire cart
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("foodBuddyCart");
    renderCart();
  }
}

// Add "Clear Cart" button dynamically
function addClearCartButton() {
  const cartItemsContainer = document.getElementById("cartItemsList");
  if (
    !document.getElementById("clearCartBtn") &&
    cartItemsContainer &&
    getCart().length > 0
  ) {
    const clearBtn = document.createElement("button");
    clearBtn.id = "clearCartBtn";
    clearBtn.textContent = "Clear Cart";
    clearBtn.className = "continue-shopping";
    clearBtn.style.marginTop = "15px";
    clearBtn.onclick = clearCart;
    cartItemsContainer.appendChild(clearBtn);
  }
}

// Go to checkout
function goToCheckout() {
  window.location.href = "checkout-page.html";
}
renderCart();

function addToCart(name, description, price, image) {
  const cart = getCart();

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      description: description,
      price: price,
      quantity: 1,
      image: image
    });
  }

  saveCart(cart);
  renderCart();
}
// function goToCheckout() {
//   const cart = getCart();
//   if (cart.length === 0) {
//     alert("Your cart is empty!");
//     return;
//   }
//   window.location.href = "checkout.html";
// }