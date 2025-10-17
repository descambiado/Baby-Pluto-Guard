import { FileIntegrityCheck } from '@/types/security';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getRiskBadgeVariant, formatTimestamp } from '@/utils/securityUtils';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface FileIntegrityTableProps {
  files: FileIntegrityCheck[];
}

export function FileIntegrityTable({ files }: FileIntegrityTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'modified':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'new':
        return <Shield className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Path</TableHead>
              <TableHead>Current Hash</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No files scanned
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-sm max-w-md truncate" title={file.file_path}>
                    {file.file_path}
                  </TableCell>
                  <TableCell className="font-mono text-xs max-w-xs truncate" title={file.current_hash}>
                    {file.current_hash || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {file.last_modified ? formatTimestamp(file.last_modified) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <Badge variant="outline">{file.status.toUpperCase()}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(file.risk_level)}>
                      {file.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {files.length} file integrity checks
      </div>
    </div>
  );
}
