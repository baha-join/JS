// Отображение всех игр в каталоге
function displayGames(games) {
    const container = document.getElementById('games-container');
    if (!container) return;
    
    if (games.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    Игры не найдены. Попробуйте изменить параметры фильтра.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = games.map(game => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card game-card h-100">
                <div style="height: 200px; overflow: hidden;">
                    <img src="${game.image}" class="card-img-top" alt="${game.title}" 
                         style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">
                        <a href="game-detail.html?id=${game.id}" class="text-decoration-none text-dark">
                            ${game.title}
                        </a>
                    </h5>
                    <p class="text-muted mb-2">${game.genre}</p>
                    <p class="card-text flex-grow-1">${game.description.substring(0, 100)}...</p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="text-success mb-0">${game.price} RUB</h5>
                                <small class="text-muted">
                                    <a href="seller-detail.html?id=${game.seller.id}" class="text-decoration-none">
                                        ${game.seller.login}
                                    </a>
                                </small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-primary add-to-cart" data-game-id="${game.id}">
                                    <i class="fas fa-cart-plus"></i>
                                </button>
                                <a href="game-detail.html?id=${game.id}" class="btn btn-sm btn-outline-secondary">
                                    <i class="fas fa-info-circle"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer bg-transparent">
                    <small class="text-muted">
                        <i class="fas fa-gamepad me-1"></i>${game.platform} • 
                        <i class="fas fa-calendar-alt me-1"></i>${game.release_date.substring(0, 4)}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const gameId = parseInt(btn.dataset.gameId);
            const game = loadGames().find(g => g.id === gameId);
            if (game) cart.addItem(game);
        });
    });
}

// Фильтрация игр
function filterGames() {
    const genre = document.getElementById('genre-filter')?.value || '';
    const platform = document.getElementById('platform-filter')?.value || '';
    
    let games = loadGames();
    
    if (genre) {
        games = games.filter(game => game.genre === genre);
    }
    if (platform) {
        games = games.filter(game => game.platform === platform);
    }
    
    displayGames(games);
}

// Инициализация каталога
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем все игры
    const games = loadGames();
    displayGames(games);
    
    // Настройка фильтров
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterGames);
    }
    
    // Обработка поиска
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value;
            if (query) {
                const filtered = searchGames(query);
                displayGames(filtered);
            } else {
                displayGames(loadGames());
            }
        });
    }
    
    // Обновляем счетчик корзины
    cart.updateCartCount();
});