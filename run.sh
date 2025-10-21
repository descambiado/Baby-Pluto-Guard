#!/bin/bash

echo "🐶 Starting Baby Pluto Guard..."
echo "================================"
echo ""

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found!"
    echo "Please run ./setup.sh first"
    exit 1
fi

# Start backend in background
echo "🔧 Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting Frontend (Vite + React)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✅ Baby Pluto Guard is running!"
echo "================================"
echo ""
echo "📡 Backend:  http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '🛑 Baby Pluto Guard stopped'; exit" INT

# Keep script running
wait
