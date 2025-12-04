// СТРАНИЦА ТОВАРА - ЛОГИКА
import { GlitchEffect } from '/effects/glitch.js';
import { CRTEffect } from '/effects/crt.js';
import { CartManager, getProductById, isClothing, SIZES, getMediaType } from './utils.js';

const glitch = new GlitchEffect();
const crt = new CRTEffect();
const cart = new CartManager();

let currentProduct = null;
let currentMediaIndex = 0;
let selectedSize = null;

export async function initProduct() {
  // Создаём скан-линии
  crt.createScanlines(document.body);

  // Получаем ID товара из URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    console.error('ID товара не найден');
    window.location.href = '/catalog.html';
    return;
  }

  // Загружаем товар
  currentProduct = await getProductById(productId);

  if (!currentProduct) {
    console.error('Товар не найден');
    window.location.href = '/catalog.html';
    return;
  }

  // Заполняем информацию
  displayProductInfo();
  displayGallery();
  setupMediaNavigation();
  setupSizeSelector();
  setupCartButtons();
  setupBackButton();
}

function displayProductInfo() {
  const titleEl = document.querySelector('.details-title');
  const articleEl = document.querySelector('.details-article');
  const priceEl = document.querySelector('.details-price');
  const descriptionEl = document.querySelector('.details-description');

  titleEl.textContent = currentProduct.title;
  articleEl.textContent = `Art: ${currentProduct.article}`;
  priceEl.textContent = `₽${currentProduct.price}`;
  
  // Отображаем описание, если оно есть
  if (currentProduct.description) {
    descriptionEl.textContent = currentProduct.description;
  } else {
    descriptionEl.textContent = 'Описание отсутствует';
  }

  // Применяем CRT эффект
  titleEl.style.textShadow = '0 0 10px var(--primary-color), 2px 2px 0 var(--secondary-color)';
}

function displayGallery() {
  if (!currentProduct.media || currentProduct.media.length === 0) return;

  const mainMediaContainer = document.querySelector('.main-media');
  mainMediaContainer.innerHTML = '';

  const firstMedia = currentProduct.media[0];
  const mediaEl = createMediaElement(firstMedia);
  mainMediaContainer.appendChild(mediaEl);

  // Если больше одного медиа, показываем миниатюры
  if (currentProduct.media.length > 1) {
    displayMediaThumbnails();
  }
}

function createMediaElement(media) {
  if (media.type === 'video') {
    const video = document.createElement('video');
    video.src = media.src;
    video.controls = true;
    video.autoplay = false;
    video.className = 'main-media-content';
    return video;
  } else {
    const img = document.createElement('img');
    img.src = media.src;
    img.alt = currentProduct.title;
    img.className = 'main-media-content';
    return img;
  }
}

function displayMediaThumbnails() {
  const thumbsContainer = document.querySelector('.media-nav');
  thumbsContainer.innerHTML = '';

  currentProduct.media.forEach((media, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    if (index === 0) thumb.classList.add('active');

    if (media.type === 'video') {
      const video = document.createElement('video');
      video.src = media.src;
      thumb.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = media.src;
      thumb.appendChild(img);
    }

    thumb.addEventListener('click', () => {
      changeMedia(index);
    });

    thumbsContainer.appendChild(thumb);
  });
}

function changeMedia(index) {
  if (index < 0 || index >= currentProduct.media.length) return;

  const mainMediaContainer = document.querySelector('.main-media');
  const mediaEl = mainMediaContainer.querySelector('.main-media-content');

  // Анимация выхода
  mediaEl.style.animation = 'none';
  setTimeout(() => {
    mainMediaContainer.innerHTML = '';
    const newMediaEl = createMediaElement(currentProduct.media[index]);
    mainMediaContainer.appendChild(newMediaEl);
  }, 0);

  // Обновляем активную миниатюру
  document.querySelectorAll('.media-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  currentMediaIndex = index;
}

function setupMediaNavigation() {
  // Если только одно медиа, не показываем навигацию
  if (!currentProduct.media || currentProduct.media.length <= 1) {
    return;
  }
}

function setupSizeSelector() {
  if (!isClothing(currentProduct)) {
    // Скрываем выбор размера для не-одежды
    const sizeSection = document.querySelector('.size-selector');
    if (sizeSection) {
      sizeSection.style.display = 'none';
    }
    return;
  }

  // Получаем доступные размеры
  const sizes = currentProduct.sizes || SIZES;

  const optionsContainer = document.querySelector('.size-options');
  optionsContainer.innerHTML = '';

  sizes.forEach(size => {
    const btn = document.createElement('button');
    btn.className = 'size-option';
    btn.textContent = size;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = size;
    });
    optionsContainer.appendChild(btn);
  });
}

function setupCartButtons() {
  const addBtn = document.querySelector('.add-to-cart-btn');
  const actionButtons = document.querySelector('.action-buttons');

  addBtn.addEventListener('click', () => {
    // Проверяем размер для одежды
    if (isClothing(currentProduct) && !selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }

    // Добавляем в корзину
    cart.addItem(currentProduct, 1, selectedSize);

    // Показываем уведомление
    glitch.tvStaticFlash(200);

    // Обновляем кнопки
    updateCartButtons();
  });

  // Проверяем, в корзине ли товар
  if (cart.isInCart(currentProduct.id, selectedSize)) {
    updateCartButtons();
  }
}

function updateCartButtons() {
  const addBtn = document.querySelector('.add-to-cart-btn');
  const actionButtons = document.querySelector('.action-buttons');

  if (cart.isInCart(currentProduct.id, selectedSize)) {
    // Заменяем кнопку на две кнопки
    const container = document.createElement('div');
    container.className = 'button-container';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Убрать из корзины';
    removeBtn.addEventListener('click', () => {
      cart.removeItem(currentProduct.id, selectedSize);
      addBtn.style.display = 'block';
      container.remove();
      selectedSize = null;
    });

    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'checkout-btn';
    checkoutBtn.textContent = 'Перейти к покупке';
    checkoutBtn.addEventListener('click', () => {
      window.location.href = '/order.html';
    });

    container.appendChild(removeBtn);
    container.appendChild(checkoutBtn);

    addBtn.style.display = 'none';
    actionButtons.appendChild(container);
  }
}

function setupBackButton() {
  const backBtn = document.querySelector('.back-button');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '/catalog.html';
    });
  }
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProduct);
} else {
  initProduct();
}
