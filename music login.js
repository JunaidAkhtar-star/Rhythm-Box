// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// DOM elements
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
const toggleAuthText = document.getElementById('toggle-auth-text');
const authModeTitle = document.getElementById('auth-mode-title');
const errorMessageDiv = document.getElementById('error-message');
const errorMessageSpan = errorMessageDiv.querySelector('span');
const successMessageDiv = document.getElementById('success-message');
const successMessageSpan = successMessageDiv.querySelector('span');

let isLoginMode = true; // true for login, false for signup

// Firebase initialization
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

if (Object.keys(firebaseConfig).length === 0) {
    console.error("Firebase configuration is missing or empty.");
    displayMessage(errorMessageDiv, "Application configuration error. Please try again later.", true);
} else {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Function to display messages
    function displayMessage(element, message, isError = true) {
        // Hide both before showing the relevant one
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.classList.remove('show'); // Remove animation class
        successMessageDiv.classList.add('hidden');
        successMessageDiv.classList.remove('show'); // Remove animation class

        if (isError) {
            errorMessageSpan.textContent = message;
            errorMessageDiv.classList.remove('hidden');
            // Trigger reflow to restart animation
            void errorMessageDiv.offsetWidth;
            errorMessageDiv.classList.add('show');
        } else {
            successMessageSpan.textContent = message;
            successMessageDiv.classList.remove('hidden');
            // Trigger reflow to restart animation
            void successMessageDiv.offsetWidth;
            successMessageDiv.classList.add('show');
        }
    }

    // Function to clear messages
    function clearMessages() {
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.classList.remove('show');
        successMessageDiv.classList.add('hidden');
        successMessageDiv.classList.remove('show');
        errorMessageSpan.textContent = '';
        successMessageSpan.textContent = '';
    }

    // Toggle between login and signup mode
    toggleAuthModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        clearMessages();
        if (isLoginMode) {
            authModeTitle.textContent = "Login to your account";
            submitBtn.textContent = "Login";
            toggleAuthText.textContent = "Don't have an account?";
            toggleAuthModeBtn.textContent = "Sign Up";
            passwordInput.setAttribute('autocomplete', 'current-password');
        } else {
            authModeTitle.textContent = "Create a new account";
            submitBtn.textContent = "Sign Up";
            toggleAuthText.textContent = "Already have an account?";
            toggleAuthModeBtn.textContent = "Login";
            passwordInput.setAttribute('autocomplete', 'new-password');
        }
    });

    // Handle form submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            displayMessage(errorMessageDiv, "Please enter both email and password.", true);
            return;
        }

        if (isLoginMode) {
            // Login user
            try {
                await signInWithEmailAndPassword(auth, email, password);
                displayMessage(successMessageDiv, "Login successful! Redirecting...", false);
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to main app
                }, 1500);
            } catch (error) {
                console.error("Login error:", error.code, error.message);
                let msg = "Login failed. Please check your credentials.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    msg = "Invalid email or password.";
                } else if (error.code === 'auth/invalid-email') {
                    msg = "Please enter a valid email address.";
                } else if (error.code === 'auth/too-many-requests') {
                    msg = "Too many failed login attempts. Please try again later.";
                }
                displayMessage(errorMessageDiv, msg, true);
            }
        } else {
            // Sign up user
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                displayMessage(successMessageDiv, "Account created successfully! Switching to Login...", false);
                // Automatically switch to login mode after successful signup
                isLoginMode = true;
                authModeTitle.textContent = "Login to your account";
                submitBtn.textContent = "Login";
                toggleAuthText.textContent = "Don't have an account?";
                toggleAuthModeBtn.textContent = "Sign Up";
                passwordInput.setAttribute('autocomplete', 'current-password');
                // Optionally, auto-fill email and clear password
                passwordInput.value = '';
            } catch (error) {
                console.error("Sign up error:", error.code, error.message);
                let msg = "Sign up failed.";
                if (error.code === 'auth/email-already-in-use') {
                    msg = "Email already in use. Please login or use a different email.";
                } else if (error.code === 'auth/weak-password') {
                    msg = "Password should be at least 6 characters.";
                } else if (error.code === 'auth/invalid-email') {
                    msg = "Please enter a valid email address.";
                }
                displayMessage(errorMessageDiv, msg, true);
            }
        }
    });
}
