// ГЛАВНАЯ СТРАНИЦА - ЛОГИКА
import { GlitchEffect } from '/effects/glitch.js';
import { CRTEffect } from '/effects/crt.js';

const glitch = new GlitchEffect();
const crt = new CRTEffect();

// Инициализация главной страницы
export function initHome() {
  // Создаём скан-линии
  crt.createScanlines(document.body);

  // Применяем CRT эффект к логотипу
  const logo = document.querySelector('.logo');
  if (logo) {
    crt.applyChromatic(logo);
    crt.addBloom(logo);
    crt.addVibration(logo, 5000, 3);
  }

  // Обработчик кнопки каталога
  const catalogBtn = document.getElementById('catalog-btn');
  if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
      window.location.href = '/catalog.html';
    });
  }

  // Обработчик опасной кнопки
  const dangerBtn = document.getElementById('danger-button');
  if (dangerBtn) {
    dangerBtn.addEventListener('click', () => {
      // Открываем 5 вкладок about:blank
      for (let i = 0; i < 5; i++) {
        window.open('about:blank', '_blank');
      }
      
      // Краш-анимация
      glitch.crashScreen(400);
    });
  }

  // Анимация появления при загрузке (после splash screen)
  const homePage = document.getElementById('home-page');
  if (homePage) {
    homePage.style.display = 'flex';
  }
}

// Инициализация splash screen
export function initSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  
  if (splashScreen) {
    // Автоматически скрывается через 4.0 + 0.8 секунд (смотри CSS анимацию)
    // Затем показывается главная страница

    // Опционально: добавляем динамические помехи
    // Подстраиваем длительность TV-помех под увеличенный splash (4s + 0.8s = 4.8s)
    const tvNoise = glitch.createTVNoise(4800);

    setTimeout(() => {
      // После анимации скрытия удаляем splash screen
      setTimeout(() => {
        splashScreen.remove();
        tvNoise.remove();
      }, 800);
    }, 4000);
  }

  initHome();
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplashScreen);
} else {
  initSplashScreen();
}
