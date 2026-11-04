@echo off
title DrGodly Web Studio Launcher
echo ========================================================
echo   Starting DrGodly Next.js Healthcare Workstation...
echo   Port: http://localhost:4000
echo ========================================================
cd /d "%~dp0"
start http://localhost:4000/en/screens
npm run dev
pause
