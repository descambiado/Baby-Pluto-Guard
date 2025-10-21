# 🏗️ Architecture Documentation - Baby Pluto Guard

This document provides a technical overview of Baby Pluto Guard's architecture, design decisions, and implementation details.

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Component Design](#component-design)
- [Data Flow](#data-flow)
- [Security Modules](#security-modules)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Performance Considerations](#performance-considerations)
- [Future Enhancements](#future-enhancements)

---

## System Overview

Baby Pluto Guard is a **client-server architecture** security monitoring application consisting of:

1. **Backend (Python):** FastAPI-based REST API that performs system security scans
2. **Frontend (React):** Modern web interface for visualization and interaction
3. **Data Layer:** SQLite database for baseline storage and persistence

### Design Philosophy

- **Educational First:** Clear, understandable code for learning
- **Cross-Platform:** Works on Windows and Linux
- **Lightweight:** Minimal dependencies, easy to deploy
- **Real-Time:** Live monitoring with automatic updates
- **Modular:** Easy to add new security scanning features

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                     http://localhost:5173                    │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      FRONTEND LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React + TypeScript + Vite               │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Pages     │  │  Components  │  │   Hooks    │  │   │
│  │  │ - Dashboard │  │ - Sidebar    │  │ - API      │  │   │
│  │  │ - Processes │  │ - Tables     │  │ - Query    │  │   │
│  │  │ - Ports     │  │ - Charts     │  │ - State    │  │   │
│  │  │ - Baseline  │  │ - Cards      │  │            │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                       │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         React Query (TanStack Query)          │  │   │
│  │  │  - Data fetching, caching, synchronization    │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│                   ┌─────────▼──────────┐                    │
│                   │   UI Components    │                     │
│                   │  (shadcn/ui)       │                     │
│                   │  - Radix UI        │                     │
│                   │  - Tailwind CSS    │                     │
│                   └────────────────────┘                     │
└──────────────────────────────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ http://localhost:8000/api/*
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      BACKEND LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 FastAPI (Python 3.8+)                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │              API Endpoints                      │  │   │
│  │  │  /api/processes - Process monitoring           │  │   │
│  │  │  /api/ports - Port scanning                    │  │   │
│  │  │  /api/startup - Startup items                  │  │   │
│  │  │  /api/integrity - File integrity               │  │   │
│  │  │  /api/baseline/* - Baseline management         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │          Security Scanning Modules             │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │  │   │
│  │  │  │ analyzer │  │ processes│  │   ports     │  │  │   │
│  │  │  │  .py     │  │   .py    │  │    .py      │  │  │   │
│  │  │  └──────────┘  └──────────┘  └─────────────┘  │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │  │   │
│  │  │  │ startup  │  │ integrity│  │  baseline   │  │  │   │
│  │  │  │  .py     │  │   .py    │  │    .py      │  │  │   │
│  │  │  └──────────┘  └──────────┘  └─────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ System Calls
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    SYSTEM INTERFACE                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  psutil Library                       │   │
│  │  - Cross-platform system and process utilities       │   │
│  │  - Process enumeration and monitoring                │   │
│  │  - Network connection information                    │   │
│  │  - System statistics                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│  ┌──────────────┬───────────┴──────────┬──────────────┐    │
│  │              │                       │              │     │
│  │  Windows     │       Linux           │   Database   │     │
│  │  ┌────────┐  │  ┌──────────────┐    │  ┌────────┐  │     │
│  │  │winreg  │  │  │ /proc, /sys  │    │  │ SQLite │  │     │
│  │  │pywin32 │  │  │  systemd     │    │  │  .db   │  │     │
│  │  └────────┘  │  └──────────────┘    │  └────────┘  │     │
│  └──────────────┴──────────────────────┴──────────────┘     │
└──────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  OPERATING SYSTEM                            │
│  - Windows 10/11 or Linux (Ubuntu, Fedora, etc.)            │
│  - Process Management                                        │
│  - Network Stack                                             │
│  - File System                                               │
│  - System Registry (Windows) / systemd (Linux)              │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3+ | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| TanStack Query | 5.x | Data fetching & caching |
| React Router | 6.x | Client-side routing |
| Tailwind CSS | 3.x | Styling framework |
| shadcn/ui | Latest | UI component library |
| Radix UI | Various | Headless UI primitives |
| Recharts | 3.x | Data visualization |
| Lucide React | Latest | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Programming language |
| FastAPI | 0.115+ | Web framework |
| Uvicorn | 0.32+ | ASGI server |
| psutil | 6.1+ | System monitoring |
| pydantic | 2.10+ | Data validation |
| SQLite | 3.x | Database (via Python) |
| pywin32 | 308 | Windows-specific APIs |

---

## Component Design

### Frontend Architecture

#### Pages Layer
- **Entry Point:** Route handlers for each main view
- **Responsibility:** Layout, data fetching orchestration
- **Examples:** `Dashboard.tsx`, `ProcessMonitor.tsx`, `Baseline.tsx`

#### Components Layer
Organized by function:

```
components/
├── layout/           # App structure
│   ├── SecuritySidebar.tsx
│   └── ConnectionStatus.tsx
├── security/         # Security features
│   ├── ProcessTable.tsx
│   ├── PortScanner.tsx
│   ├── StartupTable.tsx
│   └── FileIntegrityTable.tsx
├── baseline/         # Baseline system
│   ├── BaselineCard.tsx
│   └── ComparisonResults.tsx
├── charts/           # Data visualization
│   ├── TrendChart.tsx
│   ├── DistributionChart.tsx
│   └── BarComparisonChart.tsx
└── ui/               # Reusable UI primitives (shadcn)
    ├── button.tsx
    ├── card.tsx
    ├── table.tsx
    └── ...
```

#### Hooks Layer
Custom React hooks for business logic:

```typescript
// useSecurityAPI.ts - Backend communication
export const useProcesses = () => useQuery({
  queryKey: ['processes'],
  queryFn: fetchProcesses,
  refetchInterval: 30000, // Auto-refresh every 30s
});

// useBaseline.ts - Baseline management
export const useBaseline = () => {
  const createBaseline = useMutation(/* ... */);
  const compareBaseline = useMutation(/* ... */);
  return { createBaseline, compareBaseline };
};
```

### Backend Architecture

#### Module Structure

```
backend/
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
├── security/            # Security scanning modules
│   ├── analyzer.py      # Risk analysis engine
│   ├── processes.py     # Process monitoring
│   ├── ports.py         # Port scanning
│   ├── startup.py       # Startup items
│   ├── integrity.py     # File integrity
│   └── baseline.py      # Baseline management
└── data/                # SQLite database (created at runtime)
    └── baselines.db
```

#### API Design Pattern

```python
@app.get("/api/processes")
async def get_processes():
    """
    1. Call security module
    2. Process raw data
    3. Analyze for risks
    4. Return structured JSON
    """
    raw_processes = scan_processes()
    analyzed = [analyze_process(p) for p in raw_processes]
    return {"processes": analyzed, "timestamp": datetime.now()}
```

---

## Data Flow

### Request/Response Cycle

```
User Action → Frontend Component → React Query Hook → HTTP Request
    ↓
Backend API Endpoint → Security Module → System API (psutil, etc.)
    ↓
Raw Data → Risk Analysis → JSON Response
    ↓
React Query Cache → Component Re-render → User Sees Updated UI
```

### Example: Loading Processes

1. **User navigates** to Process Monitor page
2. **ProcessMonitor component** mounts
3. **useProcesses hook** fires
4. **React Query** checks cache:
   - If fresh data exists → Use cached data
   - If stale/missing → Fetch from API
5. **HTTP GET** to `/api/processes`
6. **Backend** calls `scan_processes()`
7. **psutil** enumerates running processes
8. **Risk analyzer** evaluates each process
9. **JSON response** returned to frontend
10. **React Query** caches response
11. **Component** renders table with data
12. **Auto-refresh** after 30 seconds (repeat from step 5)

---

## Security Modules

### 1. Process Monitor (`processes.py`)

**Purpose:** Enumerate and analyze running processes

**System APIs:**
- **Windows:** `psutil.process_iter()`
- **Linux:** `/proc` filesystem via psutil

**Data Collected:**
- PID (Process ID)
- Name
- User
- CPU usage
- Memory usage (RSS)
- Executable path
- Command line arguments

**Risk Analysis:**
```python
def analyze_process_risk(process):
    risk = 0
    
    # High CPU usage
    if process.cpu_percent > 80:
        risk += 20
    
    # Running from TEMP
    if "\\Temp\\" in process.exe or "/tmp/" in process.exe:
        risk += 40
    
    # Suspicious name patterns
    if suspicious_name_pattern(process.name):
        risk += 30
    
    return min(risk, 100)
```

### 2. Port Scanner (`ports.py`)

**Purpose:** Monitor network connections and listening ports

**System APIs:**
- `psutil.net_connections()`

**Data Collected:**
- Local address and port
- Remote address and port
- Connection state (LISTEN, ESTABLISHED, etc.)
- Process using the port
- Protocol (TCP/UDP)

**Risk Analysis:**
```python
def analyze_port_risk(connection):
    risk = 0
    
    # Listening on all interfaces (0.0.0.0)
    if connection.laddr.ip == "0.0.0.0":
        risk += 25
    
    # Uncommon high port
    if connection.laddr.port > 49152:
        risk += 15
    
    # Connection to external IP
    if connection.raddr and is_external_ip(connection.raddr.ip):
        risk += 20
    
    return min(risk, 100)
```

### 3. Startup Items (`startup.py`)

**Purpose:** Identify programs configured to run at boot

**System APIs:**
- **Windows:** `winreg` (Registry), Task Scheduler
  - `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`
  - `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
- **Linux:** systemd, cron, `/etc/rc.local`

**Data Collected:**
- Name
- Command/Path
- Location (Registry key, systemd unit, etc.)
- User context

**Risk Analysis:**
```python
def analyze_startup_risk(item):
    risk = 0
    
    # From temp directory
    if "temp" in item.path.lower():
        risk += 50
    
    # Not digitally signed (Windows)
    if not is_signed(item.path):
        risk += 20
    
    # Unusual startup location
    if is_uncommon_startup_method(item.location):
        risk += 30
    
    return min(risk, 100)
```

### 4. File Integrity (`integrity.py`)

**Purpose:** Detect unauthorized file modifications

**Algorithm:**
1. Hash files using SHA-256
2. Store hashes in baseline
3. Compare current hashes to baseline
4. Report mismatches

**Data Collected:**
- File path
- SHA-256 hash
- File size
- Last modified timestamp

**Risk Analysis:**
```python
def analyze_file_risk(file_change):
    risk = 0
    
    # Critical system file modified
    if is_system_file(file_change.path):
        risk += 60
    
    # Executable modified
    if file_change.path.endswith(('.exe', '.dll', '.so')):
        risk += 30
    
    # Recently modified
    if time_since_modification(file_change) < timedelta(hours=1):
        risk += 10
    
    return min(risk, 100)
```

### 5. Baseline System (`baseline.py`)

**Purpose:** Snapshot system state for comparison

**Database Schema (SQLite):**
```sql
CREATE TABLE baselines (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP,
    notes TEXT
);

CREATE TABLE baseline_processes (
    baseline_id INTEGER,
    pid INTEGER,
    name TEXT,
    user TEXT,
    cpu_percent REAL,
    memory_mb REAL,
    path TEXT,
    FOREIGN KEY (baseline_id) REFERENCES baselines(id)
);

-- Similar tables for ports, startup items, files
```

**Comparison Algorithm:**
```python
def compare_baseline(baseline_id, current_data):
    baseline = load_baseline(baseline_id)
    
    # Find new items (in current but not in baseline)
    new_items = [item for item in current_data 
                 if item not in baseline]
    
    # Find removed items (in baseline but not in current)
    removed_items = [item for item in baseline 
                     if item not in current_data]
    
    # Find modified items
    modified_items = [item for item in current_data 
                      if item_changed(item, baseline)]
    
    return {
        "new": new_items,
        "removed": removed_items,
        "modified": modified_items,
        "risk_score": calculate_overall_risk(new_items, modified_items)
    }
```

---

## API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### Get Processes
```http
GET /api/processes
```

**Response:**
```json
{
  "processes": [
    {
      "pid": 1234,
      "name": "chrome.exe",
      "user": "username",
      "cpu_percent": 2.5,
      "memory_mb": 512.3,
      "path": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "risk_level": "safe",
      "risk_score": 10
    }
  ],
  "timestamp": "2025-01-15T10:30:00",
  "total": 150
}
```

#### Get Ports
```http
GET /api/ports
```

**Response:**
```json
{
  "connections": [
    {
      "local_address": "127.0.0.1",
      "local_port": 8000,
      "remote_address": null,
      "remote_port": null,
      "status": "LISTEN",
      "pid": 5678,
      "process_name": "python.exe",
      "protocol": "TCP",
      "risk_level": "low",
      "risk_score": 15
    }
  ],
  "timestamp": "2025-01-15T10:30:00"
}
```

#### Get Startup Items
```http
GET /api/startup
```

**Response:**
```json
{
  "startup_items": [
    {
      "name": "Windows Defender",
      "command": "C:\\Program Files\\Windows Defender\\MSASCuiL.exe",
      "location": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",
      "user": "SYSTEM",
      "risk_level": "safe",
      "risk_score": 5
    }
  ],
  "timestamp": "2025-01-15T10:30:00"
}
```

#### File Integrity Scan
```http
POST /api/integrity/scan
Content-Type: application/json

{
  "paths": [
    "C:\\Windows\\System32",
    "C:\\Program Files"
  ]
}
```

**Response:**
```json
{
  "files": [
    {
      "path": "C:\\Windows\\System32\\kernel32.dll",
      "hash": "a1b2c3d4...",
      "size": 1024000,
      "modified": "2024-12-01T10:00:00",
      "status": "unchanged",
      "risk_level": "safe"
    }
  ],
  "total_scanned": 5432,
  "changes_detected": 0
}
```

#### Baseline Management

**Create Baseline:**
```http
POST /api/baseline
Content-Type: application/json

{
  "name": "Clean System January 2025",
  "notes": "After fresh Windows install"
}
```

**List Baselines:**
```http
GET /api/baseline
```

**Compare to Baseline:**
```http
POST /api/baseline/{baseline_id}/compare
```

**Response:**
```json
{
  "baseline_name": "Clean System January 2025",
  "comparison_date": "2025-01-15T10:30:00",
  "new_processes": [...],
  "removed_processes": [...],
  "new_ports": [...],
  "new_startup_items": [...],
  "modified_files": [...],
  "overall_risk_score": 35,
  "risk_level": "low"
}
```

---

## Database Schema

### SQLite Database (`data/baselines.db`)

```sql
-- Baselines table
CREATE TABLE baselines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 0
);

-- Baseline processes snapshot
CREATE TABLE baseline_processes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    baseline_id INTEGER NOT NULL,
    pid INTEGER,
    name TEXT NOT NULL,
    user TEXT,
    cpu_percent REAL,
    memory_mb REAL,
    path TEXT,
    risk_score INTEGER,
    FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- Baseline ports snapshot
CREATE TABLE baseline_ports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    baseline_id INTEGER NOT NULL,
    local_address TEXT,
    local_port INTEGER,
    remote_address TEXT,
    remote_port INTEGER,
    status TEXT,
    protocol TEXT,
    process_name TEXT,
    risk_score INTEGER,
    FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- Baseline startup items snapshot
CREATE TABLE baseline_startup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    baseline_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    command TEXT,
    location TEXT,
    user TEXT,
    risk_score INTEGER,
    FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- Baseline file hashes
CREATE TABLE baseline_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    baseline_id INTEGER NOT NULL,
    path TEXT NOT NULL,
    hash TEXT NOT NULL,
    size INTEGER,
    modified_at TIMESTAMP,
    FOREIGN KEY (baseline_id) REFERENCES baselines(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_baseline_processes ON baseline_processes(baseline_id);
CREATE INDEX idx_baseline_ports ON baseline_ports(baseline_id);
CREATE INDEX idx_baseline_startup ON baseline_startup(baseline_id);
CREATE INDEX idx_baseline_files ON baseline_files(baseline_id, path);
```

---

## Performance Considerations

### Frontend Optimization

**React Query Caching:**
- Data cached for 5 minutes (stale time)
- Background refetch every 30 seconds
- Reduces API calls and improves responsiveness

**Lazy Loading:**
- Components loaded on demand
- Charts only rendered when visible
- Reduces initial bundle size

**Virtualization (Future):**
- For large tables (>1000 rows)
- Only render visible rows
- Using `react-window` or `@tanstack/virtual`

### Backend Optimization

**Process Scanning:**
- Iterates processes once per request
- Caches results for 5 seconds to handle concurrent requests
- Filters unnecessary data early

**Database Queries:**
- Indexed foreign keys for fast joins
- Prepared statements to prevent SQL injection
- Connection pooling (handled by SQLite)

**Async Operations:**
- FastAPI async endpoints for I/O-bound operations
- Non-blocking file system access
- Concurrent baseline comparisons

### Resource Usage

**Typical Memory:**
- Frontend: ~150MB (browser)
- Backend: ~50MB (idle), ~100MB (scanning)

**CPU Usage:**
- Frontend: <5% (idle), ~15% (rendering charts)
- Backend: <5% (idle), ~30% (full system scan)

**Network:**
- API responses: 10KB - 500KB per request
- Polling interval: 30 seconds
- Bandwidth: <1 MB/min

---

## Future Enhancements

### Planned Features

1. **Advanced Threat Detection**
   - YARA rules integration
   - Signature-based malware detection
   - Behavioral analysis engine

2. **Network Traffic Analysis**
   - Packet capture (pcap)
   - Protocol analysis
   - Anomaly detection

3. **Reporting System**
   - PDF report generation
   - Scheduled scans
   - Email alerts

4. **Multi-System Management**
   - Agent-based architecture
   - Centralized dashboard
   - Fleet monitoring

5. **Machine Learning**
   - Anomaly detection models
   - Process classification
   - Risk score refinement

6. **Integration APIs**
   - VirusTotal API
   - MISP threat intelligence
   - SIEM integration

### Technical Debt

- [ ] Add comprehensive unit tests (pytest, jest)
- [ ] Implement error boundaries in React
- [ ] Add API rate limiting
- [ ] Improve error handling and logging
- [ ] Add TypeScript strict mode
- [ ] Optimize large table rendering
- [ ] Add pagination for large datasets
- [ ] Implement WebSocket for real-time updates

---

## Contributing to Architecture

When adding new features, follow these guidelines:

### Adding a New Security Module

1. **Backend (`backend/security/your_module.py`):**
```python
def scan_your_feature():
    """Scan logic here"""
    pass

def analyze_your_feature_risk(item):
    """Risk analysis logic"""
    pass
```

2. **API Endpoint (`backend/main.py`):**
```python
@app.get("/api/your-feature")
async def get_your_feature():
    data = scan_your_feature()
    analyzed = [analyze_your_feature_risk(item) for item in data]
    return {"data": analyzed}
```

3. **Frontend Hook (`src/hooks/useSecurityAPI.ts`):**
```typescript
export const useYourFeature = () => useQuery({
  queryKey: ['your-feature'],
  queryFn: () => fetch('/api/your-feature').then(r => r.json()),
});
```

4. **Frontend Component (`src/components/security/YourFeatureTable.tsx`):**
```typescript
export function YourFeatureTable() {
  const { data } = useYourFeature();
  return <Table data={data} />;
}
```

5. **Page (`src/pages/YourFeature.tsx`):**
```typescript
export default function YourFeaturePage() {
  return (
    <div>
      <h1>Your Feature</h1>
      <YourFeatureTable />
    </div>
  );
}
```

---

## License

MIT License - See [LICENSE](../LICENSE) for details

---

**Questions?** Open an issue or discussion on GitHub!
