import { Shield, Activity, Network, HardDrive, AlertTriangle, FileText, Settings, Scan, Database } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Shield },
  { title: "Process Monitor", url: "/processes", icon: Activity },
  { title: "Network Security", url: "/network", icon: Network },
  { title: "Startup Items", url: "/startup", icon: Scan },
  { title: "File Integrity", url: "/integrity", icon: HardDrive },
  { title: "System Baseline", url: "/baseline", icon: Database },
  { title: "Reports", url: "/reports", icon: FileText },
];

const toolItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function SecuritySidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <div className="flex items-center gap-2 px-4 py-3 mb-2">
              <img src="/logo.png" alt="Baby Pluto Guard Logo" className="h-8 w-8" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-primary">Baby Pluto Guard</span>
                <span className="text-xs text-sidebar-foreground/60">Security Scanner</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center px-2 py-3 mb-2">
              <img src="/logo.png" alt="Baby Pluto Guard Logo" className="h-8 w-8" />
            </div>
          )}
          <SidebarGroupLabel className="text-sidebar-primary font-semibold">
            {!collapsed && "Security Modules"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-semibold">
            {!collapsed && "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}