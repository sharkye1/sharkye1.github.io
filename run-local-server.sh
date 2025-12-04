#!/bin/bash

# SZHIMA Store - Local Server Script
# Используется для локального тестирования на Linux/Mac

echo ""
echo "================================="
echo " SZHIMA - Retro CRT Glitch Store"
echo "================================="
echo ""
echo "Запуск локального сервера..."
echo ""

# Проверяем Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[!] Python не найден. Пожалуйста, установите Python 3"
    exit 1
fi

# Используем python3 если доступно
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "[+] Python обнаружен: $PYTHON_CMD"
echo ""
echo "Открываем сервер на http://localhost:8000"
echo "Нажмите Ctrl+C чтобы остановить сервер"
echo ""

# Запускаем сервер
$PYTHON_CMD -m http.server 8000
