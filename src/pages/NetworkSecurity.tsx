import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PortScanner } from '@/components/security/PortScanner';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, AlertCircle } from 'lucide-react';
import { usePorts } from '@/hooks/useSecurityAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NetworkSecurity() {
  const { data: ports, isLoading, isError, error, refetch } = usePorts();

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load network ports'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wifi className="h-8 w-8" />
            Network Security
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor network ports and connections
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Scan Ports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Ports & Connections</CardTitle>
          <CardDescription>
            All active network ports with their associated processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <PortScanner ports={ports || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
