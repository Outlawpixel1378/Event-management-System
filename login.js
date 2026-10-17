// Sample user and admin credentials (in a real app, these would be in a secure database)
let users = JSON.parse(localStorage.getItem('users')) || [
    { email: 'user@example.com', password: 'user123', name: 'Demo User', phone: '1234567890' }
];

const admins = [
    { email: 'admin@example.com', password: 'admin123' }
];

// Check if user is already logged in
function checkAuth() {
    const userAuth = localStorage.getItem('userAuth');
    const adminAuth = localStorage.getItem('adminAuth');
    
    if (userAuth) {
        window.location.href = 'index.html';
    } else if (adminAuth) {
        window.location.href = 'index.html?admin=true';
    }
}

// Show/hide forms
function showForm(formId) {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
}

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Tab switching
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active form
            const forms = document.querySelectorAll('.login-form');
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}LoginForm`).classList.add('active');
        });
    });

    // Show registration form
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showForm('userRegisterForm');
    });

    // Show login form
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showForm('userLoginForm');
    });

    // User registration
    document.getElementById('userRegisterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const phone = document.getElementById('regPhone').value;
        const errorElement = document.getElementById('registerError');
        const successElement = document.getElementById('registerSuccess');

        // Validation
        if (password !== confirmPassword) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorElement.textContent = 'Password must be at least 6 characters long';
            errorElement.style.display = 'block';
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            errorElement.textContent = 'Email already registered';
            errorElement.style.display = 'block';
            return;
        }

        // Add new user
        users.push({
            name,
            email,
            password,
            phone
        });

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message
        successElement.textContent = 'Registration successful! Please login.';
        successElement.style.display = 'block';
        errorElement.style.display = 'none';

        // Clear form
        e.target.reset();

        // Redirect to login after 2 seconds
        setTimeout(() => {
            showForm('userLoginForm');
            successElement.style.display = 'none';
        }, 2000);
    });

    // User login
    document.getElementById('userLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const errorElement = document.getElementById('userError');

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('userAuth', JSON.stringify({ 
                email: user.email,
                name: user.name 
            }));
            window.location.href = 'index.html';
        } else {
            errorElement.textContent = 'Invalid email or password';
            errorElement.style.display = 'block';
        }
    });

    // Admin login
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const errorElement = document.getElementById('adminError');

        const admin = admins.find(a => a.email === email && a.password === password);
        
        if (admin) {
            localStorage.setItem('adminAuth', JSON.stringify({ email: admin.email }));
            window.location.href = 'index.html?admin=true';
        } else {
            errorElement.textContent = 'Invalid admin credentials';
            errorElement.style.display = 'block';
        }
    });
}); 