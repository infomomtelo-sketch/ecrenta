import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Wrench, AlertTriangle, DollarSign, Clock, CheckCircle2, Loader2, Phone } from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = {
  emergency: "bg-destructive text-destructive-foreground",
  urgent: "bg-accent text-accent-foreground",
  normal: "bg-blue-100 text-blue-800",
  low: "bg-muted text-muted-foreground",
};

export default function MaintenanceDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("maintenance_requests").select("*").eq("id", id).single();
      if (data) {
        setRequest(data);
        setStatus(data.status);
        setNotes(data.resolution_notes || "");
      }
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel(`maintenance-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "maintenance_requests", filter: `id=eq.${id}` }, (payload) => {
        setRequest(payload.new);
        setStatus(payload.new.status);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    const { error } = await supabase.from("maintenance_requests").update({ status, resolution_notes: notes } as any).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Request updated successfully." });
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Request not found</p>
        <Link to="/maintenance"><Button>Back to Maintenance</Button></Link>
      </div>
    );
  }

  const triage = request.ai_triage;

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>{request.title} | Maintenance | runp8</title></Helmet>

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/maintenance"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
          <h1 className="text-lg font-bold text-foreground truncate" style={{ fontFamily: "var(--font-heading)" }}>{request.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Emergency Banner */}
        {(request.status === "emergency" || triage?.severity === "emergency") && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Emergency Request</p>
              <p className="text-sm text-destructive/80">Call <a href="tel:5598253038" className="underline font-bold">559-825-3038</a> immediately</p>
            </div>
          </div>
        )}

        {/* Request Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: "var(--font-heading)" }}>Request Details</CardTitle>
              <Badge className={SEVERITY_COLORS[request.urgency] || SEVERITY_COLORS.normal}>
                {request.urgency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Property</p>
                <p className="font-medium text-foreground">{request.property_address}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium text-foreground capitalize">{request.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reporter</p>
                <p className="font-medium text-foreground">{request.reporter_name} ({request.reporter_role})</p>
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium text-foreground">{new Date(request.created_at).toLocaleString()}</p>
              </div>
              {request.reporter_email && (
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{request.reporter_email}</p>
                </div>
              )}
              {request.reporter_phone && (
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <a href={`tel:${request.reporter_phone}`} className="font-medium text-primary flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {request.reporter_phone}
                  </a>
                </div>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Description</p>
              <p className="text-foreground text-sm whitespace-pre-wrap">{request.description}</p>
            </div>
            {request.photos?.length > 0 && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Photos</p>
                <div className="grid grid-cols-3 gap-2">
                  {request.photos.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-border" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* P8 AI Analysis */}
        {(triage || request.ai_response) && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">P8</span>
                </div>
                P8 AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.ai_response && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{request.ai_response}</p>
                </div>
              )}

              {triage && !triage.raw && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {triage.estimated_cost_min != null && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <DollarSign className="h-3 w-3" /> Est. Cost
                        </div>
                        <p className="font-semibold text-foreground text-sm">
                          ${triage.estimated_cost_min} - ${triage.estimated_cost_max}
                        </p>
                      </div>
                    )}
                    {triage.estimated_response_time && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <Clock className="h-3 w-3" /> Response Time
                        </div>
                        <p className="font-semibold text-foreground text-sm capitalize">{triage.estimated_response_time}</p>
                      </div>
                    )}
                    {triage.priority_score && (
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <AlertTriangle className="h-3 w-3" /> Priority
                        </div>
                        <p className="font-semibold text-foreground text-sm">{triage.priority_score}/10</p>
                      </div>
                    )}
                  </div>

                  {triage.troubleshooting_steps?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-1">
                        <Wrench className="h-4 w-4" /> Troubleshooting Steps
                      </h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {triage.troubleshooting_steps.map((step: string, i: number) => (
                          <li key={i} className="text-sm text-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {triage.needs_professional && (
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-accent shrink-0" />
                      <p className="text-sm text-foreground">
                        <strong>Professional help recommended.</strong>
                        {triage.recommended_vendors?.length > 0 && ` Need: ${triage.recommended_vendors.join(", ")}`}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Management Actions */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-heading)" }}>Manage Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="triaging">P8 Analyzing</SelectItem>
                  <SelectItem value="ai_handled">AI Handled</SelectItem>
                  <SelectItem value="needs_dispatch">Needs Dispatch</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resolution Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes on resolution, vendor dispatched, etc." rows={3} />
            </div>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Update Request
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
