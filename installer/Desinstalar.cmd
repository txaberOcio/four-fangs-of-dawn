@echo off
rem Desinstala Four Fangs of Dawn. Tus cuentas y partidas (en %APPDATA%\FourFangsOfDawn) NO se borran.
setlocal
echo.
echo  Desinstalando Four Fangs of Dawn...
taskkill /f /im FourFangsOfDawn.exe >nul 2>&1
del /q "%USERPROFILE%\Desktop\Four Fangs of Dawn.lnk" >nul 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -ErrorAction SilentlyContinue ([Environment]::GetFolderPath('Desktop') + '\Four Fangs of Dawn.lnk'), ([Environment]::GetFolderPath('Programs') + '\Four Fangs of Dawn.lnk'), ([Environment]::GetFolderPath('Programs') + '\Desinstalar Four Fangs of Dawn.lnk')"
rem la carpeta se borra desde fuera para poder borrar este mismo archivo
start "" /min cmd /c "ping 127.0.0.1 -n 3 >nul & rd /s /q "%~dp0""
echo  Listo. Tus partidas guardadas se han conservado en %APPDATA%\FourFangsOfDawn
timeout /t 3 >nul
endlocal
exit /b 0
