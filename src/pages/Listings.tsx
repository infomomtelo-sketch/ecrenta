import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { Search, SlidersHorizontal, MessageCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Listings() {
  const [search, setSearch] = useState("");

  const filtered = mockListings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            runp8
          </h1>
          <Link
            to="/inbox"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Inbox
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Search */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location or property name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Today's Picks
        </h2>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No listings found.</p>
        )}
      </main>
    </div>
  );
}
