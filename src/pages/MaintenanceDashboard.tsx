import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Plus, Clock, AlertTriangle, CheckCircle2, Bot, ArrowLeft, Loader2 } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: Clock },
  triaging: { label: "P8 Analyzing", color: "bg-yellow-100 text-yellow-800", icon: Bot },
  pending_review: { label: "Pending Review", color: "bg-accent/20 text-accent-foreground", icon: Clock },
  approved: { label: "Approved", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  needs_dispatch: { label: "Needs Dispatch", color: "bg-accent/20 text-accent-foreground", icon: Wrench },
  emergency: { label: "Emergency", color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Wrench },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

export default function MaintenanceDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchRequests = async () => {
    let query = supabase.from("maintenance_requests").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel("maintenance-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "maintenance_requests" }, () => fetchRequests())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  const stats = {
    total: requests.length,
    emergency: requests.filter((r) => r.status === "emergency").length,
    pending: requests.filter((r) => ["submitted", "triaging", "needs_dispatch"].includes(r.status)).length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Maintenance Requests | ecrenta</title></Helmet>

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Dashboard</Button>
            </Link>
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Maintenance Requests
            </h1>
          </div>
          <Link to="/repair">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Request</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, icon: Wrench, color: "text-foreground" },
            { label: "Emergencies", value: stats.emergency, icon: AlertTriangle, color: "text-destructive" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-accent" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-primary" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="emergency">🚨 Emergency</SelectItem>
              <SelectItem value="pending_review">⏳ Pending Review</SelectItem>
              <SelectItem value="approved">✅ Approved</SelectItem>
              <SelectItem value="rejected">❌ Rejected</SelectItem>
              <SelectItem value="needs_dispatch">🔧 Needs Dispatch</SelectItem>
              <SelectItem value="in_progress">🔨 In Progress</SelectItem>
              <SelectItem value="resolved">✅ Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-3">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No maintenance requests</h3>
              <p className="text-muted-foreground">Repair requests from tenants will appear here.</p>
              <Link to="/repair"><Button>Submit a Request</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.submitted;
              const StatusIcon = statusCfg.icon;
              return (
                <Link key={req.id} to={`/maintenance/${req.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${statusCfg.color}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate text-sm">{req.title}</h3>
                          <Badge variant="secondary" className="shrink-0 text-xs">{req.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{req.property_address}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.reporter_name} · {new Date(req.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`shrink-0 ${statusCfg.color} border-0`}>{statusCfg.label}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
