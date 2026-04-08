import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, XCircle, Loader2, Share2, ArrowLeftRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    if (error) {
      toast({ title: "Error", description: "Inspection not found", variant: "destructive" });
    }
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
    if (inspection.share_token) {
      copyShareLink(inspection.share_token);
      return;
    }
    setSharing(true);
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const { error } = await supabase
      .from("inspections")
      .update({ share_token: token } as any)
      .eq("id", inspection.id);
    if (error) {
      toast({ title: "Error", description: "Failed to create share link", variant: "destructive" });
    } else {
      setInspection((prev: any) => ({ ...prev, share_token: token }));
      copyShareLink(token);
    }
    setSharing(false);
  };

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/inspection/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this link with tenants or owners." });
    setTimeout(() => setCopied(false), 2000);
  };

  const report = inspection?.ai_report;
  const checklist = inspection?.checklist_data || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Inspection not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold">{inspection.property_address}</h1>
          <p className="text-muted-foreground mt-1">
            {inspection.inspection_type.replace("_", "-")} inspection · {new Date(inspection.created_at).toLocaleDateString()}
            {inspection.template_type && inspection.template_type !== "custom" && (
              <Badge variant="secondary" className="ml-2 text-xs">{inspection.template_type.replace("_", " ")}</Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleShare} disabled={sharing}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Share2 className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : inspection.share_token ? "Copy Link" : "Share"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/inspections/${id}/compare`}>
              <ArrowLeftRight className="h-4 w-4 mr-1" />Compare
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/inspections"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
        </div>
      </div>

      {/* Photos */}
      {inspection.photos?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {inspection.photos.map((url: string, i: number) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Checklist results */}
      {checklist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Inspection Checklist
              <div className="flex gap-2">
                <Badge className="bg-primary/15 text-primary text-xs">
                  {checklist.filter((c: any) => c.status === "pass").length} Pass
                </Badge>
                <Badge className="bg-destructive/15 text-destructive text-xs">
                  {checklist.filter((c: any) => c.status === "fail").length} Fail
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
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
                      <div className="flex-1">
                        <span className="text-sm">{item.item}</span>
                        {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.severity && item.status === "fail" && (
                          <Badge className={`text-xs ${severityColors[item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)] || ""}`}>
                            {item.severity}
                          </Badge>
                        )}
                        <Badge variant={item.status === "pass" ? "default" : item.status === "fail" ? "destructive" : "secondary"} className="text-xs">
                          {item.status === "not_inspected" ? "N/I" : item.status === "na" ? "N/A" : item.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {inspection.status === "analyzing" && (
        <Card className="text-center py-12">
          <CardContent>
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            <h2 className="font-[var(--font-heading)] text-xl font-semibold mb-2">AI Analysis in Progress</h2>
            <p className="text-muted-foreground">Analyzing {inspection.photos?.length} photos. Usually takes 30-60 seconds.</p>
          </CardContent>
        </Card>
      )}

      {inspection.status === "draft" && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">This inspection hasn't been analyzed yet.</p>
            <Button onClick={async () => {
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
              <RefreshCw className="h-4 w-4 mr-1" />Run AI Analysis
            </Button>
          </CardContent>
        </Card>
      )}

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
                              {issue.is_wear_and_tear && <span className="text-xs text-muted-foreground">Normal wear & tear</span>}
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

          {report.move_out_checklist?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Move-Out Checklist</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.move_out_checklist.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-sm">{item.item}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === "Pass" ? "default" : item.status === "Fail" ? "destructive" : "secondary"} className="text-xs">
                          {item.status}
                        </Badge>
                        {item.notes && <span className="text-xs text-muted-foreground max-w-[150px] truncate">{item.notes}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {report.recommended_actions?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Recommended Actions</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommended_actions.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {report?.raw_response && (
        <Card>
          <CardHeader><CardTitle>AI Response</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{report.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
