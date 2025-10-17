import { useState } from 'react';
import { SecurityProcess } from '@/types/security';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRiskBadgeVariant, formatTimestamp } from '@/utils/securityUtils';
import { Search } from 'lucide-react';

interface ProcessTableProps {
  processes: SecurityProcess[];
}

export function ProcessTable({ processes }: ProcessTableProps) {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredProcesses = processes.filter(proc => {
    const matchesSearch = proc.name.toLowerCase().includes(search.toLowerCase()) ||
                         proc.username.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'all' || proc.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by process name or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by risk" />
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>CPU %</TableHead>
              <TableHead>Memory %</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProcesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No processes found
                </TableCell>
              </TableRow>
            ) : (
              filteredProcesses.map((proc) => (
                <TableRow key={proc.pid}>
                  <TableCell className="font-mono">{proc.pid}</TableCell>
                  <TableCell className="font-medium">{proc.name}</TableCell>
                  <TableCell>{proc.username}</TableCell>
                  <TableCell>{proc.cpu_percent.toFixed(1)}%</TableCell>
                  <TableCell>{proc.memory_percent.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proc.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(proc.create_time)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(proc.risk_level)}>
                      {proc.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProcesses.length} of {processes.length} processes
      </div>
    </div>
  );
}
