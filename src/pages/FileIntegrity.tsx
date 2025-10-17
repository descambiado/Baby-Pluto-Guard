import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileIntegrityTable } from '@/components/security/FileIntegrityTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateMockScanResults } from '@/utils/mockData';
import { FileIntegrityCheck } from '@/types/security';

export default function FileIntegrity() {
  const [files, setFiles] = useState<FileIntegrityCheck[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFileIntegrity();
  }, []);

  const loadFileIntegrity = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockScanResults();
      setFiles(mockData.file_integrity);
      setLoading(false);
    }, 700);
  };

  const modifiedCount = files.filter(f => f.status === 'modified').length;
  const missingCount = files.filter(f => f.status === 'missing').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileCheck className="h-8 w-8" />
            File Integrity
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor critical system files for unauthorized changes
          </p>
        </div>
        <Button onClick={loadFileIntegrity} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Integrity
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {files.filter(f => f.status === 'safe').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Modified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{modifiedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{missingCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Integrity Checks</CardTitle>
          <CardDescription>
            SHA-256 hash verification of critical system files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileIntegrityTable files={files} />
        </CardContent>
      </Card>
    </div>
  );
}
