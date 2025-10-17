import { SecurityAlert } from '@/types/security';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRiskBadgeVariant } from '@/utils/securityUtils';
import { AlertTriangle, Shield, Network, FileWarning, Activity, CheckCircle } from 'lucide-react';

interface AlertsListProps {
  alerts: SecurityAlert[];
  onResolve?: (alertId: string) => void;
}

export function AlertsList({ alerts, onResolve }: AlertsListProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'process':
        return <Activity className="h-5 w-5" />;
      case 'port':
        return <Network className="h-5 w-5" />;
      case 'startup':
        return <Shield className="h-5 w-5" />;
      case 'file':
        return <FileWarning className="h-5 w-5" />;
      case 'network':
        return <Network className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-success mb-4" />
          <p className="text-lg font-medium">No Active Alerts</p>
          <p className="text-sm text-muted-foreground">Your system is secure</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`${alert.severity === 'high' ? 'text-destructive' : alert.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                  <CardDescription>
                    {new Date(alert.timestamp * 1000).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRiskBadgeVariant(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline">{alert.type}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>
            {!alert.resolved && onResolve && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(alert.id)}
              >
                Mark as Resolved
              </Button>
            )}
            {alert.resolved && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Resolved
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
