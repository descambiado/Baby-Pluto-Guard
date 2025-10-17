import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { generateMockScanResults } from '@/utils/mockData';
import { exportToJSON, exportToHTML, exportToCSV } from '@/utils/exportUtils';
import { AlertsList } from '@/components/security/AlertsList';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const [scanResults] = useState(generateMockScanResults());
  const { toast } = useToast();

  const handleExportJSON = () => {
    exportToJSON(scanResults);
    toast({
      title: 'Export Complete',
      description: 'Scan results exported as JSON',
    });
  };

  const handleExportHTML = () => {
    exportToHTML(scanResults);
    toast({
      title: 'Export Complete',
      description: 'Security report exported as HTML',
    });
  };

  const handleExportCSV = () => {
    exportToCSV(scanResults.processes, 'processes');
    toast({
      title: 'Export Complete',
      description: 'Process data exported as CSV',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Security Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and export comprehensive security reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleExportJSON}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              JSON Export
            </CardTitle>
            <CardDescription>
              Complete scan data in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleExportHTML}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              HTML Report
            </CardTitle>
            <CardDescription>
              Formatted report for viewing in browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleExportCSV}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              CSV Export
            </CardTitle>
            <CardDescription>
              Spreadsheet-compatible data export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
          <CardDescription>
            All security alerts from the latest scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertsList alerts={scanResults.alerts} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scan Summary</CardTitle>
          <CardDescription>
            Overview of the last security scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm text-muted-foreground">Processes Scanned</div>
              <div className="text-2xl font-bold">{scanResults.metrics.total_processes}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Open Ports</div>
              <div className="text-2xl font-bold">{scanResults.metrics.open_ports}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Startup Items</div>
              <div className="text-2xl font-bold">{scanResults.metrics.startup_items}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">File Changes</div>
              <div className="text-2xl font-bold">{scanResults.metrics.file_changes}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
