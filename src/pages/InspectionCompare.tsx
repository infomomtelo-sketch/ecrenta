import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowLeftRight, Loader2 } from "lucide-react";

export default function InspectionCompare() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [current, setCurrent] = useState<any>(null);
  const [compareWith, setCompareWith] = useState<any>(null);
  const [allInspections, setAllInspections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from("inspections").select("*").eq("id", id).eq("user_id", user.id).single(),
      supabase.from("inspections").select("id, property_address, inspection_type, created_at, ai_report, photos").eq("user_id", user.id).neq("id", id).order("created_at", { ascending: false }),
    ]).then(([{ data: cur }, { data: all }]) => {
      setCurrent(cur);
      setAllInspections((all as any[]) || []);
      // Auto-select comparison if comparison_id is set
      if (cur?.comparison_id) {
        setSelectedId(cur.comparison_id);
      }
      setLoading(false);
    });
  }, [user, id]);

  useEffect(() => {
    if (!selectedId || !user) { setCompareWith(null); return; }
    supabase.from("inspections").select("*").eq("id", selectedId).eq("user_id", user.id).single()
      .then(({ data }) => setCompareWith(data));
  }, [selectedId, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sameAddress = allInspections.filter((i) =>
    i.property_address?.toLowerCase() === current?.property_address?.toLowerCase()
  );
  const otherAddress = allInspections.filter((i) =>
    i.property_address?.toLowerCase() !== current?.property_address?.toLowerCase()
  );

  const renderScore = (report: any) => {
    if (!report?.overall_score) return <span className="text-muted-foreground text-sm">No AI report</span>;
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border-2 border-primary">
          <span className="font-[var(--font-heading)] text-2xl font-bold text-primary">{report.overall_score}</span>
        </div>
        <div>
          <p className="font-semibold">{report.overall_condition}</p>
          <p className="text-xs text-muted-foreground">/ 10</p>
        </div>
      </div>
    );
  };

  const renderPhotos = (photos: string[]) => {
    if (!photos?.length) return <p className="text-sm text-muted-foreground">No photos</p>;
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {photos.slice(0, 6).map((url, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
            <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
        {photos.length > 6 && (
          <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
            +{photos.length - 6}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-primary" />
            Compare Inspections
          </h1>
          <p className="text-muted-foreground mt-1">Side-by-side before & after analysis</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/inspections/${id}`}><ArrowLeft className="h-4 w-4 mr-1" />Back to Report</Link>
        </Button>
      </div>

      {/* Selector */}
      <Card>
        <CardContent className="pt-6">
          <label className="text-sm font-medium mb-2 block">Compare with:</label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Select an inspection to compare" /></SelectTrigger>
            <SelectContent>
              {sameAddress.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Same Property</div>
                  {sameAddress.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.inspection_type.replace("_", "-")} — {new Date(i.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </>
              )}
              {otherAddress.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-1">Other Properties</div>
                  {otherAddress.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.property_address} — {new Date(i.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Current</CardTitle>
              <Badge variant="default" className="text-xs">{current?.inspection_type?.replace("_", "-")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{current?.property_address}</p>
            <p className="text-xs text-muted-foreground">{new Date(current?.created_at).toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderScore(current?.ai_report)}
            {current?.ai_report?.total_estimated_repairs > 0 && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 inline-block">
                <p className="text-xs text-muted-foreground">Est. Repairs</p>
                <p className="font-bold text-destructive">${current.ai_report.total_estimated_repairs?.toLocaleString()}</p>
              </div>
            )}
            {renderPhotos(current?.photos || [])}
          </CardContent>
        </Card>

        {/* Comparison */}
        <Card className={!compareWith ? "opacity-50" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Comparison</CardTitle>
              {compareWith && (
                <Badge variant="secondary" className="text-xs">{compareWith.inspection_type?.replace("_", "-")}</Badge>
              )}
            </div>
            {compareWith ? (
              <>
                <p className="text-sm text-muted-foreground">{compareWith.property_address}</p>
                <p className="text-xs text-muted-foreground">{new Date(compareWith.created_at).toLocaleDateString()}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select an inspection to compare</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {compareWith ? (
              <>
                {renderScore(compareWith.ai_report)}
                {compareWith.ai_report?.total_estimated_repairs > 0 && (
                  <div className="rounded-lg bg-destructive/10 px-3 py-2 inline-block">
                    <p className="text-xs text-muted-foreground">Est. Repairs</p>
                    <p className="font-bold text-destructive">${compareWith.ai_report.total_estimated_repairs?.toLocaleString()}</p>
                  </div>
                )}
                {renderPhotos(compareWith.photos || [])}
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                <ArrowLeftRight className="h-8 w-8 opacity-30" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Room comparison table */}
      {current?.ai_report?.rooms && compareWith?.ai_report?.rooms && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Room-by-Room Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4">Room</th>
                    <th className="text-center py-2 px-4">Current</th>
                    <th className="text-center py-2 px-4">Comparison</th>
                    <th className="text-center py-2 pl-4">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {current.ai_report.rooms.map((room: any) => {
                    const match = compareWith.ai_report.rooms?.find((r: any) => r.name === room.name);
                    const diff = match ? room.score - match.score : null;
                    return (
                      <tr key={room.name} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium">{room.name}</td>
                        <td className="text-center py-2 px-4">
                          <Badge variant="secondary">{room.score}/10</Badge>
                        </td>
                        <td className="text-center py-2 px-4">
                          {match ? <Badge variant="secondary">{match.score}/10</Badge> : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="text-center py-2 pl-4">
                          {diff !== null ? (
                            <span className={`font-semibold ${diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                              {diff > 0 ? `+${diff}` : diff === 0 ? "—" : diff}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
