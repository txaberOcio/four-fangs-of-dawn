@echo off
rem Instalador de Four Fangs of Dawn (se ejecuta al abrir el Setup, o a mano desde la carpeta del proyecto).
rem Copia el juego a tu carpeta de usuario, crea accesos directos y lo abre. No necesita permisos de administrador.
setlocal
set "DEST=%LOCALAPPDATA%\Programs\Four Fangs of Dawn"
set "HERE=%~dp0"
set "SRC=%HERE%"
set "ICO=%HERE%vampiro.ico"
rem Si se ejecuta desde la carpeta del proyecto (installer\), el juego esta en dist\ y el icono en public\
if not exist "%SRC%FourFangsOfDawn.exe" if exist "%HERE%..\dist\FourFangsOfDawn.exe" set "SRC=%HERE%..\dist\"
if not exist "%ICO%" if exist "%HERE%..\public\vampiro.ico" set "ICO=%HERE%..\public\vampiro.ico"
if not exist "%SRC%FourFangsOfDawn.exe" (
  echo.
  echo  No encuentro FourFangsOfDawn.exe. Genera el juego primero con:  npm run build:exe
  echo  o usa el instalador FourFangsOfDawn-Setup.exe de la carpeta dist.
  echo.
  pause
  exit /b 1
)

echo.
echo  FOUR FANGS OF DAWN - instalando...
taskkill /f /im FourFangsOfDawn.exe >nul 2>&1
if not exist "%DEST%" mkdir "%DEST%"
copy /y "%SRC%FourFangsOfDawn.exe" "%DEST%\FourFangsOfDawn.exe" >nul
if errorlevel 1 (
  echo  No se pudo copiar el juego. Cierra el juego si estaba abierto y vuelve a intentarlo.
  pause
  exit /b 1
)
copy /y "%ICO%" "%DEST%\vampiro.ico" >nul 2>&1
copy /y "%HERE%Desinstalar.cmd" "%DEST%\Desinstalar.cmd" >nul 2>&1

rem Accesos directos: escritorio y menu Inicio
powershell -NoProfile -ExecutionPolicy Bypass -File "%HERE%crear-accesos.ps1"

echo.
echo  Instalado en: %DEST%
echo  Accesos directos creados en el escritorio y en el menu Inicio. Se abre el juego...
echo  (Si Windows pregunta por el firewall, permite el acceso en redes privadas para jugar con amigos.)
start "" "%DEST%\FourFangsOfDawn.exe"
timeout /t 6 >nul
endlocal
exit /b 0
