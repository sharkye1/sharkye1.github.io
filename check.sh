#!/usr/bin/env bash
# Лог проверки проекта

echo "📋 ЛОГ ПРОВЕРКИ ПРОЕКТА SZHIMA"
echo "=============================="
echo ""
echo "Дата: $(date)"
echo ""

# Проверка файлов
echo "📁 СТРУКТУРА ФАЙЛОВ:"
echo "==================="

echo ""
echo "HTML файлы:"
ls -1 *.html 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "CSS файлы:"
find assets/css -name "*.css" 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "JavaScript файлы:"
find assets/js -name "*.js" 2>/dev/null | sed 's/^/  ✓ /'
find effects -name "*.js" 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "Data файлы:"
ls -1 data/*.json 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "Media файлы:"
find assets/media -type f 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "📄 ДОКУМЕНТАЦИЯ:"
echo "==============="
ls -1 *.md 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "🛠️  СКРИПТЫ:"
echo "============"
ls -1 *.bat *.sh 2>/dev/null | sed 's/^/  ✓ /'

echo ""
echo "✅ Проверка завершена"
echo ""
echo "Для локального запуска:"
echo "  python -m http.server 8000"
echo ""
echo "Для дополнительной информации:"
echo "  cat QUICKSTART.md"
