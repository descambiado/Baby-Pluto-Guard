# Changelog

All notable changes to Baby Pluto Guard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-02-15 🎉

### 🎊 First Stable Release!

**Baby Pluto Guard v1.0** is officially stable and ready for production use by cybersecurity students and enthusiasts worldwide.

### Added
- 📚 Complete professional documentation
  - Comprehensive README with installation guides, screenshots, and learning resources
  - CHANGELOG documenting all versions and changes
  - Architecture overview and technical deep-dive
- 🐶 Official Baby Pluto Guard logo and branding
  - Logo integration across application (sidebar, favicon, meta tags)
  - Enhanced SEO with proper meta descriptions and Open Graph tags
  - Professional favicon and social media preview images
- ✅ Production-ready codebase
  - Error handling improvements
  - Code cleanup and optimization
  - Performance enhancements
- 🎓 Educational focus throughout the application
  - Clear explanations of security concepts
  - Links to learning resources
  - Student-friendly interface and documentation

### Changed
- Updated sidebar with logo and improved branding
- Enhanced HTML meta tags for better SEO and social sharing
- Improved overall user experience and polish

### Fixed
- React-is dependency issue for Recharts
- Various UI/UX polish improvements

---

## [0.6.0] - 2025-02-10

### 📊 Major UI/UX Improvements with Charts

This release transforms Baby Pluto Guard with rich data visualizations and improved user experience.

### Added
- 📊 **Recharts Integration**
  - `TrendChart` component for temporal data (CPU usage, network activity)
  - `DistributionChart` component for risk level distribution
  - `BarComparisonChart` component for baseline vs. current comparisons
- 🎨 **Activity Timeline**
  - Visual timeline of security events and scan results
  - Color-coded by event type (scan, alert, baseline)
  - Real-time updates
- 🔍 **Enhanced Filtering**
  - Global `SearchInput` component with debouncing
  - Risk level filtering (All, Safe, Low, Medium, High)
  - Combined search + filter functionality across modules
- 📈 **Dashboard Improvements**
  - Integrated `ActivityTimeline` for recent events
  - `BarComparisonChart` comparing current state vs. baseline
  - More intuitive metric cards with visual indicators
- 🎨 **Process Monitor Enhancements**
  - CPU usage trend chart over time (mock data for now)
  - Search and filter processes by name and risk level
  - Improved table layout with better responsive design
- 🎨 **Design System Expansion**
  - New security risk color tokens (`--security-safe`, `--security-low`, `--security-medium`, `--security-high`)
  - Chart-specific color palette (`--chart-1` through `--chart-5`)
  - Consistent theming across all visualizations

### Changed
- Updated `SecurityMetrics` component with integrated charts
- Improved responsive design for smaller screens
- Better color contrast and accessibility

### Fixed
- 🐛 React-is dependency warning for Recharts
- Layout issues on mobile devices
- Search input styling and consistency

---

## [0.5.0] - 2025-02-05

### 🔄 Baseline System Implementation

This release introduces the powerful baseline comparison system - a cornerstone feature for security monitoring.

### Added
- ✨ **Baseline Management System**
  - Create baseline snapshots of system state (processes, ports, startup items, file integrity)
  - SQLite database for persistent baseline storage
  - Activate/deactivate baselines
  - Delete old baselines
  - List all saved baselines with metadata
- ✨ **Baseline Comparison Engine**
  - Compare current system state against active baseline
  - Automatic risk scoring based on deviations
  - Detailed diff tracking:
    - New processes/ports/files since baseline
    - Removed items from baseline
    - Changed items (e.g., modified files)
  - Threshold-based alerting
- 📊 **Baseline UI Components**
  - `BaselineCard` for managing individual baselines
  - `ComparisonResults` for visualizing differences
  - Baseline management page (`/baseline`)
  - Visual indicators for baseline status (active/inactive)
- 🔒 **Backend Baseline Module** (`backend/security/baseline.py`)
  - `BaselineManager` class with full CRUD operations
  - Automatic timestamp tracking
  - Risk calculation algorithms
  - Comprehensive comparison logic

### Changed
- Enhanced dashboard to show baseline comparison when available
- Updated navigation to include "System Baseline" link
- Improved data structures to support baseline metadata

### Technical Details
- Baseline storage: SQLite database (`baselines.db`)
- Baseline schema: timestamp, name, description, system_info (JSON)
- Comparison output: detailed diffs with risk scores

---

## [0.4.0] - 2025-02-01

### 🔗 Real Frontend-Backend Integration

This release connects the React frontend to the Python backend, enabling real-time security monitoring.

### Added
- 🔗 **React Query Integration**
  - `@tanstack/react-query` for efficient data fetching and caching
  - Automatic background refetching every 5 seconds
  - Loading and error states
  - Query invalidation on user actions
- 🔗 **Custom API Hooks** (`src/hooks/useSecurityAPI.ts`)
  - `useProcesses()` - Fetch and monitor running processes
  - `usePorts()` - Network port scanning data
  - `useStartupItems()` - Startup programs analysis
  - `useFileIntegrity()` - File integrity monitoring
  - `useSystemInfo()` - General system information
  - `useQuickScan()` - Trigger quick security scans
  - `useFullScan()` - Trigger comprehensive scans
- 🌐 **Connection Status Component**
  - Real-time backend health monitoring
  - Visual indicator (green/red) for API availability
  - Automatic reconnection attempts
  - User-friendly error messages
- ⚙️ **Environment Configuration**
  - `.env` file for API URL configuration
  - Default: `VITE_API_URL=http://localhost:8000`
  - Easy switching between development and production

### Changed
- **All pages now fetch real data from backend:**
  - `Dashboard.tsx` - Real metrics and alerts
  - `ProcessMonitor.tsx` - Live process list
  - `NetworkSecurity.tsx` - Actual port scan results
  - `StartupItems.tsx` - Real startup program analysis
  - `FileIntegrity.tsx` - Actual file hash checking
- Removed mock data generators (kept as fallback for demo mode)
- Updated UI to handle loading and error states gracefully

### Fixed
- 🐛 Loading states displaying properly across all modules
- 🐛 Error handling when backend is unavailable
- 🐛 Data refresh intervals optimized to avoid overwhelming the API
- 🐛 Race conditions in concurrent API requests

### Technical Details
- React Query cache time: 30 seconds
- Refetch interval: 5 seconds (configurable)
- Retry logic: 3 attempts with exponential backoff
- Error boundaries for graceful degradation

---

## [0.3.0] - 2025-01-25

### 🎨 Frontend Foundation & UI Components

This release establishes the complete frontend interface with all security modules and navigation.

### Added
- 🎨 **Dashboard Page** (`src/pages/Dashboard.tsx`)
  - Security metrics overview (processes, ports, alerts, files monitored)
  - Recent alerts list with severity indicators
  - Visual metric cards with icons
  - Quick navigation to detailed views
- 🖥️ **Process Monitor Page** (`src/pages/ProcessMonitor.tsx`)
  - Sortable process table (PID, name, user, CPU, memory)
  - Risk level badges (Safe, Low, Medium, High)
  - Process count and high-risk indicators
  - Responsive table design
- 🌐 **Network Security Page** (`src/pages/NetworkSecurity.tsx`)
  - Open ports table with service detection
  - Connection state monitoring (LISTEN, ESTABLISHED)
  - Protocol information (TCP/UDP)
  - Risk analysis for ports
- 🚀 **Startup Items Page** (`src/pages/StartupItems.tsx`)
  - Autorun programs listing
  - Registry locations (Windows) / systemd units (Linux)
  - Risk assessment for startup items
  - Disable/enable functionality (mock for now)
- 🔒 **File Integrity Page** (`src/pages/FileIntegrity.tsx`)
  - File hash monitoring table
  - SHA-256 hash display
  - Change detection (modified indicator)
  - Path and timestamp information
- 📊 **Reports Page** (`src/pages/Reports.tsx`)
  - Placeholder for future report generation
  - Export functionality planning
- 🧭 **Navigation System**
  - `SecuritySidebar` with collapsible menu
  - Icons for each module (lucide-react)
  - Active route highlighting
  - Settings and tools section
- 🌙 **Dark Mode Support**
  - Consistent theming across all pages
  - Dark-optimized color palette
  - Smooth transitions between themes
- 🎨 **Design System**
  - Comprehensive Tailwind CSS configuration
  - HSL color tokens for theming
  - Shadcn UI component library integration
  - Responsive design utilities

### Technical Details
- Component architecture: Page components + UI components + Layout components
- Routing: React Router v6 with nested routes
- Styling: Tailwind CSS + CSS variables for theming
- Icons: lucide-react library
- Mock data: Temporary data generators for development

---

## [0.2.0] - 2025-01-20

### 🔒 Core Security Modules Implementation

This release implements all core backend security scanning modules.

### Added
- 🔒 **Process Monitor** (`backend/security/processes.py`)
  - Enumerate all running processes using psutil
  - Extract PID, name, user, CPU usage, memory usage
  - Risk analysis based on process characteristics:
    - System-critical processes marked as safe
    - Unsigned executables marked as medium risk
    - Processes running as admin/root flagged
  - Cross-platform support (Windows & Linux)
- 🌐 **Port Scanner** (`backend/security/ports.py`)
  - Scan all listening ports and network connections
  - Identify port numbers, protocols (TCP/UDP), and connection states
  - Service detection (HTTP, SSH, FTP, etc.)
  - Risk evaluation:
    - Common services (80, 443) marked as safe
    - Unusual high ports flagged as suspicious
    - Administrative ports (22, 3389) marked as medium risk
  - Connection state tracking (LISTEN, ESTABLISHED, TIME_WAIT, etc.)
- 🚀 **Startup Items Analyzer** (`backend/security/startup.py`)
  - **Windows**: Query Registry Run keys
    - HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
    - HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run
  - **Linux**: Parse systemd unit files and rc.local
  - Risk assessment:
    - Known safe programs (Microsoft, antivirus) marked as safe
    - Unknown executables in suspicious locations flagged
    - Programs in temp directories marked as high risk
- 🔐 **File Integrity Monitor** (`backend/security/integrity.py`)
  - Calculate SHA-256 hashes for critical system files
  - Monitor predefined file paths:
    - Windows: System32, drivers, hosts file
    - Linux: /etc, /bin, /usr/bin
  - Detect changes by comparing hashes against baseline
  - Risk scoring:
    - Unchanged files marked as safe
    - Modified files flagged as high risk
  - Timestamp tracking for last modification
- 🧠 **Risk Analysis Engine** (`backend/security/analyzer.py`)
  - Centralized risk calculation logic
  - Risk levels: SAFE, LOW, MEDIUM, HIGH
  - Scoring algorithms for each module
  - Aggregated system risk score
  - Threshold-based alerting

### Changed
- Refactored backend structure for better modularity
- Each security module in separate file for maintainability
- Improved error handling and logging

### Technical Details
- Dependencies: psutil, winreg (Windows), subprocess (Linux)
- Hash algorithm: SHA-256
- Risk calculation: Weighted scoring based on multiple factors

---

## [0.1.0] - 2025-01-15

### 🎉 Initial Project Structure

The foundation of Baby Pluto Guard is laid with a complete project skeleton.

### Added
- ⚡ **Frontend Setup**
  - Vite + React 18 + TypeScript
  - Tailwind CSS configuration
  - Shadcn UI component library integration
  - React Router for navigation
  - ESLint and Prettier configuration
- 🐍 **Backend Setup**
  - FastAPI framework with Python 3.8+
  - Uvicorn ASGI server
  - CORS middleware for frontend communication
  - Project structure:
    ```
    backend/
    ├── main.py           # FastAPI app entry point
    ├── requirements.txt  # Python dependencies
    ├── security/         # Security modules directory
    │   ├── __init__.py
    │   ├── processes.py
    │   ├── ports.py
    │   ├── startup.py
    │   ├── integrity.py
    │   └── analyzer.py
    └── .env.example      # Environment variables template
    ```
- 📡 **API Endpoints** (stubs)
  - `GET /api/system/info` - System information
  - `GET /api/scan/quick` - Quick security scan
  - `GET /api/scan/full` - Comprehensive scan
  - `GET /api/processes` - Running processes
  - `GET /api/ports` - Open ports
  - `GET /api/startup` - Startup items
  - `GET /api/integrity` - File integrity
- 📝 **Documentation**
  - Backend README with setup instructions
  - Frontend README with development guide
  - Environment configuration examples
- 🔧 **Development Tools**
  - Hot reload for frontend (Vite HMR)
  - Auto-reload for backend (Uvicorn --reload)
  - TypeScript strict mode
  - Python type hints

### Dependencies Installed
- **Frontend**: react, react-dom, react-router-dom, tailwindcss, @tanstack/react-query, lucide-react
- **Backend**: fastapi, uvicorn, psutil, pydantic

---

## [0.0.1] - 2025-01-10

### 🌱 Project Inception

- Initial repository creation
- Project planning and architecture design
- Technology stack selection
- Development environment setup

---

## Upcoming Features

See our [Roadmap](README.md#-roadmap) for planned features and future versions.

---

## Legend

- ✨ New feature
- 🔗 Integration
- 📊 Data visualization
- 🎨 UI/UX improvement
- 🐛 Bug fix
- 🔒 Security enhancement
- 📚 Documentation
- ⚡ Performance improvement
- 🔧 Configuration
- 🎉 Major milestone

---

**For detailed technical changes, see individual commit messages on [GitHub](https://github.com/YOUR_USERNAME/baby-pluto-guard/commits).**
