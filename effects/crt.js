// CRT монитор эффекты
export class CRTEffect {
  constructor() {
    this.scanlineHeight = 2;
  }

  // Применение CRT эффекта к элементу
  applyCRT(element) {
    element.style.textShadow = `
      0 0 10px rgba(0, 255, 255, 0.3),
      2px 2px 0px rgba(255, 0, 255, 0.2),
      -2px -2px 0px rgba(0, 255, 255, 0.2)
    `;
  }

  // Эффект скан-линий (горизонтальные полосы)
  createScanlines(container) {
    const overlay = document.createElement('div');
    overlay.className = 'scanlines';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background-image: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15) 0px,
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      z-index: 9999;
    `;
    document.body.appendChild(overlay);
  }

  // Хроматическая аберрация (разделение цветов)
  applyChromatic(element) {
    element.style.filter = `
      drop-shadow(2px 0 0 #FF00FF)
      drop-shadow(-2px 0 0 #00FFFF)
    `;
  }

  // Вибрация и jitter
  addVibration(element, duration = 5000, intensity = 2) {
    const keyframes = `
      @keyframes vibrate {
        0% { transform: translate(0, 0) rotate(0deg); }
        10% { transform: translate(${intensity}px, ${intensity}px) rotate(0.5deg); }
        20% { transform: translate(-${intensity}px, ${intensity}px) rotate(-0.5deg); }
        30% { transform: translate(${intensity}px, -${intensity}px) rotate(0.3deg); }
        40% { transform: translate(-${intensity}px, -${intensity}px) rotate(-0.3deg); }
        50% { transform: translate(${intensity}px, 0) rotate(0deg); }
        60% { transform: translate(-${intensity}px, ${intensity * 0.5}px) rotate(0.2deg); }
        70% { transform: translate(${intensity * 0.5}px, -${intensity}px) rotate(-0.2deg); }
        80% { transform: translate(-${intensity * 0.5}px, ${intensity}px) rotate(0.1deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    element.style.animation = `vibrate ${duration}ms infinite`;
  }

  // Bloom эффект (свечение)
  addBloom(element) {
    element.style.filter = `drop-shadow(0 0 10px rgba(0, 255, 255, 0.6)) 
                            drop-shadow(0 0 20px rgba(255, 0, 150, 0.4))`;
  }

  // Distortion эффект
  applyDistortion(element) {
    element.style.filter = `
      contrast(1.2)
      brightness(1.1)
      saturate(1.3)
    `;
  }
}

// Поиск ближайшего CSS свойства для фильтра
export function createCRTOverlay() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    pointer-events: none;
    z-index: 8999;
  `;
  return overlay;
}
