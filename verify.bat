#!/usr/bin/env batch
@echo off
REM Final setup and verification script for Windows

echo.
echo 🎬 SZHIMA Store - Setup Verification
echo ====================================
echo.

setlocal enabledelayedexpansion

set missing=0
set count=0

echo 📁 Проверка структуры проекта...
echo.

REM Check files
for %%f in (
  "index.html"
  "catalog.html"
  "product.html"
  "order.html"
  "data\products.json"
  "assets\css\global.css"
  "assets\css\index.css"
  "assets\css\catalog.css"
  "assets\css\product.css"
  "assets\css\order.css"
  "assets\js\utils.js"
  "assets\js\home.js"
  "assets\js\catalog.js"
  "assets\js\product.js"
  "assets\js\order.js"
  "effects\noise.js"
  "effects\crt.js"
  "effects\glitch.js"
) do (
  set /a count=!count!+1
  if exist "%%f" (
    echo   ✓ %%f
  ) else (
    echo   ✗ %%f (ОТСУТСТВУЕТ)
    set /a missing=!missing!+1
  )
)

echo.
if !missing! equ 0 (
  echo ✅ Все %count% основных файлов на месте!
) else (
  echo ⚠️  Отсутствует !missing! файлов из %count%
)

echo.
echo 📝 Документация:
for %%f in (
  "README.md"
  "QUICKSTART.md"
  "DEPLOYMENT.md"
  "EFFECTS.md"
  "package.json"
) do (
  if exist "%%f" (
    echo   ✓ %%f
  ) else (
    echo   ✗ %%f (ОТСУТСТВУЕТ)
  )
)

echo.
echo 🚀 Готово к использованию!
echo.
echo 📖 Начните с:
echo   1. Прочитайте: QUICKSTART.md
echo   2. Запустите: run-local-server.bat
echo   3. Откройте: http://localhost:8000
echo.
echo 🎨 Для развёртывания на GitHub Pages смотрите: DEPLOYMENT.md
echo ✨ Для информации об эффектах смотрите: EFFECTS.md
echo.
pause
