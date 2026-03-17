export const AUTH_KEYS = {
    USERS: 'hotel_users',
    CURRENT_USER: 'hotel_current_user'
};

/**
 * Registra un nuevo usuario en el sistema (localStorage).
 * @param {Object} userData - Los datos del usuario (email, password, etc).
 * @returns {boolean} true si el registro es exitoso, false si el usuario ya existe.
 */
export function registerUser(userData) {
    if (!userData || !userData.email) return false;

    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    
    // Comprobar si ya existe un usuario con ese email
    const exists = users.find(u => u.email === userData.email);
    if (exists) {
        return false;
    }

    users.push(userData);
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    return true;
}

/**
 * Inicia sesión verificando credenciales en localStorage.
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean} true si el login es exitoso.
 */
export function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
    }
    return false;
}

/**
 * Cierra la sesión activa.
 */
export function logoutUser() {
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
}

/**
 * Obtiene el usuario actual logeado.
 * @returns {Object|null} El usuario o null si no hay sesión.
 */
export function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
}
