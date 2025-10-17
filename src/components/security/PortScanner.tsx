import { useState } from 'react';
import { NetworkPort } from '@/types/security';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getRiskBadgeVariant } from '@/utils/securityUtils';
import { Search, Wifi } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PortScannerProps {
  ports: NetworkPort[];
}

export function PortScanner({ ports }: PortScannerProps) {
  const [search, setSearch] = useState('');

  const filteredPorts = ports.filter(port => 
    port.local_port.toString().includes(search) ||
    port.process_name?.toLowerCase().includes(search.toLowerCase()) ||
    port.local_address.includes(search)
  );

  const highRiskPorts = ports.filter(p => p.risk_level === 'high').length;
  const listeningPorts = ports.filter(p => p.status === 'LISTEN').length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Open Ports</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening</CardTitle>
            <Wifi className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listeningPorts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Wifi className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highRiskPorts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by port, process, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Port</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Process</TableHead>
              <TableHead>PID</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPorts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No ports found
                </TableCell>
              </TableRow>
            ) : (
              filteredPorts.map((port, idx) => (
                <TableRow key={`${port.local_port}-${idx}`}>
                  <TableCell className="font-mono font-medium">{port.local_port}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{port.protocol.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{port.local_address}</TableCell>
                  <TableCell>
                    <Badge variant={port.status === 'LISTEN' ? 'default' : 'secondary'}>
                      {port.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{port.process_name || 'N/A'}</TableCell>
                  <TableCell className="font-mono">{port.pid || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(port.risk_level)}>
                      {port.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredPorts.length} of {ports.length} ports
      </div>
    </div>
  );
}
