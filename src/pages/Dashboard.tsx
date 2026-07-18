import { useState, useEffect } from "react";
import { useListings } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import {
  Building2,
  MessageCircle,
  Users,
  TrendingUp,
  Plus,
  ChevronRight,
  Home,
  CircleDot,
  CreditCard,
  Crown,
  Loader2,
  ClipboardCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { listings } = useListings();
  const { subscribed, subscriptionTier, subscriptionEnd, refreshSubscription, role } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [managingPortal, setManagingPortal] = useState(false);

  useEffect(() => {
    supabase.from("conversations").select("*").then(({ data }) => {
      if (data) setConversations(data);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "Subscription activated! 🎉", description: "You can now list unlimited properties." });
      refreshSubscription();
    }
  }, [searchParams]);

  const totalUnits = listings.length;
  const occupiedUnits = listings.filter((l) => !l.available).length;
  const vacantUnits = listings.filter((l) => l.available).length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalRevenue = listings.reduce((sum, l) => sum + l.price, 0);
  const pendingMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const activeInquiries = conversations.filter((c) => c.status === "inquiry").length;

  const handleManageSubscription = async () => {
    setManagingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setManagingPortal(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-20 overflow-hidden">
      {/* Ambient drifting orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-drift" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-drift" style={{ animationDelay: "-6s" }} />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-float" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/40 backdrop-blur-xl px-4 pb-4 pt-6">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
      </header>



      <main className="px-4 py-4 space-y-4">
        {/* Subscription status banner */}
        {role === "landlord" && (
          <div className={`rounded-xl border p-4 ${
            subscribed
              ? "border-primary/30 bg-primary/5"
              : "border-accent/30 bg-accent/5"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {subscribed ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <CreditCard className="h-5 w-5 text-accent" />
                )}
                <div>
                  {subscribed ? (
                    <>
                      <p className="text-sm font-semibold text-foreground">
                        {subscriptionTier === "premium" ? "Premium Service" : subscriptionTier === "saas" ? "Self-Manage" : "Property Management"} Active
                      </p>
                      {subscriptionEnd && (
                        <p className="text-xs text-muted-foreground">
                          Renews {new Date(subscriptionEnd).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">No Active Subscription</p>
                      <p className="text-xs text-muted-foreground">Subscribe to list properties</p>
                    </>
                  )}
                </div>
              </div>
              {subscribed ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageSubscription}
                  disabled={managingPortal}
                >
                  {managingPortal && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Manage
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/pricing">Subscribe</Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Building2 className="h-5 w-5 text-primary" />}
            label="Total Units"
            value={totalUnits.toString()}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            label="Occupancy"
            value={`${occupancyRate}%`}
            sub={`${occupiedUnits} occupied · ${vacantUnits} vacant`}
          />
          <StatCard
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            label="Unread Messages"
            value={pendingMessages.toString()}
            highlight={pendingMessages > 0}
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Active Inquiries"
            value={activeInquiries.toString()}
          />
        </div>

        {/* Revenue banner */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
          <p className="text-xs font-medium text-primary">Potential Monthly Revenue</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${totalRevenue.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-2">
            {role === "landlord" && !subscribed ? (
              <QuickAction to="/pricing" icon={<CreditCard className="h-5 w-5" />} label="Subscribe to List Properties" />
            ) : (
              <QuickAction to="/add-property" icon={<Plus className="h-5 w-5" />} label="Add New Property" />
            )}
            <QuickAction to="/inbox" icon={<MessageCircle className="h-5 w-5" />} label="View Messages" badge={pendingMessages > 0 ? pendingMessages : undefined} />
            <QuickAction to="/maintenance" icon={<Wrench className="h-5 w-5" />} label="Maintenance Requests" />
            <QuickAction to="/inspections" icon={<ClipboardCheck className="h-5 w-5" />} label="AI Property Inspections" />
            <QuickAction to="/listings" icon={<Home className="h-5 w-5" />} label="Browse Listings" />
          </div>
        </div>

        {/* Properties list */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Properties</h2>
            {subscribed && (
              <Link to="/add-property" className="text-xs font-medium text-primary">+ Add</Link>
            )}
          </div>
          {listings.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <Building2 className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                {subscribed ? "No properties yet. Add your first listing!" : "Subscribe to start listing properties."}
              </p>
            </div>
          )}
          <div className="space-y-2">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 transition-colors hover:bg-secondary/50"
              >
                <img
                  src={listing.images[0]}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
                  <p className="text-xs text-muted-foreground">{listing.address}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">${listing.price.toLocaleString()}/mo</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CircleDot className={`h-3 w-3 ${listing.available ? "text-green-500" : "text-muted-foreground"}`} />
                      {listing.available ? "Vacant" : "Occupied"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent conversations */}
        {conversations.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Messages</h2>
              <Link to="/inbox" className="text-xs font-medium text-primary">View all</Link>
            </div>
            <div className="space-y-2">
              {conversations.slice(0, 3).map((conv) => {
                const listing = listings.find((l) => l.id === conv.listingId);
                return (
                  <Link
                    key={conv.id}
                    to="/inbox"
                    className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 transition-colors hover:bg-secondary/50"
                  >
                    {listing && (
                      <img src={listing.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{conv.tenantName}</p>
                      <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {conv.unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card py-2">
        <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-primary">
          <Building2 className="h-6 w-6" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link to="/listings" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <Home className="h-6 w-6" />
          <span className="text-[10px]">Listings</span>
        </Link>
        <Link to="/add-property" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <Plus className="h-6 w-6" />
          <span className="text-[10px]">Add</span>
        </Link>
        <Link to="/inbox" className="relative flex flex-col items-center gap-0.5 text-muted-foreground">
          <MessageCircle className="h-6 w-6" />
          {pendingMessages > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {pendingMessages}
            </span>
          )}
          <span className="text-[10px]">Inbox</span>
        </Link>
      </nav>
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function QuickAction({ to, icon, label, badge }: {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 transition-colors hover:bg-secondary/50"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {badge !== undefined && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
