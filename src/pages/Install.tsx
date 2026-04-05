import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle, Share } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
          <img src="/pwa-icon-512.png" alt="P8" width={96} height={96} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Install P8
          </h1>
          <p className="text-muted-foreground text-lg">
            Add P8 to your home screen for instant access to your AI property manager.
          </p>
        </div>

        {isInstalled ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-semibold">P8 is installed!</span>
            </div>
            <Link to="/p8">
              <Button size="lg" className="gap-2">
                Open P8 <Smartphone className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : isIOS ? (
          <div className="space-y-4 bg-card rounded-xl p-6 border border-border text-left">
            <p className="font-semibold text-foreground">To install on iPhone/iPad:</p>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Tap the <Share className="inline w-4 h-4 -mt-0.5" /> Share button in Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span>Tap <strong>"Add"</strong> in the top right</span>
              </li>
            </ol>
          </div>
        ) : deferredPrompt ? (
          <Button size="lg" onClick={handleInstall} className="gap-2 w-full text-lg py-6">
            <Download className="w-5 h-5" /> Install P8
          </Button>
        ) : (
          <div className="space-y-4 bg-card rounded-xl p-6 border border-border text-left">
            <p className="font-semibold text-foreground">To install:</p>
            <p className="text-muted-foreground">
              Open the browser menu (⋮) and tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          </div>
        )}

        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4 text-primary shrink-0" />
            <span>Works offline — manage properties anywhere</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Download className="w-4 h-4 text-primary shrink-0" />
            <span>No app store needed — installs instantly</span>
          </div>
        </div>

        <Link to="/" className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to runp8.com
        </Link>
      </div>
    </div>
  );
};

export default Install;
