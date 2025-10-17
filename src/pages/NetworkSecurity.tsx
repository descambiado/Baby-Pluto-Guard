import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PortScanner } from '@/components/security/PortScanner';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateMockScanResults } from '@/utils/mockData';
import { NetworkPort } from '@/types/security';

export default function NetworkSecurity() {
  const [ports, setPorts] = useState<NetworkPort[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockScanResults();
      setPorts(mockData.ports);
      setLoading(false);
    }, 800);
  };

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
        <Button onClick={loadPorts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
          <PortScanner ports={ports} />
        </CardContent>
      </Card>
    </div>
  );
}
