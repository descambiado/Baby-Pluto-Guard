export interface SecurityProcess {
  pid: number;
  name: string;
  status: string;
  cpu_percent: number;
  memory_percent: number;
  username: string;
  cmdline: string[];
  create_time: number;
  risk_level: 'safe' | 'low' | 'medium' | 'high';
}

export interface NetworkPort {
  local_address: string;
  local_port: number;
  remote_address?: string;
  remote_port?: number;
  status: string;
  protocol: 'tcp' | 'udp';
  process_name?: string;
  pid?: number;
  risk_level: 'safe' | 'low' | 'medium' | 'high';
}

export interface StartupItem {
  name: string;
  path: string;
  location: string;
  enabled: boolean;
  publisher?: string;
  risk_level: 'safe' | 'low' | 'medium' | 'high';
}

export interface FileIntegrityCheck {
  file_path: string;
  current_hash: string;
  expected_hash?: string;
  last_modified: number;
  status: 'safe' | 'modified' | 'missing' | 'new';
  risk_level: 'safe' | 'low' | 'medium' | 'high';
}

export interface SecurityAlert {
  id: string;
  type: 'process' | 'port' | 'startup' | 'file' | 'network';
  severity: 'safe' | 'low' | 'medium' | 'high';
  title: string;
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface SecurityMetrics {
  total_processes: number;
  suspicious_processes: number;
  open_ports: number;
  high_risk_ports: number;
  startup_items: number;
  suspicious_startup: number;
  file_changes: number;
  alerts_count: {
    safe: number;
    low: number;
    medium: number;
    high: number;
  };
  last_scan: number;
}

export interface ScanResults {
  processes: SecurityProcess[];
  ports: NetworkPort[];
  startup_items: StartupItem[];
  file_integrity: FileIntegrityCheck[];
  alerts: SecurityAlert[];
  metrics: SecurityMetrics;
  scan_duration: number;
  timestamp: number;
}

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high';
export type ScanType = 'quick' | 'full' | 'custom';