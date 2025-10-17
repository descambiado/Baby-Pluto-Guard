import { useState } from 'react';
import { StartupItem } from '@/types/security';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getRiskBadgeVariant } from '@/utils/securityUtils';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface StartupTableProps {
  startupItems: StartupItem[];
}

export function StartupTable({ startupItems }: StartupTableProps) {
  const [search, setSearch] = useState('');

  const filteredItems = startupItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search startup items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No startup items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm max-w-md truncate" title={item.path}>
                    {item.path}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.location}
                  </TableCell>
                  <TableCell>{item.publisher || 'Unknown'}</TableCell>
                  <TableCell>
                    {item.enabled ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span>Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span>Disabled</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(item.risk_level)}>
                      {item.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {startupItems.length} startup items
      </div>
    </div>
  );
}
