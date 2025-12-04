
// Helper para manejar la autenticación con LocalStorage

const USERS_KEY = "studyhub_users";
const CURRENT_USER_KEY = "studyhub_current_user";

// Obtener todos los usuarios (exportado para búsqueda de colaboradores)
export const getAllUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper interno
const getUsers = getAllUsers;

// Registrar un nuevo usuario
export const registerUser = (userData) => {
    const users = getUsers();

    // Verificar si el email ya existe
    const userExists = users.some(user => user.email === userData.email);
    if (userExists) {
        return { success: false, message: "El usuario ya existe" };
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(), // ID simple basado en timestamp
        name: userData.name,
        email: userData.email,
        password: userData.password, // En una app real, esto debería estar hasheado
        createdAt: new Date().toISOString()
    };

    // Guardar
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // No iniciamos sesión automáticamente, el usuario debe ir al login

    return { success: true, user: newUser };
};

// Iniciar sesión
export const loginUser = (email, password) => {
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
        return { success: true, user: userSession };
    }

    return { success: false, message: "Credenciales inválidas" };
};

// Cerrar sesión
export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Obtener usuario actual
export const getCurrentUser = () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Update user in users list and also update current session if it matches
const _updateUser = (userId, updates) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const current = getCurrentUser();
    if (current && current.id === userId) {
        const updatedSession = { ...current, ...updates };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSession));
    }

    return users[index];
};

// Convenience: set avatar (base64 or URL) on user profile
export const setUserAvatar = (userId, avatarData) => {
    const updated = _updateUser(userId, { avatar: avatarData });
    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
        }
    } catch (error) { void error; }
    return updated;
};

// Dispatch data-changed after updateUser as well
const _updateUserAndNotify = (userId, updates) => {
    const updated = _updateUser(userId, updates);
    try {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('studyhub:data-changed'));
        }
    } catch (error) { void error; }
    return updated;
};

// Replace exported updateUser with wrapper that notifies listeners
export { _updateUserAndNotify as updateUser };
