import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Phone, Mail, MapPin, Calendar, Trash2, Edit2 } from "lucide-react";

type Lead = {
  id: string;
  owner_name: string;
  email: string | null;
  phone: string | null;
  property_address: string | null;
  source: string;
  status: string;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-500/20 text-blue-400" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "interested", label: "Interested", color: "bg-green-500/20 text-green-400" },
  { value: "listed", label: "Listed", color: "bg-primary/20 text-primary" },
  { value: "declined", label: "Declined", color: "bg-red-500/20 text-red-400" },
];

const SOURCE_OPTIONS = ["Manual", "Tax Records", "Craigslist", "Facebook", "Referral", "Drive-By", "Hospital", "Other"];

const emptyForm = { owner_name: "", email: "", phone: "", property_address: "", source: "Manual", status: "new", notes: "", follow_up_date: "" };

export default function OutreachCRM() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchLeads = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("property_owner_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user]);

  const handleSave = async () => {
    if (!user || !form.owner_name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const payload = {
      user_id: user.id,
      owner_name: form.owner_name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      property_address: form.property_address || null,
      source: form.source,
      status: form.status,
      notes: form.notes || null,
      follow_up_date: form.follow_up_date || null,
    };

    if (editingId) {
      const { error } = await supabase.from("property_owner_leads").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error updating lead", variant: "destructive" }); return; }
      toast({ title: "Lead updated" });
    } else {
      const { error } = await supabase.from("property_owner_leads").insert(payload);
      if (error) { toast({ title: "Error adding lead", variant: "destructive" }); return; }
      toast({ title: "Lead added" });
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("property_owner_leads").delete().eq("id", id);
    toast({ title: "Lead removed" });
    fetchLeads();
  };

  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      owner_name: lead.owner_name,
      email: lead.email || "",
      phone: lead.phone || "",
      property_address: lead.property_address || "",
      source: lead.source,
      status: lead.status,
      notes: lead.notes || "",
      follow_up_date: lead.follow_up_date || "",
    });
    setDialogOpen(true);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.owner_name.toLowerCase().includes(search.toLowerCase()) || (l.property_address || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const s = STATUS_OPTIONS.find(o => o.value === status);
    return <Badge variant="outline" className={s?.color || ""}>{s?.label || status}</Badge>;
  };

  const counts = STATUS_OPTIONS.map(s => ({ ...s, count: leads.filter(l => l.status === s.value).length }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Landlord Outreach</h1>
          <p className="text-sm text-muted-foreground">Track property owner leads and follow-ups</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Lead" : "Add New Lead"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Owner name *" value={form.owner_name} onChange={e => setForm(f => ({ ...f, owner_name: e.target.value }))} />
              <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Input placeholder="Property address" value={form.property_address} onChange={e => setForm(f => ({ ...f, property_address: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>{SOURCE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input type="date" value={form.follow_up_date} onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))} />
              <Textarea placeholder="Notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
              <Button onClick={handleSave} className="w-full">{editingId ? "Update" : "Add Lead"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline counts */}
      <div className="grid grid-cols-5 gap-2">
        {counts.map(c => (
          <button key={c.value} onClick={() => setFilterStatus(filterStatus === c.value ? "all" : c.value)}
            className={`rounded-lg border p-3 text-center transition-colors ${filterStatus === c.value ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent/50"}`}>
            <p className="text-2xl font-bold text-foreground">{c.count}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or address..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {leads.length === 0 ? "No leads yet. Add your first property owner lead!" : "No leads match your filter."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => (
            <div key={lead.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{lead.owner_name}</h3>
                    {statusBadge(lead.status)}
                    <Badge variant="secondary" className="text-xs">{lead.source}</Badge>
                  </div>
                  {lead.property_address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{lead.property_address}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(lead)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(lead.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                {lead.follow_up_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Follow up: {new Date(lead.follow_up_date).toLocaleDateString()}</span>}
              </div>
              {lead.notes && <p className="text-sm text-muted-foreground border-t border-border pt-2 mt-2">{lead.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
