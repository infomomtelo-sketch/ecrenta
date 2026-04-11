import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Receipt, FileWarning, DollarSign, ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ReceiptView({ content, form }: { content: any; form: any }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold font-heading">RENT RECEIPT</h2>
          <p className="text-sm text-muted-foreground">EC Rental Property Management LLC</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><strong>Date:</strong> {content.payment_date}</div>
          <div><strong>Receipt #:</strong> {form.id?.slice(0, 8).toUpperCase()}</div>
        </div>
        <div className="border-t pt-3 space-y-2 text-sm">
          <p><strong>Received from:</strong> {content.tenant_name}</p>
          <p><strong>Property:</strong> {content.property_address}</p>
          <p><strong>Rental Period:</strong> {content.period_from} to {content.period_to}</p>
          <p><strong>Payment Method:</strong> {(content.payment_method || "other").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Amount Paid</p>
          <p className="text-3xl font-bold text-primary">${Number(content.amount_paid).toFixed(2)}</p>
        </div>
        {content.notes && (
          <div className="border-t pt-3 text-sm">
            <p><strong>Notes:</strong> {content.notes}</p>
          </div>
        )}
        <div className="border-t pt-3 text-sm">
          <p><strong>Received by:</strong> {content.received_by}</p>
          <p className="text-xs text-muted-foreground mt-2">This receipt confirms payment received for the rental period specified above.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InvoiceView({ content, form }: { content: any; form: any }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold font-heading">INVOICE</h2>
            <p className="text-sm text-muted-foreground">EC Rental Property Management LLC</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Invoice #:</strong> {form.id?.slice(0, 8).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(form.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="border-t pt-3 space-y-1 text-sm">
          <p><strong>Bill To:</strong> {content.tenant_name}</p>
          <p><strong>Property:</strong> {content.property_address}</p>
          <p><strong>Due Date:</strong> {content.due_date}</p>
        </div>
        {content.description && <p className="text-sm text-muted-foreground">{content.description}</p>}
        {content.line_items?.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {content.line_items.map((item: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-right">${Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50 border-t-2">
                <tr>
                  <td className="p-3 font-bold">Total Due</td>
                  <td className="p-3 text-right font-bold text-primary">${Number(content.amount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        {content.notes && (
          <div className="border-t pt-3 text-sm">
            <p><strong>Notes:</strong> {content.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NoticeView({ content, form }: { content: any; form: any }) {
  const noticeLabel = (content.notice_type || "notice").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold font-heading">{noticeLabel}</h2>
          <p className="text-sm text-muted-foreground">EC Rental Property Management LLC</p>
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>To:</strong> {content.tenant_name}</p>
          <p><strong>Property:</strong> {content.property_address}</p>
          <p><strong>Date:</strong> {new Date(form.created_at).toLocaleDateString()}</p>
          <p><strong>Effective:</strong> {content.effective_date}</p>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{content.body_text}</div>
        </div>
        <div className="border-t pt-4 text-sm">
          <p><strong>From:</strong> {content.landlord_name}</p>
          <p className="text-muted-foreground">EC Rental Property Management LLC</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignForm() {
  const { token } = useParams<{ token: string }>();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!token) return;
      const { data } = await supabase
        .from("rental_forms")
        .select("*")
        .eq("sign_token", token)
        .single();
      setForm(data);
      if (data?.status === "signed") setSigned(true);
      setLoading(false);
    };
    fetchForm();
  }, [token]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    setHasSignature(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setHasSignature(false);
  };

  const handleSign = async () => {
    if (!signerName.trim() || !hasSignature) return;
    setSigning(true);
    const signatureData = canvasRef.current!.toDataURL("image/png");
    await supabase.from("rental_forms").update({
      status: "signed",
      signed_at: new Date().toISOString(),
      signature_data: signatureData,
      signer_name: signerName.trim(),
    }).eq("sign_token", token);
    setSigned(true);
    setSigning(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4"><CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold">Document not found</p>
          <p className="text-sm text-muted-foreground mt-1">This link may be invalid or expired.</p>
        </CardContent></Card>
      </div>
    );
  }

  const content = form.content || {};
  const isReadOnly = ["rent_receipt", "invoice", "notice"].includes(form.form_type);

  const getIcon = () => {
    if (form.form_type === "rent_receipt") return <Receipt className="w-5 h-5 text-primary" />;
    if (form.form_type === "invoice") return <DollarSign className="w-5 h-5 text-primary" />;
    if (form.form_type === "notice") return <FileWarning className="w-5 h-5 text-primary" />;
    return <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <Helmet>
        <title>{form.title} | E.Crenta</title>
      </Helmet>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            {getIcon()}
            <h1 className="text-2xl font-bold font-heading">E.Crenta</h1>
          </div>
          <p className="text-sm text-muted-foreground">EC Rental Property Management LLC</p>
        </div>

        {/* Read-only document types */}
        {isReadOnly ? (
          <>
            {form.form_type === "rent_receipt" && <ReceiptView content={content} form={form} />}
            {form.form_type === "invoice" && <InvoiceView content={content} form={form} />}
            {form.form_type === "notice" && <NoticeView content={content} form={form} />}
            <p className="text-[10px] text-muted-foreground text-center">
              This document was generated by E.Crenta on {new Date(form.created_at).toLocaleDateString()}.
            </p>
          </>
        ) : signed ? (
          <Card><CardContent className="py-12 text-center space-y-3">
            <CheckCircle className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-xl font-bold">Document Signed</h2>
            <p className="text-muted-foreground">
              This document was signed{form.signer_name ? ` by ${form.signer_name}` : ""} on {new Date(form.signed_at).toLocaleDateString()}.
            </p>
            {form.signature_data && (
              <div className="border rounded-lg p-4 inline-block bg-white">
                <img src={form.signature_data} alt="Signature" className="h-20" />
              </div>
            )}
          </CardContent></Card>
        ) : (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">{form.title}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{form.form_type.replace(/_/g, " ")}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Date: {new Date(form.created_at).toLocaleDateString()}</p>
                </div>
                {content.property_address && (
                  <div className="border-t pt-3">
                    <p className="text-sm"><strong>Property:</strong> {content.property_address}</p>
                  </div>
                )}
                {content.rent_amount && <p className="text-sm"><strong>Monthly Rent:</strong> ${content.rent_amount}</p>}
                {content.lease_start && content.lease_end && (
                  <p className="text-sm"><strong>Lease Term:</strong> {content.lease_start} to {content.lease_end}</p>
                )}
                {content.terms && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-semibold mb-1">Terms & Conditions</p>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">{content.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold">Electronic Signature</h3>
                <p className="text-xs text-muted-foreground">
                  By signing below, you acknowledge that you have read and agree to the terms of this document.
                </p>
                <div>
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input value={signerName} onChange={e => setSignerName(e.target.value)} placeholder="Enter your full legal name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Signature *</label>
                  <div className="border rounded-lg bg-white relative">
                    <canvas
                      ref={canvasRef}
                      width={560}
                      height={160}
                      className="w-full h-40 cursor-crosshair touch-none"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={endDraw}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <Button variant="ghost" size="sm" onClick={clearSignature} className="text-xs">Clear</Button>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSign}
                  disabled={!signerName.trim() || !hasSignature || signing}
                >
                  {signing ? "Signing..." : "Sign Document"}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  This electronic signature is legally binding under the ESIGN Act and UETA.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
