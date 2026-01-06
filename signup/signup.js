// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  const existingError = document.querySelector(".error-message");
  if (existingError) existingError.remove();

  if (
    !validateForm(
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      terms
    )
  )
    return;

  const user = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    phone,
    password, 
    createdAt: new Date().toISOString(),
  };

  saveUser(user);

  
  showSuccessMessage("Account created successfully!");


  setTimeout(() => {
    window.location.href = "../Home/Home-page.html";
  }, 1500);
}

function validateForm(
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  terms
) {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    showError("Please fill in all required fields");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("Please enter a valid email address");
    return false;
  }

  const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    showError("Please enter a valid Philippine phone number");
    return false;
  }

  if (password.length < 8) {
    showError("Password must be at least 8 characters long");
    return false;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return false;
  }

  if (!terms) {
    showError("Please accept the Terms & Conditions");
    return false;
  }

  if (emailExists(email)) {
    showError("An account with this email already exists");
    return false;
  }

  return true;
}

function emailExists(email) {
  const users = getUsers();
  return users.some((user) => user.email.toLowerCase() === email.toLowerCase());
}

function getUsers() {
  const usersData = localStorage.getItem("users");
  if (usersData) {
    try {
      return JSON.parse(usersData);
    } catch (e) {
      console.error("Error parsing users data:", e);
      return [];
    }
  }
  return [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  console.log("User saved:", user);
}

function showError(message) {
  const form = document.getElementById("signupForm");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message show";
  errorDiv.textContent = message;

  form.insertBefore(errorDiv, form.firstChild);

  setTimeout(() => {
    errorDiv.classList.remove("show");
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}

function showSuccessMessage(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

const style = document.createElement("style");
style.textContent = `
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

document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.startsWith("0")) {
        value = "63" + value.substring(1);
      }

      if (value.startsWith("63") && value.length > 2) {
        value =
          "+63 " +
          value.substring(2, 5) +
          (value.length > 5 ? " " + value.substring(5, 8) : "") +
          (value.length > 8 ? " " + value.substring(8, 12) : "");
      }

      e.target.value = value;
    });
  }
});

console.log("Signup script loaded successfully");
