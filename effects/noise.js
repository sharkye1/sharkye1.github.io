// Генерация шума на канвасе для создания эффекта старого ТВ
export class NoiseGenerator {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.imageData = this.ctx.createImageData(width, height);
    this.data = this.imageData.data;
  }

  generate(intensity = 0.3) {
    for (let i = 0; i < this.data.length; i += 4) {
      const noise = Math.random() * 255 * intensity;
      this.data[i] = noise;
      this.data[i + 1] = noise;
      this.data[i + 2] = noise;
      this.data[i + 3] = 255;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    return this.canvas.toDataURL();
  }

  generateAnimated(element, intensity = 0.1, fps = 10) {
    const interval = setInterval(() => {
      element.style.backgroundImage = `url("${this.generate(intensity)}")`;
    }, 1000 / fps);
    return interval;
  }

  createNoisePattern() {
    // Создание шумового паттерна как фона
    for (let i = 0; i < this.data.length; i += 4) {
      const noise = Math.random() * 255 * 0.2;
      this.data[i] = 30 + noise;
      this.data[i + 1] = 30 + noise;
      this.data[i + 2] = 30 + noise;
      this.data[i + 3] = 255;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    return this.canvas.toDataURL();
  }
}

// SVG фильтр для шума
export function createNoiseSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'noise');
  
  const feTurbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
  feTurbulence.setAttribute('type', 'fractalNoise');
  feTurbulence.setAttribute('baseFrequency', '0.5');
  feTurbulence.setAttribute('numOctaves', '4');
  feTurbulence.setAttribute('seed', '2');
  
  filter.appendChild(feTurbulence);
  defs.appendChild(filter);
  svg.appendChild(defs);
  
  return svg;
}
