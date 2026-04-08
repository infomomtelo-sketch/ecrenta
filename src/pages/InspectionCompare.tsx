import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowLeftRight, Loader2, TrendingUp, TrendingDown, Minus, Camera } from "lucide-react";

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
      if (cur?.comparison_id) setSelectedId(cur.comparison_id);
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
      <div className="flex items-center justify-center py-24">
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

  const scoreColor = (score: number) =>
    score >= 8 ? "text-primary" : score >= 5 ? "text-accent" : "text-destructive";
  const scoreBg = (score: number) =>
    score >= 8 ? "bg-primary/10 border-primary/25" : score >= 5 ? "bg-accent/10 border-accent/25" : "bg-destructive/10 border-destructive/25";

  const renderSide = (data: any, label: string, variant: "current" | "compare") => {
    const report = data?.ai_report;
    return (
      <div className={`rounded-2xl border bg-card overflow-hidden ${variant === "current" ? "border-primary/20" : "border-border"} ${!data && variant === "compare" ? "opacity-40" : ""}`}>
        <div className={`px-5 py-3 border-b ${variant === "current" ? "bg-primary/5 border-primary/15" : "bg-muted/30 border-border"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-widest ${variant === "current" ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            {data && <Badge variant="outline" className="text-[11px]">{data.inspection_type?.replace("_", "-")}</Badge>}
          </div>
          {data ? (
            <div className="mt-1.5">
              <p className="text-sm font-semibold truncate">{data.property_address}</p>
              <p className="text-xs text-muted-foreground">{new Date(data.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1.5">Select an inspection to compare</p>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Score */}
          {report?.overall_score ? (
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 ${scoreBg(report.overall_score)}`}>
                <span className={`font-[var(--font-heading)] text-2xl font-extrabold ${scoreColor(report.overall_score)}`}>{report.overall_score}</span>
              </div>
              <div>
                <p className="font-semibold">{report.overall_condition}</p>
                <p className="text-xs text-muted-foreground">/ 10</p>
              </div>
            </div>
          ) : data ? (
            <p className="text-sm text-muted-foreground italic">No AI report</p>
          ) : (
            <div className="flex items-center justify-center h-16">
              <ArrowLeftRight className="h-8 w-8 text-muted-foreground/20" />
            </div>
          )}

          {/* Repair estimate */}
          {report?.total_estimated_repairs > 0 && (
            <div className="rounded-xl bg-destructive/8 border border-destructive/15 px-4 py-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Est. Repairs</p>
              <p className="font-[var(--font-heading)] text-lg font-bold text-destructive">${report.total_estimated_repairs?.toLocaleString()}</p>
            </div>
          )}

          {/* Photos */}
          {data?.photos?.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {data.photos.slice(0, 6).map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
              {data.photos.length > 6 && (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                  +{data.photos.length - 6}
                </div>
              )}
            </div>
          ) : data ? (
            <div className="flex items-center justify-center h-20 rounded-xl bg-muted/30 text-muted-foreground/40">
              <Camera className="h-6 w-6" />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" asChild>
          <Link to={`/inspections/${id}`}><ArrowLeft className="h-4 w-4 mr-1" />Back to Report</Link>
        </Button>
        <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          Compare Inspections
        </h1>
        <p className="text-muted-foreground mt-1.5">Side-by-side before & after analysis</p>
      </div>

      {/* Selector */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <label className="text-sm font-medium mb-2 block">Compare with:</label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="h-11"><SelectValue placeholder="Select an inspection to compare" /></SelectTrigger>
          <SelectContent>
            {sameAddress.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-[11px] font-semibold text-primary uppercase tracking-widest">Same Property</div>
                {sameAddress.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.inspection_type.replace("_", "-")} — {new Date(i.created_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </>
            )}
            {otherAddress.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">Other Properties</div>
                {otherAddress.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.property_address} — {new Date(i.created_at).toLocaleDateString()}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSide(current, "Current", "current")}
        {renderSide(compareWith, "Comparison", "compare")}
      </div>

      {/* Room comparison table */}
      {current?.ai_report?.rooms && compareWith?.ai_report?.rooms && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <h3 className="font-[var(--font-heading)] text-base font-bold">Room-by-Room Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-primary uppercase tracking-wider">Current</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comparison</th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody>
                {current.ai_report.rooms.map((room: any) => {
                  const match = compareWith.ai_report.rooms?.find((r: any) => r.name === room.name);
                  const diff = match ? room.score - match.score : null;
                  return (
                    <tr key={room.name} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-6 font-medium">{room.name}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${scoreBg(room.score)} text-xs font-bold ${scoreColor(room.score)}`}>
                          {room.score}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        {match ? (
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${scoreBg(match.score)} text-xs font-bold ${scoreColor(match.score)}`}>
                            {match.score}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-6">
                        {diff !== null ? (
                          <span className={`inline-flex items-center gap-1 text-sm font-semibold ${diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {diff > 0 ? <TrendingUp className="h-4 w-4" /> : diff < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
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
        </div>
      )}
    </div>
  );
}
