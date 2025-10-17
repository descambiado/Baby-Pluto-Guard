import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Network, AlertTriangle } from "lucide-react";
import { SecurityMetrics as SecurityMetricsType } from "@/types/security";

interface SecurityMetricsProps {
  metrics: SecurityMetricsType;
}

export function SecurityMetrics({ metrics }: SecurityMetricsProps) {
  const riskBadgeVariant = (count: number): "default" | "destructive" | "outline" | "secondary" => {
    if (count === 0) return "default";
    if (count <= 2) return "secondary";
    if (count <= 5) return "destructive";
    return "destructive";
  };

  const formatLastScan = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processes</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_processes}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Suspicious:</span>
            <Badge variant={riskBadgeVariant(metrics.suspicious_processes)}>
              {metrics.suspicious_processes}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Ports</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.open_ports}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>High Risk:</span>
            <Badge variant={riskBadgeVariant(metrics.high_risk_ports)}>
              {metrics.high_risk_ports}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Startup Items</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.startup_items}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Suspicious:</span>
            <Badge variant={riskBadgeVariant(metrics.suspicious_startup)}>
              {metrics.suspicious_startup}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.alerts_count.high + metrics.alerts_count.medium + metrics.alerts_count.low}
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Badge variant="destructive" className="text-xs">
              {metrics.alerts_count.high}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {metrics.alerts_count.medium}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {metrics.alerts_count.low}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Last scan: {formatLastScan(metrics.last_scan)}</span>
            </div>
            <div className="flex space-x-2">
              {metrics.file_changes > 0 && (
                <Badge variant="destructive">
                  {metrics.file_changes} file changes detected
                </Badge>
              )}
              {metrics.alerts_count.high > 0 && (
                <Badge variant="destructive">
                  {metrics.alerts_count.high} critical alerts
                </Badge>
              )}
              {metrics.alerts_count.high === 0 && metrics.alerts_count.medium === 0 && (
                <Badge variant="default" className="bg-security-safe">
                  System Secure
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}