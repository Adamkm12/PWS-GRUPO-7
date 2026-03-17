import { loginUser } from './modules/auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".register-form"); // El formulario usa la misma clase en ambas páginas
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const success = loginUser(email, password);

            if (success) {
                // Redirigir al inicio en caso de éxito
                window.location.href = "home.html";
            } else {
                alert("Correo o contraseña incorrectos.");
            }
        });
    }
});
