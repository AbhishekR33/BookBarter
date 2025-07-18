@echo off
echo Starting BookBarter Application...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
