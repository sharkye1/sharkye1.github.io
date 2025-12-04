// Глитч эффекты и анимации
export class GlitchEffect {
  constructor() {
    this.isAnimating = false;
  }

  // Глитч переход между элементами
  glitchTransition(element, duration = 300) {
    return new Promise(resolve => {
      element.style.animation = `glitch-transition ${duration}ms ease-in-out`;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes glitch-transition {
          0% {
            opacity: 1;
            transform: translate(0, 0) skew(0deg);
            filter: drop-shadow(0 0 0 rgba(255, 0, 255, 0));
          }
          20% {
            opacity: 0.9;
            transform: translate(-5px, 3px) skew(2deg);
            filter: drop-shadow(2px 0 0 #FF00FF) drop-shadow(-2px 0 0 #00FFFF);
          }
          40% {
            opacity: 0.7;
            transform: translate(4px, -3px) skew(-1deg);
            filter: drop-shadow(4px 0 0 #FF00FF) drop-shadow(-4px 0 0 #00FFFF);
          }
          60% {
            opacity: 0.5;
            transform: translate(-3px, 2px) skew(1deg);
            filter: drop-shadow(6px 0 0 #FF00FF) drop-shadow(-6px 0 0 #00FFFF);
          }
          80% {
            opacity: 0.3;
            transform: translate(2px, -2px) skew(-0.5deg);
            filter: drop-shadow(4px 0 0 #FF00FF) drop-shadow(-4px 0 0 #00FFFF);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) skew(0deg);
            filter: drop-shadow(0 0 0 rgba(255, 0, 255, 0));
          }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        element.style.animation = '';
        resolve();
      }, duration);
    });
  }

  // Эффект "ломаного экрана"
  async crashScreen(duration = 400) {
    const crash = document.createElement('div');
    crash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(45deg, transparent 30%, rgba(255, 0, 255, 0.3) 50%, transparent 70%),
        linear-gradient(-45deg, transparent 30%, rgba(0, 255, 255, 0.3) 50%, transparent 70%);
      pointer-events: none;
      z-index: 10000;
      animation: crash ${duration}ms ease-out forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes crash {
        0% {
          opacity: 1;
          transform: scale(1);
          filter: brightness(1.5);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.05) rotate(1deg);
          filter: brightness(0.5) contrast(2);
        }
        100% {
          opacity: 0;
          transform: scale(1);
          filter: brightness(1);
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(crash);

    return new Promise(resolve => {
      setTimeout(() => {
        crash.remove();
        resolve();
      }, duration);
    });
  }

  // Глитч текста
  glitchText(element, intensity = 5) {
    const originalText = element.textContent;
    const characters = 'ﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐﾊﾐ';
    
    let iteration = 0;
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (Math.random() < 0.1) {
            return characters[Math.floor(Math.random() * characters.length)];
          }
          return char;
        })
        .join('');

      if (iteration++ > intensity) {
        clearInterval(interval);
        element.textContent = originalText;
      }
    }, 50);
  }

  // Яркие вспышки помех на экране
  tvStaticFlash(duration = 200) {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.7;
      pointer-events: none;
      z-index: 10000;
      animation: staticFlash ${duration}ms ease-out forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes staticFlash {
        0% { opacity: 0.7; }
        50% { opacity: 0.3; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(flash);

    setTimeout(() => flash.remove(), duration);
  }

  // Эффект "рассеивания" текста
  glitchDissolve(element, duration = 500) {
    return new Promise(resolve => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes dissolve {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          50% {
            opacity: 0.5;
            transform: translate(
              ${Math.random() * 20 - 10}px,
              ${Math.random() * 20 - 10}px
            );
          }
          100% {
            opacity: 0;
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
          }
        }
      `;
      document.head.appendChild(style);

      element.style.animation = `dissolve ${duration}ms ease-in-out forwards`;

      setTimeout(resolve, duration);
    });
  }

  // TV помехи (горизонтальные полосы, идущие вниз)
  createTVNoise(duration = 5000) {
    const noise = document.createElement('div');
    noise.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        );
      background-size: 100% 8px;
      pointer-events: none;
      z-index: 9998;
      animation: tvNoise ${duration}ms linear infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes tvNoise {
        0% {
          background-position: 0 0;
          opacity: 0.8;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          background-position: 0 100px;
          opacity: 0.8;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(noise);

    return noise;
  }

  // Эффект искажения изображения (distortion)
  distortImage(element, duration = 300) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes distort {
        0% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
        25% {
          clip-path: polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%);
        }
        50% {
          clip-path: polygon(5% 0%, 100% 3%, 95% 100%, 0% 97%);
        }
        75% {
          clip-path: polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%);
        }
        100% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      }
    `;
    document.head.appendChild(style);

    element.style.animation = `distort ${duration}ms ease-in-out`;
  }
}
