import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessTable } from '@/components/security/ProcessTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, AlertCircle, Filter } from 'lucide-react';
import { useProcesses } from '@/hooks/useSecurityAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SearchInput } from '@/components/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { TrendChart } from '@/components/charts/TrendChart';

export default function ProcessMonitor() {
  const { data: processes, isLoading, isError, error, refetch } = useProcesses();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredProcesses = useMemo(() => {
    if (!processes) return [];
    
    return processes.filter(proc => {
      const matchesSearch = proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           proc.pid.toString().includes(searchQuery);
      const matchesRisk = riskFilter === 'all' || proc.risk_level === riskFilter;
      
      return matchesSearch && matchesRisk;
    });
  }, [processes, searchQuery, riskFilter]);

  const suspiciousCount = processes?.filter(proc => 
    proc.risk_level === 'high' || proc.risk_level === 'medium'
  ).length || 0;

  const avgCpu = processes?.reduce((acc, p) => acc + p.cpu_percent, 0) / (processes?.length || 1) || 0;
  const avgMemory = processes?.reduce((acc, p) => acc + p.memory_percent, 0) / (processes?.length || 1) || 0;

  // Generate CPU trend data
  const cpuTrend = Array.from({ length: 10 }, (_, i) => ({
    name: `${i * 30}s`,
    value: Math.random() * 100,
  }));

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load processes'}
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
            <Activity className="h-8 w-8" />
            Process Monitor
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of running processes
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Processes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{processes?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspicious</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-destructive">{suspiciousCount}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Memory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{avgMemory.toFixed(1)}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <TrendChart
          title="CPU Usage Trend"
          description="System CPU usage over time"
          data={cpuTrend}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Active Processes</CardTitle>
              <CardDescription>
                All currently running processes with security risk assessment
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchInput
                placeholder="Search processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                className="w-full sm:w-[250px]"
              />
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ProcessTable processes={filteredProcesses} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
