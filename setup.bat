@echo off
echo.
echo ==========================================
echo   🐶 Baby Pluto Guard - Setup Script
echo ==========================================
echo.

REM Check Python installation
echo 🔍 Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Python %PYTHON_VERSION% found
echo.

REM Check Node.js installation
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

echo ==========================================
echo   📦 Setting up Backend...
echo ==========================================
echo.

REM Create virtual environment
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
    echo ✅ Virtual environment created
) else (
    echo ⚠️  Virtual environment already exists
)

REM Install backend dependencies
echo Installing Python dependencies...
cd backend
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..
echo ✅ Backend dependencies installed
echo.

echo ==========================================
echo   📦 Setting up Frontend...
echo ==========================================
echo.

REM Install frontend dependencies
echo Installing Node.js dependencies...
call npm install
echo ✅ Frontend dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    (
        echo # Baby Pluto Guard Environment Configuration
        echo VITE_API_URL=http://localhost:8000
    ) > .env
    echo ✅ .env file created
) else (
    echo ⚠️  .env file already exists
)

echo.
echo ==========================================
echo   ✨ Setup Complete!
echo ==========================================
echo.
echo To start Baby Pluto Guard, run:
echo   run.bat
echo.
echo Or manually:
echo   Terminal 1: cd backend ^&^& venv\Scripts\activate ^&^& python main.py
echo   Terminal 2: npm run dev
echo.
pause
