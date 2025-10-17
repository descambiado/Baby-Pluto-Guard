"""
File Integrity Module
Verifies file integrity using SHA-256 hashing
"""

import hashlib
import os
from typing import List, Dict


def scan_file_integrity(file_paths: List[str], baseline: Dict[str, str] = None) -> List[Dict]:
    """
    Verify the integrity of specified files
    
    Args:
        file_paths: List of file paths to check
        baseline: Optional dict of {filepath: expected_hash}
        
    Returns:
        List of file integrity check results
    """
    results = []
    
    for filepath in file_paths:
        try:
            if os.path.exists(filepath):
                # Calculate current hash
                current_hash = calculate_sha256(filepath)
                last_modified = os.path.getmtime(filepath)
                
                # Compare with baseline if available
                expected_hash = baseline.get(filepath) if baseline else None
                status = 'safe'
                risk_level = 'safe'
                
                if expected_hash and current_hash != expected_hash:
                    status = 'modified'
                    risk_level = 'high'
                
                results.append({
                    'file_path': filepath,
                    'current_hash': current_hash,
                    'expected_hash': expected_hash,
                    'last_modified': int(last_modified),
                    'status': status,
                    'risk_level': risk_level
                })
            else:
                # File is missing
                results.append({
                    'file_path': filepath,
                    'current_hash': None,
                    'expected_hash': baseline.get(filepath) if baseline else None,
                    'last_modified': None,
                    'status': 'missing',
                    'risk_level': 'high'
                })
                
        except Exception as e:
            # Error accessing file
            results.append({
                'file_path': filepath,
                'current_hash': None,
                'expected_hash': None,
                'last_modified': None,
                'status': 'error',
                'risk_level': 'medium',
                'error': str(e)
            })
    
    return results


def calculate_sha256(filepath: str, chunk_size: int = 8192) -> str:
    """
    Calculate SHA-256 hash of a file
    
    Args:
        filepath: Path to the file
        chunk_size: Size of chunks to read (bytes)
        
    Returns:
        SHA-256 hash string with 'sha256:' prefix
    """
    sha256_hash = hashlib.sha256()
    
    try:
        with open(filepath, "rb") as f:
            # Read file in chunks to handle large files
            for byte_block in iter(lambda: f.read(chunk_size), b""):
                sha256_hash.update(byte_block)
        
        return f"sha256:{sha256_hash.hexdigest()}"
    except Exception as e:
        raise Exception(f"Failed to hash file {filepath}: {str(e)}")


def calculate_md5(filepath: str, chunk_size: int = 8192) -> str:
    """
    Calculate MD5 hash of a file (legacy support)
    
    Args:
        filepath: Path to the file
        chunk_size: Size of chunks to read (bytes)
        
    Returns:
        MD5 hash string with 'md5:' prefix
    """
    md5_hash = hashlib.md5()
    
    try:
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(chunk_size), b""):
                md5_hash.update(byte_block)
        
        return f"md5:{md5_hash.hexdigest()}"
    except Exception as e:
        raise Exception(f"Failed to hash file {filepath}: {str(e)}")


def create_baseline(file_paths: List[str]) -> Dict[str, str]:
    """
    Create a baseline of file hashes
    
    Args:
        file_paths: List of files to include in baseline
        
    Returns:
        Dictionary mapping filepath to hash
    """
    baseline = {}
    
    for filepath in file_paths:
        if os.path.exists(filepath):
            try:
                baseline[filepath] = calculate_sha256(filepath)
            except Exception:
                continue
    
    return baseline


def save_baseline(baseline: Dict[str, str], output_file: str):
    """
    Save baseline to a file
    
    Args:
        baseline: Dictionary of filepath to hash mappings
        output_file: Path to save the baseline
    """
    import json
    
    try:
        with open(output_file, 'w') as f:
            json.dump(baseline, f, indent=2)
    except Exception as e:
        raise Exception(f"Failed to save baseline: {str(e)}")


def load_baseline(baseline_file: str) -> Dict[str, str]:
    """
    Load baseline from a file
    
    Args:
        baseline_file: Path to the baseline file
        
    Returns:
        Dictionary of filepath to hash mappings
    """
    import json
    
    try:
        with open(baseline_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f"Failed to load baseline: {str(e)}")


def get_critical_files() -> List[str]:
    """
    Get list of critical system files to monitor
    
    Returns:
        List of critical file paths for the current OS
    """
    import platform
    
    if platform.system() == 'Windows':
        return [
            r"C:\Windows\System32\drivers\etc\hosts",
            r"C:\Windows\System32\ntdll.dll",
            r"C:\Windows\System32\kernel32.dll",
            r"C:\Windows\System32\user32.dll",
            r"C:\Windows\System32\advapi32.dll",
        ]
    elif platform.system() == 'Linux':
        return [
            "/etc/hosts",
            "/etc/passwd",
            "/etc/shadow",
            "/etc/sudoers",
            "/bin/bash",
            "/bin/sh",
            "/usr/bin/sudo",
        ]
    else:
        return []


# Example usage
if __name__ == "__main__":
    import platform
    
    print(f"File Integrity Check on {platform.system()}")
    print("=" * 50)
    
    # Get critical files for the OS
    critical_files = get_critical_files()
    
    print(f"\nChecking {len(critical_files)} critical files...")
    
    # Perform integrity check
    results = scan_file_integrity(critical_files)
    
    # Display results
    for result in results:
        status_symbol = "✓" if result['status'] == 'safe' else "✗"
        print(f"\n{status_symbol} {result['file_path']}")
        print(f"  Status: {result['status']}")
        print(f"  Hash: {result['current_hash'][:50]}..." if result['current_hash'] else "  Hash: N/A")
        print(f"  Risk: {result['risk_level']}")
