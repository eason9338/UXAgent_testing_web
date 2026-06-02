// 購物車管理
const CART_STORAGE_KEY = 'ftvmall_cart';

// 取得購物車
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error('Error loading cart:', e);
        return [];
    }
}

// 儲存購物車
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
        return true;
    } catch (e) {
        console.error('Error saving cart:', e);
        return false;
    }
}

// 加入購物車
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const product = getProduct(productId);

    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity: quantity,
            sku: product.sku
        });
    }

    saveCart(cart);
    return true;
}

// 更新購物車項目數量
function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
        return true;
    }
    return false;
}

// 從購物車移除
function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    saveCart(filteredCart);
    return true;
}

// 清空購物車
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
}

// 計算購物車總額
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 計算購物車商品數量
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// 更新購物車徽章
function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'inline-block';
    }
}

// 顯示加入購物車成功通知
function showCartToast(productName, quantity) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">✓</div>
        <div class="toast-body">
            <div class="toast-title">已加入購物車</div>
            <div class="toast-product">${productName}${quantity > 1 ? ` × ${quantity}` : ''}</div>
        </div>
        <div class="toast-actions">
            <a href="cart.html" class="toast-cart-link">前往購物車</a>
            <button type="button" class="toast-confirm-btn">確認</button>
        </div>
    `;

    const confirmBtn = toast.querySelector('.toast-confirm-btn');
    confirmBtn.addEventListener('click', () => {
        toast.classList.add('toast-hide');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    });

    container.appendChild(toast);
}

// 頁面載入時更新購物車徽章
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartBadge);
} else {
    updateCartBadge();
}
