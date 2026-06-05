import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Globe, Lock, AlertCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const LOVABLE_IP = "185.158.133.1";
const DOMAINS = ["myrental.space", "www.myrental.space"] as const;

type Check = {
  domain: string;
  dnsOk: boolean | null;
  records: string[];
  tlsOk: boolean | null;
  tlsStatus?: number;
  error?: string;
  checking: boolean;
};

async function lookupA(domain: string): Promise<string[]> {
  const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
  const json = await res.json();
  return (json.Answer || []).filter((a: any) => a.type === 1).map((a: any) => a.data);
}

async function checkTls(domain: string): Promise<{ ok: boolean; status?: number }> {
  try {
    const res = await fetch(`https://${domain}`, { method: "HEAD", mode: "no-cors" });
    return { ok: true, status: res.status };
  } catch {
    return { ok: false };
  }
}

export default function DomainStatus() {
  const [checks, setChecks] = useState<Check[]>(
    DOMAINS.map((d) => ({ domain: d, dnsOk: null, records: [], tlsOk: null, checking: true })),
  );

  const runChecks = useCallback(async () => {
    setChecks(DOMAINS.map((d) => ({ domain: d, dnsOk: null, records: [], tlsOk: null, checking: true })));
    const results = await Promise.all(
      DOMAINS.map(async (domain): Promise<Check> => {
        try {
          const [records, tls] = await Promise.all([lookupA(domain), checkTls(domain)]);
          return {
            domain,
            records,
            dnsOk: records.includes(LOVABLE_IP),
            tlsOk: tls.ok,
            tlsStatus: tls.status,
            checking: false,
          };
        } catch (e: any) {
          return { domain, dnsOk: false, records: [], tlsOk: false, error: e?.message, checking: false };
        }
      }),
    );
    setChecks(results);
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const allGood = checks.every((c) => c.dnsOk && c.tlsOk);
  const anyChecking = checks.some((c) => c.checking);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Domain Status — myrental.space"
        description="Live DNS and TLS verification status for the myrental.space custom domain."
      />
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Custom Domain Status</h1>
            <p className="text-muted-foreground mt-1">Live DNS & TLS checks for myrental.space</p>
          </div>
          <Button onClick={runChecks} disabled={anyChecking} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${anyChecking ? "animate-spin" : ""}`} />
            Recheck
          </Button>
        </div>

        {!anyChecking && (
          <Alert className="mb-6" variant={allGood ? "default" : "destructive"}>
            {allGood ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{allGood ? "Domain is live" : "Connection incomplete"}</AlertTitle>
            <AlertDescription>
              {allGood
                ? "Both DNS and HTTPS are working for all domains."
                : `Target A record: ${LOVABLE_IP}. Add A records at your registrar and Lovable will auto-provision TLS.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {checks.map((c) => (
            <Card key={c.domain}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="font-mono">{c.domain}</span>
                  {c.checking ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : c.dnsOk && c.tlsOk ? (
                    <Badge>Active</Badge>
                  ) : (
                    <Badge variant="destructive">Not Connected</Badge>
                  )}
                </CardTitle>
                <CardDescription>DNS resolution and HTTPS reachability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusRow
                  icon={<Globe className="h-4 w-4" />}
                  label="DNS A record → Lovable"
                  ok={c.dnsOk}
                  loading={c.checking}
                  detail={
                    c.records.length
                      ? c.records.join(", ")
                      : c.checking
                        ? "Resolving…"
                        : "No A records found"
                  }
                />
                <StatusRow
                  icon={<Lock className="h-4 w-4" />}
                  label="HTTPS / TLS certificate"
                  ok={c.tlsOk}
                  loading={c.checking}
                  detail={
                    c.tlsOk
                      ? "TLS handshake succeeded"
                      : c.checking
                        ? "Connecting…"
                        : "HTTPS not reachable yet"
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-muted/40">
          <CardHeader>
            <CardTitle className="text-base">Required DNS records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs space-y-1">
              <div>A     @     {LOVABLE_IP}</div>
              <div>A     www   {LOVABLE_IP}</div>
              <div>TXT   _lovable   lovable_verify=… (from Lovable dialog)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  ok,
  loading,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  ok: boolean | null;
  loading: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground font-mono">{detail}</div>
        </div>
      </div>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
      ) : ok ? (
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-destructive shrink-0" />
      )}
    </div>
  );
}
