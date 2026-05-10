import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, ExternalLink, Plus, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import type { Json } from "@/integrations/supabase/types";

type Msg = { role: "user" | "assistant"; content: string };

interface P8ChatProps {
  mode: "va" | "inspector" | "growth";
  onSearchQuery?: (query: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/p8-chat`;

export default function P8Chat({ mode, onSearchQuery }: P8ChatProps) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load most recent conversation for current mode on mount
  useEffect(() => {
    if (!session?.user?.id) return;
    const loadRecent = async () => {
      const { data } = await supabase
        .from("p8_conversations")
        .select("id, title, messages, updated_at")
        .eq("user_id", session.user.id)
        .eq("mode", mode)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setConversationId(data.id);
        const msgs = (data.messages as unknown as Msg[]) || [];
        setMessages(msgs);
      } else {
        setConversationId(null);
        setMessages([]);
      }
    };
    loadRecent();
  }, [mode, session?.user?.id]);

  // Load conversation list for history panel
  const loadConversations = useCallback(async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from("p8_conversations")
      .select("id, title, updated_at")
      .eq("user_id", session.user.id)
      .eq("mode", mode)
      .order("updated_at", { ascending: false })
      .limit(20);
    setConversations(data || []);
  }, [session?.user?.id, mode]);

  useEffect(() => {
    if (showHistory) loadConversations();
  }, [showHistory, loadConversations]);

  // Save conversation (debounced)
  const saveConversation = useCallback(async (msgs: Msg[], convId: string | null) => {
    if (!session?.user?.id || msgs.length === 0) return;

    const title = msgs[0]?.content?.slice(0, 60) || "New conversation";

    if (convId) {
      await supabase
        .from("p8_conversations")
        .update({ messages: msgs as unknown as Json, title, updated_at: new Date().toISOString() })
        .eq("id", convId);
    } else {
      const { data } = await supabase
        .from("p8_conversations")
        .insert({
          user_id: session.user.id,
          mode,
          messages: msgs as unknown as Json,
          title,
        })
        .select("id")
        .single();
      if (data) setConversationId(data.id);
    }
  }, [session?.user?.id, mode]);

  const debouncedSave = useCallback((msgs: Msg[], convId: string | null) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveConversation(msgs, convId), 1500);
  }, [saveConversation]);

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setShowHistory(false);
  };

  const loadConversation = async (id: string) => {
    const { data } = await supabase
      .from("p8_conversations")
      .select("id, messages")
      .eq("id", id)
      .single();
    if (data) {
      setConversationId(data.id);
      setMessages((data.messages as unknown as Msg[]) || []);
    }
    setShowHistory(false);
  };

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !session) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: newMessages, mode }),
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

      // Save after stream completes
      const finalMessages = [...newMessages, { role: "assistant" as const, content: assistantSoFar }];
      debouncedSave(finalMessages, conversationId);
    } catch (e) {
      console.error("P8 chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Something went wrong. Please try again."}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, mode, session, conversationId, debouncedSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const markdownComponents: Components = {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith("search:")) {
        const query = href.slice(7);
        return (
          <button
            onClick={() => onSearchQuery?.(query)}
            className="inline-flex items-center gap-1 text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary font-medium cursor-pointer bg-primary/5 hover:bg-primary/10 px-1.5 py-0.5 rounded-md transition-colors"
          >
            {children}
            <ExternalLink className="w-3 h-3 inline flex-shrink-0" />
          </button>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline" {...props}>
          {children}
        </a>
      );
    },
  };

  const placeholders: Record<string, string> = {
    va: "Ask P8 anything... e.g. 'Draft a 3-day notice for 123 Main St'",
    inspector: "Ask about inspections...",
    growth: "Ask for marketing help...",
  };

  if (showHistory) {
    return (
      <div className="flex flex-col h-[calc(100dvh-14rem)] max-h-[700px] min-h-[400px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Chat History</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={startNewConversation}>
              <Plus className="w-3 h-3 mr-1" /> New
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowHistory(false)}>Back</Button>
          </div>
        </div>
        <ScrollArea className="flex-1 px-4 py-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-1">
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => loadConversation(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors ${c.id === conversationId ? "bg-muted font-medium" : ""}`}
                >
                  <p className="truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(c.updated_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-14rem)] max-h-[700px] min-h-[400px]">
      <div className="flex items-center justify-end px-4 py-1.5 gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={startNewConversation} title="New chat">
          <Plus className="w-3.5 h-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowHistory(true)} title="History">
          <History className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {mode === "va" ? "P8 Virtual Assistant" : mode === "inspector" ? "P8 Inspector" : "P8 Growth & Marketing"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {mode === "va" && "I help manage your properties — draft notices, handle tenant comms, translate, and answer anything."}
              {mode === "inspector" && "I help plan inspections, assess damage vs. wear & tear, and estimate repair costs."}
              {mode === "growth" && "I create listing ads, social media posts, and growth strategies to fill vacancies faster."}
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
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 break-words overflow-hidden">
                    <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
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
            className="!min-h-[44px] max-h-[120px] resize-none text-sm"
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
