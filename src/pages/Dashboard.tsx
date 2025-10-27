import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SecurityMetrics } from "@/components/security/SecurityMetrics";
import { ScanResults } from "@/types/security";
import { Shield, Play, RefreshCw, Clock, CheckCircle, Download, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuickScan, useFullScan } from "@/hooks/useSecurityAPI";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import { ActivityTimeline } from "@/components/security/ActivityTimeline";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { HelpDialog } from "@/components/ui/help-dialog";
import { exportToJSON } from "@/utils/exportUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Dashboard() {
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  
  const quickScanMutation = useQuickScan();
  const fullScanMutation = useFullScan();

  const runQuickScan = async () => {
    setScanProgress(0);
    
    toast({
      title: "Security Scan Started",
      description: "Running quick security assessment...",
    });

    // Simulate scan progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const results = await quickScanMutation.mutateAsync();
      setScanResults(results as ScanResults);
      setScanProgress(100);
      clearInterval(progressInterval);
      
      toast({
        title: "Scan Complete",
        description: `Quick scan completed successfully`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setScanProgress(0);
      // Error toast is handled by the hook
    }
  };

  const runFullScan = async () => {
    setScanProgress(0);
    
    toast({
      title: "Full Security Scan Started",
      description: "Running comprehensive security analysis...",
    });

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const results = await fullScanMutation.mutateAsync();
      setScanResults(results as ScanResults);
      setScanProgress(100);
      clearInterval(progressInterval);
      
      toast({
        title: "Full Scan Complete",
        description: `Comprehensive scan completed successfully`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setScanProgress(0);
    }
  };

  const isScanning = quickScanMutation.isPending || fullScanMutation.isPending;

  const getSystemStatus = (): { status: string; color: "default" | "destructive" | "outline" | "secondary" } => {
    if (!scanResults) return { status: "unknown", color: "secondary" };
    
    const { alerts_count } = scanResults.metrics;
    if (alerts_count.high > 0) return { status: "critical", color: "destructive" };
    if (alerts_count.medium > 0) return { status: "warning", color: "secondary" };
    return { status: "secure", color: "default" };
  };

  const systemStatus = getSystemStatus();

  const handleExportResults = () => {
    if (!scanResults) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "Run a scan first to export results.",
      });
      return;
    }
    
    exportToJSON(scanResults, `babypluto-scan-${Date.now()}`);
    toast({
      title: "Export Successful",
      description: "Scan results exported as JSON file.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              BabyPluto Security Dashboard
            </h1>
            <HelpDialog 
              title="Dashboard Help"
              description="Learn how to use the security dashboard effectively"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Quick Scan</h4>
                  <p>Performs a rapid security assessment of your system, checking processes, ports, and startup items.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Full Scan</h4>
                  <p>Comprehensive security analysis including file integrity checks and detailed baseline comparison.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Export Results</h4>
                  <p>Save scan results as JSON for documentation, sharing, or further analysis.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Connection Status</h4>
                  <p>Green badge indicates backend is online. If offline, ensure Python backend is running with <code>run.sh</code> or <code>run.bat</code>.</p>
                </div>
              </div>
            </HelpDialog>
          </div>
          <p className="text-muted-foreground">
            Monitor your system security and detect potential threats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatus />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={runQuickScan}
                  disabled={isScanning}
                  variant="default"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Quick Scan
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rapid security assessment (~30 seconds)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={runFullScan}
                  disabled={isScanning}
                  variant="outline"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Full Scan
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comprehensive analysis with file integrity (~2 minutes)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportResults}
                  disabled={!scanResults}
                  variant="ghost"
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export scan results as JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Security Scan in Progress
            </CardTitle>
            <CardDescription>
              Analyzing processes, network connections, and system integrity...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(scanProgress)}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </span>
            <Badge variant={systemStatus.color}>
              {systemStatus.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-security-safe" />
              <span className="text-sm">Real-time monitoring active</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Last scan: {scanResults ? new Date(scanResults.timestamp).toLocaleTimeString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm">Security level: Enhanced</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      {scanResults && <SecurityMetrics metrics={scanResults.metrics} />}

      {/* Activity and Alerts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Alerts */}
        {scanResults && scanResults.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Alerts</CardTitle>
              <CardDescription>
                Latest security events requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanResults.alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between border-l-4 border-l-security-medium pl-4 py-2">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Timeline */}
        <ActivityTimeline />
      </div>

      {/* Metrics Comparison Chart */}
      {scanResults && (
        <BarComparisonChart
          title="Security Metrics Comparison"
          description="Current vs baseline metrics"
          data={[
            { name: "Processes", current: scanResults.metrics.total_processes, previous: 125 },
            { name: "Ports", current: scanResults.metrics.open_ports, previous: 15 },
            { name: "Startup", current: scanResults.metrics.startup_items, previous: 22 },
            { name: "Alerts", current: scanResults.metrics.alerts_count.high + scanResults.metrics.alerts_count.medium, previous: 5 },
          ]}
        />
      )}
    </div>
  );
}