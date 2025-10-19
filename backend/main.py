"""
BabyPluto Security Scanner - Main API Server
FastAPI-based REST API for security scanning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import uvicorn
import time
from datetime import datetime

# Import security modules (to be implemented)
from security.processes import scan_processes
from security.ports import scan_open_ports
from security.startup import scan_startup_items
from security.integrity import scan_file_integrity
from security.analyzer import generate_metrics, generate_alerts
from security.baseline import baseline_manager

app = FastAPI(
    title="BabyPluto Security API",
    description="Cross-platform security scanner for Windows and Linux",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Root endpoint with API information"""
    return {
        "message": "BabyPluto Security API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "system_info": "/api/system/info",
            "quick_scan": "/api/scan/quick",
            "full_scan": "/api/scan/full",
            "processes": "/api/processes",
            "ports": "/api/ports",
            "startup": "/api/startup"
        }
    }


@app.get("/api/system/info")
def system_info():
    """Get system information"""
    import platform
    
    return {
        "os": platform.system(),
        "os_version": platform.version(),
        "os_release": platform.release(),
        "architecture": platform.machine(),
        "hostname": platform.node(),
        "processor": platform.processor(),
        "python_version": platform.python_version()
    }


@app.post("/api/scan/quick")
def quick_scan():
    """
    Quick security scan: processes + ports
    Returns basic security information quickly
    """
    try:
        start_time = time.time()
        
        # Scan processes and ports
        processes = scan_processes()
        ports = scan_open_ports()
        
        scan_duration = int((time.time() - start_time) * 1000)  # milliseconds
        
        return {
            "processes": processes,
            "ports": ports,
            "scan_type": "quick",
            "scan_duration": scan_duration,
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")


@app.post("/api/scan/full")
def full_scan():
    """
    Full security scan: complete system analysis
    Includes processes, ports, startup, file integrity, and threat analysis
    """
    try:
        start_time = time.time()
        
        # Perform all scans
        processes = scan_processes()
        ports = scan_open_ports()
        startup_items = scan_startup_items()
        
        # Define critical system files based on OS
        import platform
        import os
        
        if platform.system() == 'Windows':
            critical_files = [
                "C:\\Windows\\System32\\drivers\\etc\\hosts",
                "C:\\Windows\\System32\\ntdll.dll",
                "C:\\Windows\\System32\\kernel32.dll"
            ]
        else:  # Linux
            critical_files = [
                "/etc/hosts",
                "/etc/passwd",
                "/bin/bash",
                "/bin/sh"
            ]
        
        file_integrity = scan_file_integrity(critical_files)
        
        # Generate metrics and alerts
        metrics = generate_metrics(processes, ports, startup_items, file_integrity)
        alerts = generate_alerts(processes, ports, startup_items, file_integrity)
        
        scan_duration = int((time.time() - start_time) * 1000)  # milliseconds
        
        return {
            "processes": processes,
            "ports": ports,
            "startup_items": startup_items,
            "file_integrity": file_integrity,
            "alerts": alerts,
            "metrics": metrics,
            "scan_type": "full",
            "scan_duration": scan_duration,
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Full scan failed: {str(e)}")


@app.get("/api/processes")
def get_processes():
    """Get current running processes"""
    try:
        processes = scan_processes()
        return {
            "processes": processes,
            "count": len(processes),
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get processes: {str(e)}")


@app.get("/api/ports")
def get_ports():
    """Get open ports and connections"""
    try:
        ports = scan_open_ports()
        return {
            "ports": ports,
            "count": len(ports),
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get ports: {str(e)}")


@app.get("/api/startup")
def get_startup():
    """Get startup items"""
    try:
        startup_items = scan_startup_items()
        return {
            "startup_items": startup_items,
            "count": len(startup_items),
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get startup items: {str(e)}")


@app.get("/api/integrity")
def get_file_integrity():
    """Get file integrity checks"""
    try:
        import platform
        from security.integrity import get_critical_files
        
        critical_files = get_critical_files()
        file_integrity = scan_file_integrity(critical_files)
        
        return {
            "files": file_integrity,
            "count": len(file_integrity),
            "timestamp": int(time.time())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check file integrity: {str(e)}")


# ==================== BASELINE ENDPOINTS ====================

@app.post("/api/baseline/create")
def create_baseline(name: str, description: str = ""):
    """Create a new baseline of the current system state"""
    try:
        baseline = baseline_manager.create_baseline(name, description)
        return {
            "success": True,
            "baseline": baseline,
            "message": f"Baseline '{name}' created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create baseline: {str(e)}")


@app.get("/api/baseline/active")
def get_active_baseline():
    """Get the currently active baseline"""
    try:
        baseline = baseline_manager.get_active_baseline()
        if not baseline:
            return {
                "exists": False,
                "message": "No active baseline found"
            }
        return {
            "exists": True,
            "baseline": baseline
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active baseline: {str(e)}")


@app.get("/api/baseline/list")
def list_baselines():
    """List all baselines"""
    try:
        baselines = baseline_manager.list_baselines()
        return {
            "baselines": baselines,
            "count": len(baselines)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list baselines: {str(e)}")


@app.get("/api/baseline/{baseline_id}")
def get_baseline(baseline_id: int):
    """Get a specific baseline"""
    try:
        baseline = baseline_manager.get_baseline(baseline_id)
        if not baseline:
            raise HTTPException(status_code=404, detail="Baseline not found")
        return baseline
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get baseline: {str(e)}")


@app.post("/api/baseline/{baseline_id}/activate")
def activate_baseline(baseline_id: int):
    """Set a baseline as active"""
    try:
        success = baseline_manager.set_active_baseline(baseline_id)
        return {
            "success": success,
            "message": f"Baseline {baseline_id} activated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to activate baseline: {str(e)}")


@app.delete("/api/baseline/{baseline_id}")
def delete_baseline(baseline_id: int):
    """Delete a baseline"""
    try:
        success = baseline_manager.delete_baseline(baseline_id)
        return {
            "success": success,
            "message": f"Baseline {baseline_id} deleted"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete baseline: {str(e)}")


@app.post("/api/baseline/compare")
def compare_with_baseline(baseline_id: int = None):
    """Compare current system state with baseline"""
    try:
        comparison = baseline_manager.compare_with_baseline(baseline_id)
        return comparison
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare with baseline: {str(e)}")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    print("🛡️  BabyPluto Security Scanner API")
    print("=" * 50)
    print(f"Starting server on http://0.0.0.0:8000")
    print(f"API docs available at http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
