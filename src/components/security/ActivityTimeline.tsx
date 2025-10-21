import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, AlertTriangle, Shield, TrendingUp, TrendingDown } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "scan" | "alert" | "change" | "info";
  title: string;
  description: string;
  timestamp: number;
  severity?: "high" | "medium" | "low";
}

interface ActivityTimelineProps {
  events?: TimelineEvent[];
  maxHeight?: string;
}

export function ActivityTimeline({ events = [], maxHeight = "400px" }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "scan":
        return <Shield className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "change":
        return <Activity className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (severity?: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Generate mock events if none provided
  const displayEvents = events.length > 0 ? events : [
    {
      id: "1",
      type: "scan",
      title: "Full System Scan Completed",
      description: "All components scanned successfully",
      timestamp: Date.now() - 600000,
      severity: "low",
    },
    {
      id: "2",
      type: "alert",
      title: "Suspicious Process Detected",
      description: "Process 'unknown.exe' flagged for review",
      timestamp: Date.now() - 1200000,
      severity: "high",
    },
    {
      id: "3",
      type: "change",
      title: "Baseline Updated",
      description: "New baseline created and activated",
      timestamp: Date.now() - 1800000,
    },
  ] as TimelineEvent[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Timeline of security events and scans</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4">
            {displayEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    {getIcon(event.type)}
                  </div>
                  {index < displayEvents.length - 1 && (
                    <div className="h-full w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{event.title}</p>
                    {event.severity && (
                      <Badge variant={getSeverityVariant(event.severity)} className="text-xs">
                        {event.severity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
