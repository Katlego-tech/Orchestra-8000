/**
 * Orchestra 8000 - Login Page JavaScript
 * Handles authentication, form validation, and user interactions
 */

// ===== Configuration =====
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',
    TOKEN_KEY: 'orchestra_token',
    USER_KEY: 'orchestra_user',
    REDIRECT_DELAY: 1500
};

// ===== State Management =====
const state = {
    isLoading: false,
    passwordVisible: false
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    initializePasswordToggle();
    checkExistingAuth();
    addFormValidation();
    initPageTransitions();
});

// ===== Form Initialization =====
function initializeForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (state.isLoading) return;
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validate inputs
        if (!validateEmail(email)) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            showStatus('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Perform login
        await performLogin(email, password, remember);
    });
}

// ===== Password Toggle =====
function initializePasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    toggleButton.addEventListener('click', () => {
        state.passwordVisible = !state.passwordVisible;
        
        if (state.passwordVisible) {
            passwordInput.type = 'text';
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            passwordInput.type = 'password';
            toggleButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        }
    });
}

// ===== Authentication =====
async function performLogin(email, password, remember) {
    const loginButton = document.getElementById('loginButton');
    
    try {
        // Set loading state
        state.isLoading = true;
        loginButton.classList.add('loading');
        
        // Simulate API call (replace with actual API endpoint)
        const response = await authenticateUser(email, password);
        
        if (response.success) {
            // Store authentication data
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(CONFIG.TOKEN_KEY, response.token);
            storage.setItem(CONFIG.USER_KEY, JSON.stringify(response.user));
            
            // Show success message
            showStatus('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, CONFIG.REDIRECT_DELAY);
        } else {
            throw new Error(response.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showStatus(error.message || 'Login failed. Please try again.', 'error');
        state.isLoading = false;
        loginButton.classList.remove('loading');
    }
}

async function authenticateUser(email, password) {
    // For development: simulate API call
    // In production, replace with actual API endpoint
    return new Promise((resolve) => {
        setTimeout(() => {
            // Demo credentials for testing
            if (email === 'demo@orchestra.ai' && password === 'demo123') {
                resolve({
                    success: true,
                    token: generateMockToken(),
                    user: {
                        id: '1',
                        email: email,
                        name: 'Demo User',
                        role: 'admin',
                        avatar: 'D'
                    }
                });
            } else {
                resolve({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        }, 1500); // Simulate network delay
    });
    
    /* Production implementation:
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
    */
}

// ===== Check Existing Authentication =====
function checkExistingAuth() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY) || 
                  sessionStorage.getItem(CONFIG.TOKEN_KEY);
    
    if (token && isTokenValid(token)) {
        // User is already authenticated, redirect to dashboard
        showStatus('Already logged in. Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

function isTokenValid(token) {
    // In production, validate token expiration
    // For now, just check if token exists
    return token && token.length > 0;
}

// ===== Form Validation =====
function addFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Real-time email validation
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            emailInput.style.borderColor = 'var(--error)';
            showStatus('Please enter a valid email address', 'warning');
        } else {
            emailInput.style.borderColor = '';
        }
    });
    
    // Real-time password validation
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length > 0 && password.length < 6) {
            passwordInput.style.borderColor = 'var(--warning)';
        } else {
            passwordInput.style.borderColor = '';
        }
    });
    
    // Clear validation on focus
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        });
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Status Messages =====
function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusMessage');
    
    statusElement.textContent = message;
    statusElement.className = `status-message ${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 5000);
}

// ===== Social Login Handlers =====
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.textContent.trim();
        showStatus(`${provider} authentication coming soon!`, 'warning');
    });
});

// ===== Utility Functions =====
function generateMockToken() {
    // Generate a mock JWT-like token for development
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: '1',
        email: 'demo@orchestra.ai',
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
}

function parseToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (error) {
        console.error('Token parse error:', error);
        return null;
    }
}

// ===== Page Transitions =====
function initPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') || href === 'javascript:void(0)') return;
            
            e.preventDefault();
            
            let overlay = document.querySelector('.page-transition');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'page-transition';
                document.body.appendChild(overlay);
            }
            
            overlay.classList.add('active');
            
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Alt + L to focus email input
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('email').focus();
    }
});

// ===== Animation Enhancements =====
function addInteractionEffects() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.01)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = '';
        });
    });
}

// Initialize interaction effects
addInteractionEffects();

// ===== Error Handling =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showStatus('An unexpected error occurred. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showStatus('An unexpected error occurred. Please try again.', 'error');
});

// ===== Export for debugging =====
window.OrchestraAuth = {
    state,
    performLogin,
    checkExistingAuth,
    validateEmail,
    showStatus
};

console.log('%c🔐 Orchestra 8000 Login', 'color: #0F62FE; font-size: 16px; font-weight: bold;');
console.log('%cDemo credentials: demo@orchestra.ai / demo123', 'color: #FFD600; font-size: 12px;');

// Made with Bob
