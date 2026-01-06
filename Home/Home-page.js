// // Logout function
function logoutUser() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("cartCount");
    localStorage.removeItem("cart");
    window.location.href = "../index.html";
  }
}
// CATEGORY FILTER SYSTEM
const categoryCards = document.querySelectorAll(".category-card");
const productCards = document.querySelectorAll(".product-card");

categoryCards.forEach((card) => {
  card.addEventListener("click", function () {
    const selectedCategory = this.dataset.category;

    // Active highlight
    categoryCards.forEach((c) => c.classList.remove("active"));
    this.classList.add("active");

    productCards.forEach((product) => {
      const productCategory = product.dataset.category;

      if (selectedCategory === "all" || productCategory === selectedCategory) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});

// Navigate to group page
function goToGroup() {
  window.location.href = "../group-member/group.html";
}

// Navigate to cart page
function goToCart() {
  window.location.href = "../cart/cart-page.html";
}

// Function to get cart from localStorage
function getCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error("Error parsing cart:", e);
      return [];
    }
  }
  return [];
}

// Function to save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Function to update cart count
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartCount", totalItems);

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.textContent = `🛒 Cart (${totalItems})`;
  }
}

// Function to add item to cart
function addToCart(productCard) {
  // Extract product information
  const name = productCard.querySelector(".product-name")?.textContent.trim();
  const description = productCard
    .querySelector(".product-description")
    ?.textContent.trim();
  const priceText = productCard
    .querySelector(".product-price")
    ?.textContent.trim();
  const image = productCard.querySelector(".product-image")?.src;

  // Parse price
  let price = 0;
  if (priceText) {
    price = parseFloat(
      priceText.replace("₱", "").replace(",", "").replace(/\s/g, "")
    );
  }

  // Get current cart
  let cart = getCart();

  // Check if item already exists
  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex > -1) {
    // Item exists, increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // New item, add to cart
    cart.push({
      id: Date.now(),
      name: name || "Unknown Item",
      price: price,
      image: image || "",
      description: description || "",
      quantity: 1,
    });
  }

  // Save cart
  saveCart(cart);

  // Show notification
  showNotification(`${name} added to cart!`);

  console.log("Cart updated:", cart);
}

// Function to show notification
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00ff00;
    color: #000;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,255,0,0.3);
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Add CSS for animations
const style = document.createElement("style");
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing cart system...");

  // Update cart count on page load
  updateCartCount();

  // Add to cart functionality
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  console.log("Found", addToCartBtns.length, "add-to-cart buttons");

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent card click event

      // Find parent product card
      const productCard = this.closest(".product-card");

      if (productCard) {
        // Add to cart
        addToCart(productCard);

        // Button animation
        this.style.transform = "scale(1.2)";
        setTimeout(() => {
          this.style.transform = "scale(1)";
        }, 200);
      } else {
        console.error("Product card not found");
      }
    });
  });

  // Product card click (view details)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking the add-to-cart button
      if (e.target.classList.contains("add-to-cart")) {
        return;
      }

      const productName = this.querySelector(".product-name").textContent;
      alert(`Viewing details for: ${productName}`);
    });
  });

  // Category click
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.textContent.trim();
      alert(`Browsing ${category}`);
    });
  });
});

console.log("Home page script loaded successfully");
