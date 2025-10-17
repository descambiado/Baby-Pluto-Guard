import { RiskLevel, SecurityAlert, SecurityMetrics, ScanResults } from '@/types/security';

export function getRiskColor(risk: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    safe: 'text-success',
    low: 'text-warning',
    medium: 'text-warning',
    high: 'text-destructive',
  };
  return colors[risk] || 'text-muted-foreground';
}

export function getRiskBadgeVariant(risk: RiskLevel): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<RiskLevel, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    safe: 'secondary',
    low: 'outline',
    medium: 'default',
    high: 'destructive',
  };
  return variants[risk] || 'default';
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function getSystemStatus(metrics: SecurityMetrics): {
  status: 'critical' | 'warning' | 'secure';
  color: string;
  message: string;
} {
  const highAlerts = metrics.alerts_count.high;
  const mediumAlerts = metrics.alerts_count.medium;
  
  if (highAlerts > 0) {
    return {
      status: 'critical',
      color: 'text-destructive',
      message: `${highAlerts} critical security issue${highAlerts > 1 ? 's' : ''} detected`,
    };
  }
  
  if (mediumAlerts > 3) {
    return {
      status: 'warning',
      color: 'text-warning',
      message: `${mediumAlerts} security warnings detected`,
    };
  }
  
  return {
    status: 'secure',
    color: 'text-success',
    message: 'System security is optimal',
  };
}

export function filterByRiskLevel<T extends { risk_level: RiskLevel }>(
  items: T[],
  minRisk: RiskLevel = 'low'
): T[] {
  const riskOrder: Record<RiskLevel, number> = {
    safe: 0,
    low: 1,
    medium: 2,
    high: 3,
  };
  
  const minLevel = riskOrder[minRisk];
  return items.filter(item => riskOrder[item.risk_level] >= minLevel);
}

export function sortByRisk<T extends { risk_level: RiskLevel }>(items: T[]): T[] {
  const riskOrder: Record<RiskLevel, number> = {
    high: 0,
    medium: 1,
    low: 2,
    safe: 3,
  };
  
  return [...items].sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
}

export function generateSummary(results: ScanResults): string {
  const { metrics } = results;
  const issues: string[] = [];
  
  if (metrics.suspicious_processes > 0) {
    issues.push(`${metrics.suspicious_processes} suspicious processes`);
  }
  if (metrics.high_risk_ports > 0) {
    issues.push(`${metrics.high_risk_ports} high-risk ports`);
  }
  if (metrics.suspicious_startup > 0) {
    issues.push(`${metrics.suspicious_startup} suspicious startup items`);
  }
  
  if (issues.length === 0) {
    return 'No security issues detected';
  }
  
  return `Found: ${issues.join(', ')}`;
}
