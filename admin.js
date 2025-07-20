// admin.js - For admin login and menu management

document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin script loaded!");

    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginCard = document.getElementById('loginCard');
    const menuEditorCard = document.getElementById('menuEditorCard');

    // --- Admin Login Logic ---
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent page reload

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Attempting login with:", { email, password });

            // --- IMPORTANT: This is where you would send credentials to a backend for verification ---
            // For now, a simple local check:
            if (email === "admin@armah.com" && password === "password123") { // NEVER do this in real production!
                alert("Login successful! Welcome, Admin.");
                loginCard.style.display = 'none'; // Hide login form
                menuEditorCard.style.display = 'block'; // Show menu editor
            } else {
                alert("Invalid email or password.");
            }

            // In a real app, use fetch() to send to a backend and handle tokens for sessions.
            /*
            fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Login successful!");
                    // Store token (e.g., in localStorage) and redirect or show admin panel
                    loginCard.style.display = 'none';
                    menuEditorCard.style.display = 'block';
                } else {
                    alert(data.message || "Login failed.");
                }
            })
            .catch(error => console.error('Login error:', error));
            */
        });
    }

    // --- Future Menu Management Logic (after login) ---
    // 1. Fetch current menu items.
    // 2. Dynamically display them in the editor.
    // 3. Add event listeners for Edit, Delete, Add New buttons.
    // 4. Implement forms/modals for editing/adding items.
    // 5. Send updates to backend API.
});
