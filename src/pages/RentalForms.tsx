import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, Building2, Scale, Plus, ArrowLeft, FileText, PenTool,
  Download, ChevronRight, Search, Lock, ClipboardList, ClipboardCheck,
  Wrench, ShieldAlert, FileSignature, Eraser, GripVertical,
  Type, AlignLeft, Calendar, Mail, Phone, Hash, ChevronDown,
  CheckSquare, Heading, Send, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFieldRenderer } from "@/components/FormFieldRenderer";
import { SignaturePad } from "@/components/SignaturePad";
import {
  FORM_TEMPLATES, FORM_CATEGORIES, FIELD_TYPES,
  type FormTemplate, type FormField, type FieldType, makeFieldId
} from "@/lib/formTemplates";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Home, Building2, Scale, Lock, ClipboardList, ClipboardCheck,
  Wrench, ShieldAlert, FileSignature, FileText, PenTool,
  Type, AlignLeft, Calendar, Mail, Phone, Hash, ChevronDown,
  CheckSquare, Heading,
};

type View = "library" | "fill" | "builder";

export default function RentalForms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>("library");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [customFormName, setCustomFormName] = useState("Untitled Form");
  const [sendEmail, setSendEmail] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const filteredTemplates = FORM_TEMPLATES.filter((t) => {
    const matchCat = !activeCategory || t.category === activeCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openTemplate = useCallback((t: FormTemplate) => {
    setSelectedTemplate(t);
    setFormValues({});
    setView("fill");
  }, []);

  const openBuilder = useCallback(() => {
    setCustomFields([
      { id: makeFieldId(), type: "heading", label: "Untitled Form" },
    ]);
    setCustomFormName("Untitled Form");
    setFormValues({});
    setView("builder");
  }, []);

  const addFieldToBuilder = useCallback((type: FieldType) => {
    setCustomFields((prev) => [
      ...prev,
      { id: makeFieldId(), type, label: type === "heading" ? "Section" : type === "paragraph" ? "Enter description text..." : `New ${type} field`, required: false },
    ]);
  }, []);

  const updateBuilderField = useCallback((id: string, updates: Partial<FormField>) => {
    setCustomFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const removeBuilderField = useCallback((id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveField = useCallback((idx: number, dir: -1 | 1) => {
    setCustomFields((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const previewCustomForm = useCallback(() => {
    setSelectedTemplate({
      id: "custom",
      name: customFormName,
      description: "Custom form",
      category: "legal",
      icon: "FileText",
      fields: customFields,
    });
    setFormValues({});
    setView("fill");
  }, [customFields, customFormName]);

  const handleExportPDF = useCallback(() => {
    if (!formRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) { toast.error("Please allow popups to export PDF"); return; }

    const fields = selectedTemplate?.fields ?? [];
    let html = `<html><head><title>${selectedTemplate?.name ?? "Form"}</title><style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
      h1 { font-size: 22px; border-bottom: 2px solid #333; padding-bottom: 8px; }
      h2 { font-size: 17px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
      .field { margin-bottom: 14px; }
      .label { font-weight: 600; font-size: 13px; color: #444; margin-bottom: 2px; }
      .value { font-size: 14px; padding: 4px 0; border-bottom: 1px dotted #ccc; min-height: 20px; }
      .sig-img { max-width: 260px; height: auto; border-bottom: 1px solid #333; }
      .checkbox { display: flex; align-items: center; gap: 6px; }
      p.desc { font-size: 13px; color: #555; line-height: 1.5; }
      .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 11px; color: #888; }
      @media print { body { padding: 20px; } }
    </style></head><body>`;

    html += `<p style="font-size:11px;color:#888;margin-bottom:4px;">EC Rental Property Management LLC</p>`;

    fields.forEach((f) => {
      const v = formValues[f.id] || "";
      if (f.type === "heading") { html += `<h2>${f.label}</h2>`; return; }
      if (f.type === "paragraph") { html += `<p class="desc">${f.label}</p>`; return; }
      if (f.type === "signature") {
        html += `<div class="field"><div class="label">${f.label}</div>${v ? `<img class="sig-img" src="${v}" />` : '<div class="value">(not signed)</div>'}</div>`;
        return;
      }
      if (f.type === "checkbox") {
        html += `<div class="field checkbox"><span>${v === "true" ? "☑" : "☐"}</span><span>${f.label}</span></div>`;
        return;
      }
      html += `<div class="field"><div class="label">${f.label}</div><div class="value">${v || "&nbsp;"}</div></div>`;
    });

    html += `<div class="footer">Generated by EC Rental Property Management LLC · ecrenta.space</div>`;
    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
    toast.success("PDF export opened — use Print > Save as PDF");
  }, [formValues, selectedTemplate]);

  const handleSendForSignature = useCallback(async () => {
    if (!sendEmail.trim() || !selectedTemplate || !user) return;
    setSending(true);
    try {
      const signToken = crypto.randomUUID();
      const content: Record<string, string> = {};
      for (const f of selectedTemplate.fields) {
        if (formValues[f.id]) content[f.id] = formValues[f.id];
        // Also store display-friendly versions
        if (f.type === "heading" || f.type === "paragraph") continue;
        if (f.id === "property_address" && formValues[f.id]) content.property_address = formValues[f.id];
        if (f.id === "rent_amount" && formValues[f.id]) content.rent_amount = formValues[f.id];
        if (f.id === "lease_start" && formValues[f.id]) content.lease_start = formValues[f.id];
        if (f.id === "lease_end" && formValues[f.id]) content.lease_end = formValues[f.id];
      }
      // Store terms (all paragraph fields concatenated)
      const terms = selectedTemplate.fields
        .filter(f => f.type === "paragraph")
        .map(f => f.label)
        .join("\n\n");
      content.terms = terms;

      const { error } = await supabase.from("rental_forms").insert({
        title: selectedTemplate.name,
        form_type: selectedTemplate.id,
        content: content as any,
        user_id: user.id,
        status: "pending",
        sign_token: signToken,
        recipient_email: sendEmail.trim(),
      });
      if (error) throw error;

      // Send the email via edge function
      const signUrl = `${window.location.origin}/sign/${signToken}`;
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          to: sendEmail.trim(),
          template: "form-sign-request",
          data: {
            formTitle: selectedTemplate.name,
            signUrl,
            senderName: user.user_metadata?.full_name || user.email || "Your Landlord",
          },
        },
      });

      toast.success(`Signature request sent to ${sendEmail.trim()}`);
      setSendEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }, [sendEmail, selectedTemplate, formValues, user]);

  // ── LIBRARY VIEW ──
  if (view === "library") {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <Helmet><title>Rental Forms | ecrenta</title></Helmet>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">Form Maker</h1>
            <p className="text-muted-foreground mt-1">Browse templates or build your own — fill, sign, and export as PDF.</p>
          </div>
          <Button onClick={openBuilder} className="gap-2">
            <Plus className="h-4 w-4" /> Build Custom
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Button variant={!activeCategory ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(null)}>All</Button>
          {FORM_CATEGORIES.map((c) => {
            const Icon = iconMap[c.icon] ?? FileText;
            return (
              <Button key={c.id} variant={activeCategory === c.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(c.id)} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {c.label}
              </Button>
            );
          })}
        </div>

        {/* Template grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((t) => {
            const Icon = iconMap[t.icon] ?? FileText;
            const cat = FORM_CATEGORIES.find((c) => c.id === t.category);
            return (
              <button
                key={t.id}
                onClick={() => openTemplate(t)}
                className="group text-left p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all"
              >
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${cat?.bg ?? "from-muted to-muted"} mb-3`}>
                  <Icon className={`h-5 w-5 ${cat?.color ?? "text-muted-foreground"}`} />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                  Open form <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── FILL VIEW ──
  if (view === "fill" && selectedTemplate) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <Helmet><title>{selectedTemplate.name} | ecrenta</title></Helmet>
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setView(selectedTemplate.id === "custom" ? "builder" : "library")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading text-foreground">{selectedTemplate.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
        </div>

        <div ref={formRef} className="space-y-4">
          {selectedTemplate.fields.map((f) => {
            const wrapClass = f.width === "half" ? "w-full sm:w-[calc(50%-0.5rem)]" : "w-full";
            return (
              <div key={f.id} className={`inline-block align-top ${wrapClass}`} style={f.width === "half" ? { marginRight: "0.5rem" } : {}}>
                <FormFieldRenderer field={f} value={formValues[f.id] ?? ""} onChange={(v) => setFormValues((prev) => ({ ...prev, [f.id]: v }))} />
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" /> Export as PDF
          </Button>
        </div>
      </div>
    );
  }

  // ── BUILDER VIEW ──
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <Helmet><title>Form Builder | ecrenta</title></Helmet>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setView("library")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Library
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <Input
            className="text-xl font-bold bg-transparent border-none px-0 h-auto focus-visible:ring-0 text-foreground"
            value={customFormName}
            onChange={(e) => setCustomFormName(e.target.value)}
            placeholder="Form name..."
          />
        </div>
        <Button onClick={previewCustomForm} className="gap-2">
          <PenTool className="h-4 w-4" /> Preview & Fill
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-6">
        {/* Form canvas */}
        <div className="space-y-2">
          {customFields.map((f, idx) => {
            const Icon = iconMap[FIELD_TYPES.find((ft) => ft.type === f.type)?.icon ?? "Type"] ?? Type;
            return (
              <div key={f.id} className="group flex items-start gap-2 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
                <div className="flex flex-col gap-1 mt-1">
                  <button onClick={() => moveField(idx, -1)} className="text-muted-foreground hover:text-foreground text-xs" disabled={idx === 0}>▲</button>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <button onClick={() => moveField(idx, 1)} className="text-muted-foreground hover:text-foreground text-xs" disabled={idx === customFields.length - 1}>▼</button>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      className="h-8 text-sm font-medium"
                      value={f.label}
                      onChange={(e) => updateBuilderField(f.id, { label: e.target.value })}
                      placeholder="Field label..."
                    />
                    {f.type !== "heading" && f.type !== "paragraph" && (
                      <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
                        <input type="checkbox" checked={f.required ?? false} onChange={(e) => updateBuilderField(f.id, { required: e.target.checked })} className="accent-primary" />
                        Req
                      </label>
                    )}
                  </div>
                  {f.type === "select" && (
                    <Input
                      className="h-7 text-xs"
                      value={f.options?.join(", ") ?? ""}
                      onChange={(e) => updateBuilderField(f.id, { options: e.target.value.split(",").map((s) => s.trim()) })}
                      placeholder="Options (comma separated)"
                    />
                  )}
                </div>
                <button onClick={() => removeBuilderField(f.id)} className="text-muted-foreground hover:text-destructive mt-1">
                  <Eraser className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {customFields.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Add fields from the panel →</p>
            </div>
          )}
        </div>

        {/* Field type panel */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Add Field</h3>
          {FIELD_TYPES.map((ft) => {
            const Icon = iconMap[ft.icon] ?? Type;
            return (
              <button
                key={ft.type}
                onClick={() => addFieldToBuilder(ft.type)}
                className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-accent/50 transition-all text-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                {ft.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
