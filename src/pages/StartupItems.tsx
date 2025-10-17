import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StartupTable } from '@/components/security/StartupTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateMockScanResults } from '@/utils/mockData';
import { StartupItem } from '@/types/security';

export default function StartupItems() {
  const [startupItems, setStartupItems] = useState<StartupItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStartupItems();
  }, []);

  const loadStartupItems = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockScanResults();
      setStartupItems(mockData.startup_items);
      setLoading(false);
    }, 600);
  };

  const suspiciousCount = startupItems.filter(item => 
    item.risk_level === 'high' || item.risk_level === 'medium'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Startup Items
          </h1>
          <p className="text-muted-foreground mt-1">
            Programs that run automatically at system startup
          </p>
        </div>
        <Button onClick={loadStartupItems} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startupItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{suspiciousCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {startupItems.filter(item => item.enabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Startup Configuration</CardTitle>
          <CardDescription>
            Review and manage programs that start with your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StartupTable startupItems={startupItems} />
        </CardContent>
      </Card>
    </div>
  );
}
