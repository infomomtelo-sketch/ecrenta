import {
  Bot, LayoutDashboard, Inbox, ClipboardCheck, Wrench,
  Plus, FileText, LogOut, Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "P8 Assistant", url: "/p8", icon: Sparkles },
  { title: "Inbox", url: "/inbox", icon: Inbox },
];

const toolsNav = [
  { title: "Inspections", url: "/inspections", icon: ClipboardCheck },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Add Property", url: "/add-property", icon: Plus },
  { title: "Blog Editor", url: "/blog/new", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="px-3 py-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold font-heading leading-tight">ecrenta</span>
              <span className="text-[10px] text-muted-foreground leading-tight">for your business</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end={item.url === "/dashboard"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} end={item.url === "/blog/new"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        {!collapsed && profile?.display_name && (
          <p className="text-xs text-muted-foreground truncate mb-2 px-2">
            {profile.display_name}
          </p>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
