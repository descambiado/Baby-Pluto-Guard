import { useBackendHealth } from '@/hooks/useSecurityAPI';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ConnectionStatus() {
  const { data, isLoading, isError } = useBackendHealth();

  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Connecting...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connecting to backend server...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isError || !data) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="gap-2">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cannot connect to backend server</p>
            <p className="text-xs text-muted-foreground">Make sure the server is running on port 8000</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
            <Wifi className="h-3 w-3" />
            Connected
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Backend server is online</p>
          <p className="text-xs text-muted-foreground">Status: {data.status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
