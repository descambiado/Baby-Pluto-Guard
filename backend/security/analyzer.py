"""
Security Analyzer Module
Generates metrics and alerts from scan results
"""

from typing import List, Dict
import time
import uuid


def generate_metrics(
    processes: List[Dict],
    ports: List[Dict],
    startup_items: List[Dict],
    file_integrity: List[Dict]
) -> Dict:
    """
    Generate security metrics from scan results
    
    Args:
        processes: List of process dictionaries
        ports: List of port dictionaries
        startup_items: List of startup item dictionaries
        file_integrity: List of file integrity dictionaries
        
    Returns:
        Dictionary of security metrics
    """
    # Count processes by risk level
    suspicious_processes = len([p for p in processes if p['risk_level'] in ['medium', 'high']])
    
    # Count ports by risk level
    high_risk_ports = len([p for p in ports if p['risk_level'] == 'high'])
    open_ports = len([p for p in ports if p['status'] == 'LISTEN'])
    
    # Count startup items by risk level
    suspicious_startup = len([s for s in startup_items if s['risk_level'] in ['medium', 'high']])
    
    # Count file changes
    file_changes = len([f for f in file_integrity if f['status'] in ['modified', 'missing']])
    
    # Count alerts by severity
    alerts_count = {
        'safe': 0,
        'low': 0,
        'medium': 0,
        'high': 0
    }
    
    # Aggregate risk levels
    all_items = processes + ports + startup_items + file_integrity
    for item in all_items:
        risk = item.get('risk_level', 'safe')
        if risk in alerts_count:
            alerts_count[risk] += 1
    
    return {
        'total_processes': len(processes),
        'suspicious_processes': suspicious_processes,
        'open_ports': open_ports,
        'high_risk_ports': high_risk_ports,
        'startup_items': len(startup_items),
        'suspicious_startup': suspicious_startup,
        'file_changes': file_changes,
        'alerts_count': alerts_count,
        'last_scan': int(time.time())
    }


def generate_alerts(
    processes: List[Dict],
    ports: List[Dict],
    startup_items: List[Dict],
    file_integrity: List[Dict]
) -> List[Dict]:
    """
    Generate security alerts from scan results
    
    Args:
        processes: List of process dictionaries
        ports: List of port dictionaries
        startup_items: List of startup item dictionaries
        file_integrity: List of file integrity dictionaries
        
    Returns:
        List of security alert dictionaries
    """
    alerts = []
    timestamp = int(time.time())
    
    # Process alerts
    for proc in processes:
        if proc['risk_level'] == 'high':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'process',
                'severity': 'high',
                'title': f"Suspicious Process: {proc['name']}",
                'description': f"Process '{proc['name']}' (PID: {proc['pid']}) exhibits suspicious behavior. "
                              f"Running as user '{proc['username']}' with {proc['cpu_percent']:.1f}% CPU usage.",
                'timestamp': timestamp,
                'resolved': False
            })
        elif proc['risk_level'] == 'medium':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'process',
                'severity': 'medium',
                'title': f"High Resource Usage: {proc['name']}",
                'description': f"Process '{proc['name']}' is using {proc['cpu_percent']:.1f}% CPU "
                              f"and {proc['memory_percent']:.1f}% memory.",
                'timestamp': timestamp,
                'resolved': False
            })
    
    # Port alerts
    for port in ports:
        if port['risk_level'] == 'high':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'port',
                'severity': 'high',
                'title': f"High-Risk Port Open: {port['local_port']}",
                'description': f"Port {port['local_port']} ({port['protocol'].upper()}) is open and associated "
                              f"with malware. Process: {port['process_name'] or 'Unknown'}",
                'timestamp': timestamp,
                'resolved': False
            })
        elif port['risk_level'] == 'medium':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'port',
                'severity': 'medium',
                'title': f"Potentially Vulnerable Port: {port['local_port']}",
                'description': f"Port {port['local_port']} ({port['protocol'].upper()}) should be monitored. "
                              f"Process: {port['process_name'] or 'Unknown'}",
                'timestamp': timestamp,
                'resolved': False
            })
    
    # Startup alerts
    for item in startup_items:
        if item['risk_level'] == 'high':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'startup',
                'severity': 'high',
                'title': f"Suspicious Startup Item: {item['name']}",
                'description': f"Startup item '{item['name']}' appears suspicious. "
                              f"Location: {item['location']}",
                'timestamp': timestamp,
                'resolved': False
            })
    
    # File integrity alerts
    for file in file_integrity:
        if file['status'] == 'modified':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'file',
                'severity': 'high',
                'title': f"Critical File Modified",
                'description': f"File '{file['file_path']}' has been modified. "
                              "This may indicate a security breach.",
                'timestamp': timestamp,
                'resolved': False
            })
        elif file['status'] == 'missing':
            alerts.append({
                'id': str(uuid.uuid4()),
                'type': 'file',
                'severity': 'high',
                'title': f"Critical File Missing",
                'description': f"Critical file '{file['file_path']}' is missing from the system.",
                'timestamp': timestamp,
                'resolved': False
            })
    
    # Sort alerts by severity (high -> medium -> low)
    severity_order = {'high': 0, 'medium': 1, 'low': 2, 'safe': 3}
    alerts.sort(key=lambda x: severity_order.get(x['severity'], 3))
    
    return alerts


def calculate_security_score(metrics: Dict) -> int:
    """
    Calculate an overall security score (0-100)
    
    Args:
        metrics: Security metrics dictionary
        
    Returns:
        Security score (0 = critical, 100 = perfect)
    """
    score = 100
    
    # Deduct points for suspicious processes
    score -= min(metrics['suspicious_processes'] * 10, 30)
    
    # Deduct points for high-risk ports
    score -= min(metrics['high_risk_ports'] * 15, 40)
    
    # Deduct points for suspicious startup items
    score -= min(metrics['suspicious_startup'] * 5, 15)
    
    # Deduct points for file changes
    score -= min(metrics['file_changes'] * 20, 40)
    
    return max(score, 0)


# Example usage
if __name__ == "__main__":
    # Mock data for testing
    mock_processes = [
        {'name': 'chrome.exe', 'pid': 1234, 'cpu_percent': 5.0, 'memory_percent': 10.0, 
         'username': 'user', 'risk_level': 'safe'},
        {'name': 'suspicious_miner.exe', 'pid': 5678, 'cpu_percent': 95.0, 'memory_percent': 50.0,
         'username': 'unknown', 'risk_level': 'high'},
    ]
    
    mock_ports = [
        {'local_port': 80, 'protocol': 'tcp', 'process_name': 'nginx', 'risk_level': 'safe', 'status': 'LISTEN'},
        {'local_port': 4444, 'protocol': 'tcp', 'process_name': 'unknown', 'risk_level': 'high', 'status': 'LISTEN'},
    ]
    
    mock_startup = [
        {'name': 'OneDrive', 'location': 'HKCU\\Run', 'risk_level': 'safe'},
    ]
    
    mock_files = [
        {'file_path': '/etc/hosts', 'status': 'safe', 'risk_level': 'safe'},
    ]
    
    # Generate metrics
    metrics = generate_metrics(mock_processes, mock_ports, mock_startup, mock_files)
    print("Security Metrics:")
    print(f"  Suspicious Processes: {metrics['suspicious_processes']}")
    print(f"  High-Risk Ports: {metrics['high_risk_ports']}")
    
    # Generate alerts
    alerts = generate_alerts(mock_processes, mock_ports, mock_startup, mock_files)
    print(f"\nGenerated {len(alerts)} alerts")
    
    for alert in alerts:
        print(f"\n[{alert['severity'].upper()}] {alert['title']}")
        print(f"  {alert['description']}")
