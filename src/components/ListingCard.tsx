import { Listing } from "@/data/mockListings";
import { useNavigate } from "react-router-dom";

interface Props {
  listing: Listing;
}

export function ListingCard({ listing }: Props) {
  const navigate = useNavigate();

  const bedsLabel = listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`;
  const label = `${bedsLabel} ${listing.bathrooms} Bath House`;

  return (
    <div
      className="cursor-pointer overflow-hidden"
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {listing.listed === "Just listed" && (
          <span className="absolute bottom-2 left-2 rounded bg-card/90 px-2 py-0.5 text-xs font-semibold text-foreground">
            Just listed
          </span>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-[15px] font-bold text-foreground">
          ${listing.price.toLocaleString()}
        </p>
        <p className="text-[13px] text-muted-foreground leading-tight">{label}</p>
        <p className="text-[13px] text-muted-foreground">{listing.address}</p>
      </div>
    </div>
  );
}
