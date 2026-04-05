import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lightbulb, Palette, ArrowLeft, Sparkles } from "lucide-react";
import P8Chat from "@/components/P8Chat";

type P8Mode = "va" | "strategist" | "creative";

export default function P8Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<P8Mode>("va");

  return (
    <>
      <Helmet>
        <title>P8 AI Assistant | Run P8 for Your Business</title>
        <meta name="description" content="P8 — your AI business assistant for growth, strategy, content, and daily operations." />
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
              <TabsTrigger value="strategist" className="gap-2 text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4" />
                Strategist
              </TabsTrigger>
              <TabsTrigger value="creative" className="gap-2 text-xs sm:text-sm">
                <Palette className="w-4 h-4" />
                Creative
              </TabsTrigger>
            </TabsList>

            <Card className="border-border/50 shadow-lg">
              <TabsContent value="va" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" /> Business Assistant
                  </CardTitle>
                  <CardDescription>Draft documents, translate, plan operations, answer anything</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="va" />
                </CardContent>
              </TabsContent>

              <TabsContent value="strategist" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" /> Strategist
                  </CardTitle>
                  <CardDescription>Growth planning, market analysis, financial strategy</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="strategist" />
                </CardContent>
              </TabsContent>

              <TabsContent value="creative" className="mt-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" /> Creative Studio
                  </CardTitle>
                  <CardDescription>Social media, ad copy, content calendars, brand messaging</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <P8Chat mode="creative" />
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </>
  );
}
