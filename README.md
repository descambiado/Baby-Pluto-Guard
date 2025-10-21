<div align="center">
  <img src="public/logo.png" alt="Baby Pluto Guard Logo" width="150" />
  
  # 🐶 Baby Pluto Guard
  
  **Open-Source Security Scanner & Network Monitoring Tool for Cybersecurity Students**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Python 3.8+](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)
  [![Node.js 18+](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
  [![Platform: Windows | Linux](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey.svg)]()
  
  *Learn cybersecurity fundamentals by monitoring your system in real-time*
  
  [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Screenshots](#-screenshots) • [Contributing](#-contributing)
  
</div>

---

## 📖 About

**Baby Pluto Guard** is a powerful, educational security scanner designed for cybersecurity students and enthusiasts. It provides real-time monitoring of system processes, network connections, startup items, and file integrity - helping you understand how security monitoring works from the ground up.

### 🎓 Educational Focus

This tool is built specifically for learning:
- **Understand System Behavior**: See exactly what's running on your system
- **Network Security Fundamentals**: Learn about ports, connections, and network monitoring
- **Baseline Comparison**: Understand how security professionals establish and compare system baselines
- **Risk Analysis**: Learn how different security indicators are evaluated
- **Hands-On Experience**: Practice with a real security tool, not just theory

### 🌟 Perfect For

- 🎓 Cybersecurity students learning network security
- 🔍 Security enthusiasts wanting hands-on experience
- 💻 System administrators monitoring their home lab
- 📚 Educators teaching security concepts
- 🏠 Anyone curious about what's running on their computer

---

## ✨ Features

### 🖥️ **Process Monitor**
- Real-time process tracking with PID, name, user, and CPU/memory usage
- Risk analysis based on process behavior
- Search and filter by risk level
- CPU usage trends over time

### 🌐 **Network Security Scanner**
- Port scanning and network connection monitoring
- Identify open ports and listening services
- Connection state tracking (LISTEN, ESTABLISHED, etc.)
- Risk assessment for unusual ports

### 🚀 **Startup Items Analysis**
- Windows Registry and Linux systemd analysis
- Identify programs that run on system boot
- Risk evaluation for suspicious startup items
- Autorun locations monitoring

### 🔒 **File Integrity Monitoring**
- SHA-256 hash-based integrity checking
- Monitor critical system files for changes
- Detect unauthorized modifications
- Baseline comparison for file states

### 📊 **System Baseline Management**
- Create snapshots of your system's normal state
- Compare current state vs. baseline to detect anomalies
- Visual comparison charts and risk scoring
- Multiple baseline support with activation/switching

### 📈 **Rich Visualizations**
- Interactive charts with Recharts
- Trend analysis and distribution graphs
- Activity timeline of security events
- Real-time metrics dashboard

### 🎨 **Modern UI/UX**
- Dark mode support
- Responsive design
- Real-time data refresh
- Clean, professional interface built with React + Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Administrator/Root privileges** (required for system monitoring)

### Installation

#### 🪟 Windows

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/baby-pluto-guard.git
cd baby-pluto-guard

# 2. Setup Backend (Command Prompt as Administrator)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 3. Start Backend
python main.py

# 4. Setup Frontend (new terminal)
cd ..
npm install

# 5. Start Frontend
npm run dev

# 6. Open your browser
# http://localhost:5173
```

#### 🐧 Linux

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/baby-pluto-guard.git
cd baby-pluto-guard

# 2. Setup Backend (with sudo)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Start Backend (requires root for full monitoring)
sudo python3 main.py

# 4. Setup Frontend (new terminal)
cd ..
npm install

# 5. Start Frontend
npm run dev

# 6. Open your browser
# http://localhost:5173
```

### ⚡ Quick Run Scripts (Coming Soon)

We're working on one-command startup scripts:
```bash
# Windows
run.bat

# Linux
./run.sh
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (React + Vite)             │
│  - Modern UI with Tailwind CSS              │
│  - Real-time data visualization (Recharts)  │
│  - React Query for state management         │
└─────────────────┬───────────────────────────┘
                  │ HTTP API (REST)
                  ▼
┌─────────────────────────────────────────────┐
│      Backend (Python + FastAPI)             │
│  - Security scanning modules                │
│  - Risk analysis engine                     │
│  - Baseline management (SQLite)             │
└─────────────────┬───────────────────────────┘
                  │ System Calls
                  ▼
┌─────────────────────────────────────────────┐
│   Operating System (Windows/Linux)          │
│  - psutil (process/network info)            │
│  - Windows Registry / systemd               │
│  - File system monitoring                   │
└─────────────────────────────────────────────┘
```

---

## 📸 Screenshots

### 🎛️ Dashboard
*Real-time security metrics with visual charts and activity timeline*

### 📊 Process Monitor
*Monitor all running processes with risk analysis and CPU trends*

### 🌐 Network Security
*View open ports, active connections, and network security status*

### 🔄 Baseline Comparison
*Compare your current system state against established baselines*

---

## 📚 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup instructions for Windows and Linux
- **[User Guide](docs/USER_GUIDE.md)** - How to use each module effectively
- **[Architecture Overview](docs/ARCHITECTURE.md)** - Technical deep-dive into the system
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](SECURITY.md)** - Responsible disclosure and security considerations

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful component library
- **Recharts** - Data visualization
- **React Query** - Server state management
- **React Router** - Client-side routing

### Backend
- **Python 3.8+** - Core language
- **FastAPI** - High-performance API framework
- **psutil** - System and process utilities
- **SQLite** - Baseline storage
- **pydantic** - Data validation

---

## 🗺️ Roadmap

### v1.0 ✅ (Current)
- ✅ Process monitoring
- ✅ Port scanning
- ✅ Startup items analysis
- ✅ File integrity checking
- ✅ Baseline system
- ✅ Rich UI with charts

### v1.1 (Planned)
- [ ] PDF report generation
- [ ] Email alerts for critical events
- [ ] Scheduled scans
- [ ] Export/import baselines

### v1.2 (Future)
- [ ] Machine learning anomaly detection
- [ ] Multi-system monitoring
- [ ] REST API for integrations
- [ ] Plugin system

### v2.0 (Vision)
- [ ] Docker container support
- [ ] Electron desktop app (all-in-one executable)
- [ ] Cloud backup of baselines
- [ ] Community threat intelligence feed

---

## 🤝 Contributing

We welcome contributions from the cybersecurity community! Whether you're fixing bugs, adding features, or improving documentation - your help makes Baby Pluto Guard better for everyone.

**Ways to contribute:**
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the project!

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🎓 Learning Resources

Want to learn more about cybersecurity? Check out these resources:

### 📚 Recommended Reading
- [The Cybersecurity Body of Knowledge](https://www.cybok.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Reading Room](https://www.sans.org/reading-room/)

### 🎬 Video Courses
- [Cybrary - Free Cybersecurity Training](https://www.cybrary.it/)
- [NetworkChuck - Networking & Security](https://www.youtube.com/@NetworkChuck)

### 🏆 Certifications
- **CompTIA Security+** - Entry-level security certification
- **CEH** (Certified Ethical Hacker) - Intermediate penetration testing
- **OSCP** - Advanced hands-on pentesting

### 💬 Communities
- [r/cybersecurity](https://reddit.com/r/cybersecurity)
- [r/netsec](https://reddit.com/r/netsec)
- [InfoSec Twitter Community](https://twitter.com/search?q=%23infosec)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Free to use, modify, and distribute
```

---

## 🙏 Acknowledgments

- **Built with love by [@Descambiado](https://github.com/Descambiado)** - Cybersecurity student sharing knowledge
- **Powered by open-source tools** - FastAPI, React, psutil, and many more
- **For the community** - Made by students, for students

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/baby-pluto-guard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/baby-pluto-guard/discussions)
- **Twitter**: [@descambiado](https://twitter.com/descambiado)

---

## ⚠️ Disclaimer

**Baby Pluto Guard is an educational tool.** 

- Use it responsibly and only on systems you own or have permission to monitor
- This tool is designed for learning and should not be used for malicious purposes
- Always follow your country's laws and regulations regarding security testing
- The authors are not responsible for misuse of this software

---

<div align="center">
  
  **🐶 Happy Security Monitoring! 🐶**
  
  If you find Baby Pluto Guard useful, please ⭐ star the repo!
  
  Made with 💙 for cybersecurity students worldwide
  
</div>
