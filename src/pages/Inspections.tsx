import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ClipboardCheck, Trash2, Eye, Calendar, Camera, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InspectionSchedules from "./InspectionSchedules";

interface Inspection {
  id: string;
  property_address: string;
  inspection_type: string;
  status: string;
  template_type: string;
  ai_report: any;
  created_at: string;
  photos: string[];
}

const typeLabels: Record<string, string> = {
  move_in: "Move-In",
  move_out: "Move-Out",
  routine: "Routine",
  annual: "Annual",
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: "bg-muted/60", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  analyzing: { bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  completed: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  archived: { bg: "bg-secondary", text: "text-secondary-foreground", dot: "bg-secondary-foreground" },
};

export default function Inspections() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("inspections")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setInspections((data as any[]) || []);
        setLoading(false);
      });
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("inspections").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete inspection", variant: "destructive" });
    } else {
      setInspections((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "Deleted", description: "Inspection removed" });
    }
  };

  const completedCount = inspections.filter((i) => i.status === "completed").length;
  const avgScore = inspections
    .filter((i) => i.ai_report?.overall_score)
    .reduce((sum, i, _, arr) => sum + i.ai_report.overall_score / arr.length, 0);
  const totalRepairs = inspections.reduce((sum, i) => sum + (i.ai_report?.total_estimated_repairs || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/8 via-background to-accent/5 border border-border/60 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">AI-Powered</span>
            </div>
            <h1 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-extrabold tracking-tight">
              Property Inspections
            </h1>
            <p className="text-muted-foreground mt-1.5 max-w-md">
              Templates, AI photo analysis, scheduling & shareable reports — all in one place.
            </p>
          </div>
          <Button size="lg" className="shadow-lg shadow-primary/20 shrink-0" asChild>
            <Link to="/inspections/new">
              <Plus className="h-5 w-5 mr-1.5" />New Inspection
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        {inspections.length > 0 && (
          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Inspections", value: completedCount, icon: ClipboardCheck },
              { label: "Avg Score", value: avgScore ? `${avgScore.toFixed(1)}/10` : "—", icon: TrendingUp },
              { label: "Est. Repairs", value: totalRepairs > 0 ? `$${totalRepairs.toLocaleString()}` : "$0", icon: AlertTriangle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 px-4 py-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
                </div>
                <p className="font-[var(--font-heading)] text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="inspections">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="inspections" className="gap-1.5 data-[state=active]:shadow-sm">
            <ClipboardCheck className="h-4 w-4" />Inspections
          </TabsTrigger>
          <TabsTrigger value="schedules" className="gap-1.5 data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4" />Schedules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : inspections.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 mb-5">
                <ClipboardCheck className="h-10 w-10 text-primary/50" />
              </div>
              <h2 className="font-[var(--font-heading)] text-2xl font-bold mb-2">No inspections yet</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                Upload property photos or fill a checklist — AI generates detailed reports with repair estimates.
              </p>
              <Button size="lg" className="shadow-lg shadow-primary/20" asChild>
                <Link to="/inspections/new"><Plus className="h-5 w-5 mr-1.5" />Start Your First Inspection</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {inspections.map((insp) => {
                const sc = statusConfig[insp.status] || statusConfig.draft;
                return (
                  <div
                    key={insp.id}
                    className="group relative rounded-xl border border-border/60 bg-card hover:bg-card/90 transition-all duration-200 hover:shadow-md hover:border-border overflow-hidden"
                  >
                    <div className="flex items-stretch">
                      {/* Photo thumbnail */}
                      <div className="hidden sm:block w-28 shrink-0 bg-muted/30 border-r border-border/40">
                        {insp.photos?.[0] ? (
                          <img src={insp.photos[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Camera className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-[var(--font-heading)] text-base font-semibold truncate">{insp.property_address}</h3>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs text-muted-foreground">
                                {new Date(insp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <span className="text-muted-foreground/40">·</span>
                              <span className="text-xs text-muted-foreground">{insp.photos?.length || 0} photos</span>
                              {insp.template_type && insp.template_type !== "custom" && (
                                <>
                                  <span className="text-muted-foreground/40">·</span>
                                  <span className="text-xs text-muted-foreground">{insp.template_type.replace(/_/g, " ")}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className="text-[11px] font-medium border-border/60">
                              {typeLabels[insp.inspection_type] || insp.inspection_type}
                            </Badge>
                            <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} ${insp.status === "analyzing" ? "animate-pulse" : ""}`} />
                              {insp.status}
                            </div>
                          </div>
                        </div>

                        {/* Score row */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                          <div>
                            {insp.ai_report?.overall_score ? (
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                                  <span className="font-[var(--font-heading)] text-sm font-bold text-primary">
                                    {insp.ai_report.overall_score}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{insp.ai_report.overall_condition}</span>
                                  {insp.ai_report.total_estimated_repairs > 0 && (
                                    <span className="text-xs text-destructive ml-3">
                                      ${insp.ai_report.total_estimated_repairs?.toLocaleString()} repairs
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                {insp.status === "analyzing" ? "AI analysis in progress…" : "No AI report yet"}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs" asChild>
                              <Link to={`/inspections/${insp.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-1" />View
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(insp.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive/70" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-6">
          <InspectionSchedules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
