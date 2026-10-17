@echo off
rem Instalador de Four Fangs of Dawn (se ejecuta al abrir el Setup).
rem Copia el juego a tu carpeta de usuario, crea accesos directos y lo abre. No necesita permisos de administrador.
setlocal
set "DEST=%LOCALAPPDATA%\Programs\Four Fangs of Dawn"
set "SRC=%~dp0"

taskkill /f /im FourFangsOfDawn.exe >nul 2>&1
if not exist "%DEST%" mkdir "%DEST%"
copy /y "%SRC%FourFangsOfDawn.exe" "%DEST%\FourFangsOfDawn.exe" >nul
if errorlevel 1 (
  echo  No se pudo copiar el juego. Cierra el juego si estaba abierto y vuelve a intentarlo.
  pause
  exit /b 1
)
copy /y "%SRC%vampiro.ico" "%DEST%\vampiro.ico" >nul 2>&1
copy /y "%SRC%Desinstalar.cmd" "%DEST%\Desinstalar.cmd" >nul 2>&1

rem Accesos directos: escritorio y menu Inicio
powershell -NoProfile -ExecutionPolicy Bypass -File "%SRC%crear-accesos.ps1"

rem (Si Windows pregunta por el firewall, hay que permitir el acceso en redes privadas para jugar con amigos.)
start "" "%DEST%\FourFangsOfDawn.exe"
endlocal
exit /b 0
