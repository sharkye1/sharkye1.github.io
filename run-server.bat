@echo off
REM Запуск локального сервера для тестирования
REM Откройся на http://localhost:8000

cd /d %~dp0

echo.
echo ========================================
echo   Question Bank - Local Server
echo ========================================
echo.
echo Открываю http://localhost:8000
echo.
echo Для выхода нажми Ctrl+C
echo.

start http://localhost:8000

python -m http.server 8000
