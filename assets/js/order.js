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
    // Проверяем форму с полной валидацией
    const form = document.querySelector('.order-form-section');
    
    // Получаем значения полей
    const fullName = form.querySelector('input[placeholder*="ФИО"]')?.value.trim() || '';
    const phone = form.querySelector('input[type="tel"]')?.value.trim() || '';
    const email = form.querySelector('input[type="email"]')?.value.trim() || '';
    const address = form.querySelector('input[placeholder*="адрес"]')?.value.trim() || '';
    const deliveryMethod = form.querySelector('select')?.value || '';

    // Массив для сбора ошибок
    const errors = [];

    // Проверка ФИО (3 слова, русские или латинские буквы)
    //const fullNameRegex = /^[а-яёА-ЯЁa-zA-Z]+\s+[а-яёА-ЯЁa-zA-Z]+\s+[а-яёА-ЯЁa-zA-Z]+$/;
    //if (!fullName) {
    //  errors.push('Введите ФИО');
    //} else if (!fullNameRegex.test(fullName)) {
    //  errors.push('ФИО должно содержать 3 слова только русскими или латинскими буквами');
    //}

    // Проверка российского телефона (+7 или 8, затем 10 цифр)
    const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phone) {
      errors.push('Введите номер телефона');
    } else if (!phoneRegex.test(phone)) {
      errors.push('Введите корректный российский номер телефона');
    }

    // Проверка email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      errors.push('Введите email');
    } else if (!emailRegex.test(email)) {
      errors.push('Введите корректный email');
    }

    // Проверка адреса (минимум 10 символов для реальности)
    //if (!address) {
    //  errors.push('Введите адрес доставки');
    //} else if (address.length < 10) {
    //  errors.push('Адрес доставки должен быть более подробным (минимум 10 символов)');
    //}

    // Проверка способа доставки
    if (!deliveryMethod) {
      errors.push('Выберите способ доставки');
    }

    // Подсветка полей с ошибками
    const fullNameInput = form.querySelector('input[placeholder*="ФИО"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const emailInput = form.querySelector('input[type="email"]');
    const addressInput = form.querySelector('input[placeholder*="адрес"]');
    const deliverySelect = form.querySelector('select');

    if (fullNameInput) fullNameInput.style.borderColor = fullNameRegex.test(fullName) ? 'var(--primary-color)' : '#ff6666';
    if (phoneInput) phoneInput.style.borderColor = phoneRegex.test(phone) ? 'var(--primary-color)' : '#ff6666';
    if (emailInput) emailInput.style.borderColor = emailRegex.test(email) ? 'var(--primary-color)' : '#ff6666';
    if (addressInput) addressInput.style.borderColor = (address && address.length >= 10) ? 'var(--primary-color)' : '#ff6666';
    if (deliverySelect) deliverySelect.style.borderColor = deliveryMethod ? 'var(--primary-color)' : '#ff6666';

    // Если есть ошибки, показываем их
    if (errors.length > 0) {
      alert('❌ Пожалуйста, исправьте следующие ошибки:\n\n' + errors.map((err, i) => `${i + 1}. ${err}`).join('\n'));
      return;
    }

    // ЭПИЧЕСКАЯ АНИМАЦИЯ УСПЕХА
    showSuccessAnimation();
    
    // Очищаем корзину
    cart.clearCart();
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

async function showSuccessAnimation() {
  // Создаём оверлей для эффектов
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ff00, #ff00ff, #00ffff, #ffff00, #00ff00);
    background-size: 400% 400%;
    z-index: 9999;
    animation: psychoGradient 3s ease infinite;
    pointer-events: none;
  `;
  
  // Добавляем стили анимации
  if (!document.querySelector('#success-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'success-animation-styles';
    style.textContent = `
      @keyframes psychoGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes confetti {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), 100vh) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes spin-zoom {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(1.5) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px #00ff00; }
        50% { box-shadow: 0 0 60px #00ffff; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);
  
  // Создаём конфетти
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 20 + 10}px;
      height: ${Math.random() * 20 + 10}px;
      background: hsl(${Math.random() * 360}, 100%, 50%);
      left: ${Math.random() * 100}%;
      top: -20px;
      z-index: 10000;
      pointer-events: none;
      --tx: ${(Math.random() - 0.5) * 300}px;
    `;
    confetti.style.animation = `confetti ${Math.random() * 2 + 2}s linear forwards`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), (Math.random() * 2 + 2) * 1000);
  }
  
  // Создаём "телепортирующиеся" сферы
  for (let i = 0; i < 8; i++) {
    const sphere = document.createElement('div');
    sphere.style.cssText = `
      position: fixed;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle at 30% 30%, #00ffff, #ff00ff);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      z-index: 9998;
      pointer-events: none;
      box-shadow: 0 0 30px #00ff00;
    `;
    sphere.style.animation = `spin-zoom 1.5s ease-out forwards`;
    document.body.appendChild(sphere);
    
    setTimeout(() => sphere.remove(), 1500);
  }

  // Центральное сообщение с гло́ем
  const successMsg = document.createElement('div');
  successMsg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
    text-align: center;
    font-family: 'Orbitron', monospace;
    pointer-events: none;
  `;

  const title = document.createElement('div');
  title.textContent = '>>> УСПЕХ <<<';
  title.style.cssText = `
    font-size: 4rem;
    color: #00ff00;
    text-shadow: 0 0 20px #00ff00, 0 0 40px #ff00ff;
    letter-spacing: 5px;
    animation: pulse-glow 0.5s ease-in-out infinite;
    margin-bottom: 20px;
    font-weight: bold;
  `;

  const subtitle = document.createElement('div');
  subtitle.textContent = '🎉 ЗАКАЗ ПРИНЯТ 🎉';
  subtitle.style.cssText = `
    font-size: 2rem;
    color: #00ffff;
    text-shadow: 0 0 15px #00ffff;
    margin-bottom: 10px;
  `;

  const message = document.createElement('div');
  message.textContent = 'ГОТОВИМСЯ К ОТПРАВКЕ...';
  message.style.cssText = `
    font-size: 1.2rem;
    color: #ffff00;
    text-shadow: 0 0 10px #ffff00;
    animation: pulse-glow 1s ease-in-out infinite;
  `;

  successMsg.appendChild(title);
  successMsg.appendChild(subtitle);
  successMsg.appendChild(message);
  document.body.appendChild(successMsg);

  // Звуковой эффект - воспроизводим файл
  try {
    const audio = new Audio('/assets/media/nain.mp3');
    audio.volume = 0.7; // 70% громкости
    audio.play().catch(err => console.log('Звук не воспроизведён:', err));
  } catch (e) {
    // Звук не важен, если не сработает
  }

  // Ждём 3 секунды, затем переходим на главную
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Убираем эффекты
  overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
  successMsg.style.animation = 'fadeOut 0.5s ease-out forwards';

  // Добавляем fadeOut анимацию если её ещё нет
  if (!document.querySelector('#fadeout-style')) {
    const fadeStyle = document.createElement('style');
    fadeStyle.id = 'fadeout-style';
    fadeStyle.textContent = `
      @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(fadeStyle);
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Очищаем конфетти и переходим
  document.querySelectorAll('[style*="confetti"]').forEach(el => el.remove());
  overlay.remove();
  successMsg.remove();
  
  window.location.href = '/';
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrder);
} else {
  initOrder();
}
