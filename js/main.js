// Данные игр (полная версия)
const gamesDatabase = [
    {
        id: 1,
        title: "The Witcher 3: Wild Hunt",
        description: "Захватывающая RPG в фэнтезийном мире, где вы играете за Геральта из Ривии, охотника на монстров.",
        genre: "RPG",
        release_date: "2015-05-18",
        platform: "PC",
        price: 1999,
        image: "https://via.placeholder.com/300x200?text=Witcher+3",
        seller: { id: 1, login: "gamer_shop", rating: 4.8 }
    },
    {
        id: 2,
        title: "Cyberpunk 2077",
        description: "Научно-фантастическая RPG в будущем, действие происходит в городе Найт-Сити.",
        genre: "RPG",
        release_date: "2020-12-10",
        platform: "PC",
        price: 2499,
        image: "https://via.placeholder.com/300x200?text=Cyberpunk+2077",
        seller: { id: 1, login: "gamer_shop", rating: 4.5 }
    },
    {
        id: 3,
        title: "Counter-Strike 2",
        description: "Культовый шутер от первого лица с командными сражениями.",
        genre: "Шутер",
        release_date: "2023-09-27",
        platform: "PC",
        price: 0,
        image: "https://via.placeholder.com/300x200?text=CS2",
        seller: { id: 2, login: "valve_inc", rating: 4.9 }
    },
    {
        id: 4,
        title: "Baldur's Gate 3",
        description: "Эпическая RPG по мотивам Dungeons & Dragons.",
        genre: "RPG",
        release_date: "2023-08-03",
        platform: "PC",
        price: 2999,
        image: "https://via.placeholder.com/300x200?text=Baldur's+Gate+3",
        seller: { id: 3, login: "larian_studios", rating: 4.9 }
    },
    {
        id: 5,
        title: "Starfield",
        description: "Космическая RPG от создателей The Elder Scrolls.",
        genre: "RPG",
        release_date: "2023-09-06",
        platform: "PC",
        price: 3499,
        image: "https://via.placeholder.com/300x200?text=Starfield",
        seller: { id: 4, login: "bethesda", rating: 4.2 }
    },
    {
        id: 6,
        title: "Minecraft",
        description: "Игра в стиле песочницы с бесконечными возможностями.",
        genre: "Приключения",
        release_date: "2011-11-18",
        platform: "PC",
        price: 1499,
        image: "https://via.placeholder.com/300x200?text=Minecraft",
        seller: { id: 5, login: "mojang", rating: 4.9 }
    }
];

// Сохраняем данные в localStorage
if (!localStorage.getItem('games')) {
    localStorage.setItem('games', JSON.stringify(gamesDatabase));
}

// Загружаем игры
function loadGames() {
    const games = JSON.parse(localStorage.getItem('games')) || gamesDatabase;
    return games;
}

// Сохраняем игры
function saveGames(games) {
    localStorage.setItem('games', JSON.stringify(games));
}

// Отображение статистики
function updateStats() {
    const games = loadGames();
    const gamesCount = document.getElementById('games-count');
    const sellersCount = document.getElementById('sellers-count');
    const usersCount = document.getElementById('users-count');
    
    if (gamesCount) gamesCount.textContent = games.length;
    if (sellersCount) {
        const sellers = new Set(games.map(g => g.seller.id));
        sellersCount.textContent = sellers.size;
    }
    if (usersCount) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        usersCount.textContent = users.length;
    }
}

// Отображение рекомендуемых игр
function displayRecommendedGames() {
    const container = document.getElementById('recommended-games');
    if (!container) return;
    
    const games = loadGames();
    const recommended = games.slice(0, 6);
    
    container.innerHTML = recommended.map(game => `
        <div class="col-md-4 col-lg-2 mb-4">
            <div class="card game-card h-100">
                <img src="${game.image}" 
                     class="card-img-top" 
                     alt="${game.title}"
                     style="height: 120px; object-fit: cover;">
                <div class="card-body p-2">
                    <h6 class="card-title mb-1" style="font-size: 0.9rem;">${game.title.substring(0, 20)}</h6>
                    <p class="card-text mb-1">
                        <small class="text-success fw-bold">${game.price} ₽</small>
                    </p>
                    <button class="btn btn-primary btn-sm w-100 add-to-cart" data-game-id="${game.id}">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameId = parseInt(btn.dataset.gameId);
            const game = loadGames().find(g => g.id === gameId);
            if (game) cart.addItem(game);
        });
    });
}

// Поиск игр
function searchGames(query) {
    const games = loadGames();
    if (!query) return games;
    
    return games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.genre.toLowerCase().includes(query.toLowerCase())
    );
}

// Обработка поиска
function setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value;
            if (query) {
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    displayRecommendedGames();
    updateStats();
    setupSearch();
    
    // Обновляем счетчик корзины
    cart.updateCartCount();
    
    // Добавляем стили для карточек
    const style = document.createElement('style');
    style.textContent = `
        .game-card {
            transition: all 0.3s ease;
        }
        .game-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }
    `;
    document.head.appendChild(style);
});