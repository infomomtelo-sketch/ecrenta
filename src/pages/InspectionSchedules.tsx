import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Trash2, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Schedule {
  id: string;
  property_address: string;
  interval_months: number;
  next_due: string;
  notify_email: string | null;
  notes: string | null;
  last_completed_id: string | null;
  created_at: string;
}

export default function InspectionSchedules() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [address, setAddress] = useState("");
  const [interval, setInterval] = useState("12");
  const [nextDue, setNextDue] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSchedules = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("inspection_schedules")
      .select("*")
      .eq("user_id", user.id)
      .order("next_due", { ascending: true });
    setSchedules((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSchedules(); }, [user]);

  const handleCreate = async () => {
    if (!user || !address.trim() || !nextDue) return;
    setSaving(true);
    const { error } = await supabase.from("inspection_schedules").insert({
      user_id: user.id,
      property_address: address.trim(),
      interval_months: parseInt(interval),
      next_due: nextDue,
      notify_email: notifyEmail.trim() || null,
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Schedule created" });
      setAddress("");
      setInterval("12");
      setNextDue("");
      setNotifyEmail("");
      setDialogOpen(false);
      fetchSchedules();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("inspection_schedules").delete().eq("id", id);
    if (!error) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Schedule removed" });
    }
  };

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();
  const isDueSoon = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };

  const intervalLabels: Record<string, string> = {
    "3": "Quarterly",
    "6": "Semi-Annual",
    "12": "Annual",
    "24": "Biennial",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Inspection Schedules
          </h1>
          <p className="text-muted-foreground mt-1">Auto-schedule recurring inspections for your properties</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" />New Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Recurring Inspection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Property Address *</Label>
                <Input placeholder="123 Main St, Fresno, CA" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Inspection Frequency</Label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Quarterly (every 3 months)</SelectItem>
                    <SelectItem value="6">Semi-Annual (every 6 months)</SelectItem>
                    <SelectItem value="12">Annual (every 12 months)</SelectItem>
                    <SelectItem value="24">Biennial (every 24 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Next Due Date *</Label>
                <Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
              </div>
              <div>
                <Label>Reminder Email (optional)</Label>
                <Input type="email" placeholder="you@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={saving || !address.trim() || !nextDue}>
                {saving ? "Creating..." : "Create Schedule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : schedules.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="font-[var(--font-heading)] text-xl font-semibold mb-2">No schedules yet</h2>
            <p className="text-muted-foreground mb-6">Set up recurring inspections so you never miss one.</p>
            <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Create First Schedule</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((s) => {
            const overdue = isOverdue(s.next_due);
            const soon = isDueSoon(s.next_due);
            return (
              <Card key={s.id} className={`transition-shadow hover:shadow-md ${overdue ? "border-destructive/50" : soon ? "border-accent/50" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{s.property_address}</h3>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {intervalLabels[String(s.interval_months)] || `Every ${s.interval_months}mo`}
                        </Badge>
                        <Badge
                          variant={overdue ? "destructive" : soon ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {overdue ? (
                            <><AlertTriangle className="h-3 w-3 mr-1" />Overdue</>
                          ) : soon ? (
                            <><Clock className="h-3 w-3 mr-1" />Due Soon</>
                          ) : (
                            <><CheckCircle className="h-3 w-3 mr-1" />Scheduled</>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Next: {new Date(s.next_due).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="default" size="sm" asChild>
                        <Link to={`/inspections/new?address=${encodeURIComponent(s.property_address)}`}>
                          Start Inspection
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
