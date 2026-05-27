import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, Mail, Phone, MapPin, Send, Copy, CheckCircle2 } from "lucide-react";

interface Tenant {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  unit_address: string | null;
  lease_start: string | null;
  lease_end: string | null;
  rent_amount: number | null;
  notes: string | null;
  invite_token?: string | null;
  invited_at?: string | null;
  accepted_at?: string | null;
}

export default function Tenants() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", unit_address: "",
    lease_start: "", lease_end: "", rent_amount: "", notes: "",
  });

  const fetchTenants = async () => {
    if (!user) return;
    const { data } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
    setTenants((data as Tenant[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchTenants(); }, [user]);

  const resetForm = () => {
    setForm({ full_name: "", email: "", phone: "", unit_address: "", lease_start: "", lease_end: "", rent_amount: "", notes: "" });
    setEditing(null);
  };

  const handleEdit = (t: Tenant) => {
    setEditing(t);
    setForm({
      full_name: t.full_name, email: t.email || "", phone: t.phone || "",
      unit_address: t.unit_address || "", lease_start: t.lease_start || "",
      lease_end: t.lease_end || "", rent_amount: t.rent_amount?.toString() || "", notes: t.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      unit_address: form.unit_address.trim() || null,
      lease_start: form.lease_start || null,
      lease_end: form.lease_end || null,
      rent_amount: form.rent_amount ? parseInt(form.rent_amount) : null,
      notes: form.notes.trim() || null,
      user_id: user!.id,
    };

    if (editing) {
      await supabase.from("tenants").update(payload).eq("id", editing.id);
      toast({ title: "Tenant updated" });
    } else {
      await supabase.from("tenants").insert(payload);
      toast({ title: "Tenant added" });
    }
    setDialogOpen(false);
    resetForm();
    fetchTenants();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("tenants").delete().eq("id", id);
    toast({ title: "Tenant removed" });
    fetchTenants();
  };

  const handleInvite = async (t: Tenant) => {
    let token = t.invite_token;
    if (!token || t.accepted_at) {
      token = crypto.randomUUID().replace(/-/g, "");
      const { error } = await supabase
        .from("tenants")
        .update({ invite_token: token, invited_at: new Date().toISOString(), accepted_at: null, auth_user_id: null })
        .eq("id", t.id);
      if (error) { toast({ title: "Could not create invite", description: error.message, variant: "destructive" }); return; }
    }
    const url = `${window.location.origin}/tenant/accept-invite/${token}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    toast({ title: "Invite link copied", description: t.email ? `Send it to ${t.email}` : "Share with your tenant" });
    fetchTenants();
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <Helmet><title>Tenants | ecrenta</title></Helmet>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Tenants</h1>
          <p className="text-sm text-muted-foreground">Manage your tenant records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Tenant</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Full Name *</Label><Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div><Label>Unit Address</Label><Input value={form.unit_address} onChange={e => setForm(f => ({ ...f, unit_address: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Lease Start</Label><Input type="date" value={form.lease_start} onChange={e => setForm(f => ({ ...f, lease_start: e.target.value }))} /></div>
                <div><Label>Lease End</Label><Input type="date" value={form.lease_end} onChange={e => setForm(f => ({ ...f, lease_end: e.target.value }))} /></div>
              </div>
              <div><Label>Monthly Rent ($)</Label><Input type="number" value={form.rent_amount} onChange={e => setForm(f => ({ ...f, rent_amount: e.target.value }))} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <Button className="w-full" onClick={handleSubmit}>{editing ? "Update" : "Add"} Tenant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : tenants.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-3 opacity-40" /><p>No tenants yet. Add your first tenant to get started.</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tenants.map(t => (
            <Card key={t.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{t.full_name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {t.email && <p className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5" />{t.email}</p>}
                {t.phone && <p className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" />{t.phone}</p>}
                {t.unit_address && <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{t.unit_address}</p>}
                {t.rent_amount && <Badge variant="secondary">${t.rent_amount}/mo</Badge>}
                {t.lease_start && t.lease_end && (
                  <p className="text-xs text-muted-foreground">Lease: {t.lease_start} → {t.lease_end}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
