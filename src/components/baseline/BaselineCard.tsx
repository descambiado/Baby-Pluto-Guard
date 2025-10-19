import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BaselineSummary } from '@/types/baseline';
import { CheckCircle2, Trash2, Power } from 'lucide-react';
import { formatTimestamp } from '@/utils/securityUtils';

interface BaselineCardProps {
  baseline: BaselineSummary;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export function BaselineCard({ baseline, onActivate, onDelete, onViewDetails }: BaselineCardProps) {
  return (
    <Card className={baseline.is_active ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {baseline.name}
              {baseline.is_active && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{baseline.description || 'No description'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Created: {formatTimestamp(new Date(baseline.created_at).getTime() / 1000)}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Processes:</span>
              <span className="ml-2 font-medium">{baseline.metrics.total_processes}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ports:</span>
              <span className="ml-2 font-medium">{baseline.metrics.total_ports}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Startup Items:</span>
              <span className="ml-2 font-medium">{baseline.metrics.total_startup_items}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Files:</span>
              <span className="ml-2 font-medium">{baseline.metrics.total_files}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(baseline.id)}
              className="flex-1"
            >
              View Details
            </Button>
            
            {!baseline.is_active && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onActivate(baseline.id)}
              >
                <Power className="h-4 w-4 mr-1" />
                Activate
              </Button>
            )}
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(baseline.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
