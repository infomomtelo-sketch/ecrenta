import { useParams, useNavigate } from "react-router-dom";
import { mockListings } from "@/data/mockListings";
import { ArrowLeft, Bed, Bath, Maximize, MessageCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Listing not found.</p>
      </div>
    );
  }

  const handleMessageLandlord = () => {
    navigate(`/inbox?property=${listing.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="truncate text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {listing.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Hero image */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-64 w-full object-cover sm:h-96"
            width={800}
            height={600}
          />
        </div>

        {/* Price & details */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              ${listing.price.toLocaleString()}<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </h2>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {listing.address}
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-secondary px-5 py-3 text-sm font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-muted-foreground" />
              {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-muted-foreground" />
              {listing.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-muted-foreground" />
              {listing.sqft.toLocaleString()} sqft
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            About this property
          </h3>
          <p className="leading-relaxed text-muted-foreground">{listing.description}</p>
        </div>

        {/* Info bar */}
        <div className="mt-6 flex flex-wrap gap-4 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Listed {listing.listed}
          </span>
          <span>•</span>
          <span>By {listing.landlordName}</span>
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 mt-8 border-t bg-background py-4">
          <Button
            onClick={handleMessageLandlord}
            className="w-full gap-2 rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <MessageCircle className="h-5 w-5" />
            Message Landlord
          </Button>
        </div>
      </main>
    </div>
  );
}
