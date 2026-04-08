import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, CheckCircle, XCircle, ClipboardCheck, Loader2, Star, Wrench, DollarSign, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

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

export default function SharedInspection() {
  const { token } = useParams<{ token: string }>();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    supabase
      .from("inspections")
      .select("*")
      .eq("share_token", token)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setInspection(data);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading inspection report…</p>
        </div>
      </div>
    );
  }

  if (notFound || !inspection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mb-5">
            <Shield className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground text-sm">This inspection report link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  const report = inspection.ai_report;
  const checklist = inspection.checklist_data || [];

  const scoreColor = (score: number) =>
    score >= 8 ? "text-primary" : score >= 5 ? "text-accent" : "text-destructive";
  const scoreBg = (score: number) =>
    score >= 8 ? "bg-primary/10 border-primary/25" : score >= 5 ? "bg-accent/10 border-accent/25" : "bg-destructive/10 border-destructive/25";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`Inspection Report — ${inspection.property_address}`}
        description={`Property inspection report for ${inspection.property_address}`}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight">ecrenta</span>
          </div>
          <Badge variant="outline" className="text-[11px] font-medium">
            <Shield className="h-3 w-3 mr-1" />Shared Report
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Property hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[11px]">{inspection.inspection_type?.replace("_", "-")}</Badge>
            <span className="text-xs text-muted-foreground">{new Date(inspection.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <h1 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-extrabold tracking-tight">{inspection.property_address}</h1>
        </div>

        {/* Photos */}
        {inspection.photos?.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 mb-10">
            {inspection.photos.map((url: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[var(--font-heading)] text-lg font-bold">Inspection Checklist</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">{checklist.filter((c: any) => c.status === "pass").length}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1">
                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">{checklist.filter((c: any) => c.status === "fail").length}</span>
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
                      <span className="text-sm font-medium">{item.item}</span>
                      <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        item.status === "pass" ? "bg-primary/15 text-primary" :
                        item.status === "fail" ? "bg-destructive/15 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status === "not_inspected" ? "N/I" : item.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Report */}
        {report && !report.raw_response && (
          <div className="space-y-6">
            {/* Overall Score */}
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

            {/* Room cards */}
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
                      <Badge variant="outline" className="text-xs">{room.condition}</Badge>
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
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/8 via-primary/5 to-accent/5 border border-border p-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 mb-4">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-[var(--font-heading)] text-xl font-bold mb-2">AI-Powered Property Inspections</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Generate detailed inspection reports with repair estimates, condition scoring, and shareable links. Built for property managers.
          </p>
          <Button size="lg" className="shadow-lg shadow-primary/20" asChild>
            <a href="/">
              Get Started Free <ArrowRight className="h-4 w-4 ml-1.5" />
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
