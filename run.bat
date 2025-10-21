@echo off
echo.
echo ======================================
echo   🐶 Starting Baby Pluto Guard...
echo ======================================
echo.

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo ❌ Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ Node modules not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Start backend in new window
echo 🔧 Starting Backend (FastAPI)...
start "Baby Pluto Guard - Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo 🎨 Starting Frontend (Vite + React)...
start "Baby Pluto Guard - Frontend" cmd /k "npm run dev"

echo.
echo ======================================
echo   ✅ Baby Pluto Guard is running!
echo ======================================
echo.
echo 📡 Backend:  http://localhost:8000
echo 🌐 Frontend: http://localhost:5173
echo.
echo Two windows have been opened:
echo   1. Backend (FastAPI Python server)
echo   2. Frontend (Vite React dev server)
echo.
echo Close both windows to stop the services.
echo.
pause
