import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SecuritySidebar } from "@/components/layout/SecuritySidebar";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";
import Index from "./pages/Index";
import ProcessMonitor from "./pages/ProcessMonitor";
import NetworkSecurity from "./pages/NetworkSecurity";
import StartupItems from "./pages/StartupItems";
import FileIntegrity from "./pages/FileIntegrity";
import Baseline from "./pages/Baseline";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <SidebarProvider>
            <header className="h-12 flex items-center justify-between border-b bg-background px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="font-semibold text-foreground">BabyPluto Security</h1>
              </div>
              <ConnectionStatus />
            </header>
            
            <div className="flex min-h-screen w-full">
              <SecuritySidebar />
              
              <main className="flex-1 p-6 bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/processes" element={<ProcessMonitor />} />
                  <Route path="/network" element={<NetworkSecurity />} />
                  <Route path="/startup" element={<StartupItems />} />
                  <Route path="/integrity" element={<FileIntegrity />} />
                  <Route path="/baseline" element={<Baseline />} />
                  <Route path="/reports" element={<Reports />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
