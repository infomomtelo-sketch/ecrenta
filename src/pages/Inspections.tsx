import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ClipboardCheck, Trash2, Eye, Calendar } from "lucide-react";
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

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  analyzing: "bg-accent/20 text-accent",
  completed: "bg-primary/15 text-primary",
  archived: "bg-secondary text-secondary-foreground",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl font-bold">Property Inspections</h1>
          <p className="text-muted-foreground mt-1">AI-powered inspections with templates, scheduling & shareable reports</p>
        </div>
        <Button asChild>
          <Link to="/inspections/new"><Plus className="h-4 w-4 mr-1" />New Inspection</Link>
        </Button>
      </div>

      <Tabs defaultValue="inspections">
        <TabsList>
          <TabsTrigger value="inspections">
            <ClipboardCheck className="h-4 w-4 mr-1.5" />Inspections
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Calendar className="h-4 w-4 mr-1.5" />Schedules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : inspections.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="font-[var(--font-heading)] text-xl font-semibold mb-2">No inspections yet</h2>
                <p className="text-muted-foreground mb-6">Upload property photos or fill a checklist — AI generates detailed reports.</p>
                <Button asChild>
                  <Link to="/inspections/new"><Plus className="h-4 w-4 mr-1" />Start Your First Inspection</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {inspections.map((insp) => (
                <Card key={insp.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{insp.property_address}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(insp.created_at).toLocaleDateString()} · {insp.photos?.length || 0} photos
                          {insp.template_type && insp.template_type !== "custom" && (
                            <span className="ml-2">· {insp.template_type.replace(/_/g, " ")}</span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{typeLabels[insp.inspection_type] || insp.inspection_type}</Badge>
                        <Badge className={`text-xs ${statusColors[insp.status] || ""}`}>{insp.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        {insp.ai_report?.overall_score && (
                          <span className="text-sm font-medium">
                            Score: <span className="text-primary">{insp.ai_report.overall_score}/10</span>
                            {insp.ai_report.total_estimated_repairs > 0 && (
                              <span className="ml-3 text-destructive">
                                Est. Repairs: ${insp.ai_report.total_estimated_repairs?.toLocaleString()}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/inspections/${insp.id}`}><Eye className="h-4 w-4 mr-1" />View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(insp.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4">
          <InspectionSchedules />
        </TabsContent>
      </Tabs>
    </div>
  );
}
