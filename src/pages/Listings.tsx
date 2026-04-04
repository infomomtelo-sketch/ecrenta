import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { UserMenu } from "@/components/UserMenu";
import { Search, SlidersHorizontal, Bookmark, Plus, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Listings() {
  const { listings, loading } = useListings();
  const [search, setSearch] = useState("");

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Marketplace"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Link
            to="/add-property"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
          >
            <Plus className="h-5 w-5" />
          </Link>
          <UserMenu />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto px-3 pb-2">
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-foreground">
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-secondary px-4 text-sm font-medium text-foreground">
            Distance ▾
          </button>
          <button className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-secondary px-4 text-sm font-medium text-foreground">
            Sort by ▾
          </button>
        </div>
      </header>

      <main className="px-2 py-2">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No listings found.</p>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card py-2">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-foreground">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/inbox" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span className="text-[10px]">Inbox</span>
        </Link>
        <Link to="/add-property" className="flex flex-col items-center gap-0.5 text-muted-foreground">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          <span className="text-[10px]">Sell</span>
        </Link>
      </nav>
    </div>
  );
}
