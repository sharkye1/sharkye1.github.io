// Утилиты для работы с корзиной, хранилищем и данными
export class CartManager {
  constructor() {
    this.storageKey = 'szhima_cart';
    this.cart = this.loadCart();
  }

  loadCart() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
  }

  addItem(product, quantity = 1, selectedSize = null) {
    const existingItem = this.cart.find(item => 
      item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        article: product.article,
        quantity: quantity,
        selectedSize: selectedSize,
        image: product.media && product.media[0] ? product.media[0].src : null
      });
    }
    this.saveCart();
    return this.cart;
  }

  removeItem(productId, selectedSize = null) {
    this.cart = this.cart.filter(item => 
      !(item.id === productId && item.selectedSize === selectedSize)
    );
    this.saveCart();
    return this.cart;
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getTotalPrice() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  isInCart(productId, selectedSize = null) {
    return this.cart.some(item => 
      item.id === productId && item.selectedSize === selectedSize
    );
  }
}

// Загрузка продуктов из JSON
export async function loadProducts() {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
    return [];
  }
}

// Поиск продукта по ID
export async function getProductById(id) {
  const products = await loadProducts();
  return products.find(p => p.id === id);
}

// Проверка является ли товар одеждой
export function isClothing(product) {
  const clothingKeywords = ['shirt', 'pants', 'hoodie', 'jacket', 'dress', 'hat', 'shirt', 'clothing', 'apparel', 'рубашка', 'брюки', 'худи', 'куртка', 'платье', 'шапка', 'одежда'];
  const title = product.title.toLowerCase();
  return clothingKeywords.some(keyword => title.includes(keyword));
}

// Размеры для одежды
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Проверка расширения файла для медиа
export function getMediaType(src) {
  const ext = src.toLowerCase().split('.').pop();
  if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  return 'image'; // по умолчанию изображение
}
