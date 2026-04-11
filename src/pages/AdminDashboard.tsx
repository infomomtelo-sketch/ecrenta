import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Building2, BarChart3, FolderOpen, Eye, Trash2, Ban, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UserRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  role?: string;
}

interface ListingRow {
  id: string;
  title: string;
  address: string;
  price: number;
  available: boolean;
  created_at: string;
  user_id: string | null;
}

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalConversations: number;
  totalInspections: number;
  totalMaintenanceRequests: number;
}

const PROJECTS = [
  { name: "Runp8", id: "7f219471-abb9-46a6-b27d-0a04e60d77da" },
  { name: "@DropVault", id: "e4172f48-84c3-4a57-a5d3-2e955355545b" },
  { name: "Fluentra AI", id: "f4e17d0c-a51c-4e15-8351-5bddcc1b3970" },
  { name: "Digital Ledger Enhanced", id: "c3a1114d-ad71-4f5a-a5b0-347c6c0d2df2" },
  { name: "EC-TaxBuddy", id: "7bf2fce3-27a5-4eb0-bdc1-15f13a79acd3" },
  { name: "Project Showcase Hub", id: "c60ae536-32d2-4096-bc45-cd5090f8dd5a" },
];

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    totalConversations: 0,
    totalInspections: 0,
    totalMaintenanceRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [profilesRes, listingsRes, convsRes, inspRes, maintRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, avatar_url, created_at"),
      supabase.from("listings").select("id, title, address, price, available, created_at, user_id").order("created_at", { ascending: false }),
      supabase.from("conversations").select("id", { count: "exact", head: true }),
      supabase.from("inspections").select("id", { count: "exact", head: true }),
      supabase.from("maintenance_requests").select("id", { count: "exact", head: true }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    const profiles = profilesRes.data || [];
    const roles = rolesRes.data || [];
    const roleMap = new Map(roles.map((r) => [r.user_id, r.role]));

    setUsers(
      profiles.map((p) => ({ ...p, role: roleMap.get(p.user_id) || "none" }))
    );

    const allListings = listingsRes.data || [];
    setListings(allListings);

    setStats({
      totalUsers: profiles.length,
      totalListings: allListings.length,
      activeListings: allListings.filter((l) => l.available).length,
      totalConversations: convsRes.count || 0,
      totalInspections: inspRes.count || 0,
      totalMaintenanceRequests: maintRes.count || 0,
    });

    setLoading(false);
  }

  const toggleListing = async (id: string, available: boolean) => {
    const { error } = await supabase.from("listings").update({ available: !available }).eq("id", id);
    if (error) {
      toast.error("Failed to update listing");
    } else {
      toast.success(available ? "Listing deactivated" : "Listing activated");
      fetchAll();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | E.Crenta</title>
        <meta name="description" content="Admin panel for managing users, listings, and analytics." />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage users, moderate listings, and view analytics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Users", value: stats.totalUsers, icon: Users },
            { label: "Listings", value: stats.totalListings, icon: Building2 },
            { label: "Active", value: stats.activeListings, icon: CheckCircle },
            { label: "Chats", value: stats.totalConversations, icon: BarChart3 },
            { label: "Inspections", value: stats.totalInspections, icon: Eye },
            { label: "Repairs", value: stats.totalMaintenanceRequests, icon: BarChart3 },
          ].map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <s.icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-11">
            <TabsTrigger value="users" className="text-xs sm:text-sm gap-1">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="listings" className="text-xs sm:text-sm gap-1">
              <Building2 className="w-4 h-4" /> Listings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm gap-1">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm gap-1">
              <FolderOpen className="w-4 h-4" /> Projects
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>{users.length} registered users</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[500px]">
                  <div className="divide-y divide-border">
                    {users.map((u) => (
                      <div key={u.user_id} className="flex items-center gap-3 px-4 py-3">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {u.display_name || "No name"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={u.role === "admin" ? "default" : u.role === "landlord" ? "secondary" : "outline"} className="text-[10px]">
                          {u.role || "none"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Listings Moderation</CardTitle>
                <CardDescription>{listings.length} total listings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[500px]">
                  <div className="divide-y divide-border">
                    {listings.map((l) => (
                      <div key={l.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{l.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{l.address}</p>
                          <p className="text-xs text-muted-foreground">
                            ${l.price.toLocaleString()} · {new Date(l.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={l.available ? "default" : "outline"} className="text-[10px] flex-shrink-0">
                          {l.available ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => toggleListing(l.id, l.available)}
                          title={l.available ? "Deactivate" : "Activate"}
                        >
                          {l.available ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-primary" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Platform activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Total Users", value: stats.totalUsers, desc: "Registered accounts" },
                    { label: "Total Listings", value: stats.totalListings, desc: `${stats.activeListings} currently active` },
                    { label: "Conversations", value: stats.totalConversations, desc: "Tenant-landlord chats" },
                    { label: "Inspections", value: stats.totalInspections, desc: "Property inspections" },
                    { label: "Maintenance", value: stats.totalMaintenanceRequests, desc: "Repair requests filed" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border p-4">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Lovable Projects</CardTitle>
                <CardDescription>All your builds in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROJECTS.map((p) => (
                    <a
                      key={p.id}
                      href={`https://lovable.dev/projects/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Lovable project</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
