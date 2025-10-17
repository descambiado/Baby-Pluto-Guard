"""
Port Scanning Module
Scans open ports and network connections using psutil
"""

import psutil
from typing import List, Dict


def scan_open_ports() -> List[Dict]:
    """
    Scan all open ports and active network connections
    
    Returns:
        List of port/connection dictionaries with security analysis
    """
    ports = []
    
    for conn in psutil.net_connections(kind='inet'):
        try:
            # Get process info if available
            process_name = None
            if conn.pid:
                try:
                    process = psutil.Process(conn.pid)
                    process_name = process.name()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    process_name = "Unknown"
            
            # Analyze risk level
            risk_level = analyze_port_risk(conn)
            
            ports.append({
                'local_address': conn.laddr.ip if conn.laddr else None,
                'local_port': conn.laddr.port if conn.laddr else None,
                'remote_address': conn.raddr.ip if conn.raddr else None,
                'remote_port': conn.raddr.port if conn.raddr else None,
                'status': conn.status,
                'protocol': 'tcp' if conn.type == 1 else 'udp',
                'process_name': process_name,
                'pid': conn.pid,
                'risk_level': risk_level
            })
            
        except Exception:
            continue
    
    return ports


def analyze_port_risk(conn) -> str:
    """
    Analyze the risk level of an open port
    
    Args:
        conn: psutil connection object
        
    Returns:
        Risk level: 'safe', 'low', 'medium', or 'high'
    """
    if not conn.laddr:
        return 'safe'
    
    port = conn.laddr.port
    
    # High-risk ports (commonly used by malware)
    high_risk_ports = [
        1337,   # Elite/Leet
        4444,   # Metasploit default
        5555,   # Common backdoor
        6666,   # IRC bot
        31337,  # Back Orifice
        12345,  # NetBus
        54321,  # Back Orifice 2000
    ]
    
    # Medium-risk ports (should be monitored)
    medium_risk_ports = [
        21,     # FTP (unencrypted)
        23,     # Telnet (unencrypted)
        135,    # Windows RPC
        139,    # NetBIOS
        445,    # SMB (WannaCry vector)
        3389,   # RDP
    ]
    
    # Check for high-risk ports
    if port in high_risk_ports:
        return 'high'
    
    # Check for medium-risk ports
    if port in medium_risk_ports:
        return 'medium'
    
    # Dynamic/private ports (49152-65535) - low risk but monitor
    if port > 49152:
        return 'low'
    
    # Well-known ports (0-1023) - generally safe if legitimate
    if port <= 1023:
        return 'safe'
    
    # Registered ports (1024-49151) - safe
    return 'safe'


def get_listening_ports() -> List[Dict]:
    """
    Get only ports in LISTEN state
    
    Returns:
        List of listening port dictionaries
    """
    all_ports = scan_open_ports()
    return [p for p in all_ports if p['status'] == 'LISTEN']


def get_established_connections() -> List[Dict]:
    """
    Get only established connections
    
    Returns:
        List of established connection dictionaries
    """
    all_ports = scan_open_ports()
    return [p for p in all_ports if p['status'] == 'ESTABLISHED']


def is_port_open(port: int, protocol: str = 'tcp') -> bool:
    """
    Check if a specific port is open
    
    Args:
        port: Port number to check
        protocol: 'tcp' or 'udp'
        
    Returns:
        True if port is open, False otherwise
    """
    connections = scan_open_ports()
    return any(
        c['local_port'] == port and 
        c['protocol'] == protocol and 
        c['status'] == 'LISTEN'
        for c in connections
    )


# Example usage
if __name__ == "__main__":
    print("Scanning ports...")
    ports = scan_open_ports()
    
    print(f"\nFound {len(ports)} open ports/connections")
    
    # Show listening ports
    listening = get_listening_ports()
    print(f"\nLISTENING PORTS ({len(listening)}):")
    for port in listening[:10]:  # Show first 10
        print(f"  - Port {port['local_port']} ({port['protocol']}) - {port['process_name']} [{port['risk_level']}]")
    
    # Show high-risk ports
    high_risk = [p for p in ports if p['risk_level'] == 'high']
    if high_risk:
        print(f"\n⚠️  HIGH RISK PORTS ({len(high_risk)}):")
        for port in high_risk:
            print(f"  - Port {port['local_port']} - {port['process_name']}")
