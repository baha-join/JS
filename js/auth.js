// Класс для работы с авторизацией
class Auth {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.updateAuthUI();
    }

    // Получить текущего пользователя
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Зарегистрировать пользователя
    register(email, password, username) {
        const users = this.getAllUsers();
        
        // Проверяем, существует ли пользователь
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Пользователь с таким email уже существует' };
        }
        
        if (users.find(u => u.username === username)) {
            return { success: false, error: 'Пользователь с таким именем уже существует' };
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            date_joined: new Date().toISOString(),
            role: 'user'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Автоматически входим
        this.login(email, password);
        
        return { success: true };
    }

    // Вход в систему
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && this.checkPassword(password, u.password));
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            this.currentUser = userWithoutPassword;
            this.updateAuthUI();
            return { success: true };
        }
        
        return { success: false, error: 'Неверный email или пароль' };
    }

    // Выход из системы
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    // Получить всех пользователей
    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Хеширование пароля (простое для демо)
    hashPassword(password) {
        return btoa(password);
    }

    // Проверка пароля
    checkPassword(password, hash) {
        return btoa(password) === hash;
    }

    // Обновить UI в зависимости от авторизации
    updateAuthUI() {
        const authButtons = document.getElementById('auth-buttons');
        if (!authButtons) return;
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                        <i class="fas fa-user me-1"></i>
                        ${this.currentUser.username}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="profile.html">
                            <i class="fas fa-user-circle me-2"></i>Профиль
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="logout-btn">
                            <i class="fas fa-sign-out-alt me-2"></i>Выйти
                        </a></li>
                    </ul>
                </div>
            `;
            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
            
            // Обновляем приветствие на главной
            const welcomeTitle = document.getElementById('welcome-title');
            if (welcomeTitle) {
                welcomeTitle.innerHTML = `Добро пожаловать, ${this.currentUser.username}! 🎮`;
            }
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline-light">
                    <i class="fas fa-user"></i>
                    Войти
                </a>
            `;
        }
    }
}

// Глобальный объект авторизации
const auth = new Auth();

// Инициализация демо-пользователей
if (!localStorage.getItem('users')) {
    const demoUsers = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            password: btoa('admin123'),
            date_joined: new Date().toISOString(),
            role: 'admin'
        },
        {
            id: 2,
            username: 'gamer',
            email: 'gamer@example.com',
            password: btoa('gamer123'),
            date_joined: new Date().toISOString(),
            role: 'user'
        }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
}