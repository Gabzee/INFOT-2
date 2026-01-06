// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Remove existing error message if any
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation
    if (!validateForm(firstName, lastName, email, phone, password, confirmPassword, terms)) {
        return;
    }
    
    // Create user object
    const user = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    // Save user to localStorage
    saveUser(user);
    
    // Show success message
    showSuccessMessage('Account created successfully!');
    
    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Validate form fields
function validateForm(firstName, lastName, email, phone, password, confirmPassword, terms) {
    // Check if all fields are filled
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showError('Please fill in all required fields');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Validate phone format (Philippine format)
    const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showError('Please enter a valid Philippine phone number');
        return false;
    }
    
    // Check password length
    if (password.length < 8) {
        showError('Password must be at least 8 characters long');
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }
    
    // Check if terms are accepted
    if (!terms) {
        showError('Please accept the Terms & Conditions');
        return false;
    }
    
    // Check if email already exists
    if (emailExists(email)) {
        showError('An account with this email already exists');
        return false;
    }
    
    return true;
}

// Check if email already exists
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Get all users from localStorage
function getUsers() {
    const usersData = localStorage.getItem('users');
    if (usersData) {
        try {
            return JSON.parse(usersData);
        } catch (e) {
            console.error('Error parsing users data:', e);
            return [];
        }
    }
    return [];
}

// Save user to localStorage
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User saved:', user);
}

// Show error message
function showError(message) {
    const form = document.getElementById('signupForm');
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    // Insert at the top of the form
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove after 2 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 2000);
}

// Add CSS for slide out animation
const style = document.createElement('style');
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

// Auto-format phone number input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Add +63 if starting with 0
            if (value.startsWith('0')) {
                value = '63' + value.substring(1);
            }
            
            // Format: +63 XXX XXX XXXX
            if (value.startsWith('63') && value.length > 2) {
                value = '+63 ' + value.substring(2, 5) + 
                        (value.length > 5 ? ' ' + value.substring(5, 8) : '') +
                        (value.length > 8 ? ' ' + value.substring(8, 12) : '');
            }
            
            e.target.value = value;
        });
    }
});

console.log('Signup script loaded successfully');