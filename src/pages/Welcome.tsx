import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Play, BookOpen, Github, FileText, Zap, Lock, Activity, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import { Separator } from "@/components/ui/separator";

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "Process Monitor",
      description: "Monitor running processes and detect suspicious activity in real-time",
    },
    {
      icon: Lock,
      title: "Network Security",
      description: "Scan open ports and network connections to identify vulnerabilities",
    },
    {
      icon: Shield,
      title: "Baseline Analysis",
      description: "Create and compare system baselines to detect unauthorized changes",
    },
    {
      icon: FileText,
      title: "File Integrity",
      description: "Monitor critical system files and detect modifications",
    },
  ];

  const quickStart = [
    "Ensure the Python backend is running (run setup.sh/setup.bat first)",
    "Click 'Quick Scan' to perform a rapid security assessment",
    "Navigate through the sidebar to explore different security modules",
    "Create a baseline to track changes over time",
    "Export reports for documentation and analysis",
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">BabyPluto</h1>
          <Badge variant="secondary">v1.0.0</Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Open-source Security Analysis Tool for Educational Purposes
        </p>
        <div className="flex items-center justify-center gap-2">
          <ConnectionStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={() => navigate("/dashboard")} className="gap-2">
          <Play className="h-5 w-5" />
          Start Security Scan
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.open("https://github.com/yourusername/babypluto", "_blank")} className="gap-2">
          <Github className="h-5 w-5" />
          View on GitHub
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.open("/docs/USER_GUIDE.md", "_blank")} className="gap-2">
          <BookOpen className="h-5 w-5" />
          Documentation
        </Button>
      </div>

      <Separator />

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            What is BabyPluto?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            BabyPluto is an educational security analysis tool designed to help students and security enthusiasts 
            understand system security concepts through hands-on practice. It provides real-time monitoring of 
            processes, network connections, file integrity, and startup items.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Fast & Lightweight</h4>
                <p className="text-sm text-muted-foreground">Built with React + Python for optimal performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Educational Focus</h4>
                <p className="text-sm text-muted-foreground">Learn security concepts through practical application</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Well Documented</h4>
                <p className="text-sm text-muted-foreground">Comprehensive guides and API documentation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Github className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Open Source</h4>
                <p className="text-sm text-muted-foreground">MIT licensed, contributions welcome</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get started with BabyPluto in 5 simple steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {quickStart.map((step, index) => (
              <li key={index} className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                  {index + 1}
                </Badge>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Shield className="h-5 w-5" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Educational Use Only:</strong> This tool is designed for learning and educational purposes. 
            Always use it responsibly and only on systems you own or have permission to test.
          </p>
          <p className="text-sm text-muted-foreground">
            🔒 <strong>Admin/Root Access:</strong> Some features require elevated privileges to function properly. 
            Run with appropriate permissions when needed.
          </p>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-semibold">Ready to start?</h3>
        <Button size="lg" onClick={() => navigate("/dashboard")} className="gap-2">
          <Play className="h-5 w-5" />
          Launch Dashboard
        </Button>
      </div>
    </div>
  );
}
