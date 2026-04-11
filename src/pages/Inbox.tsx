import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Calendar, CheckCircle, StickyNote } from "lucide-react";
import ChatQuickActions from "@/components/ChatQuickActions";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  type: string;
  created_at: string;
}

interface Conversation {
  id: string;
  listing_id: string;
  tenant_name: string;
  status: "inquiry" | "showing_scheduled" | "approved" | "declined";
  unread: number;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  inquiry: "Inquiry",
  showing_scheduled: "Showing Scheduled",
  approved: "Approved",
  declined: "Declined",
};

const statusColors: Record<string, string> = {
  inquiry: "bg-accent text-accent-foreground",
  showing_scheduled: "bg-primary text-primary-foreground",
  approved: "bg-primary text-primary-foreground",
  declined: "bg-destructive text-destructive-foreground",
};

export default function Inbox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  const propertyId = searchParams.get("property");
  const prefillMsg = searchParams.get("msg");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
    setLoading(false);
  };

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  useEffect(() => {
    fetchConversations();

    // Realtime: listen for new/updated conversations
    const convChannel = supabase
      .channel("conversations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
    };
  }, []);

  // Handle incoming from listing detail
  useEffect(() => {
    if (!propertyId || loading) return;

    const initConversation = async () => {
      const existing = conversations.find((c) => c.listing_id === propertyId);
      if (existing) {
        setActiveConvId(existing.id);
        await fetchMessages(existing.id);
        return;
      }

      const listing = listings.find((l) => l.id === propertyId);
      if (!listing) return;

      const text = prefillMsg || `Hi! I'm interested in "${listing.title}". Is it still available?`;

      const { data: newConv } = await supabase
        .from("conversations")
        .insert({ listing_id: propertyId, tenant_name: "You", status: "inquiry" as const })
        .select()
        .single();

      if (newConv) {
        await supabase.from("messages").insert({
          conversation_id: newConv.id,
          sender_id: "tenant",
          text,
          type: "text",
        });
        await fetchConversations();
        setActiveConvId(newConv.id);
        await fetchMessages(newConv.id);
      }
    };

    initConversation();
  }, [propertyId, loading]);

  useEffect(() => {
    if (!activeConvId) return;
    fetchMessages(activeConvId);

    // Realtime: listen for new messages in this conversation
    const msgChannel = supabase
      .channel(`messages-${activeConvId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeListing = activeConv ? listings.find((l) => l.id === activeConv.listing_id) : null;

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvId) return;
    await supabase.from("messages").insert({
      conversation_id: activeConvId,
      sender_id: "landlord",
      text: newMessage,
      type: "text",
    });
    setNewMessage("");
    await fetchMessages(activeConvId);
    await fetchConversations();
  };

  const updateStatus = async (status: Conversation["status"]) => {
    if (!activeConvId) return;
    await supabase.from("conversations").update({ status }).eq("id", activeConvId);
    await fetchConversations();
  };

  // Conversation list
  if (!activeConv) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card px-3 py-3">
          <Link to="/" className="rounded-full p-2 hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">Chats</h1>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-20 text-center">
            <p className="text-base font-semibold text-foreground">No messages yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse listings to start a conversation.</p>
            <Link to="/" className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse Listings
            </Link>
          </div>
        ) : (
          <ul>
            {conversations.map((conv) => {
              const listing = listings.find((l) => l.id === conv.listing_id);
              return (
                <li
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  {listing && (
                    <img src={listing.images[0]} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[15px] font-semibold text-foreground">{conv.tenant_name}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{listing?.title}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-3 py-2">
          <button onClick={() => { setActiveConvId(null); navigate("/inbox"); }} className="rounded-full p-1.5 text-primary hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          {activeListing && (
            <img src={activeListing.images[0]} alt="" className="h-9 w-9 rounded-full object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-foreground">
              {activeConv.tenant_name} · {activeListing?.title}
            </p>
          </div>
        </div>
      </header>

      {activeListing && (
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="rounded-xl bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Marketplace listing</p>
            <p className="text-sm font-semibold text-foreground">
              ${activeListing.price.toLocaleString()} - {activeListing.bedrooms === 0 ? "Studio" : `${activeListing.bedrooms} Bed`} {activeListing.bathrooms} Bath
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => navigate(`/listing/${activeListing.id}`)}
                className="flex-1 rounded-lg bg-accent py-2 text-center text-sm font-semibold text-accent-foreground"
              >
                See details
              </button>
              <button className="flex-1 rounded-lg bg-accent py-2 text-center text-sm font-semibold text-accent-foreground">
                More options
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 overflow-x-auto">
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[activeConv.status]}`}>
              {statusLabels[activeConv.status]}
            </span>
            <button onClick={() => updateStatus("showing_scheduled")} className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <Calendar className="h-3 w-3" /> Showing
            </button>
            <button onClick={() => updateStatus("approved")} className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <CheckCircle className="h-3 w-3" /> Approve
            </button>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <StickyNote className="h-3 w-3" /> Note
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-2">
          {messages.map((msg) => {
            const isLandlord = msg.sender_id === "landlord";
            return (
              <div key={msg.id} className={`flex ${isLandlord ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isLandlord
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${isLandlord ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Aa"
            className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary disabled:text-muted-foreground"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
