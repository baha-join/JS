// Класс для работы с корзиной
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    // Загрузить корзину из localStorage
    loadCart() {
        const savedCart = localStorage.getItem('gameCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Сохранить корзину
    saveCart() {
        localStorage.setItem('gameCart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    // Добавить товар в корзину
    addItem(game, quantity = 1) {
        const existingItem = this.items.find(item => item.id === game.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: game.id,
                title: game.title,
                price: game.price,
                quantity: quantity,
                image: game.image,
                seller: game.seller || { login: 'Game Store' }
            });
        }
        
        this.saveCart();
        this.showNotification(`${game.title} добавлена в корзину!`);
    }

    // Удалить товар из корзины
    removeItem(gameId) {
        const index = this.items.findIndex(item => item.id === gameId);
        if (index !== -1) {
            const removed = this.items[index];
            this.items.splice(index, 1);
            this.saveCart();
            this.showNotification(`${removed.title} удалена из корзины`);
        }
    }

    // Обновить количество товара
    updateQuantity(gameId, quantity) {
        const item = this.items.find(item => item.id === gameId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                this.removeItem(gameId);
            }
            this.saveCart();
        }
    }

    // Получить общую сумму
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Получить общее количество товаров
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Очистить корзину
    clearCart() {
        this.items = [];
        this.saveCart();
        this.showNotification('Корзина очищена');
    }

    // Обновить счетчик на иконке корзины
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const total = this.getTotalItems();
            if (total > 0) {
                cartCount.textContent = total;
                cartCount.style.display = 'inline-block';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    // Показать уведомление
    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
        notification.style.zIndex = '9999';
        notification.style.animation = 'slideIn 0.5s ease';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Обновить отображение корзины на странице
    updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                    <p class="text-muted">Корзина пуста</p>
                    <a href="catalog.html" class="btn btn-primary">Вернуться к покупкам</a>
                </div>
            `;
            
            const totalItems = document.getElementById('total-items');
            const totalPrice = document.getElementById('total-price');
            if (totalItems) totalItems.textContent = '0';
            if (totalPrice) totalPrice.textContent = '0';
            
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = true;
            
            return;
        }

        // Отображаем товары
        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item border-bottom pb-3 mb-3" data-item-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image || 'https://via.placeholder.com/80x80?text=Game'}" 
                             class="img-fluid rounded" alt="${item.title}">
                    </div>
                    <div class="col-md-5 col-9">
                        <h6 class="mb-1">${item.title}</h6>
                        <small class="text-muted">Продавец: ${item.seller.login}</small>
                        <p class="mb-0"><strong>${item.price} RUB</strong></p>
                    </div>
                    <div class="col-md-3 col-6 mt-2 mt-md-0">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary decrease-quantity" type="button">-</button>
                            <input type="number" class="form-control text-center quantity-input" 
                                   value="${item.quantity}" min="1" style="max-width: 60px;">
                            <button class="btn btn-outline-secondary increase-quantity" type="button">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-6 mt-2 mt-md-0">
                        <button class="btn btn-danger btn-sm w-100 remove-item">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Обновляем итоги
        const totalItems = document.getElementById('total-items');
        const totalPrice = document.getElementById('total-price');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (totalItems) totalItems.textContent = this.getTotalItems();
        if (totalPrice) totalPrice.textContent = this.getTotalPrice().toFixed(2);
        if (checkoutBtn) checkoutBtn.disabled = false;

        // Добавляем обработчики событий
        this.addCartEventListeners();
    }

    addCartEventListeners() {
        // Удаление товара
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemDiv = e.target.closest('.cart-item');
                const itemId = parseInt(itemDiv.dataset.itemId);
                this.removeItem(itemId);
            });
        });

        // Изменение количества
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemDiv = e.target.closest('.cart-item');
                const itemId = parseInt(itemDiv.dataset.itemId);
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(itemId, quantity);
            });
        });

        // Увеличение количества
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('.quantity-input');
                input.value = parseInt(input.value) + 1;
                input.dispatchEvent(new Event('change'));
            });
        });

        // Уменьшение количества
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.parentElement.querySelector('.quantity-input');
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }
}

// Глобальный объект корзины
const cart = new Cart();

// Оформление заказа
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.getTotalItems() > 0) {
                alert('Спасибо за заказ! В ближайшее время с вами свяжется оператор.');
                cart.clearCart();
            }
        });
    }

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить корзину?')) {
                cart.clearCart();
            }
        });
    }
});

// Добавляем анимации в CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-item {
        transition: all 0.3s ease;
    }
    
    .cart-item:hover {
        background-color: #f8f9fa;
    }
    
    .quantity-input::-webkit-inner-spin-button,
    .quantity-input::-webkit-outer-spin-button {
        opacity: 1;
    }
`;
document.head.appendChild(style);