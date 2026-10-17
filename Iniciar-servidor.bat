@echo off
chcp 65001 >nul
title Four Fangs of Dawn - servidor
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo No se ha encontrado Node.js en este equipo.
  echo Intentando instalarlo con winget ^(Windows 11 lo trae incluido^)...
  winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  echo.
  echo Cuando termine, CIERRA esta ventana y vuelve a abrir Iniciar-servidor.bat
  pause
  exit /b
)

if not exist node_modules (
  echo Instalando dependencias ^(solo la primera vez; necesita internet^)...
  call npm install --omit=dev
)

echo.
echo Abriendo el juego en el navegador...
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000"
echo Para jugar desde otros equipos de la misma red, usa la direccion "En la red local" que aparece abajo.
echo Deja esta ventana abierta mientras jugais. Cierrala para parar el servidor.
echo.
node server\index.js
pause
