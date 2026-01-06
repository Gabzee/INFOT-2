// // =========================
// Home-page.js
// =========================

// -------------------------
// Logout function
// -------------------------
function logoutUser() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("cartCount");
    localStorage.removeItem("cart");
    window.location.href = "../index.html";
  }
}

// -------------------------
// Navigation functions
// -------------------------
function goToGroup() {
  window.location.href = "../group-member/group.html";
}

function goToCart() {
  window.location.href = "../cart/cart-page.html";
}

// -------------------------
// Cart functions
// -------------------------
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

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartCount", totalItems);

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.textContent = `🛒 Cart (${totalItems})`;
  }
}

// -------------------------
// Add to cart function
// -------------------------
function addToCart(productCard) {
  const name = productCard.querySelector(".product-name")?.textContent.trim();
  const description = productCard.querySelector(".product-description")?.textContent.trim();
  const priceText = productCard.querySelector(".product-price")?.textContent.trim();
  const image = productCard.querySelector(".product-image")?.src;

  // Parse price
  let price = 0;
  if (priceText) {
    price = parseFloat(priceText.replace("₱", "").replace(",", "").replace(/\s/g, ""));
  }

  let cart = getCart();

  // Check if product exists
  const existingIndex = cart.findIndex((item) => item.name === name);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: name || "Unknown Item",
      description: description || "",
      price: price,
      image: image || "",
      quantity: 1
    });
  }

  saveCart(cart);
  showNotification(`${name} added to cart!`);
  console.log("Cart updated:", cart);
}

// -------------------------
// Notification function
// -------------------------
function showNotification(message) {
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) existingNotification.remove();

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

// -------------------------
// Add CSS animations
// -------------------------
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==========================
// DOMContentLoaded initialization
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Home page script loaded");

  const productCards = document.querySelectorAll(".product-card");
  const categoryCards = document.querySelectorAll(".category-card");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  const searchInput = document.getElementById("search-input");

  // -------------------------
  // Initialize cart count
  // -------------------------
  updateCartCount();

  // -------------------------
  // Add to cart button events
  // -------------------------
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // prevent card click
      const productCard = this.closest(".product-card");
      if (productCard) {
        addToCart(productCard);

        // Button click animation
        this.style.transform = "scale(1.2)";
        setTimeout(() => { this.style.transform = "scale(1)"; }, 200);
      }
    });
  });

  // -------------------------
  // Product card click
  // -------------------------
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.classList.contains("add-to-cart")) return; // skip add-to-cart
      const productName = this.querySelector(".product-name").textContent;
      alert(`Viewing details for: ${productName}`);
    });
  });

  // -------------------------
  // Category filter
  // -------------------------
  let selectedCategory = "all";
  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      selectedCategory = this.dataset.category;

      // Highlight active category
      categoryCards.forEach(c => c.classList.remove("active"));
      this.classList.add("active");

      filterProducts();
    });
  });

  // -------------------------
  // Search filter
  // -------------------------
  searchInput.addEventListener("input", function () {
    filterProducts();
  });

  // -------------------------
  // Combined filter function
  // -------------------------
  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();

    productCards.forEach((product) => {
      const name = product.querySelector(".product-name").textContent.toLowerCase();
      const description = product.querySelector(".product-description").textContent.toLowerCase();
      const category = product.dataset.category || "all";

      const matchesCategory = selectedCategory === "all" || category === selectedCategory;
      const matchesSearch = name.includes(query) || description.includes(query);

      product.style.display = (matchesCategory && matchesSearch) ? "block" : "none";
    });
  }

  // Initialize products on load
  filterProducts();
});