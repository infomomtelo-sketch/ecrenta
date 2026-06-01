import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ClipboardCheck, TrendingUp, PanelRight } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import P8Chat from "@/components/P8Chat";
import QuickLaunchPanel from "@/components/QuickLaunchPanel";

type P8Mode = "va" | "inspector" | "growth";

export default function P8Dashboard() {
  const { user, role } = useAuth();
  const [mode, setMode] = useState<P8Mode>("va");
  const [showPanel, setShowPanel] = useState(false);
  const [externalQuery, setExternalQuery] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSearchQuery = useCallback((query: string) => {
    if (!showPanel) setShowPanel(true);
    // Use a unique key to re-trigger even for the same query
    setExternalQuery(query + "##" + Date.now());
  }, [showPanel]);

  // Strip the timestamp suffix before passing to panel
  const cleanQuery = externalQuery ? externalQuery.replace(/##\d+$/, "") : null;

  return (
    <>
      <Helmet>
        <title>P8 AI Assistant | ecrenta</title>
        <meta name="description" content="P8 — your AI property management assistant for inspections, operations, and growth." />
      </Helmet>

      <div className="min-h-full overflow-x-hidden bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-6 min-w-0 overflow-x-hidden">
          <Tabs value={mode} onValueChange={(v) => setMode(v as P8Mode)} className="min-w-0 space-y-4 overflow-x-hidden">
            <div className="flex min-w-0 items-center gap-2">
              <TabsList className="grid min-w-0 w-full grid-cols-3 h-12">
                <TabsTrigger value="va" className="gap-2 text-xs sm:text-sm">
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">Assistant</span>
                  <span className="sm:hidden">VA</span>
                </TabsTrigger>
                <TabsTrigger value="inspector" className="gap-2 text-xs sm:text-sm">
                  <ClipboardCheck className="w-4 h-4" />
                  Inspector
                </TabsTrigger>
                <TabsTrigger value="growth" className="gap-2 text-xs sm:text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Growth
                </TabsTrigger>
              </TabsList>
              {!showPanel && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 flex-shrink-0"
                  onClick={() => setShowPanel(true)}
                  title="Open Quick Launch panel"
                >
                  <PanelRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {showPanel && !isMobile ? (
              <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-16rem)]">
                <ResizablePanel defaultSize={60} minSize={40}>
                  <ChatCard mode={mode} onSearchQuery={handleSearchQuery} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={25}>
                  <QuickLaunchPanel onClose={() => setShowPanel(false)} externalQuery={cleanQuery} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : showPanel && isMobile ? (
              <div className="min-w-0 space-y-4 overflow-x-hidden">
                <QuickLaunchPanel onClose={() => setShowPanel(false)} externalQuery={cleanQuery} />
                <ChatCard mode={mode} onSearchQuery={handleSearchQuery} />
              </div>
            ) : (
              <ChatCard mode={mode} onSearchQuery={handleSearchQuery} />
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}

function ChatCard({ mode, onSearchQuery }: { mode: P8Mode; onSearchQuery: (q: string) => void }) {
  return (
    <Card className="border-border/50 shadow-lg h-full min-w-0 max-w-full overflow-hidden">
      {mode === "va" && (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" /> Virtual Assistant
            </CardTitle>
            <CardDescription>Draft notices, manage tenants, translate, answer anything</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden p-0">
            <P8Chat mode="va" onSearchQuery={onSearchQuery} />
          </CardContent>
        </>
      )}
      {mode === "inspector" && (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" /> Inspector
            </CardTitle>
            <CardDescription>Plan inspections, assess damage, estimate repairs</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden p-0">
            <P8Chat mode="inspector" onSearchQuery={onSearchQuery} />
          </CardContent>
        </>
      )}
      {mode === "growth" && (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Growth & Marketing
            </CardTitle>
            <CardDescription>Listing ads, social media, vacancy marketing, growth strategy</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden p-0">
            <P8Chat mode="growth" onSearchQuery={onSearchQuery} />
          </CardContent>
        </>
      )}
    </Card>
  );
}
