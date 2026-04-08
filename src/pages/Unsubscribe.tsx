import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, MailX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success || data?.reason === "already_unsubscribed") {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2 justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-heading)] text-lg font-bold">ecrenta</span>
        </Link>

        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Validating your request…</p>
          </div>
        )}

        {status === "valid" && (
          <div className="space-y-4">
            <MailX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="font-[var(--font-heading)] text-xl font-bold">Unsubscribe</h1>
            <p className="text-sm text-muted-foreground">
              You'll no longer receive app emails from ecrenta.
            </p>
            <Button
              onClick={handleUnsubscribe}
              disabled={submitting}
              className="w-full rounded-xl py-6"
              variant="destructive"
            >
              {submitting ? "Processing…" : "Confirm Unsubscribe"}
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h1 className="font-[var(--font-heading)] text-xl font-bold">You're unsubscribed</h1>
            <p className="text-sm text-muted-foreground">
              You won't receive any more app emails from ecrenta.
            </p>
          </div>
        )}

        {status === "already" && (
          <div className="space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="font-[var(--font-heading)] text-xl font-bold">Already unsubscribed</h1>
            <p className="text-sm text-muted-foreground">
              You've already been removed from our mailing list.
            </p>
          </div>
        )}

        {(status === "invalid" || status === "error") && (
          <div className="space-y-3">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="font-[var(--font-heading)] text-xl font-bold">
              {status === "invalid" ? "Invalid link" : "Something went wrong"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {status === "invalid"
                ? "This unsubscribe link is invalid or has expired."
                : "Please try again later or contact support@ecrenta.space."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
