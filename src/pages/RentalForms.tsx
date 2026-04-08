import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, FileText, CheckCircle, Eye, Copy, Trash2 } from "lucide-react";

const FORM_TYPES = [
  { value: "lease_agreement", label: "Lease Agreement" },
  { value: "move_in_checklist", label: "Move-In Checklist" },
  { value: "move_out_checklist", label: "Move-Out Checklist" },
  { value: "notice_to_vacate", label: "Notice to Vacate" },
  { value: "custom", label: "Custom Form" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-accent/20 text-accent-foreground",
  signed: "bg-primary/20 text-primary",
};

interface RentalForm {
  id: string;
  form_type: string;
  title: string;
  content: any;
  status: string;
  sign_token: string | null;
  sent_at: string | null;
  signed_at: string | null;
  signer_name: string | null;
  recipient_email: string | null;
  created_at: string;
  tenant_id: string | null;
}

interface Tenant {
  id: string;
  full_name: string;
  email: string | null;
  unit_address: string | null;
}

export default function RentalForms() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [forms, setForms] = useState<RentalForm[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    form_type: "lease_agreement", title: "", tenant_id: "", recipient_email: "",
    property_address: "", rent_amount: "", lease_start: "", lease_end: "",
    terms: "",
  });

  const fetchData = async () => {
    if (!user) return;
    const [{ data: f }, { data: t }] = await Promise.all([
      supabase.from("rental_forms").select("*").order("created_at", { ascending: false }),
      supabase.from("tenants").select("id, full_name, email, unit_address"),
    ]);
    setForms((f as RentalForm[]) || []);
    setTenants((t as Tenant[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCreate = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    const token = crypto.randomUUID();
    const content = {
      property_address: form.property_address,
      rent_amount: form.rent_amount,
      lease_start: form.lease_start,
      lease_end: form.lease_end,
      terms: form.terms,
      company_name: "EC Rental Property Management LLC",
    };
    await supabase.from("rental_forms").insert({
      user_id: user!.id,
      form_type: form.form_type,
      title: form.title.trim(),
      content,
      sign_token: token,
      tenant_id: form.tenant_id || null,
      recipient_email: form.recipient_email.trim() || null,
    });
    toast({ title: "Form created" });
    setDialogOpen(false);
    setForm({ form_type: "lease_agreement", title: "", tenant_id: "", recipient_email: "", property_address: "", rent_amount: "", lease_start: "", lease_end: "", terms: "" });
    fetchData();
  };

  const handleSend = async (f: RentalForm) => {
    const email = f.recipient_email;
    if (!email) { toast({ title: "No recipient email set", variant: "destructive" }); return; }
    await supabase.from("rental_forms").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", f.id);
    // Trigger email with sign link
    const signUrl = `${window.location.origin}/sign/${f.sign_token}`;
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "form-sign-request",
        recipientEmail: email,
        idempotencyKey: `form-sign-${f.id}`,
        templateData: { title: f.title, signUrl, companyName: "EC Rental Property Management LLC" },
      },
    });
    toast({ title: "Form sent for signing" });
    fetchData();
  };

  const copySignLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/sign/${token}`);
    toast({ title: "Sign link copied!" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("rental_forms").delete().eq("id", id);
    toast({ title: "Form deleted" });
    fetchData();
  };

  const selectTenant = (tenantId: string) => {
    const t = tenants.find(x => x.id === tenantId);
    setForm(f => ({
      ...f,
      tenant_id: tenantId,
      recipient_email: t?.email || f.recipient_email,
      property_address: t?.unit_address || f.property_address,
    }));
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <Helmet><title>Rental Forms | ecrenta</title></Helmet>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Rental Forms</h1>
          <p className="text-sm text-muted-foreground">Create and send forms for e-signature</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Form</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Form</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Form Type</Label>
                <Select value={form.form_type} onValueChange={v => setForm(f => ({ ...f, form_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FORM_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Lease Agreement - 123 Main St" /></div>
              {tenants.length > 0 && (
                <div>
                  <Label>Tenant</Label>
                  <Select value={form.tenant_id} onValueChange={selectTenant}>
                    <SelectTrigger><SelectValue placeholder="Select tenant..." /></SelectTrigger>
                    <SelectContent>{tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div><Label>Recipient Email</Label><Input type="email" value={form.recipient_email} onChange={e => setForm(f => ({ ...f, recipient_email: e.target.value }))} /></div>
              <div><Label>Property Address</Label><Input value={form.property_address} onChange={e => setForm(f => ({ ...f, property_address: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Monthly Rent ($)</Label><Input type="number" value={form.rent_amount} onChange={e => setForm(f => ({ ...f, rent_amount: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Lease Start</Label><Input type="date" value={form.lease_start} onChange={e => setForm(f => ({ ...f, lease_start: e.target.value }))} /></div>
                <div><Label>Lease End</Label><Input type="date" value={form.lease_end} onChange={e => setForm(f => ({ ...f, lease_end: e.target.value }))} /></div>
              </div>
              <div><Label>Terms / Additional Content</Label><Textarea rows={5} value={form.terms} onChange={e => setForm(f => ({ ...f, terms: e.target.value }))} placeholder="Enter lease terms, conditions, or form content..." /></div>
              <Button className="w-full" onClick={handleCreate}>Create Form</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : forms.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-3 opacity-40" /><p>No forms yet. Create your first rental form.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {forms.map(f => (
            <Card key={f.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate">{f.title}</p>
                    <Badge className={STATUS_COLORS[f.status] || ""}>{f.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {FORM_TYPES.find(t => t.value === f.form_type)?.label} · {new Date(f.created_at).toLocaleDateString()}
                    {f.recipient_email && ` · ${f.recipient_email}`}
                    {f.signed_at && ` · Signed by ${f.signer_name} on ${new Date(f.signed_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {f.sign_token && (
                    <Button variant="ghost" size="icon" onClick={() => copySignLink(f.sign_token!)} title="Copy sign link"><Copy className="w-4 h-4" /></Button>
                  )}
                  {f.sign_token && (
                    <Button variant="ghost" size="icon" asChild title="Preview">
                      <a href={`/sign/${f.sign_token}`} target="_blank"><Eye className="w-4 h-4" /></a>
                    </Button>
                  )}
                  {f.status === "draft" && (
                    <Button variant="ghost" size="icon" onClick={() => handleSend(f)} title="Send for signing"><Send className="w-4 h-4 text-primary" /></Button>
                  )}
                  {f.status !== "signed" && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  )}
                  {f.status === "signed" && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
