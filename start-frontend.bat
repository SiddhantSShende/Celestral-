@echo off
echo ========================================
echo   Starting Celestral Frontend Server
echo ========================================
echo.

echo Starting frontend on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start Python HTTP server
python -m http.server 3000
