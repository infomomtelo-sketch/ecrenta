import { useState, useEffect } from "react";
import { useListings } from "@/contexts/ListingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Building2,
  MessageCircle,
  Users,
  TrendingUp,
  Plus,
  ChevronRight,
  Home,
  CircleDot,
} from "lucide-react";

export default function Dashboard() {
  const { listings } = useListings();
  const conversations = mockConversations;

  const totalUnits = listings.length;
  const occupiedUnits = listings.filter((l) => !l.available).length;
  const vacantUnits = listings.filter((l) => l.available).length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalRevenue = listings.reduce((sum, l) => sum + l.price, 0);
  const pendingMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const activeInquiries = conversations.filter((c) => c.status === "inquiry").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 pb-4 pt-6">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Dashboard</h1>
      </header>

      <main className="px-4 py-4 space-y-4">
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
            <QuickAction to="/add-property" icon={<Plus className="h-5 w-5" />} label="Add New Property" />
            <QuickAction to="/inbox" icon={<MessageCircle className="h-5 w-5" />} label="View Messages" badge={pendingMessages > 0 ? pendingMessages : undefined} />
            <QuickAction to="/" icon={<Home className="h-5 w-5" />} label="Browse Listings" />
          </div>
        </div>

        {/* Properties list */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Properties</h2>
            <Link to="/add-property" className="text-xs font-medium text-primary">+ Add</Link>
          </div>
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
        <Link to="/" className="flex flex-col items-center gap-0.5 text-muted-foreground">
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
