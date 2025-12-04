# 🔧 ПОЛЕЗНЫЕ КОМАНДЫ

## 🏃 ЗАПУСК

### Windows
```bash
# Запуск локального сервера
run-local-server.bat

# Проверка структуры
verify.bat

# Просмотр логов
check.sh
```

### Linux / Mac
```bash
# Запуск локального сервера
chmod +x run-local-server.sh
./run-local-server.sh

# Проверка структуры
chmod +x verify.sh
./verify.sh

# Просмотр логов
chmod +x check.sh
./check.sh
```

### Python (все ОС)
```bash
# Python 3
python -m http.server 8000

# Python 2 (старые версии)
python -m SimpleHTTPServer 8000
```

### Node.js
```bash
npm install -g http-server
http-server
```

---

## 📝 РЕДАКТИРОВАНИЕ ФАЙЛОВ

### Добавить товар
```bash
# Открыть редактор
nano data/products.json        # Linux/Mac
notepad data/products.json     # Windows
```

### Изменить цвета
```bash
# Открыть глобальные стили
nano assets/css/global.css     # Linux/Mac
notepad assets/css/global.css  # Windows
```

### Добавить новый JS эффект
```bash
# Создать новый файл эффекта
touch effects/neweffect.js
```

---

## 🌍 РАЗВЁРТЫВАНИЕ

### Git - начало
```bash
# Инициализация репозитория
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "Initial commit: SZHIMA retro store"

# Добавить удалённый репозиторий
git remote add origin https://github.com/USERNAME/Szhima-site.git

# Переименовать ветку (если нужно)
git branch -M main

# Загрузить на GitHub
git push -u origin main
```

### Git - последующие обновления
```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Коммит
git commit -m "Описание изменений"

# Загрузить
git push
```

### GitHub Pages
```bash
# Клонировать репозиторий
git clone https://github.com/USERNAME/Szhima-site.git
cd Szhima-site

# Запустить локально
python -m http.server 8000

# Открыть в браузере
# http://localhost:8000
```

---

## 📦 УПРАВЛЕНИЕ ЗАВИСИМОСТЯМИ

### Node.js проект (опционально)
```bash
# Инициализация
npm init -y

# Установка dev-зависимостей (если нужно)
npm install --save-dev http-server

# Запуск через npm
npm start
```

---

## 🐛 ОТЛАДКА

### Открыть DevTools
```
Chrome/Edge: F12
Firefox: F12
Safari: Cmd+Option+I
Opera: Ctrl+Shift+I
```

### Очистить браузер
```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Safari: Cmd+Shift+Delete
Edge: Ctrl+Shift+Delete
```

### Жесткое обновление
```
Chrome/Edge: Ctrl+Shift+R
Firefox: Ctrl+Shift+R
Safari: Cmd+Shift+R
```

### Просмотр консоли
```javascript
// Открыть консоль (F12) и вставить:

// Проверить корзину
console.log(JSON.parse(localStorage.getItem('szhima_cart')));

// Очистить корзину
localStorage.removeItem('szhima_cart');

// Загрузить товары
fetch('/data/products.json').then(r => r.json()).then(d => console.log(d));

// Проверить размер медиа
console.log(document.querySelector('img')?.src);
```

---

## 🔍 ПОИСК И ЗАМЕНА

### Sed (Linux/Mac)
```bash
# Найти текст в файле
grep -r "текст" .

# Заменить во всех файлах
sed -i 's/старый/новый/g' файл.txt

# Рекурсивная замена
find . -name "*.js" -exec sed -i 's/старый/новый/g' {} \;
```

### Windows PowerShell
```powershell
# Найти текст
Select-String -Path "*.html" -Pattern "текст"

# Заменить в файле
(Get-Content file.txt) -replace 'старый', 'новый' | Set-Content file.txt
```

---

## 📊 СТАТИСТИКА

### Размер проекта
```bash
# Linux/Mac
du -sh .
du -sh assets/
du -sh effects/

# PowerShell (Windows)
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum
Write-Host "Размер: $($size / 1MB) MB"
```

### Количество файлов
```bash
# Linux/Mac
find . -type f | wc -l

# PowerShell (Windows)
(Get-ChildItem -Recurse -File).Count
```

### Количество строк кода
```bash
# Linux/Mac
find . -name "*.js" -o -name "*.css" -o -name "*.html" | xargs wc -l

# PowerShell (Windows)
Get-ChildItem -Recurse -Include *.js, *.css, *.html | ForEach-Object { 
  (Get-Content $_).Length 
} | Measure-Object -Sum
```

---

## 🎨 КАСТОМИЗАЦИЯ

### Добавить новый шрифт
```css
/* В assets/css/global.css */
@import url('https://fonts.googleapis.com/css2?family=ВАШ_ШРИФТ:wght@400;700;900&display=swap');

body {
  font-family: 'ВАШ_ШРИФТ', monospace;
}
```

### Изменить размер логотипа
```html
<!-- В index.html -->
<div class="logo-container" style="width: 400px; height: 400px;">
  <div class="logo">◆</div>
</div>
```

### Отключить эффекты
```javascript
// В assets/js/home.js
// crt.createScanlines(document.body);
// glitch.createTVNoise();
// crt.addBloom(logo);
```

---

## 📱 ТЕСТИРОВАНИЕ НА МОБИЛЬНЫХ

### DevTools мобильный режим
```
Chrome/Edge: Ctrl+Shift+M
Firefox: Ctrl+Shift+M
Safari: Cmd+Shift+M
```

### На реальном устройстве
```bash
# Узнать IP адрес
Linux: hostname -I
Mac: ifconfig | grep inet
Windows: ipconfig

# На телефоне открыть
http://192.168.1.X:8000
```

---

## ✅ КОНТРОЛЬНЫЙ СПИСОК

- [ ] Все HTML файлы открываются без ошибок
- [ ] CSS загружается (скан-линии видны)
- [ ] JavaScript работает (логотип вибрирует)
- [ ] JSON загружается (товары показываются)
- [ ] SVG изображения отображаются
- [ ] LocalStorage работает (корзина сохраняется)
- [ ] Кнопки кликаются
- [ ] Анимации плавные (60 FPS)
- [ ] Сайт адаптивен (мобильный режим)
- [ ] Нет ошибок в консоли (F12)

---

## 🆘 ЧАСТЫЕ ПРОБЛЕМЫ

### "Cannot GET /"
```bash
# Убедитесь, что запущен http-сервер
python -m http.server 8000

# Проверьте адрес
http://localhost:8000
```

### "404 на /data/products.json"
```bash
# Проверьте, что файл существует
ls -la data/products.json

# Проверьте путь в utils.js
# Должно быть: fetch('/data/products.json')
```

### "Белая страница"
```javascript
// Откройте F12 консоль и посмотрите ошибки
// Обычно это CORS или неправильные пути
```

### "Стили не применяются"
```bash
# Очистите кеш браузера (Ctrl+Shift+Delete)
# Затем жесткое обновление (Ctrl+Shift+R)
```

---

## 🚀 ФИНАЛЬНАЯ ПРОВЕРКА

Перед публикацией убедитесь:

1. **Все файлы на месте**
   ```bash
   verify.bat  # или verify.sh
   ```

2. **Сайт работает локально**
   ```bash
   python -m http.server 8000
   # Откройте http://localhost:8000
   ```

3. **Нет ошибок в консоли** (F12)

4. **Git инициализирован**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Репозиторий загружен**
   ```bash
   git remote add origin ...
   git push -u origin main
   ```

6. **GitHub Pages включён**
   - Settings → Pages
   - Branch: main, Folder: /root

7. **Сайт доступен**
   - https://username.github.io/Szhima-site/

---

**Удачи с вашим ретро CRT сайтом!** 📺✨
