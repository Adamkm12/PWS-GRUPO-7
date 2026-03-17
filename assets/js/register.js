import { registerUser } from './modules/auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".register-form");
    
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const password = document.getElementById("register-password").value;
            const confirmPassword = document.getElementById("register-confirm-password").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            const userData = {
                name: document.getElementById("register-name").value,
                lastname: document.getElementById("register-lastname").value,
                email: document.getElementById("register-email").value,
                phone: document.getElementById("register-phone").value,
                country: document.getElementById("register-country").value,
                birthdate: document.getElementById("register-birthdate").value,
                password: password
            };

            const success = registerUser(userData);

            if (success) {
                alert("Registro completado con éxito. Ahora puedes iniciar sesión.");
                window.location.href = "logIn.html";
            } else {
                alert("El correo electrónico ya está registrado.");
            }
        });
    }
});
