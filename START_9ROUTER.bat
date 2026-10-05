@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   9Router Modified v0.5.95 // AI Infrastructure Proxy
echo ============================================================
start "" http://localhost:9900
node server.js
pause
