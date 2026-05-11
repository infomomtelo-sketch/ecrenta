import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string | null;
  text: string;
  type: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  listing_id: string;
  tenant_user_id: string | null;
  landlord_user_id: string | null;
  last_message_text: string | null;
  last_message_at: string | null;
  updated_at: string;
}

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export default function Inbox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  const { user, profile, loading: authLoading } = useAuth();
  const propertyId = searchParams.get("property");
  const prefillMsg = searchParams.get("msg");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [otherParties, setOtherParties] = useState<Record<string, { name: string; avatar: string | null }>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState(prefillMsg || "");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=${encodeURIComponent(`/inbox${window.location.search}`)}`);
    }
  }, [authLoading, user, navigate]);

  // Fetch conversations where user is participant
  const fetchConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, listing_id, tenant_user_id, landlord_user_id, last_message_text, last_message_at, updated_at")
      .or(`tenant_user_id.eq.${user.id},landlord_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });
    if (data) {
      setConversations(data as Conversation[]);
      // Resolve other-party display_name + avatar
      const otherIds = Array.from(new Set(
        (data as Conversation[]).map((c) =>
          c.tenant_user_id === user.id ? c.landlord_user_id : c.tenant_user_id
        ).filter((x): x is string => !!x)
      ));
      if (otherIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", otherIds);
        const map: Record<string, { name: string; avatar: string | null }> = {};
        (profs || []).forEach((p: any) => {
          map[p.user_id] = { name: p.display_name || "User", avatar: p.avatar_url };
        });
        setOtherParties(map);
      }
    }
    setLoading(false);
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_user_id, text, type, created_at, read_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  useEffect(() => {
    if (!user) return;
    fetchConversations();

    const convChannel = supabase
      .channel("conversations-realtime")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => fetchConversations()
      )
      .subscribe();

    return () => { supabase.removeChannel(convChannel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Open or create conversation when arriving from a listing
  useEffect(() => {
    if (!propertyId || loading || !user) return;
    const init = async () => {
      const listing = listings.find((l) => l.id === propertyId);
      if (!listing) return;
      const landlordId = (listing as any).user_id;
      if (!landlordId) {
        toast.error("This listing has no owner attached yet.");
        return;
      }
      if (landlordId === user.id) {
        toast.error("You can't message your own listing.");
        return;
      }
      const existing = conversations.find(
        (c) => c.listing_id === propertyId && c.tenant_user_id === user.id
      );
      if (existing) {
        setActiveConvId(existing.id);
        return;
      }
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          listing_id: propertyId,
          tenant_user_id: user.id,
          landlord_user_id: landlordId,
          tenant_name: profile?.display_name || "Tenant",
          status: "inquiry" as const,
        })
        .select()
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      if (newConv) {
        await fetchConversations();
        setActiveConvId(newConv.id);
        if (prefillMsg) setNewMessage(prefillMsg);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, loading, user?.id, listings.length]);

  // Live messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    fetchMessages(activeConvId);
    const ch = supabase
      .channel(`messages-${activeConvId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConvId}` },
        (payload) => {
          setMessages((prev) => prev.some((m) => m.id === (payload.new as Message).id)
            ? prev
            : [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeConvId) inputRef.current?.focus();
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeListing = activeConv ? listings.find((l) => l.id === activeConv.listing_id) : null;
  const activeOtherId = activeConv
    ? (activeConv.tenant_user_id === user?.id ? activeConv.landlord_user_id : activeConv.tenant_user_id)
    : null;
  const activeOther = activeOtherId ? otherParties[activeOtherId] : null;
  const iAmLandlord = activeConv?.landlord_user_id === user?.id;

  const filteredConvs = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => {
      const listing = listings.find((l) => l.id === c.listing_id);
      const otherId = c.tenant_user_id === user?.id ? c.landlord_user_id : c.tenant_user_id;
      const otherName = otherId ? otherParties[otherId]?.name : "";
      return (listing?.title || "").toLowerCase().includes(q)
        || (otherName || "").toLowerCase().includes(q)
        || (c.last_message_text || "").toLowerCase().includes(q);
    });
  }, [search, conversations, listings, otherParties, user?.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvId || !user || sending) return;
    const text = newMessage.trim();
    setNewMessage("");
    setSending(true);
    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: activeConvId,
        sender_user_id: user.id,
        sender_id: iAmLandlord ? "landlord" : "tenant", // legacy column, NOT NULL
        text,
        type: "text",
      })
      .select()
      .single();
    setSending(false);
    if (error) {
      toast.error(error.message);
      setNewMessage(text);
      return;
    }
    if (inserted) {
      setMessages((prev) => prev.some((m) => m.id === inserted.id) ? prev : [...prev, inserted as Message]);
      supabase.functions.invoke("notify-new-message", {
        body: { messageId: inserted.id, conversationId: activeConvId, senderRole: iAmLandlord ? "landlord" : "tenant" },
      }).catch(() => {});
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // ============ Conversation list (Messenger-style) ============
  if (!activeConv) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-card">
          <div className="flex items-center gap-3 px-3 py-3">
            <Link to="/" className="rounded-full p-2 hover:bg-secondary">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">Chats</h1>
          </div>
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Messenger"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredConvs.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <p className="text-base font-semibold text-foreground">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse listings to start a conversation, or wait for tenants to reach out.
            </p>
            <Link to="/" className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse Listings
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filteredConvs.map((conv) => {
              const listing = listings.find((l) => l.id === conv.listing_id);
              const otherId = conv.tenant_user_id === user.id ? conv.landlord_user_id : conv.tenant_user_id;
              const other = otherId ? otherParties[otherId] : null;
              const name = other?.name || (conv.tenant_user_id === user.id ? "Landlord" : "Tenant");
              const avatar = other?.avatar || listing?.images?.[0];
              return (
                <li
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40 active:bg-secondary"
                >
                  <div className="relative shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-bold text-foreground">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[15px] font-semibold text-foreground">{name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(conv.last_message_at || conv.updated_at)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conv.last_message_text || listing?.title || "New conversation"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // ============ Chat view (Messenger-style) ============
  const otherName = activeOther?.name || (iAmLandlord ? "Tenant" : "Landlord");
  const otherAvatar = activeOther?.avatar || activeListing?.images?.[0];

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            onClick={() => { setActiveConvId(null); navigate("/inbox"); }}
            className="rounded-full p-1.5 text-primary hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {otherAvatar ? (
            <img src={otherAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {otherName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-foreground">{otherName}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {iAmLandlord ? "Tenant inquiry" : "Landlord"} · Active now
            </p>
          </div>
        </div>
      </header>

      {/* Pinned listing card (Marketplace-style) */}
      {activeListing && (
        <button
          onClick={() => navigate(`/listing/${activeListing.id}`)}
          className="shrink-0 border-b border-border bg-card px-3 py-2 text-left"
        >
          <div className="flex items-center gap-3 rounded-xl bg-secondary p-2.5">
            <img src={activeListing.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">{activeListing.title}</p>
              <p className="text-xs text-muted-foreground">
                ${activeListing.price.toLocaleString()}/mo · {activeListing.bedrooms === 0 ? "Studio" : `${activeListing.bedrooms} bd`} · {activeListing.bathrooms} ba
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-primary">View</span>
          </div>
        </button>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background px-3 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-1">
          {messages.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Say hi to start the conversation
            </p>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.sender_user_id === user.id;
            const prev = messages[idx - 1];
            const next = messages[idx + 1];
            const showDay = !prev || new Date(prev.created_at).toDateString() !== new Date(msg.created_at).toDateString();
            const sameAsNext = next && next.sender_user_id === msg.sender_user_id
              && (new Date(next.created_at).getTime() - new Date(msg.created_at).getTime()) < 5 * 60 * 1000;
            const sameAsPrev = prev && prev.sender_user_id === msg.sender_user_id
              && (new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) < 5 * 60 * 1000;
            return (
              <div key={msg.id}>
                {showDay && (
                  <div className="my-3 text-center text-[11px] font-semibold text-muted-foreground">
                    {dayLabel(msg.created_at)} · {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
                <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                  {!isMe && (
                    <div className={`h-7 w-7 shrink-0 ${sameAsNext ? "invisible" : ""}`}>
                      {otherAvatar ? (
                        <img src={otherAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-foreground">
                          {otherName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3.5 py-2 text-[15px] leading-snug break-words whitespace-pre-wrap ${
                      isMe
                        ? `bg-primary text-primary-foreground ${sameAsPrev ? "rounded-r-md" : "rounded-tr-2xl rounded-r-md"} ${sameAsNext ? "rounded-br-md" : "rounded-br-2xl"} rounded-l-2xl`
                        : `bg-secondary text-foreground ${sameAsPrev ? "rounded-l-md" : "rounded-tl-2xl rounded-l-md"} ${sameAsNext ? "rounded-bl-md" : "rounded-bl-2xl"} rounded-r-2xl`
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
                {!sameAsNext && (
                  <div className={`mt-0.5 px-2 text-[10px] text-muted-foreground ${isMe ? "text-right pr-1" : "text-left pl-10"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {isMe && idx === messages.length - 1 && " · Sent"}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border bg-card px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <button className="shrink-0 rounded-full p-2 text-primary hover:bg-secondary" aria-label="Attach">
            <ImageIcon className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-end rounded-3xl bg-secondary px-3 py-1.5">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Aa"
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{ minHeight: "28px" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="shrink-0 rounded-full p-2 text-primary disabled:text-muted-foreground"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
