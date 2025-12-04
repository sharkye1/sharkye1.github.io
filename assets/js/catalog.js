// КАТАЛОГ - ЛОГИКА
import { GlitchEffect } from '/effects/glitch.js';
import { CRTEffect } from '/effects/crt.js';
import { loadProducts } from './utils.js';

const glitch = new GlitchEffect();
const crt = new CRTEffect();

let products = [];
let currentIndex = 0;
let isAnimating = false;

export async function initCatalog() {
  // Создаём скан-линии
  crt.createScanlines(document.body);

  // Загружаем товары
  products = await loadProducts();
  
  if (products.length === 0) {
    console.error('Ошибка: товары не загружены');
    return;
  }

  // Инициализируем индикаторы
  updateIndicators();
  
  // Отображаем первый товар
  showProduct(0);

  // Обработчики событий
  setupEventListeners();

  // Обработка скролла
  setupScrolling();

  // Обработка свайпа (для мобильных)
  setupTouchSwipe();
}

function showProduct(index) {
  if (isAnimating || index < 0 || index >= products.length) return;

  isAnimating = true;
  
  const product = products[index];
  const viewport = document.querySelector('.product-viewport');
  
  // Удаляем старый товар
  const oldItem = viewport.querySelector('.product-item.active');
  if (oldItem) {
    oldItem.classList.remove('active');
    oldItem.classList.add('exiting');
  }

  // Создаём новый элемент товара
  const productItem = createProductElement(product);
  viewport.appendChild(productItem);

  // Триггер анимации
  setTimeout(() => {
    productItem.classList.add('active');
  }, 10);

  // Удаляем старый элемент
  if (oldItem) {
    setTimeout(() => {
      oldItem.remove();
    }, 400);
  }

  // Обновляем индикатор
  updateIndicators();

  // Завершаем анимацию
  setTimeout(() => {
    isAnimating = false;
  }, 600);

  currentIndex = index;
}

function createProductElement(product) {
  const item = document.createElement('div');
  item.className = 'product-item';

  // Медиа
  const mediaSection = document.createElement('div');
  mediaSection.className = 'product-media-section';
  
  if (product.media && product.media.length > 0) {
    const firstMedia = product.media[0];
    const mediaElement = document.createElement(firstMedia.type === 'video' ? 'video' : 'img');
    mediaElement.className = 'product-media';
    mediaElement.src = firstMedia.src;
    if (firstMedia.type === 'video') {
      mediaElement.controls = true;
      mediaElement.autoplay = false;
    }
    mediaSection.appendChild(mediaElement);
  }

  item.appendChild(mediaSection);

  // Информация
  const infoSection = document.createElement('div');
  infoSection.className = 'product-info';
  
  const title = document.createElement('div');
  title.className = 'product-title';
  title.textContent = product.title;
  
  const article = document.createElement('div');
  article.className = 'product-article';
  article.textContent = `ART: ${product.article}`;
  
  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = `₽${product.price}`;

  infoSection.appendChild(title);
  infoSection.appendChild(article);
  infoSection.appendChild(price);
  
  // Добавляем кнопку перехода к товару
  const viewBtn = document.createElement('button');
  viewBtn.textContent = 'Подробнее';
  viewBtn.style.cssText = `
    margin-top: 15px;
    padding: 10px 20px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: 2px solid var(--primary-color);
    color: var(--bg-darker);
    cursor: pointer;
    font-family: 'Orbitron', monospace;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    border-radius: 3px;
    transition: all 0.3s ease;
  `;
  viewBtn.addEventListener('click', () => {
    window.location.href = `/product.html?id=${product.id}`;
  });

  infoSection.appendChild(viewBtn);
  item.appendChild(infoSection);

  return item;
}

function updateIndicators() {
  const indicatorsContainer = document.querySelector('.catalog-indicators');
  indicatorsContainer.innerHTML = '';

  products.forEach((product, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (index === currentIndex) {
      indicator.classList.add('active');
    }
    indicator.addEventListener('click', () => showProduct(index));
    indicatorsContainer.appendChild(indicator);
  });

  // Обновляем счётчик
  const counter = document.querySelector('.counter');
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${products.length}`;
  }

  // Обновляем состояние кнопок навигации
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === products.length - 1;
}

function setupEventListeners() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const homeBtn = document.getElementById('home-nav-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showProduct(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showProduct(currentIndex + 1);
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
}

function setupScrolling() {
  let lastScrollTime = 0;
  const scrollDelay = 800; // Минимальная задержка между скроллами

  window.addEventListener('wheel', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastScrollTime < scrollDelay) return;

    if (e.deltaY > 0) {
      // Скролл вниз
      if (currentIndex < products.length - 1) {
        lastScrollTime = currentTime;
        showProduct(currentIndex + 1);
      }
    } else if (e.deltaY < 0) {
      // Скролл вверх
      if (currentIndex > 0) {
        lastScrollTime = currentTime;
        showProduct(currentIndex - 1);
      }
    }
  }, { passive: true });
}

function setupTouchSwipe() {
  let touchStartY = 0;
  let touchEndY = 0;
  let lastTouchTime = 0;
  const touchDelay = 800;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, false);

  document.addEventListener('touchend', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastTouchTime < touchDelay) return;

    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const diff = touchStartY - touchEndY;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Свайп вверх - следующий товар
        if (currentIndex < products.length - 1) {
          lastTouchTime = Date.now();
          showProduct(currentIndex + 1);
        }
      } else {
        // Свайп вниз - предыдущий товар
        if (currentIndex > 0) {
          lastTouchTime = Date.now();
          showProduct(currentIndex - 1);
        }
      }
    }
  }
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
