import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, ClipboardCheck, BarChart3, ArrowLeft, Sparkles } from "lucide-react";
import P8Chat from "@/components/P8Chat";

type P8Mode = "va" | "inspector" | "manager";

export default function P8Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<P8Mode>("va");

  return (
    <>
      <Helmet>
        <title>P8 AI Assistant | runp8</title>
        <meta name="description" content="P8 — your AI property inspector, virtual assistant, and property manager." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto flex items-center gap-4 px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading leading-tight">P8</h1>
                <p className="text-xs text-muted-foreground">AI Property Assistant</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Tabs value={mode} onValueChange={(v) => setMode(v as P8Mode)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="va" className="gap-2 text-xs sm:text-sm">
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Virtual</span> VA
              </TabsTrigger>
              <TabsTrigger value="inspector" className="gap-2 text-xs sm:text-sm">
                <ClipboardCheck className="w-4 h-4" />
                Inspector
              </TabsTrigger>
              <TabsTrigger value="manager" className="gap-2 text-xs sm:text-sm">
                <BarChart3 className="w-4 h-4" />
                Manager
              </TabsTrigger>
            </TabsList>

            <Card className="border-border/50 shadow-lg">
              <TabsContent value="va" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" /> Virtual Assistant
                  </CardTitle>
                  <CardDescription>Draft notices, answer questions, manage tenant communication</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="va" />
                </CardContent>
              </TabsContent>

              <TabsContent value="inspector" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-primary" /> Inspector
                  </CardTitle>
                  <CardDescription>Plan inspections, analyze reports, estimate repairs</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="inspector" />
                </CardContent>
              </TabsContent>

              <TabsContent value="manager" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> Property Manager
                  </CardTitle>
                  <CardDescription>Track finances, maintenance priorities, portfolio insights</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="manager" />
                </CardContent>
              </TabsContent>
            </Card>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/inspections/new">
                <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <ClipboardCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">New Inspection</p>
                      <p className="text-xs text-muted-foreground">AI photo analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/add-property">
                <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Add Property</p>
                      <p className="text-xs text-muted-foreground">List a rental</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/maintenance">
                <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Maintenance</p>
                      <p className="text-xs text-muted-foreground">View requests</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
