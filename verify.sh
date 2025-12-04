#!/usr/bin/env bash
# Final setup and verification script

echo "🎬 SZHIMA Store - Setup Verification"
echo "===================================="
echo ""

# Check structure
echo "📁 Проверка структуры проекта..."

files=(
  "index.html"
  "catalog.html"
  "product.html"
  "order.html"
  "data/products.json"
  "assets/css/global.css"
  "assets/css/index.css"
  "assets/css/catalog.css"
  "assets/css/product.css"
  "assets/css/order.css"
  "assets/js/utils.js"
  "assets/js/home.js"
  "assets/js/catalog.js"
  "assets/js/product.js"
  "assets/js/order.js"
  "effects/noise.js"
  "effects/crt.js"
  "effects/glitch.js"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (ОТСУТСТВУЕТ)"
    missing=$((missing + 1))
  fi
done

if [ $missing -eq 0 ]; then
  echo ""
  echo "✅ Все файлы на месте!"
else
  echo ""
  echo "⚠️  Отсутствует $missing файлов"
fi

echo ""
echo "📝 Документация:"
files_doc=(
  "README.md"
  "QUICKSTART.md"
  "DEPLOYMENT.md"
  "EFFECTS.md"
  "package.json"
)

for file in "${files_doc[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (ОТСУТСТВУЕТ)"
  fi
done

echo ""
echo "🚀 Готово к использованию!"
echo ""
echo "📖 Начните с:"
echo "  1. Прочитайте: QUICKSTART.md"
echo "  2. Запустите: python -m http.server 8000"
echo "  3. Откройте: http://localhost:8000"
echo ""
echo "🎨 Для развёртывания на GitHub Pages смотрите: DEPLOYMENT.md"
echo "✨ Для информации об эффектах смотрите: EFFECTS.md"
