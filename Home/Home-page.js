function logoutUser() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("cartCount"); // or clear all
    localStorage.removeItem("cart");
    window.location.href = "../login/Login.html";
  }
}
function goToGroup() {
  window.location.href = "../group-member/group.html";
}
// Function to navigate to cart page
function goToCart() {
  window.location.href = "../cart-page.html";
}

// Initialize cart count from localStorage
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
const cartBtn = document.querySelector(".cart-btn");
cartBtn.textContent = `🛒 Cart (${cartCount})`;

// Add to cart functionality
const addToCartBtns = document.querySelectorAll(".add-to-cart");

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    cartCount++;
    localStorage.setItem("cartCount", cartCount); // save count
    cartBtn.textContent = `🛒 Cart (${cartCount})`;

    // Animation
    this.style.transform = "scale(1.2)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);
  });
});

// Product card click
const productCards = document.querySelectorAll(".product-card");
productCards.forEach((card) => {
  card.addEventListener("click", function () {
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
