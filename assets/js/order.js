// СТРАНИЦА ОФОРМЛЕНИЯ ЗАКАЗА - ЛОГИКА
import { GlitchEffect } from '/effects/glitch.js';
import { CRTEffect } from '/effects/crt.js';
import { CartManager } from './utils.js';

const glitch = new GlitchEffect();
const crt = new CRTEffect();
const cart = new CartManager();

export function initOrder() {
  // Создаём скан-линии
  crt.createScanlines(document.body);

  // Отображаем товары в корзине
  displayCartItems();
  
  // Вычисляем и отображаем сумму
  updateOrderSummary();

  // Обработчик кнопки заказа
  setupOrderButton();

  // Обработчик промокода
  setupPromoCode();
}

function displayCartItems() {
  const cartList = document.querySelector('.cart-items-list');
  const cartItems = cart.getCart();

  if (cartItems.length === 0) {
    // Показываем пустую корзину
    const emptyCart = document.querySelector('.empty-cart');
    if (emptyCart) {
      emptyCart.style.display = 'block';
    }
    const orderForm = document.querySelector('.order-form-section');
    if (orderForm) {
      orderForm.style.display = 'none';
    }
    return;
  }

  cartList.innerHTML = '';

  cartItems.forEach((item, index) => {
    const itemEl = createCartItemElement(item, index);
    cartList.appendChild(itemEl);
  });
}

function createCartItemElement(item, index) {
  const itemEl = document.createElement('div');
  itemEl.className = 'cart-item';

  // Изображение
  const imageDiv = document.createElement('div');
  imageDiv.className = 'item-image';
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    imageDiv.appendChild(img);
  }
  itemEl.appendChild(imageDiv);

  // Информация
  const infoDiv = document.createElement('div');
  infoDiv.className = 'item-info';

  const title = document.createElement('div');
  title.className = 'item-title';
  title.textContent = item.title;
  infoDiv.appendChild(title);

  const article = document.createElement('div');
  article.className = 'item-article';
  article.textContent = `${item.article}${item.selectedSize ? ` / ${item.selectedSize}` : ''}`;
  infoDiv.appendChild(article);

  const price = document.createElement('div');
  price.className = 'item-price';
  price.textContent = `₽${item.price} x${item.quantity}`;
  infoDiv.appendChild(price);

  itemEl.appendChild(infoDiv);

  // Кнопка удаления
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'item-actions';

  const qtyDiv = document.createElement('div');
  qtyDiv.className = 'item-qty';
  qtyDiv.textContent = `×${item.quantity}`;
  actionsDiv.appendChild(qtyDiv);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-item-btn';
  removeBtn.textContent = 'Удалить';
  removeBtn.addEventListener('click', () => {
    cart.removeItem(item.id, item.selectedSize);
    itemEl.style.animation = 'dissolve 0.3s ease-out forwards';
    setTimeout(() => {
      itemEl.remove();
      // Обновляем сумму
      updateOrderSummary();
      // Если корзина пуста, показываем соответствующее сообщение
      if (cart.getCart().length === 0) {
        location.reload();
      }
    }, 300);
  });
  actionsDiv.appendChild(removeBtn);

  itemEl.appendChild(actionsDiv);

  return itemEl;
}

function updateOrderSummary() {
  const cartItems = cart.getCart();
  const totalPrice = cart.getTotalPrice();

  const summaryContainer = document.querySelector('.order-summary');
  
  if (!summaryContainer) return;

  summaryContainer.innerHTML = '';

  // Количество товаров
  const itemsRow = document.createElement('div');
  itemsRow.className = 'summary-row';
  itemsRow.innerHTML = `
    <span class="summary-label">Товаров:</span>
    <span class="summary-value">${cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт</span>
  `;
  summaryContainer.appendChild(itemsRow);

  // Стоимость товаров
  const subtotalRow = document.createElement('div');
  subtotalRow.className = 'summary-row';
  subtotalRow.innerHTML = `
    <span class="summary-label">Сумма:</span>
    <span class="summary-value">₽${totalPrice}</span>
  `;
  summaryContainer.appendChild(subtotalRow);

  // Доставка (условно 0)
  const shippingRow = document.createElement('div');
  shippingRow.className = 'summary-row';
  shippingRow.innerHTML = `
    <span class="summary-label">Доставка:</span>
    <span class="summary-value">Зависит от выбора</span>
  `;
  summaryContainer.appendChild(shippingRow);

  // Итого
  const totalRow = document.createElement('div');
  totalRow.className = 'summary-row';
  totalRow.innerHTML = `
    <span class="summary-label">ИТОГО:</span>
    <span class="summary-value">₽${totalPrice}</span>
  `;
  summaryContainer.appendChild(totalRow);
}

function setupOrderButton() {
  const orderBtn = document.querySelector('.order-button');
  if (!orderBtn) return;

  orderBtn.addEventListener('click', async () => {
    // Проверяем форму
    const form = document.querySelector('.order-form-section');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff6666';
      } else {
        input.style.borderColor = 'var(--primary-color)';
      }
    });

    if (!isValid) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Эффект "ломаного" заказа
    await glitch.crashScreen(400);

    // Очищаем форму и показываем сообщение
    alert('🎉 Ваш заказ успешно оформлен!\nСпасибо за покупку!');
    
    // Очищаем корзину
    cart.clearCart();
    
    // Возвращаемся на главную
    window.location.href = '/';
  });
}

function setupPromoCode() {
  const promoBtn = document.querySelector('.promo-button');
  const promoInput = document.querySelector('.promo-input');

  if (promoBtn) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      
      if (!code) {
        alert('Введите промокод');
        return;
      }

      // Условно: промокод "GLITCH" дает 10% скидку
      if (code.toUpperCase() === 'GLITCH') {
        alert('✓ Промокод применён!\nСкидка: 10%');
        glitch.tvStaticFlash(150);
      } else {
        alert('✗ Промокод не найден');
      }
    });
  }
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrder);
} else {
  initOrder();
}
