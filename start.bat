@echo off
title State and Effect Deck
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install || (echo npm install failed & pause & exit /b 1)
)
echo Starting deck at http://localhost:5173 ...
call npx vite --open
pause
