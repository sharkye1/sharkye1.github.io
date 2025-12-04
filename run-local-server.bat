@echo off
REM SZHIMA Store - Local Server Script
REM Используется для локального тестирования на Windows

echo.
echo =================================
echo  SZHIMA - Retro CRT Glitch Store
echo =================================
echo.
echo Запуск локального сервера...
echo.

REM Проверяем Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [!] Python не найден. Убедитесь, что Python установлен и добавлен в PATH
    pause
    exit /b 1
)

echo [+] Python обнаружен
echo.
echo Открываем сервер на http://localhost:8000
echo Нажмите Ctrl+C чтобы остановить сервер
echo.

REM Запускаем сервер
python -m http.server 8000

pause
