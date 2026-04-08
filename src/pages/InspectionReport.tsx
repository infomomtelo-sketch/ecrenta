import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, XCircle, Loader2, Share2, ArrowLeftRight, Check, DollarSign, Shield, Wrench, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const severityConfig: Record<string, { bg: string; text: string; border: string }> = {
  Minor: { bg: "bg-muted/60", text: "text-muted-foreground", border: "border-muted" },
  Moderate: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
  Major: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  Critical: { bg: "bg-destructive", text: "text-destructive-foreground", border: "border-destructive" },
};

const conditionConfig: Record<string, { icon: any; color: string }> = {
  Excellent: { icon: Star, color: "text-primary" },
  Good: { icon: CheckCircle, color: "text-primary" },
  Fair: { icon: AlertTriangle, color: "text-accent" },
  Poor: { icon: XCircle, color: "text-destructive" },
  Damaged: { icon: XCircle, color: "text-destructive" },
};

export default function InspectionReport() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchInspection = async () => {
    if (!user || !id) return;
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (error) toast({ title: "Error", description: "Inspection not found", variant: "destructive" });
    setInspection(data);
    setLoading(false);
  };

  useEffect(() => { fetchInspection(); }, [user, id]);

  useEffect(() => {
    if (inspection?.status !== "analyzing") return;
    const interval = setInterval(fetchInspection, 5000);
    return () => clearInterval(interval);
  }, [inspection?.status]);

  const handleShare = async () => {
    if (!inspection) return;
    if (inspection.share_token) { copyShareLink(inspection.share_token); return; }
    setSharing(true);
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const { error } = await supabase
      .from("inspections")
      .update({ share_token: token } as any)
      .eq("id", inspection.id);
    if (error) toast({ title: "Error", description: "Failed to create share link", variant: "destructive" });
    else { setInspection((prev: any) => ({ ...prev, share_token: token })); copyShareLink(token); }
    setSharing(false);
  };

  const copyShareLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/inspection/${token}`);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this link with tenants or owners." });
    setTimeout(() => setCopied(false), 2000);
  };

  const report = inspection?.ai_report;
  const checklist = inspection?.checklist_data || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="font-[var(--font-heading)] text-xl font-bold">Inspection not found</h2>
        <p className="text-muted-foreground mt-1">This inspection may have been deleted.</p>
      </div>
    );
  }

  const scoreColor = (score: number) =>
    score >= 8 ? "text-primary" : score >= 5 ? "text-accent" : "text-destructive";
  const scoreBg = (score: number) =>
    score >= 8 ? "bg-primary/10 border-primary/25" : score >= 5 ? "bg-accent/10 border-accent/25" : "bg-destructive/10 border-destructive/25";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" asChild>
          <Link to="/inspections"><ArrowLeft className="h-4 w-4 mr-1" />Back to Inspections</Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-extrabold tracking-tight">{inspection.property_address}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{inspection.inspection_type.replace("_", "-")}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(inspection.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {inspection.template_type && inspection.template_type !== "custom" && (
                <Badge variant="secondary" className="text-xs">{inspection.template_type.replace(/_/g, " ")}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleShare} disabled={sharing} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to={`/inspections/${id}/compare`}>
                <ArrowLeftRight className="h-4 w-4" />Compare
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Photos */}
      {inspection.photos?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {inspection.photos.map((url: string, i: number) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Checklist results */}
      {checklist.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-[var(--font-heading)] text-lg font-bold">Inspection Checklist</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">{checklist.filter((c: any) => c.status === "pass").length} Pass</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1">
                <XCircle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-semibold text-destructive">{checklist.filter((c: any) => c.status === "fail").length} Fail</span>
              </div>
            </div>
          </div>
          {Object.entries(
            checklist.reduce((acc: Record<string, any[]>, item: any) => {
              (acc[item.category] = acc[item.category] || []).push(item);
              return acc;
            }, {})
          ).map(([category, items]: [string, any[]]) => (
            <div key={category} className="mb-5 last:mb-0">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5 pb-1.5 border-b border-border">{category}</h4>
              <div className="space-y-1.5">
                {items.map((item: any) => (
                  <div key={item.id} className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 ${
                    item.status === "fail" ? "bg-destructive/5" : item.status === "pass" ? "bg-primary/5" : "bg-muted/30"
                  }`}>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{item.item}</span>
                      {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.severity && item.status === "fail" && (
                        <Badge className={`text-[10px] ${severityConfig[item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)]?.bg || ""} ${severityConfig[item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)]?.text || ""} border ${severityConfig[item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)]?.border || ""}`}>
                          {item.severity}
                        </Badge>
                      )}
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        item.status === "pass" ? "bg-primary/15 text-primary" :
                        item.status === "fail" ? "bg-destructive/15 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status === "pass" ? <CheckCircle className="h-3 w-3" /> : item.status === "fail" ? <XCircle className="h-3 w-3" /> : null}
                        {item.status === "not_inspected" ? "N/I" : item.status === "na" ? "N/A" : item.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analyzing state */}
      {inspection.status === "analyzing" && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
          <h2 className="font-[var(--font-heading)] text-xl font-bold mb-2">AI Analysis in Progress</h2>
          <p className="text-muted-foreground">Analyzing {inspection.photos?.length} photos. Usually takes 30–60 seconds.</p>
          <div className="mt-4 h-1.5 w-48 mx-auto rounded-full bg-primary/20 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      )}

      {/* Draft state */}
      {inspection.status === "draft" && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground mb-4">This inspection hasn't been analyzed yet.</p>
          <Button size="lg" className="shadow-lg shadow-primary/20" onClick={async () => {
            const { error } = await supabase.functions.invoke("analyze-inspection", {
              body: {
                inspectionId: inspection.id,
                photos: inspection.photos,
                propertyAddress: inspection.property_address,
                inspectionType: inspection.inspection_type,
                rooms: [],
              },
            });
            if (!error) {
              setInspection((prev: any) => ({ ...prev, status: "analyzing" }));
              toast({ title: "Analysis started" });
            }
          }}>
            <RefreshCw className="h-5 w-5 mr-2" />Run AI Analysis
          </Button>
        </div>
      )}

      {/* AI Report */}
      {report && !report.raw_response && (
        <div className="space-y-6">
          {/* Overall Score Hero */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="bg-gradient-to-r from-primary/8 via-transparent to-accent/5 p-6 sm:p-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Overall Assessment</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-5">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 ${scoreBg(report.overall_score)}`}>
                    <span className={`font-[var(--font-heading)] text-4xl font-extrabold ${scoreColor(report.overall_score)}`}>{report.overall_score}</span>
                  </div>
                  <div>
                    <p className="font-[var(--font-heading)] text-xl font-bold">{report.overall_condition}</p>
                    <p className="text-sm text-muted-foreground">out of 10</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-foreground/80">{report.summary}</p>
                </div>
              </div>

              {/* Financial summary */}
              {(report.total_estimated_repairs > 0 || report.deposit_deduction_recommended > 0) && (
                <div className="mt-6 flex gap-4 flex-wrap">
                  {report.total_estimated_repairs > 0 && (
                    <div className="rounded-xl bg-destructive/8 border border-destructive/15 px-5 py-3 flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-destructive/70" />
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Est. Repairs</p>
                        <p className="font-[var(--font-heading)] text-xl font-bold text-destructive">${report.total_estimated_repairs?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {report.deposit_deduction_recommended > 0 && (
                    <div className="rounded-xl bg-accent/8 border border-accent/15 px-5 py-3 flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-accent/70" />
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Deposit Deduction</p>
                        <p className="font-[var(--font-heading)] text-xl font-bold text-accent">${report.deposit_deduction_recommended?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Room Cards */}
          {report.rooms?.map((room: any, ri: number) => {
            const config = conditionConfig[room.condition] || { icon: AlertTriangle, color: "text-muted-foreground" };
            const Icon = config.icon;
            return (
              <div key={ri} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <h4 className="font-[var(--font-heading)] text-base font-bold">{room.name}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-medium">{room.condition}</Badge>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${scoreBg(room.score)}`}>
                      <span className={`text-sm font-bold ${scoreColor(room.score)}`}>{room.score}</span>
                    </div>
                  </div>
                </div>
                {room.issues?.length > 0 && (
                  <div className="p-4 space-y-2">
                    {room.issues.map((issue: any, ii: number) => {
                      const sev = severityConfig[issue.severity] || severityConfig.Minor;
                      return (
                        <div key={ii} className={`flex items-start justify-between rounded-xl border ${sev.border} ${sev.bg} p-3.5`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{issue.description}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge className={`text-[10px] ${sev.bg} ${sev.text} border ${sev.border}`}>{issue.severity}</Badge>
                              {issue.is_wear_and_tear && (
                                <span className="text-[11px] text-muted-foreground italic">Normal wear & tear</span>
                              )}
                            </div>
                          </div>
                          {issue.estimated_cost > 0 && (
                            <span className="text-sm font-bold text-destructive ml-4 shrink-0">${issue.estimated_cost}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Move-out checklist */}
          {report.move_out_checklist?.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-[var(--font-heading)] text-lg font-bold mb-4">Move-Out Checklist</h3>
              <div className="space-y-1.5">
                {report.move_out_checklist.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5">
                    <span className="text-sm font-medium">{item.item}</span>
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        item.status === "Pass" ? "bg-primary/15 text-primary" :
                        item.status === "Fail" ? "bg-destructive/15 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status}
                      </div>
                      {item.notes && <span className="text-xs text-muted-foreground max-w-[150px] truncate">{item.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {report.recommended_actions?.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-[var(--font-heading)] text-lg font-bold mb-4">Recommended Actions</h3>
              <ul className="space-y-2.5">
                {report.recommended_actions.map((action: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {report?.raw_response && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-[var(--font-heading)] text-lg font-bold mb-3">AI Response</h3>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{report.summary}</p>
        </div>
      )}
    </div>
  );
}
