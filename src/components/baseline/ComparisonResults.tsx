import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BaselineComparison } from '@/types/baseline';
import { getRiskBadgeVariant } from '@/utils/securityUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Activity,
  Wifi,
  Zap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ComparisonResultsProps {
  comparison: BaselineComparison;
}

export function ComparisonResults({ comparison }: ComparisonResultsProps) {
  const { differences, baseline, compared_at } = comparison;
  const { summary } = differences;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Alert variant={summary.risk_level === 'high' ? 'destructive' : 'default'}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Comparison Complete</AlertTitle>
        <AlertDescription>
          Compared current system state with baseline "{baseline.name}" 
          (created {new Date(baseline.created_at).toLocaleDateString()})
        </AlertDescription>
      </Alert>

      {/* Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{summary.risk_score.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Risk Score (0-100)</div>
            </div>
            <Badge variant={getRiskBadgeVariant(summary.risk_level)} className="text-lg px-4 py-2">
              {summary.risk_level.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{summary.new_processes}</span>
                <span className="text-sm text-muted-foreground">New</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">{summary.removed_processes}</span>
                <span className="text-sm">Removed</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">{differences.processes.unchanged}</span>
                <span className="text-sm">Unchanged</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Network Ports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{summary.new_ports}</span>
                <span className="text-sm text-muted-foreground">Opened</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">{summary.closed_ports}</span>
                <span className="text-sm">Closed</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">{differences.ports.unchanged}</span>
                <span className="text-sm">Unchanged</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Startup Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{summary.new_startup}</span>
                <span className="text-sm text-muted-foreground">Added</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">{summary.removed_startup}</span>
                <span className="text-sm">Removed</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">{differences.startup_items.unchanged}</span>
                <span className="text-sm">Unchanged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Changes</CardTitle>
          <CardDescription>
            Review all detected changes since baseline creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="processes">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="processes">
                Processes ({differences.processes.added.length + differences.processes.removed.length})
              </TabsTrigger>
              <TabsTrigger value="ports">
                Ports ({differences.ports.added.length + differences.ports.removed.length})
              </TabsTrigger>
              <TabsTrigger value="startup">
                Startup ({differences.startup_items.added.length + differences.startup_items.removed.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="processes" className="space-y-4">
              {differences.processes.added.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-success">New Processes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>PID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Risk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.processes.added.map((proc, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{proc.name}</TableCell>
                          <TableCell>{proc.pid}</TableCell>
                          <TableCell>{proc.username}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(proc.risk_level)}>
                              {proc.risk_level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.processes.removed.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-muted-foreground">Removed Processes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>PID</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.processes.removed.map((proc, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{proc.name}</TableCell>
                          <TableCell>{proc.pid}</TableCell>
                          <TableCell>{proc.username}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.processes.added.length === 0 && differences.processes.removed.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No process changes detected
                </div>
              )}
            </TabsContent>

            <TabsContent value="ports" className="space-y-4">
              {differences.ports.added.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-success">Opened Ports</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Port</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Risk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.ports.added.map((port, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{port.local_port}</TableCell>
                          <TableCell>{port.protocol.toUpperCase()}</TableCell>
                          <TableCell>{port.local_address}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(port.risk_level)}>
                              {port.risk_level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.ports.removed.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-muted-foreground">Closed Ports</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Port</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.ports.removed.map((port, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{port.local_port}</TableCell>
                          <TableCell>{port.protocol.toUpperCase()}</TableCell>
                          <TableCell>{port.local_address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.ports.added.length === 0 && differences.ports.removed.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No port changes detected
                </div>
              )}
            </TabsContent>

            <TabsContent value="startup" className="space-y-4">
              {differences.startup_items.added.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-success">Added Startup Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Risk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.startup_items.added.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(item.risk_level)}>
                              {item.risk_level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.startup_items.removed.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-muted-foreground">Removed Startup Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {differences.startup_items.removed.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {differences.startup_items.added.length === 0 && differences.startup_items.removed.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No startup changes detected
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
