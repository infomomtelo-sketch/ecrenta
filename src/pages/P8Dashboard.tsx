import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, ClipboardCheck, TrendingUp, Sparkles } from "lucide-react";
import P8Chat from "@/components/P8Chat";

type P8Mode = "va" | "inspector" | "growth";

export default function P8Dashboard() {
  const { user, role } = useAuth();
  const [mode, setMode] = useState<P8Mode>("va");

  return (
    <>
      <Helmet>
        <title>P8 AI Assistant | runp8</title>
        <meta name="description" content="P8 — your AI property management assistant for inspections, operations, and growth." />
      </Helmet>

      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Tabs value={mode} onValueChange={(v) => setMode(v as P8Mode)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 h-12">
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

            <Card className="border-border/50 shadow-lg">
              <TabsContent value="va" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" /> Virtual Assistant
                  </CardTitle>
                  <CardDescription>Draft notices, manage tenants, translate, answer anything</CardDescription>
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
                  <CardDescription>Plan inspections, assess damage, estimate repairs</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="inspector" />
                </CardContent>
              </TabsContent>

              <TabsContent value="growth" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Growth & Marketing
                  </CardTitle>
                  <CardDescription>Listing ads, social media, vacancy marketing, growth strategy</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="growth" />
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </>
  );
}
