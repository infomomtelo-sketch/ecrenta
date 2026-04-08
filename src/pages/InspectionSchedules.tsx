import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Trash2, Clock, AlertTriangle, CheckCircle, MapPin, Bell } from "lucide-react";
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
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Schedule created" });
      setAddress(""); setInterval("12"); setNextDue(""); setNotifyEmail("");
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
    const diff = (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };

  const intervalLabels: Record<string, string> = {
    "3": "Quarterly",
    "6": "Semi-Annual",
    "12": "Annual",
    "24": "Biennial",
  };

  const overdueCount = schedules.filter((s) => isOverdue(s.next_due)).length;
  const dueSoonCount = schedules.filter((s) => isDueSoon(s.next_due)).length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-[var(--font-heading)] text-xl font-bold flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            Inspection Schedules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Auto-schedule recurring inspections for your properties</p>
        </div>
        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-semibold text-destructive">{overdueCount} overdue</span>
            </div>
          )}
          {dueSoonCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">{dueSoonCount} due soon</span>
            </div>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm"><Plus className="h-4 w-4 mr-1.5" />New Schedule</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-[var(--font-heading)]">Schedule Recurring Inspection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label className="text-sm font-medium">Property Address <span className="text-destructive">*</span></Label>
                  <Input placeholder="123 Main St, Fresno, CA" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Inspection Frequency</Label>
                  <Select value={interval} onValueChange={setInterval}>
                    <SelectTrigger className="mt-1.5 h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Quarterly (every 3 months)</SelectItem>
                      <SelectItem value="6">Semi-Annual (every 6 months)</SelectItem>
                      <SelectItem value="12">Annual (every 12 months)</SelectItem>
                      <SelectItem value="24">Biennial (every 24 months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Due Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Reminder Email <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input type="email" placeholder="you@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="mt-1.5 h-11" />
                </div>
                <Button className="w-full h-11 shadow-sm" onClick={handleCreate} disabled={saving || !address.trim() || !nextDue}>
                  {saving ? "Creating..." : "Create Schedule"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 mb-4">
            <Calendar className="h-8 w-8 text-primary/40" />
          </div>
          <h3 className="font-[var(--font-heading)] text-xl font-bold mb-2">No schedules yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">Set up recurring inspections so you never miss one.</p>
          <Button onClick={() => setDialogOpen(true)} className="shadow-sm"><Plus className="h-4 w-4 mr-1.5" />Create First Schedule</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => {
            const overdue = isOverdue(s.next_due);
            const soon = isDueSoon(s.next_due);
            return (
              <div
                key={s.id}
                className={`rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-sm ${
                  overdue ? "border-destructive/30 bg-destructive/3" : soon ? "border-accent/30 bg-accent/3" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <h3 className="font-semibold text-base truncate">{s.property_address}</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {intervalLabels[String(s.interval_months)] || `Every ${s.interval_months}mo`}
                      </div>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">
                        Next: {new Date(s.next_due).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {s.notify_email && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Bell className="h-3 w-3" />
                            {s.notify_email}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      overdue ? "bg-destructive/10 text-destructive" :
                      soon ? "bg-accent/10 text-accent" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {overdue ? <AlertTriangle className="h-3 w-3" /> : soon ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {overdue ? "Overdue" : soon ? "Due Soon" : "On Track"}
                    </div>
                    <Button variant="default" size="sm" className="h-8 text-xs shadow-sm" asChild>
                      <Link to={`/inspections/new?address=${encodeURIComponent(s.property_address)}`}>
                        Start
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
