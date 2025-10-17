"""
Process Monitoring Module
Scans and analyzes running system processes using psutil
"""

import psutil
from typing import List, Dict


def scan_processes() -> List[Dict]:
    """
    Scan all running processes on the system
    
    Returns:
        List of process dictionaries with security analysis
    """
    processes = []
    
    for proc in psutil.process_iter([
        'pid', 'name', 'username', 'cpu_percent', 
        'memory_percent', 'status', 'create_time', 'cmdline'
    ]):
        try:
            # Get process info
            info = proc.info
            
            # Analyze risk level
            risk_level = analyze_process_risk(info)
            
            processes.append({
                'pid': info['pid'],
                'name': info['name'],
                'username': info['username'] or 'SYSTEM',
                'cpu_percent': info['cpu_percent'] or 0.0,
                'memory_percent': info['memory_percent'] or 0.0,
                'status': info['status'],
                'create_time': int(info['create_time']),
                'cmdline': info['cmdline'] or [],
                'risk_level': risk_level
            })
            
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            # Skip processes we can't access
            continue
    
    return processes


def analyze_process_risk(proc_info: Dict) -> str:
    """
    Analyze the risk level of a process based on various factors
    
    Args:
        proc_info: Dictionary containing process information
        
    Returns:
        Risk level: 'safe', 'low', 'medium', or 'high'
    """
    name = proc_info.get('name', '').lower()
    cpu_percent = proc_info.get('cpu_percent', 0)
    cmdline = ' '.join(proc_info.get('cmdline', [])).lower()
    
    # High risk keywords
    high_risk_keywords = [
        'miner', 'crypto', 'trojan', 'keylogger', 
        'backdoor', 'ransomware', 'rootkit'
    ]
    
    # Medium risk indicators
    medium_risk_keywords = [
        'unknown', 'suspicious', 'temp', 'tmp'
    ]
    
    # Check for high-risk indicators
    if any(keyword in name for keyword in high_risk_keywords):
        return 'high'
    
    if any(keyword in cmdline for keyword in high_risk_keywords):
        return 'high'
    
    # Check for medium-risk indicators
    if cpu_percent > 80:
        return 'medium'
    
    if any(keyword in name for keyword in medium_risk_keywords):
        return 'medium'
    
    # Processes with no username (potential system manipulation)
    if not proc_info.get('username'):
        return 'low'
    
    return 'safe'


def get_process_by_pid(pid: int) -> Dict:
    """
    Get detailed information about a specific process
    
    Args:
        pid: Process ID
        
    Returns:
        Dictionary with detailed process information
    """
    try:
        proc = psutil.Process(pid)
        
        return {
            'pid': proc.pid,
            'name': proc.name(),
            'username': proc.username(),
            'status': proc.status(),
            'cpu_percent': proc.cpu_percent(interval=0.1),
            'memory_percent': proc.memory_percent(),
            'memory_info': proc.memory_info()._asdict(),
            'create_time': int(proc.create_time()),
            'cmdline': proc.cmdline(),
            'cwd': proc.cwd(),
            'num_threads': proc.num_threads(),
            'connections': len(proc.connections())
        }
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        return None


def kill_process(pid: int) -> bool:
    """
    Terminate a process by PID (use with caution!)
    
    Args:
        pid: Process ID to terminate
        
    Returns:
        True if successful, False otherwise
    """
    try:
        proc = psutil.Process(pid)
        proc.terminate()  # SIGTERM
        proc.wait(timeout=3)  # Wait for graceful shutdown
        return True
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
        try:
            # Force kill if graceful shutdown fails
            proc = psutil.Process(pid)
            proc.kill()  # SIGKILL
            return True
        except:
            return False


# Example usage
if __name__ == "__main__":
    print("Scanning processes...")
    processes = scan_processes()
    
    print(f"\nFound {len(processes)} processes")
    
    # Show high-risk processes
    high_risk = [p for p in processes if p['risk_level'] == 'high']
    if high_risk:
        print(f"\n⚠️  HIGH RISK PROCESSES ({len(high_risk)}):")
        for proc in high_risk:
            print(f"  - {proc['name']} (PID: {proc['pid']})")
