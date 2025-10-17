import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessTable } from '@/components/security/ProcessTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateMockScanResults } from '@/utils/mockData';
import { SecurityProcess } from '@/types/security';

export default function ProcessMonitor() {
  const [processes, setProcesses] = useState<SecurityProcess[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockScanResults();
      setProcesses(mockData.processes);
      setLoading(false);
    }, 500);
  };

  const suspiciousCount = processes.filter(p => p.risk_level === 'high' || p.risk_level === 'medium').length;
  const avgCpu = processes.reduce((acc, p) => acc + p.cpu_percent, 0) / processes.length || 0;
  const avgMemory = processes.reduce((acc, p) => acc + p.memory_percent, 0) / processes.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Process Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of system processes
          </p>
        </div>
        <Button onClick={loadProcesses} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspicious</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{suspiciousCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMemory.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Processes</CardTitle>
          <CardDescription>
            All running processes with resource usage and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProcessTable processes={processes} />
        </CardContent>
      </Card>
    </div>
  );
}
