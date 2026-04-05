import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Search, Globe, X, PanelRightClose } from "lucide-react";

interface QuickLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  { name: "Google", url: "https://google.com", icon: "🔍", color: "hover:bg-blue-500/10" },
  { name: "Facebook", url: "https://facebook.com", icon: "📘", color: "hover:bg-blue-600/10" },
  { name: "FB Marketplace", url: "https://facebook.com/marketplace", icon: "🏪", color: "hover:bg-blue-600/10" },
  { name: "Instagram", url: "https://instagram.com", icon: "📸", color: "hover:bg-pink-500/10" },
  { name: "TikTok", url: "https://tiktok.com", icon: "🎵", color: "hover:bg-foreground/5" },
  { name: "YouTube", url: "https://youtube.com", icon: "▶️", color: "hover:bg-red-500/10" },
  { name: "Zillow", url: "https://zillow.com", icon: "🏠", color: "hover:bg-blue-400/10" },
  { name: "Apartments.com", url: "https://apartments.com", icon: "🏢", color: "hover:bg-green-500/10" },
  { name: "Craigslist", url: "https://craigslist.org", icon: "📋", color: "hover:bg-purple-500/10" },
  { name: "Canva", url: "https://canva.com", icon: "🎨", color: "hover:bg-cyan-500/10" },
];

interface QuickLaunchPanelProps {
  onClose: () => void;
  externalQuery?: string | null;
}

export default function QuickLaunchPanel({ onClose, externalQuery }: QuickLaunchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // When an external query comes in (from P8 chat clickable link), auto-fill and search
  useEffect(() => {
    if (externalQuery) {
      setSearchQuery(externalQuery);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(externalQuery)}`, "_blank", "noopener");
      setRecentSearches(prev => {
        const updated = [externalQuery, ...prev.filter(s => s !== externalQuery)].slice(0, 5);
        return updated;
      });
    }
  }, [externalQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank", "noopener");
      setRecentSearches(prev => [q, ...prev.filter(s => s !== q)].slice(0, 5));
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Quick Launch</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <PanelRightClose className="w-4 h-4" />
        </Button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google..."
            className="pl-9 pr-9 h-10 text-sm bg-muted/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-muted-foreground mb-1.5">Recent from P8 →</p>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(q);
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank", "noopener");
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate max-w-[180px]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      <p className="px-4 pb-2 text-[11px] text-muted-foreground">
        Click highlighted links in P8's responses to auto-search ↓
      </p>

      {/* Quick links grid */}
      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => openLink(link.url)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/30 bg-muted/30 transition-all ${link.color} hover:border-border group text-left`}
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              <span className="text-xs font-medium text-foreground truncate">{link.name}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
