import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useBaselines, 
  useCreateBaseline, 
  useActivateBaseline, 
  useDeleteBaseline,
  useActiveBaseline,
  useCompareWithBaseline
} from '@/hooks/useBaseline';
import { BaselineCard } from '@/components/baseline/BaselineCard';
import { ComparisonResults } from '@/components/baseline/ComparisonResults';
import { 
  Database, 
  Plus, 
  GitCompare, 
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaselineComparison } from '@/types/baseline';

export default function Baseline() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [baselineName, setBaselineName] = useState('');
  const [baselineDescription, setBaselineDescription] = useState('');
  const [comparisonResult, setComparisonResult] = useState<BaselineComparison | null>(null);

  const { data: baselinesData, isLoading, isError, error } = useBaselines();
  const { data: activeData } = useActiveBaseline();
  const createMutation = useCreateBaseline();
  const activateMutation = useActivateBaseline();
  const deleteMutation = useDeleteBaseline();
  const compareMutation = useCompareWithBaseline();

  const handleCreateBaseline = async () => {
    if (!baselineName.trim()) {
      toast.error('Please enter a baseline name');
      return;
    }

    try {
      await createMutation.mutateAsync({ 
        name: baselineName, 
        description: baselineDescription 
      });
      toast.success(`Baseline "${baselineName}" created successfully`);
      setBaselineName('');
      setBaselineDescription('');
      setCreateDialogOpen(false);
    } catch (err) {
      toast.error('Failed to create baseline');
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success('Baseline activated');
    } catch (err) {
      toast.error('Failed to activate baseline');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this baseline?')) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Baseline deleted');
    } catch (err) {
      toast.error('Failed to delete baseline');
    }
  };

  const handleCompare = async () => {
    if (!activeData?.exists) {
      toast.error('No active baseline to compare with');
      return;
    }

    try {
      const result = await compareMutation.mutateAsync(undefined);
      setComparisonResult(result);
      toast.success('Comparison completed');
    } catch (err) {
      toast.error('Failed to compare with baseline');
    }
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load baselines'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            System Baseline
          </h1>
          <p className="text-muted-foreground mt-1">
            Create snapshots and detect system changes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCompare}
            disabled={!activeData?.exists || compareMutation.isPending}
            variant="outline"
          >
            {compareMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <GitCompare className="h-4 w-4 mr-2" />
            )}
            Compare Now
          </Button>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Baseline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Baseline</DialogTitle>
                <DialogDescription>
                  Capture a snapshot of your system's current state for future comparison
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Baseline Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Clean System - January 2024"
                    value={baselineName}
                    onChange={(e) => setBaselineName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add notes about this baseline..."
                    value={baselineDescription}
                    onChange={(e) => setBaselineDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleCreateBaseline} 
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  Create Baseline
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>What is a Baseline?</AlertTitle>
        <AlertDescription>
          A baseline is a snapshot of your system at a specific point in time. 
          You can compare your current system state against baselines to detect changes, 
          new processes, open ports, or startup items that weren't present before.
        </AlertDescription>
      </Alert>

      {/* Active Baseline Info */}
      {activeData?.exists && activeData.baseline && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm">Active Baseline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{activeData.baseline.name}</div>
                <div className="text-sm text-muted-foreground">
                  {activeData.baseline.description || 'No description'}
                </div>
              </div>
              <Button onClick={handleCompare} disabled={compareMutation.isPending}>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <ComparisonResults comparison={comparisonResult} />
      )}

      {/* Baselines List */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Baselines</CardTitle>
          <CardDescription>
            Manage your system snapshots
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : baselinesData?.baselines && baselinesData.baselines.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {baselinesData.baselines.map((baseline) => (
                <BaselineCard
                  key={baseline.id}
                  baseline={baseline}
                  onActivate={handleActivate}
                  onDelete={handleDelete}
                  onViewDetails={(id) => toast.info('View details - Coming soon')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No baselines created yet</p>
              <p className="text-sm mt-2">Create your first baseline to start tracking system changes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
