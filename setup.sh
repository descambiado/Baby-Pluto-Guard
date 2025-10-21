#!/bin/bash

echo "🐶 Baby Pluto Guard - Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python version
echo "🔍 Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed!${NC}"
    echo "Please install Python 3.8 or higher from https://www.python.org/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✅ Python $PYTHON_VERSION found${NC}"

# Check if Python version is 3.8+
REQUIRED_VERSION="3.8"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}❌ Python 3.8+ is required (found $PYTHON_VERSION)${NC}"
    exit 1
fi

# Check Node.js version
echo "🔍 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version 2>&1 | sed 's/v//')
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"

# Check if Node version is 18+
REQUIRED_NODE="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
    echo -e "${YELLOW}⚠️  Node.js 18+ is recommended (found $NODE_VERSION)${NC}"
fi

echo ""
echo "📦 Setting up Backend..."
echo "------------------------"

# Create virtual environment
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    echo -e "${GREEN}✅ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠️  Virtual environment already exists${NC}"
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo "📦 Setting up Frontend..."
echo "-------------------------"

# Install frontend dependencies
echo "Installing Node.js dependencies..."
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# Baby Pluto Guard Environment Configuration
VITE_API_URL=http://localhost:8000
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# Make run.sh executable
chmod +x run.sh
echo -e "${GREEN}✅ Made run.sh executable${NC}"

echo ""
echo "===================================="
echo "✨ Setup Complete!"
echo "===================================="
echo ""
echo "To start Baby Pluto Guard, run:"
echo -e "${GREEN}  ./run.sh${NC}"
echo ""
echo "Or manually:"
echo "  Terminal 1: cd backend && source venv/bin/activate && python3 main.py"
echo "  Terminal 2: npm run dev"
echo ""
