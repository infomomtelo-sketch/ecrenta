import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, CheckCircle, XCircle, ClipboardCheck, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const severityColors: Record<string, string> = {
  Minor: "bg-muted text-muted-foreground",
  Moderate: "bg-accent/20 text-accent",
  Major: "bg-destructive/15 text-destructive",
  Critical: "bg-destructive text-destructive-foreground",
};

const conditionIcons: Record<string, any> = {
  Excellent: CheckCircle,
  Good: CheckCircle,
  Fair: AlertTriangle,
  Poor: XCircle,
  Damaged: XCircle,
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !inspection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground">This inspection report link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  const report = inspection.ai_report;
  const checklist = inspection.checklist_data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={`Inspection Report — ${inspection.property_address}`}
        description={`Property inspection report for ${inspection.property_address}`}
      />

      <header className="border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-2.5 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">ecrenta</span>
          <Badge variant="secondary" className="ml-auto">Shared Report</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold">{inspection.property_address}</h1>
          <p className="text-muted-foreground mt-1">
            {inspection.inspection_type?.replace("_", "-")} inspection · {new Date(inspection.created_at).toLocaleDateString()}
          </p>
        </div>

        {inspection.photos?.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8">
            {inspection.photos.map((url: string, i: number) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Checklist results */}
        {checklist.length > 0 && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Inspection Checklist</CardTitle></CardHeader>
            <CardContent>
              {Object.entries(
                checklist.reduce((acc: Record<string, any[]>, item: any) => {
                  (acc[item.category] = acc[item.category] || []).push(item);
                  return acc;
                }, {})
              ).map(([category, items]: [string, any[]]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h4>
                  <div className="space-y-1.5">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <span className="text-sm">{item.item}</span>
                        <Badge variant={item.status === "pass" ? "default" : item.status === "fail" ? "destructive" : "secondary"} className="text-xs">
                          {item.status === "not_inspected" ? "N/I" : item.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Report */}
        {report && !report.raw_response && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Overall Assessment</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary">
                      <span className="font-[var(--font-heading)] text-3xl font-bold text-primary">{report.overall_score}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{report.overall_condition}</p>
                      <p className="text-sm text-muted-foreground">out of 10</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{report.summary}</p>
                  </div>
                </div>
                {(report.total_estimated_repairs > 0 || report.deposit_deduction_recommended > 0) && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    {report.total_estimated_repairs > 0 && (
                      <div className="rounded-lg bg-destructive/10 px-4 py-2">
                        <p className="text-xs text-muted-foreground">Est. Repairs</p>
                        <p className="font-[var(--font-heading)] text-lg font-bold text-destructive">${report.total_estimated_repairs?.toLocaleString()}</p>
                      </div>
                    )}
                    {report.deposit_deduction_recommended > 0 && (
                      <div className="rounded-lg bg-accent/10 px-4 py-2">
                        <p className="text-xs text-muted-foreground">Deposit Deduction</p>
                        <p className="font-[var(--font-heading)] text-lg font-bold text-accent">${report.deposit_deduction_recommended?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {report.rooms?.map((room: any, ri: number) => {
              const Icon = conditionIcons[room.condition] || AlertTriangle;
              return (
                <Card key={ri}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${room.condition === "Good" || room.condition === "Excellent" ? "text-primary" : "text-destructive"}`} />
                        {room.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{room.condition}</Badge>
                        <span className="text-sm font-semibold text-primary">{room.score}/10</span>
                      </div>
                    </div>
                  </CardHeader>
                  {room.issues?.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {room.issues.map((issue: any, ii: number) => (
                          <div key={ii} className="flex items-start justify-between rounded-lg bg-muted/50 p-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{issue.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`text-xs ${severityColors[issue.severity] || ""}`}>{issue.severity}</Badge>
                                {issue.is_wear_and_tear && (
                                  <span className="text-xs text-muted-foreground">Normal wear & tear</span>
                                )}
                              </div>
                            </div>
                            {issue.estimated_cost > 0 && (
                              <span className="text-sm font-semibold text-destructive ml-3">${issue.estimated_cost}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center text-xs text-muted-foreground">
          <p>Generated by <strong>ecrenta</strong> — AI-powered property inspections</p>
          <p className="mt-1">
            <a href="/" className="text-primary underline">Get started free →</a>
          </p>
        </div>
      </main>
    </div>
  );
}
