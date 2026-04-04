import { useParams, useNavigate } from "react-router-dom";
import { useListings } from "@/contexts/ListingsContext";
import { ArrowLeft, Search, MoreHorizontal, ThumbsUp, Bookmark, Share2 } from "lucide-react";
import { useState } from "react";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, loading } = useListings();
  const listing = listings.find((l) => l.id === id);
  const [messageText, setMessageText] = useState("Hi, is this available?");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Listing not found.</p>
      </div>
    );
  }

  const bedsLabel = listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`;
  const label = `${bedsLabel} ${listing.bathrooms} Bath House`;

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    navigate(`/inbox?property=${listing.id}&msg=${encodeURIComponent(messageText)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-card/95 px-2 py-2 backdrop-blur-lg">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 text-foreground hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1">
          <button className="rounded-full p-2 text-foreground hover:bg-secondary">
            <Search className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-foreground hover:bg-secondary">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="w-full">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full object-cover"
          style={{ maxHeight: "50vh" }}
        />
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-foreground">{label}</h1>
        <p className="mt-1 text-lg text-muted-foreground">
          ${listing.price.toLocaleString()} / Month
        </p>

        <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4 text-primary" />
          <span>10</span>
        </div>

        <div className="mt-3 flex items-center border-y border-border py-2">
          <button className="flex flex-1 items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
            <ThumbsUp className="h-5 w-5" /> Like
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Bookmark className="h-5 w-5" /> Save
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" /> Share
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-card border border-border p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">💬 Message seller</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-bold text-foreground">Description</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>📍 {listing.address}</p>
          <p>🏠 {listing.sqft.toLocaleString()} sqft</p>
          <p>👤 By {listing.landlord_name}</p>
        </div>
      </div>
    </div>
  );
}
