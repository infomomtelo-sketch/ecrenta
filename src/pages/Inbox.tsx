import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { mockConversations, mockListings, statusLabels, statusColors, type Conversation, type Message } from "@/data/mockListings";
import { ArrowLeft, Send, Home, Calendar, CheckCircle, StickyNote, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Inbox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("property");

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // If coming from a listing, auto-create/open conversation
  useEffect(() => {
    if (propertyId) {
      const existing = conversations.find((c) => c.listingId === propertyId);
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const listing = mockListings.find((l) => l.id === propertyId);
        if (listing) {
          const newConv: Conversation = {
            id: `conv-new-${propertyId}`,
            listingId: propertyId,
            tenantName: "You",
            lastMessage: "Started a conversation",
            lastMessageTime: "Just now",
            unread: 0,
            status: "inquiry",
            messages: [
              {
                id: "auto-1",
                senderId: "tenant",
                text: `Hi! I'm interested in "${listing.title}" at ${listing.address}. Is it still available?`,
                timestamp: "Just now",
                type: "text",
              },
            ],
          };
          setConversations((prev) => [newConv, ...prev]);
          setActiveConvId(newConv.id);
        }
      }
    }
  }, [propertyId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeListing = activeConv ? mockListings.find((l) => l.id === activeConv.listingId) : null;

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "landlord",
      text: newMessage,
      timestamp: "Just now",
      type: "text",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, msg], lastMessage: newMessage, lastMessageTime: "Just now" }
          : c
      )
    );
    setNewMessage("");
  };

  const updateStatus = (status: Conversation["status"]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, status } : c))
    );
  };

  // Conversation list view
  if (!activeConv) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <Link to="/" className="rounded-lg p-2 transition-colors hover:bg-secondary">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Messages
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-2xl">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
              <p className="text-lg font-semibold text-foreground">No conversations yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse listings and message a landlord to get started.
              </p>
              <Link to="/" className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                Browse Listings
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {conversations.map((conv) => {
                const listing = mockListings.find((l) => l.id === conv.listingId);
                return (
                  <li
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className="flex cursor-pointer items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50"
                  >
                    {listing && (
                      <img
                        src={listing.images[0]}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate font-semibold text-foreground">{conv.tenantName}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{listing?.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {conv.unread}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Chat header with rental context */}
      <header className="shrink-0 border-b bg-card">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => setActiveConvId(null)} className="rounded-lg p-2 transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          {activeListing && (
            <img src={activeListing.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{activeConv.tenantName}</p>
            <p className="truncate text-xs text-muted-foreground">{activeListing?.title} • ${activeListing?.price}/mo</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[activeConv.status]}`}>
            {statusLabels[activeConv.status]}
          </span>
        </div>
        {/* Action bar */}
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 pb-3">
          <button onClick={() => updateStatus("showing_scheduled")} className="flex shrink-0 items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <Calendar className="h-3.5 w-3.5" /> Schedule Showing
          </button>
          <button onClick={() => updateStatus("approved")} className="flex shrink-0 items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <CheckCircle className="h-3.5 w-3.5" /> Mark Approved
          </button>
          <button className="flex shrink-0 items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <StickyNote className="h-3.5 w-3.5" /> Add Note
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {activeConv.messages.map((msg) => {
            const isLandlord = msg.senderId === "landlord";
            return (
              <div key={msg.id} className={`flex ${isLandlord ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isLandlord
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${isLandlord ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t bg-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
