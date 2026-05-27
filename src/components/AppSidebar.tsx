import {
  LayoutDashboard, Inbox, ClipboardCheck, Wrench,
  Plus, FileText, LogOut, Sparkles, Users, FileSignature, DollarSign, Target, Shield, Link2, Home,
} from "lucide-react";
import { ecrentaLogo } from "@/components/BrandLogo";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useHasSaas } from "@/components/SaasGate";

function useNavItems() {
  const hasSaas = useHasSaas();
  const { role } = useAuth();

  if (role === "tenant") {
    return {
      mainNav: [
        { title: "My Rental", url: "/tenant-portal", icon: Home },
        { title: "Browse Listings", url: "/listings", icon: LayoutDashboard },
        { title: "Inbox", url: "/inbox", icon: Inbox },
      ],
      managementNav: [],
      toolsNav: [
        { title: "Report Maintenance", url: "/repair", icon: Wrench },
      ],
    };
  }

  return {
    mainNav: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      ...(hasSaas ? [{ title: "P8 Assistant", url: "/p8", icon: Sparkles }] : []),
      { title: "Inbox", url: "/inbox", icon: Inbox },
    ],
    managementNav: [
      { title: "Tenants", url: "/tenants", icon: Users },
      { title: "Forms & Signatures", url: "/forms", icon: FileSignature },
      { title: "Invoices", url: "/invoices", icon: DollarSign },
      { title: "Rent Collection", url: "/rent-collection", icon: DollarSign },
    ],
    toolsNav: [
      { title: "Maintenance", url: "/maintenance", icon: Wrench },
      { title: "Add Property", url: "/add-property", icon: Plus },
      ...(hasSaas
        ? [
            { title: "Inspections", url: "/inspections", icon: ClipboardCheck },
            { title: "Outreach CRM", url: "/outreach", icon: Target },
            { title: "Capture Pages", url: "/capture-pages", icon: Link2 },
            { title: "Blog Editor", url: "/blog/new", icon: FileText },
          ]
        : []),
    ],
  };
}

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, profile, role } = useAuth();
  const mobile = useIsMobile();
  const showAdmin = role === "landlord" || role === "admin" as any;
  const { mainNav, managementNav, toolsNav } = useNavItems();

  const closeMobile = () => {
    if (mobile || isMobile) setOpenMobile(false);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="px-3 py-4">
        <NavLink to={role === "tenant" ? "/tenant-portal" : "/dashboard"} className="flex items-center gap-2">
          {collapsed ? (
            <img src={ecrentaLogo} alt="ecrenta" className="h-8 w-auto" />
          ) : (
            <img src={ecrentaLogo} alt="ecrenta" className="h-8 w-auto" />
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
                    <NavLink to={item.url} end={item.url === "/dashboard"} onClick={closeMobile}>
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
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} onClick={closeMobile}>
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
                    <NavLink to={item.url} end={item.url === "/blog/new"} onClick={closeMobile}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/admin")}
                    tooltip="Admin Panel"
                  >
                    <NavLink to="/admin" onClick={closeMobile}>
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
