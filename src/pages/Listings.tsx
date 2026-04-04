import { useListings } from "@/contexts/ListingsContext";
import { ListingCard } from "@/components/ListingCard";
import { UserMenu } from "@/components/UserMenu";
import { Search, SlidersHorizontal, Bookmark, Plus, Globe, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const AREAS = [
  { label: "All Areas", value: "" },
  { label: "Fresno", value: "fresno" },
  { label: "Clovis", value: "clovis" },
  { label: "Visalia", value: "visalia" },
  { label: "Madera", value: "madera" },
  { label: "Hanford", value: "hanford" },
  { label: "Merced", value: "merced" },
  { label: "Bakersfield", value: "bakersfield" },
  { label: "Selma", value: "selma" },
];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 999 },
  { label: "$1,000–$2,000", min: 1000, max: 2000 },
  { label: "$2,000–$3,000", min: 2000, max: 3000 },
  { label: "$3,000+", min: 3000, max: Infinity },
];

const BED_OPTIONS = [
  { label: "Any Beds", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
];

export default function Listings() {
  const { listings, loading } = useListings();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceRange];
    let results = listings.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.address.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = l.price >= range.min && l.price <= range.max;
      const matchesBeds = l.bedrooms >= BED_OPTIONS[minBeds].value;
      const matchesArea = !selectedArea || l.address.toLowerCase().includes(selectedArea.toLowerCase());
      return matchesSearch && matchesPrice && matchesBeds && matchesArea;
    });

    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
    else results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return results;
  }, [listings, search, priceRange, minBeds, selectedArea, sortBy]);

  const activeFilterCount = (priceRange > 0 ? 1 : 0) + (minBeds > 0 ? 1 : 0) + (selectedArea ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Fresno County rentals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full bg-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Link
            to="/import-listing"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            title="Import from marketplace"
          >
            <Globe className="h-5 w-5" />
          </Link>
          <Link
            to="/add-property"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
          >
            <Plus className="h-5 w-5" />
          </Link>
          <UserMenu />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto px-3 pb-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium ${
              activeFilterCount > 0
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          {PRICE_RANGES.map((range, i) =>
            i === 0 ? null : (
              <button
                key={range.label}
                onClick={() => setPriceRange(priceRange === i ? 0 : i)}
                className={`flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-medium ${
                  priceRange === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {range.label}
              </button>
            )
          )}
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="border-t border-border px-3 py-3 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Bedrooms</p>
              <div className="flex gap-2">
                {BED_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setMinBeds(i)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      minBeds === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Sort by</p>
              <div className="flex gap-2">
                {([["newest", "Newest"], ["price-asc", "Price ↑"], ["price-desc", "Price ↓"]] as const).map(
                  ([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setSortBy(val)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        sortBy === val
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
            {(priceRange > 0 || minBeds > 0) && (
              <button
                onClick={() => { setPriceRange(0); setMinBeds(0); setSortBy("newest"); }}
                className="flex items-center gap-1 text-xs text-destructive hover:underline"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>
        )}
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
          <span className="text-[10px]">List</span>
        </Link>
      </nav>
    </div>
  );
}
