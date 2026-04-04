import { Listing } from "@/data/mockListings";
import { Bed, Bath, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  listing: Listing;
}

export function ListingCard({ listing }: Props) {
  const navigate = useNavigate();

  return (
    <div className="listing-card" onClick={() => navigate(`/listing/${listing.id}`)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          width={800}
          height={600}
        />
        {listing.available && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Available
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
            {listing.title}
          </h3>
          <span className="shrink-0 text-lg font-bold text-primary">
            ${listing.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{listing.address}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bd`}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {listing.bathrooms} ba
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {listing.sqft.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </div>
  );
}
