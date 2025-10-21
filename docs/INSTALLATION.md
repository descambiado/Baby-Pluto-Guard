# 📦 Installation Guide - Baby Pluto Guard

This guide will help you install and set up Baby Pluto Guard on your system.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Installation (Recommended)](#quick-installation-recommended)
- [Manual Installation](#manual-installation)
- [Troubleshooting](#troubleshooting)
- [Verification](#verification)

---

## Prerequisites

### Required Software

#### Python 3.8+
Baby Pluto Guard requires Python 3.8 or higher for the backend security scanner.

**Windows:**
1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run the installer
3. ⚠️ **IMPORTANT:** Check "Add Python to PATH" during installation
4. Verify installation:
```cmd
python --version
```

**Linux (Ubuntu/Debian):**
```bash
# Python usually comes pre-installed
python3 --version

# If not installed:
sudo apt update
sudo apt install python3 python3-venv python3-pip
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install python3 python3-pip
```

#### Node.js 18+
The frontend requires Node.js for the React development environment.

**Windows:**
1. Download Node.js LTS from [nodejs.org](https://nodejs.org/)
2. Run the installer (includes npm automatically)
3. Verify installation:
```cmd
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository for latest version
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install nodejs npm
```

### Optional Software

#### Git
For cloning the repository (recommended):
- **Windows:** [Git for Windows](https://git-scm.com/download/win)
- **Linux:** `sudo apt install git` or `sudo dnf install git`

---

## Quick Installation (Recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/baby-pluto-guard.git
cd baby-pluto-guard
```

Or download and extract the ZIP file from GitHub.

### Step 2: Run Setup Script

#### 🪟 Windows

```cmd
setup.bat
```

The setup script will:
- ✅ Verify Python and Node.js installation
- ✅ Create Python virtual environment
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies
- ✅ Create `.env` configuration file
- ✅ Prepare the project for first run

#### 🐧 Linux / macOS

```bash
chmod +x setup.sh
./setup.sh
```

### Step 3: Start Baby Pluto Guard

#### 🪟 Windows

```cmd
run.bat
```

This will open two terminal windows:
1. Backend (FastAPI server)
2. Frontend (Vite dev server)

#### 🐧 Linux / macOS

```bash
chmod +x run.sh
./run.sh
```

Press `Ctrl+C` to stop both services.

### Step 4: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

---

## Manual Installation

If the automated scripts don't work for your system, follow these manual steps:

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. **Test backend:**
```bash
python main.py
# Should start on http://localhost:8000
```

### Frontend Setup

1. **Navigate to project root:**
```bash
cd ..  # If you're still in backend/
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
# Create .env in project root
echo "VITE_API_URL=http://localhost:8000" > .env
```

4. **Test frontend:**
```bash
npm run dev
# Should start on http://localhost:5173
```

---

## Troubleshooting

### Common Issues

#### ❌ "Python is not recognized"
**Problem:** Python is not in PATH  
**Solution:**
- **Windows:** Reinstall Python and check "Add Python to PATH"
- **Linux:** Use `python3` instead of `python`

#### ❌ "pip is not recognized"
**Problem:** pip is not installed  
**Solution:**
```bash
# Windows
python -m ensurepip --upgrade

# Linux
sudo apt install python3-pip
```

#### ❌ "Cannot find module 'vite'"
**Problem:** Frontend dependencies not installed  
**Solution:**
```bash
npm install
```

#### ❌ "Port 8000 already in use"
**Problem:** Another process is using port 8000  
**Solution:**

**Windows:**
```cmd
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Linux:**
```bash
# Find and kill process
sudo lsof -ti:8000 | xargs kill -9
```

#### ❌ "Connection refused" in frontend
**Problem:** Backend is not running  
**Solution:**
1. Make sure backend is running on http://localhost:8000
2. Check backend terminal for errors
3. Verify `.env` file has correct `VITE_API_URL`

#### ❌ "Permission denied" on Linux
**Problem:** Script files are not executable  
**Solution:**
```bash
chmod +x setup.sh
chmod +x run.sh
```

#### ❌ "ModuleNotFoundError: No module named 'psutil'"
**Problem:** Virtual environment not activated  
**Solution:**
```bash
# Make sure you're in backend/ directory
cd backend

# Activate venv
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate  # Windows

# Verify activation (should show venv path)
which python  # Linux/macOS
where python  # Windows
```

### Windows-Specific Issues

#### pywin32 Installation Fails
Some Windows features require `pywin32`. If installation fails:
```cmd
pip install --upgrade pywin32
python venv\Scripts\pywin32_postinstall.py -install
```

### Linux-Specific Issues

#### Permission Denied for Port Scanning
Some network features require elevated privileges:
```bash
# Run with sudo if needed (not recommended for development)
sudo python3 main.py
```

⚠️ **Security Note:** Running as root/sudo is not recommended. Consider using capabilities instead:
```bash
sudo setcap cap_net_raw,cap_net_admin=eip $(which python3)
```

---

## Verification

### Verify Backend
```bash
curl http://localhost:8000/api/health
# Should return: {"status": "healthy"}
```

### Verify Frontend
Open http://localhost:5173 in your browser. You should see:
- Baby Pluto Guard logo
- Dashboard with security metrics
- Sidebar navigation

### Verify Full Integration
1. Navigate to "Process Monitor" page
2. You should see a list of running processes
3. If you see real data, everything is working! ✅

---

## Next Steps

✅ Installation complete! Now you can:
1. Read the [User Guide](USER_GUIDE.md) to learn how to use Baby Pluto Guard
2. Explore the [Architecture](ARCHITECTURE.md) to understand how it works
3. Check out the security scanning features
4. Create your first baseline for comparison

---

## Uninstallation

### Remove Project Files
```bash
# Simply delete the project directory
rm -rf baby-pluto-guard/  # Linux/macOS
# OR manually delete folder on Windows
```

### Remove Python Virtual Environment
Already removed with the project directory.

### Keep Python and Node.js
Python and Node.js are system-wide installations and can be used for other projects. Only uninstall if you're sure you don't need them.

---

## Getting Help

- 📖 [User Guide](USER_GUIDE.md)
- 🏗️ [Architecture Documentation](ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/YOUR_USERNAME/baby-pluto-guard/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/baby-pluto-guard/discussions)

---

**Made with 💙 for cybersecurity students**
