import { SecurityProcess, NetworkPort, StartupItem, FileIntegrityCheck, SecurityAlert, SecurityMetrics, ScanResults, RiskLevel } from '@/types/security';

const riskLevels: RiskLevel[] = ['safe', 'low', 'medium', 'high'];
const commonProcesses = ['chrome.exe', 'firefox.exe', 'explorer.exe', 'winlogon.exe', 'svchost.exe', 'python.exe', 'node.exe', 'code.exe'];
const suspiciousProcesses = ['miner.exe', 'trojan.exe', 'suspicious.exe', 'unknown.exe'];

function randomRiskLevel(): RiskLevel {
  const weights = [0.6, 0.25, 0.12, 0.03]; // Safe, Low, Medium, High
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return riskLevels[i];
    }
  }
  return 'safe';
}

export function generateMockProcesses(count: number = 25): SecurityProcess[] {
  return Array.from({ length: count }, (_, i) => {
    const riskLevel = randomRiskLevel();
    const isSuspicious = riskLevel === 'high' || riskLevel === 'medium';
    const processName = isSuspicious ? 
      suspiciousProcesses[Math.floor(Math.random() * suspiciousProcesses.length)] :
      commonProcesses[Math.floor(Math.random() * commonProcesses.length)];
    
    return {
      pid: 1000 + i,
      name: processName,
      status: Math.random() > 0.1 ? 'running' : 'sleeping',
      cpu_percent: Math.random() * (isSuspicious ? 50 : 10),
      memory_percent: Math.random() * (isSuspicious ? 30 : 5),
      username: Math.random() > 0.8 ? 'SYSTEM' : 'user',
      cmdline: [`C:\\Windows\\System32\\${processName}`, '--normal-flag'],
      create_time: Date.now() - Math.random() * 86400000,
      risk_level: riskLevel,
    };
  });
}

export function generateMockPorts(count: number = 15): NetworkPort[] {
  const commonPorts = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995];
  const suspiciousPorts = [1337, 4444, 5555, 6666, 31337];
  
  return Array.from({ length: count }, (_, i) => {
    const riskLevel = randomRiskLevel();
    const isSuspicious = riskLevel === 'high' || riskLevel === 'medium';
    const port = isSuspicious ?
      suspiciousPorts[Math.floor(Math.random() * suspiciousPorts.length)] :
      commonPorts[Math.floor(Math.random() * commonPorts.length)];
    
    return {
      local_address: '127.0.0.1',
      local_port: port,
      remote_address: Math.random() > 0.5 ? '192.168.1.100' : undefined,
      remote_port: Math.random() > 0.5 ? Math.floor(Math.random() * 65535) : undefined,
      status: Math.random() > 0.3 ? 'LISTEN' : 'ESTABLISHED',
      protocol: Math.random() > 0.7 ? 'udp' : 'tcp',
      process_name: commonProcesses[Math.floor(Math.random() * commonProcesses.length)],
      pid: 1000 + Math.floor(Math.random() * 100),
      risk_level: riskLevel,
    };
  });
}

export function generateMockStartupItems(count: number = 12): StartupItem[] {
  const legitimateItems = [
    'Windows Security notification icon',
    'Microsoft Office Click-to-Run',
    'Adobe Updater Startup Utility',
    'Intel Graphics Command Center',
    'Realtek Audio Console',
  ];
  
  const suspiciousItems = [
    'CryptoMiner Pro',
    'SystemOptimizer',
    'unknown_startup.exe',
    'backdoor_service',
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const riskLevel = randomRiskLevel();
    const isSuspicious = riskLevel === 'high' || riskLevel === 'medium';
    const name = isSuspicious ?
      suspiciousItems[Math.floor(Math.random() * suspiciousItems.length)] :
      legitimateItems[Math.floor(Math.random() * legitimateItems.length)];
    
    return {
      name,
      path: `C:\\Program Files\\${name.replace(/\s+/g, '')}\\${name.toLowerCase().replace(/\s+/g, '')}.exe`,
      location: Math.random() > 0.5 ? 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' : 'Startup Folder',
      enabled: Math.random() > 0.1,
      publisher: isSuspicious ? undefined : 'Microsoft Corporation',
      risk_level: riskLevel,
    };
  });
}

export function generateMockFileIntegrity(count: number = 8): FileIntegrityCheck[] {
  const systemFiles = [
    'C:\\Windows\\System32\\kernel32.dll',
    'C:\\Windows\\System32\\ntdll.dll',
    'C:\\Windows\\System32\\user32.dll',
    'C:\\Windows\\hosts',
    '/etc/passwd',
    '/etc/shadow',
    '/etc/hosts',
    '/bin/bash',
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const status = Math.random() > 0.8 ? 'modified' : 'safe';
    const riskLevel = status === 'modified' ? 'high' : 'safe';
    
    return {
      file_path: systemFiles[i % systemFiles.length],
      current_hash: 'sha256:' + Math.random().toString(36).substring(2, 66),
      expected_hash: status === 'safe' ? 'sha256:' + Math.random().toString(36).substring(2, 66) : undefined,
      last_modified: Date.now() - Math.random() * 86400000,
      status: status as 'safe' | 'modified',
      risk_level: riskLevel,
    };
  });
}

export function generateMockAlerts(count: number = 8): SecurityAlert[] {
  const alertTemplates = [
    { type: 'process', title: 'Suspicious Process Detected', description: 'High CPU usage from unknown process' },
    { type: 'port', title: 'Unusual Port Activity', description: 'Non-standard port opened' },
    { type: 'startup', title: 'New Startup Item', description: 'Unknown program added to startup' },
    { type: 'file', title: 'System File Modified', description: 'Critical system file has been changed' },
    { type: 'network', title: 'Suspicious Network Activity', description: 'Unusual outbound connections detected' },
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const severity = randomRiskLevel();
    
    return {
      id: `alert_${i}_${Date.now()}`,
      type: template.type as any,
      severity,
      title: template.title,
      description: template.description,
      timestamp: Date.now() - Math.random() * 86400000,
      resolved: Math.random() > 0.3,
    };
  });
}

export function generateMockMetrics(): SecurityMetrics {
  const alerts = generateMockAlerts();
  const alertsCounts = alerts.reduce((acc, alert) => {
    acc[alert.severity]++;
    return acc;
  }, { safe: 0, low: 0, medium: 0, high: 0 });
  
  return {
    total_processes: 45,
    suspicious_processes: 3,
    open_ports: 15,
    high_risk_ports: 2,
    startup_items: 12,
    suspicious_startup: 1,
    file_changes: 2,
    alerts_count: alertsCounts,
    last_scan: Date.now() - 300000, // 5 minutes ago
  };
}

export function generateMockScanResults(): ScanResults {
  return {
    processes: generateMockProcesses(),
    ports: generateMockPorts(),
    startup_items: generateMockStartupItems(),
    file_integrity: generateMockFileIntegrity(),
    alerts: generateMockAlerts(),
    metrics: generateMockMetrics(),
    scan_duration: 2500 + Math.random() * 2000, // 2.5-4.5 seconds
    timestamp: Date.now(),
  };
}