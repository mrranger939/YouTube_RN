echo %~dp0

start "Backend" cmd.exe /k "cd /d "%~dp0backend\" && start.bat"