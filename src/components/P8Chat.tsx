import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

interface P8ChatProps {
  mode: "va" | "strategist" | "creative";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/p8-chat`;

export default function P8Chat({ mode }: P8ChatProps) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset messages when mode changes
  useEffect(() => {
    setMessages([]);
  }, [mode]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !session) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: allMessages, mode }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("P8 chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Something went wrong. Please try again."}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, mode, session]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const placeholders: Record<string, string> = {
    va: "Ask P8 anything... e.g. 'Draft a 3-day notice for unit at 123 Main St'",
    inspector: "Ask about inspections... e.g. 'What should I look for in a move-out inspection?'",
    manager: "Ask about your portfolio... e.g. 'What's my current vacancy rate?'",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-h-[700px]">
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {mode === "va" ? "P8 Virtual Assistant" : mode === "inspector" ? "P8 Inspector" : "P8 Property Manager"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {mode === "va" && "I can draft notices, answer property questions, and help manage your rentals."}
              {mode === "inspector" && "I help plan inspections, analyze reports, and estimate repair costs."}
              {mode === "manager" && "I track your portfolio, finances, maintenance, and provide strategic advice."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-4 py-3">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[mode]}
            className="min-h-[44px] max-h-[120px] resize-none text-sm"
            rows={1}
          />
          <Button
            size="icon"
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 h-11 w-11 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
