"""
Startup Items Module
Scans autostart/startup programs on Windows and Linux
"""

import platform
import os
from typing import List, Dict

# Windows-specific imports
if platform.system() == 'Windows':
    try:
        import winreg
    except ImportError:
        winreg = None


def scan_startup_items() -> List[Dict]:
    """
    Scan startup items based on the operating system
    
    Returns:
        List of startup item dictionaries
    """
    system = platform.system()
    
    if system == 'Windows':
        return scan_windows_startup()
    elif system == 'Linux':
        return scan_linux_startup()
    else:
        return []


def scan_windows_startup() -> List[Dict]:
    """
    Scan Windows Registry for startup items
    
    Returns:
        List of Windows startup items
    """
    if not winreg:
        return []
    
    startup_items = []
    
    # Registry paths to scan
    registry_paths = [
        (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run"),
        (winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\RunOnce"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\Microsoft\Windows\CurrentVersion\Run"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\Microsoft\Windows\CurrentVersion\RunOnce"),
        (winreg.HKEY_LOCAL_MACHINE, r"Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Run"),
    ]
    
    for hkey, path in registry_paths:
        try:
            key = winreg.OpenKey(hkey, path, 0, winreg.KEY_READ)
            i = 0
            
            while True:
                try:
                    name, value, _ = winreg.EnumValue(key, i)
                    
                    # Analyze risk
                    risk_level = analyze_startup_risk(name, value)
                    
                    # Determine location string
                    location_str = "HKCU" if hkey == winreg.HKEY_CURRENT_USER else "HKLM"
                    
                    startup_items.append({
                        'name': name,
                        'path': value,
                        'location': f"{location_str}\\{path}",
                        'enabled': True,
                        'publisher': extract_publisher(value),
                        'risk_level': risk_level
                    })
                    
                    i += 1
                except OSError:
                    break
            
            winreg.CloseKey(key)
            
        except FileNotFoundError:
            continue
        except Exception:
            continue
    
    # Also check Startup folder
    startup_folder_items = scan_windows_startup_folder()
    startup_items.extend(startup_folder_items)
    
    return startup_items


def scan_windows_startup_folder() -> List[Dict]:
    """
    Scan Windows Startup folder for shortcuts
    
    Returns:
        List of startup folder items
    """
    startup_items = []
    
    # Common startup folder locations
    startup_folders = [
        os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"),
        os.path.expandvars(r"%ALLUSERSPROFILE%\Microsoft\Windows\Start Menu\Programs\Startup"),
    ]
    
    for folder in startup_folders:
        if os.path.exists(folder):
            try:
                for filename in os.listdir(folder):
                    filepath = os.path.join(folder, filename)
                    
                    if os.path.isfile(filepath):
                        risk_level = analyze_startup_risk(filename, filepath)
                        
                        startup_items.append({
                            'name': filename,
                            'path': filepath,
                            'location': folder,
                            'enabled': True,
                            'publisher': None,
                            'risk_level': risk_level
                        })
            except Exception:
                continue
    
    return startup_items


def scan_linux_startup() -> List[Dict]:
    """
    Scan Linux autostart files and systemd services
    
    Returns:
        List of Linux startup items
    """
    startup_items = []
    
    # XDG Autostart directories
    autostart_dirs = [
        os.path.expanduser("~/.config/autostart"),
        "/etc/xdg/autostart",
        "/usr/share/autostart",
    ]
    
    for directory in autostart_dirs:
        if os.path.exists(directory):
            try:
                for filename in os.listdir(directory):
                    if filename.endswith('.desktop'):
                        filepath = os.path.join(directory, filename)
                        
                        # Parse .desktop file
                        exec_line = parse_desktop_file(filepath)
                        risk_level = analyze_startup_risk(filename, exec_line)
                        
                        startup_items.append({
                            'name': filename.replace('.desktop', ''),
                            'path': exec_line or filepath,
                            'location': directory,
                            'enabled': is_desktop_file_enabled(filepath),
                            'publisher': None,
                            'risk_level': risk_level
                        })
            except Exception:
                continue
    
    # Systemd user services
    systemd_items = scan_systemd_services()
    startup_items.extend(systemd_items)
    
    return startup_items


def scan_systemd_services() -> List[Dict]:
    """
    Scan systemd services (basic implementation)
    
    Returns:
        List of systemd service items
    """
    startup_items = []
    
    systemd_dirs = [
        os.path.expanduser("~/.config/systemd/user"),
        "/etc/systemd/user",
        "/usr/lib/systemd/user"
    ]
    
    for directory in systemd_dirs:
        if os.path.exists(directory):
            try:
                for filename in os.listdir(directory):
                    if filename.endswith('.service'):
                        filepath = os.path.join(directory, filename)
                        risk_level = analyze_startup_risk(filename, filepath)
                        
                        startup_items.append({
                            'name': filename,
                            'path': filepath,
                            'location': directory,
                            'enabled': True,  # Simplified
                            'publisher': None,
                            'risk_level': risk_level
                        })
            except Exception:
                continue
    
    return startup_items


def parse_desktop_file(filepath: str) -> str:
    """
    Parse a .desktop file to extract the Exec line
    
    Args:
        filepath: Path to .desktop file
        
    Returns:
        Exec command or empty string
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('Exec='):
                    return line.split('=', 1)[1].strip()
    except Exception:
        pass
    return ""


def is_desktop_file_enabled(filepath: str) -> bool:
    """
    Check if a .desktop file is enabled (not Hidden=true)
    
    Args:
        filepath: Path to .desktop file
        
    Returns:
        True if enabled, False otherwise
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip().lower() == 'hidden=true':
                    return False
    except Exception:
        pass
    return True


def analyze_startup_risk(name: str, path: str) -> str:
    """
    Analyze the risk level of a startup item
    
    Args:
        name: Name of the startup item
        path: Path or command
        
    Returns:
        Risk level: 'safe', 'low', 'medium', or 'high'
    """
    name_lower = name.lower()
    path_lower = path.lower()
    
    # High-risk keywords
    high_risk_keywords = [
        'miner', 'crypto', 'unknown', 'suspicious',
        'temp', 'tmp', 'backdoor', 'trojan'
    ]
    
    # Check for high-risk indicators
    if any(keyword in name_lower for keyword in high_risk_keywords):
        return 'high'
    
    if any(keyword in path_lower for keyword in high_risk_keywords):
        return 'high'
    
    # Items in temp directories
    if 'temp' in path_lower or 'tmp' in path_lower:
        return 'medium'
    
    # Unknown publisher (Windows only)
    if platform.system() == 'Windows' and not extract_publisher(path):
        return 'low'
    
    return 'safe'


def extract_publisher(path: str) -> str:
    """
    Try to extract publisher information from a file path (Windows)
    
    Args:
        path: File path
        
    Returns:
        Publisher name or None
    """
    # Simplified implementation - in real scenario, would read file properties
    known_publishers = {
        'microsoft': 'Microsoft Corporation',
        'google': 'Google LLC',
        'adobe': 'Adobe Systems',
        'nvidia': 'NVIDIA Corporation',
        'intel': 'Intel Corporation',
    }
    
    path_lower = path.lower()
    for keyword, publisher in known_publishers.items():
        if keyword in path_lower:
            return publisher
    
    return None


# Example usage
if __name__ == "__main__":
    print(f"Scanning startup items on {platform.system()}...")
    items = scan_startup_items()
    
    print(f"\nFound {len(items)} startup items")
    
    for item in items[:10]:  # Show first 10
        print(f"\n  Name: {item['name']}")
        print(f"  Path: {item['path'][:80]}...")
        print(f"  Location: {item['location']}")
        print(f"  Risk: {item['risk_level']}")
