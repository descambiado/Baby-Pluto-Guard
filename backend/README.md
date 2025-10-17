# BabyPluto Backend - Python Security Scanner

## 🛡️ Overview

BabyPluto Backend is a cross-platform security scanner built with Python that provides real-time system monitoring and security analysis for Windows and Linux systems.

## 🚀 Features

- **Process Monitoring**: Real-time tracking of all system processes with CPU/Memory usage
- **Port Scanning**: Detection of open ports and active network connections
- **Startup Items Analysis**: Windows Registry and Linux systemd startup monitoring
- **File Integrity Checking**: SHA-256 hash verification of critical system files
- **Risk Analysis**: Automated threat detection and risk level assessment
- **REST API**: FastAPI-based API for frontend integration

## 📋 Requirements

- Python 3.8+
- Administrator/Root privileges (for full system access)

## 🔧 Installation

### Windows

```bash
# Clone the repository
git clone https://github.com/yourusername/babypluto.git
cd babypluto/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Linux

```bash
# Clone the repository
git clone https://github.com/yourusername/babypluto.git
cd babypluto/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 📦 Dependencies

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
psutil==6.1.0
pydantic==2.10.0
python-multipart==0.0.20
pywin32==308  # Windows only
```

## 🎯 Usage

### Start the API Server

```bash
# Development mode
python main.py

# Production mode with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### API Endpoints

#### System Information
```bash
GET /api/system/info
```

Returns basic system information including OS, version, architecture, and hostname.

#### Quick Scan
```bash
POST /api/scan/quick
```

Performs a quick security scan (processes + ports). Returns:
- List of running processes
- Open network ports
- Basic metrics

#### Full Scan
```bash
POST /api/scan/full
```

Performs a comprehensive security scan. Returns:
- All processes with risk analysis
- All open ports and connections
- Startup items (Windows Registry / Linux systemd)
- File integrity checks
- Security alerts
- Detailed metrics

### Example Usage

```python
import requests

# System info
response = requests.get('http://localhost:8000/api/system/info')
print(response.json())

# Quick scan
response = requests.post('http://localhost:8000/api/scan/quick')
scan_results = response.json()

# Full scan
response = requests.post('http://localhost:8000/api/scan/full')
full_results = response.json()
```

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── security/
│   ├── __init__.py
│   ├── processes.py        # Process monitoring (psutil)
│   ├── ports.py            # Port scanning (psutil)
│   ├── startup.py          # Startup items (winreg/systemd)
│   ├── integrity.py        # File integrity (SHA-256)
│   ├── network.py          # Network analysis
│   └── analyzer.py         # Risk analysis engine
├── models/
│   └── security_models.py  # Pydantic data models
└── utils/
    ├── platform_utils.py   # OS detection utilities
    └── permissions.py      # Permission validation
```

## 🔐 Security Modules

### 1. Process Monitor (`security/processes.py`)

Scans all running processes using `psutil` and analyzes:
- Process name, PID, username
- CPU and memory usage
- Command line arguments
- Creation time
- Risk level based on suspicious patterns

**Risk Detection:**
- Suspicious process names (miner, trojan, keylogger)
- High CPU usage (>80%)
- Unknown/hidden processes

### 2. Port Scanner (`security/ports.py`)

Detects open ports and active connections:
- Local/remote addresses and ports
- Connection status (LISTEN, ESTABLISHED, etc.)
- Associated process and PID
- Protocol (TCP/UDP)

**Risk Detection:**
- High-risk ports (1337, 4444, 5555, 31337)
- Unusual port bindings
- Unknown processes on network ports

### 3. Startup Items (`security/startup.py`)

**Windows:**
- Scans Registry keys:
  - `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
  - `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`

**Linux:**
- Scans autostart directories:
  - `~/.config/autostart`
  - `/etc/xdg/autostart`
- systemd services

**Risk Detection:**
- Suspicious names (crypto, miner, unknown)
- Unsigned or unverified publishers
- Recently added items

### 4. File Integrity (`security/integrity.py`)

Verifies critical system files using SHA-256 hashing:

**Windows:**
- `C:\Windows\System32\drivers\etc\hosts`
- `C:\Windows\System32\ntdll.dll`
- System32 core DLLs

**Linux:**
- `/etc/hosts`
- `/etc/passwd`
- `/etc/shadow`
- `/bin/bash`

**Detection:**
- Modified files (hash mismatch)
- Missing files
- New unexpected files

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Security Settings
ENABLE_CORS=True
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080

# Scan Settings
MAX_PROCESSES=1000
SCAN_TIMEOUT=30
LOG_LEVEL=INFO
```

### Critical Files Configuration

Edit `config.json`:

```json
{
  "critical_files": {
    "windows": [
      "C:\\Windows\\System32\\drivers\\etc\\hosts",
      "C:\\Windows\\System32\\ntdll.dll"
    ],
    "linux": [
      "/etc/hosts",
      "/etc/passwd",
      "/bin/bash"
    ]
  }
}
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=security tests/

# Run specific test
pytest tests/test_processes.py
```

## 📊 API Response Examples

### Quick Scan Response

```json
{
  "processes": [
    {
      "pid": 1234,
      "name": "chrome.exe",
      "username": "user",
      "cpu_percent": 2.5,
      "memory_percent": 5.2,
      "status": "running",
      "create_time": 1699000000,
      "cmdline": ["chrome.exe", "--flag"],
      "risk_level": "safe"
    }
  ],
  "ports": [
    {
      "local_address": "0.0.0.0",
      "local_port": 8080,
      "remote_address": null,
      "remote_port": null,
      "status": "LISTEN",
      "protocol": "tcp",
      "process_name": "python.exe",
      "pid": 5678,
      "risk_level": "safe"
    }
  ],
  "scan_type": "quick",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Full Scan Response

```json
{
  "processes": [...],
  "ports": [...],
  "startup_items": [
    {
      "name": "OneDrive",
      "path": "C:\\Program Files\\Microsoft OneDrive\\OneDrive.exe",
      "location": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "enabled": true,
      "publisher": "Microsoft Corporation",
      "risk_level": "safe"
    }
  ],
  "file_integrity": [
    {
      "file_path": "C:\\Windows\\System32\\drivers\\etc\\hosts",
      "current_hash": "sha256:abc123...",
      "expected_hash": "sha256:abc123...",
      "last_modified": 1699000000,
      "status": "safe",
      "risk_level": "safe"
    }
  ],
  "alerts": [
    {
      "id": "alert_001",
      "type": "process",
      "severity": "high",
      "title": "Suspicious Process Detected",
      "description": "Process 'miner.exe' exhibits suspicious behavior",
      "timestamp": 1699000000,
      "resolved": false
    }
  ],
  "metrics": {
    "total_processes": 156,
    "suspicious_processes": 2,
    "open_ports": 45,
    "high_risk_ports": 1,
    "startup_items": 23,
    "suspicious_startup": 0,
    "file_changes": 0,
    "alerts_count": {
      "safe": 0,
      "low": 3,
      "medium": 1,
      "high": 1
    },
    "last_scan": 1699000000
  },
  "scan_duration": 2500,
  "timestamp": "2024-01-15T10:30:00"
}
```

## 🔨 Building Executables

### Windows Executable (PyInstaller)

```bash
# Install PyInstaller
pip install pyinstaller

# Build executable
pyinstaller --onefile --name BabyPluto main.py

# With custom icon and additional files
pyinstaller --onefile \
  --name BabyPluto \
  --icon=icon.ico \
  --add-data "config.json;." \
  main.py
```

Output: `dist/BabyPluto.exe`

### Linux Binary

```bash
# Using PyInstaller
pyinstaller --onefile --name babypluto main.py

# Using Nuitka (better performance)
pip install nuitka
python -m nuitka --onefile --follow-imports main.py
```

### Creating Installers

**Windows (Inno Setup):**
```iss
[Setup]
AppName=BabyPluto Security Scanner
AppVersion=1.0
DefaultDirName={pf}\BabyPluto
DefaultGroupName=BabyPluto
OutputDir=installers
OutputBaseFilename=BabyPluto-Setup

[Files]
Source: "dist\BabyPluto.exe"; DestDir: "{app}"
Source: "config.json"; DestDir: "{app}"

[Icons]
Name: "{group}\BabyPluto"; Filename: "{app}\BabyPluto.exe"
```

**Linux (DEB package):**
```bash
# Using fpm
fpm -s dir -t deb -n babypluto -v 1.0.0 \
  --description "BabyPluto Security Scanner" \
  --license MIT \
  --maintainer "your@email.com" \
  dist/babypluto=/usr/bin/babypluto
```

## 🔒 Security Considerations

1. **Elevated Privileges**: Many scans require administrator/root access
2. **No Telemetry**: All data stays local, no external connections
3. **CORS Configuration**: Restrict allowed origins in production
4. **Rate Limiting**: Consider adding rate limits to API endpoints
5. **Logging**: Sensitive data is not logged by default
6. **Data Retention**: Scan results are not persisted (stateless)

## 🐛 Troubleshooting

### Permission Denied Errors

**Windows:**
```bash
# Run as Administrator
powershell -Command "Start-Process python -ArgumentList 'main.py' -Verb RunAs"
```

**Linux:**
```bash
# Run with sudo
sudo python3 main.py
```

### Missing Dependencies

```bash
# Reinstall all dependencies
pip install --force-reinstall -r requirements.txt
```

### Port Already in Use

```bash
# Change port in .env or command line
uvicorn main:app --port 8001
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please submit pull requests or open issues.

## 📧 Support

For issues and questions: [GitHub Issues](https://github.com/yourusername/babypluto/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Process monitoring
- Port scanning
- Startup items analysis
- File integrity checking
- REST API with FastAPI
- Windows and Linux support
