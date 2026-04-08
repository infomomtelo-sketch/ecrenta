import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, DollarSign, Trash2, FileText, Eye } from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  status: string;
  description: string | null;
  line_items: any[];
  notes: string | null;
  sent_at: string | null;
  paid_at: string | null;
  tenant_id: string | null;
  created_at: string;
}

interface Tenant {
  id: string;
  full_name: string;
  email: string | null;
  rent_amount: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  sent: "bg-accent/20 text-accent-foreground",
  paid: "bg-primary/20 text-primary",
  overdue: "bg-destructive/20 text-destructive",
};

export default function Invoices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState({
    tenant_id: "", amount: "", due_date: "", description: "Monthly Rent", notes: "",
  });

  const fetchData = async () => {
    if (!user) return;
    const [{ data: inv }, { data: t }] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("tenants").select("id, full_name, email, rent_amount"),
    ]);
    // Mark overdue invoices
    const now = new Date();
    const processed = ((inv as Invoice[]) || []).map(i => ({
      ...i,
      status: i.status === "sent" && new Date(i.due_date) < now ? "overdue" : i.status,
    }));
    setInvoices(processed);
    setTenants((t as Tenant[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const generateInvoiceNumber = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
  };

  const selectTenant = (tenantId: string) => {
    const t = tenants.find(x => x.id === tenantId);
    setForm(f => ({
      ...f,
      tenant_id: tenantId,
      amount: t?.rent_amount?.toString() || f.amount,
    }));
  };

  const handleCreate = async () => {
    if (!form.amount || !form.due_date) { toast({ title: "Amount and due date required", variant: "destructive" }); return; }
    const invoiceNumber = generateInvoiceNumber();
    const lineItems = [{ description: form.description || "Monthly Rent", amount: parseInt(form.amount) }];
    await supabase.from("invoices").insert({
      user_id: user!.id,
      invoice_number: invoiceNumber,
      amount: parseInt(form.amount),
      due_date: form.due_date,
      description: form.description || null,
      line_items: lineItems,
      notes: form.notes || null,
      tenant_id: form.tenant_id || null,
    });
    toast({ title: `Invoice ${invoiceNumber} created` });
    setDialogOpen(false);
    setForm({ tenant_id: "", amount: "", due_date: "", description: "Monthly Rent", notes: "" });
    fetchData();
  };

  const handleSend = async (inv: Invoice) => {
    const tenant = tenants.find(t => t.id === inv.tenant_id);
    if (!tenant?.email) { toast({ title: "Tenant has no email", variant: "destructive" }); return; }
    await supabase.from("invoices").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", inv.id);
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "invoice-reminder",
        recipientEmail: tenant.email,
        idempotencyKey: `invoice-${inv.id}`,
        templateData: {
          tenantName: tenant.full_name,
          invoiceNumber: inv.invoice_number,
          amount: inv.amount,
          dueDate: inv.due_date,
          companyName: "EC Rental Property Management LLC",
        },
      },
    });
    toast({ title: "Invoice sent to tenant" });
    fetchData();
  };

  const handleMarkPaid = async (id: string) => {
    await supabase.from("invoices").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Marked as paid" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("invoices").delete().eq("id", id);
    toast({ title: "Invoice deleted" });
    fetchData();
  };

  const getTenantName = (tenantId: string | null) => tenants.find(t => t.id === tenantId)?.full_name || "—";

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <Helmet><title>Invoices | ecrenta</title></Helmet>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Invoices</h1>
          <p className="text-sm text-muted-foreground">Create and send payment invoices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {tenants.length > 0 && (
                <div>
                  <Label>Tenant</Label>
                  <Select value={form.tenant_id} onValueChange={selectTenant}>
                    <SelectTrigger><SelectValue placeholder="Select tenant..." /></SelectTrigger>
                    <SelectContent>{tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount ($) *</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div><Label>Due Date *</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Payment instructions, late fees, etc." /></div>
              <Button className="w-full" onClick={handleCreate}>Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice Preview Dialog */}
      <Dialog open={!!previewInvoice} onOpenChange={() => setPreviewInvoice(null)}>
        <DialogContent className="max-w-lg">
          {previewInvoice && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold font-heading">EC Rental Property Management LLC</h2>
                <p className="text-xs text-muted-foreground">Invoice</p>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-semibold">Invoice #: {previewInvoice.invoice_number}</p>
                  <p>Due: {new Date(previewInvoice.due_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p>Bill To: {getTenantName(previewInvoice.tenant_id)}</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-semibold flex justify-between">
                  <span>Description</span><span>Amount</span>
                </div>
                {(previewInvoice.line_items as any[]).map((item: any, i: number) => (
                  <div key={i} className="px-4 py-2 text-sm flex justify-between border-t">
                    <span>{item.description}</span><span>${item.amount}</span>
                  </div>
                ))}
                <div className="px-4 py-2 text-sm font-bold flex justify-between border-t bg-muted">
                  <span>Total</span><span>${previewInvoice.amount}</span>
                </div>
              </div>
              {previewInvoice.notes && <p className="text-xs text-muted-foreground">{previewInvoice.notes}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : invoices.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><DollarSign className="w-12 h-12 mx-auto mb-3 opacity-40" /><p>No invoices yet. Create your first invoice.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <Card key={inv.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{inv.invoice_number}</p>
                    <Badge className={STATUS_COLORS[inv.status] || ""}>{inv.status}</Badge>
                    <span className="text-lg font-bold text-primary">${inv.amount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getTenantName(inv.tenant_id)} · Due {new Date(inv.due_date).toLocaleDateString()}
                    {inv.description && ` · ${inv.description}`}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setPreviewInvoice(inv)} title="Preview"><Eye className="w-4 h-4" /></Button>
                  {(inv.status === "pending" || inv.status === "overdue") && inv.tenant_id && (
                    <Button variant="ghost" size="icon" onClick={() => handleSend(inv)} title="Send to tenant"><Send className="w-4 h-4 text-primary" /></Button>
                  )}
                  {inv.status !== "paid" && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkPaid(inv.id)} className="text-xs">Mark Paid</Button>
                  )}
                  {inv.status !== "paid" && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
