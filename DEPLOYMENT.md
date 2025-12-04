# GitHub Pages Configuration for SZHIMA Store

## Развёртывание на GitHub Pages

### Шаг 1: Инициализация Git репозитория

```bash
cd Szhima-site
git init
git add .
git commit -m "Initial commit: SZHIMA retro CRT glitch store"
```

### Шаг 2: Создание репозитория на GitHub

1. Создайте новый репозиторий на https://github.com/new
2. Назовите его: `Szhima-site` (или `username.github.io` для персональной страницы)
3. Не инициализируйте README, .gitignore или лицензию

### Шаг 3: Добавление удаленного репозитория

```bash
git remote add origin https://github.com/YOUR_USERNAME/Szhima-site.git
git branch -M main
git push -u origin main
```

### Шаг 4: Включение GitHub Pages

1. Откройте Settings репозитория
2. Перейдите в "Pages" (в левом меню)
3. Выберите Source: "Deploy from a branch"
4. Выберите Branch: "main" и Folder: "/ (root)"
5. Нажмите "Save"

Сайт будет доступен по адресу:
- `https://YOUR_USERNAME.github.io/Szhima-site/` (если репозиторий не `username.github.io`)
- `https://YOUR_USERNAME.github.io/` (если репозиторий называется `username.github.io`)

### Шаг 5 (Опционально): Пользовательский домен

1. Купите или используйте существующий домен
2. В Settings > Pages, в разделе "Custom domain" введите ваш домен
3. Настройте DNS записи на хостинге домена согласно инструкциям GitHub

## Важно!

### Пути к файлам

Все пути в сайте используют абсолютные пути от корня (`/`):
- `/index.html` - главная
- `/catalog.html` - каталог
- `/assets/css/global.css` - стили
- `/data/products.json` - товары
- `/assets/media/` - медиа

Это работает корректно как при локальном запуске простого сервера, так и на GitHub Pages.

### Локальное тестирование

Для локального тестирования используйте простой HTTP-сервер:

**Python:**
```bash
python -m http.server 8000
# или Python 3
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npm install -g http-server
http-server
```

**VS Code (Live Server extension):**
- Установите расширение "Live Server"
- Откройте `index.html`
- Кликните "Go Live" внизу

Затем откройте `http://localhost:8000` (или адрес, указанный в терминале)

## Структура для публикации

Файлы на GitHub должны быть точно такого же расположения:

```
Szhima-site/
├── index.html
├── catalog.html
├── product.html
├── order.html
├── README.md
├── package.json
├── data/
│   └── products.json
├── assets/
│   ├── css/
│   ├── js/
│   └── media/
└── effects/
    ├── noise.js
    ├── crt.js
    └── glitch.js
```

## Особенности

✅ Полностью статический сайт (no server needed)
✅ Работает на GitHub Pages без конфигурации
✅ Все ресурсы локальные (нет внешних CDN кроме Google Fonts)
✅ Быстрая загрузка
✅ Кросс-браузерная совместимость
✅ Адаптивность для всех устройств

## Проблемы при развёртывании?

### Белая страница / 404 на подпапке

Убедитесь, что используются абсолютные пути (`/path/to/file`) вместо относительных (`./path/to/file`).

### JSON не загружается

Проверьте:
1. Правильность пути в `loadProducts()` функции
2. Что файл `products.json` находится в `/data/products.json`
3. Что CORS разрешены (GitHub Pages это поддерживает)

### Стили не применяются

Проверьте:
1. Пути к CSS файлам в HTML (должны начинаться с `/`)
2. Кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)

## Контакт

По вопросам развёртывания смотрите:
- GitHub Pages документация: https://docs.github.com/en/pages
- Официальные примеры: https://pages.github.com/
