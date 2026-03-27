// Получить ID игры из URL
function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Отобразить детальную информацию об игре
function displayGameDetail() {
    const gameId = getGameIdFromUrl();
    const container = document.getElementById('game-detail-container');
    
    if (!gameId) {
        container.innerHTML = '<div class="alert alert-danger">Игра не найдена</div>';
        return;
    }
    
    const game = loadGames().find(g => g.id === gameId);
    
    if (!game) {
        container.innerHTML = '<div class="alert alert-danger">Игра не найдена</div>';
        return;
    }
    
    container.innerHTML = `
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Главная</a></li>
                <li class="breadcrumb-item"><a href="catalog.html">Каталог</a></li>
                <li class="breadcrumb-item active">${game.title}</li>
            </ol>
        </nav>
        
        <div class="row">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <img src="${game.image}" class="card-img-top" alt="${game.title}" 
                         style="max-height: 400px; object-fit: contain; background-color: #f8f9fa;">
                    
                    <div class="card-body">
                        <h1 class="card-title">${game.title}</h1>
                        <p class="text-muted">${game.genre} • ${game.platform}</p>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <p><strong>Дата выхода:</strong> ${game.release_date}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Продавец:</strong> 
                                    <a href="seller-detail.html?id=${game.seller.id}" class="text-decoration-none">
                                        ${game.seller.login}
                                    </a>
                                    <span class="badge bg-warning text-dark ms-1">${game.seller.rating}/5</span>
                                </p>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h3>Описание</h3>
                            <p class="lead">${game.description}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Отзывы покупателей</h3>
                    </div>
                    <div class="card-body">
                        <div class="text-center py-4">
                            <i class="far fa-comment-alt fa-3x text-secondary mb-3"></i>
                            <p class="text-muted">Пока нет отзывов на эту игру</p>
                            ${auth.currentUser ? 
                                '<button class="btn btn-outline-primary" onclick="alert(\'Функция добавления отзывов в разработке\')">Оставить отзыв</button>' : 
                                '<a href="login.html" class="btn btn-outline-primary">Войдите, чтобы оставить отзыв</a>'
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card shadow-sm sticky-top" style="top: 20px;">
                    <div class="card-body">
                        <div class="text-center mb-4">
                            <h2 class="text-success mb-3">${game.price} RUB</h2>
                            <div class="badge bg-light text-dark p-2 mb-3">
                                <i class="fas fa-tag me-1"></i>
                                Бесплатная доставка
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 mb-4">
                            <button class="btn btn-primary btn-lg py-3" id="add-to-cart-btn">
                                <i class="fas fa-shopping-cart me-2"></i>Добавить в корзину
                            </button>
                            <button class="btn btn-outline-primary" onclick="alert('Функция в разработке')">
                                <i class="far fa-heart me-2"></i>В избранное
                            </button>
                        </div>
                        
                        <div class="alert alert-success">
                            <h6><i class="fas fa-shield-alt me-2"></i>Гарантия качества</h6>
                            <p class="small mb-0">100% гарантия возврата денег в течение 14 дней</p>
                        </div>
                        
                        <ul class="list-unstyled text-muted small">
                            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Мгновенная доставка</li>
                            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Лицензионная копия</li>
                            <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Поддержка 24/7</li>
                            <li><i class="fas fa-check-circle text-success me-2"></i>Безопасная оплата</li>
                        </ul>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <h6 class="mb-0">Другие игры от ${game.seller.login}</h6>
                    </div>
                    <div class="card-body">
                        ${loadGames().filter(g => g.seller.id === game.seller.id && g.id !== game.id).slice(0, 3).map(otherGame => `
                            <div class="mb-3">
                                <a href="game-detail.html?id=${otherGame.id}" class="text-decoration-none text-dark">
                                    <div class="d-flex">
                                        <img src="${otherGame.image}" alt="${otherGame.title}" 
                                             class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                                        <div>
                                            <h6 class="mb-1">${otherGame.title.substring(0, 30)}</h6>
                                            <p class="text-success mb-0 small">${otherGame.price} RUB</p>
                                        </div>
                                    </div>
                                </a>
                                ${otherGame !== loadGames().filter(g => g.seller.id === game.seller.id && g.id !== game.id).slice(0, 3).pop() ? '<hr class="my-2">' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки "В корзину"
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            cart.addItem(game);
        });
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    displayGameDetail();
    cart.updateCartCount();
});