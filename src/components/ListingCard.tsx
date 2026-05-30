import { useState } from "react";
import { useListings, type Listing } from "@/contexts/ListingsContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  listing: Listing;
}

export function ListingCard({ listing }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteListing } = useListings();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bedsLabel = listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`;
  const label = `${bedsLabel} ${listing.bathrooms} Bath House`;
  const isOwner = !!user && user.id === listing.user_id;
  const hasExternalSource = !!listing.source_url;

  const handleClick = () => {
    if (hasExternalSource) {
      window.open(listing.source_url!, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/listing/${listing.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    const { error } = await deleteListing(listing.id);
    setDeleting(false);
    setConfirmOpen(false);
    if (error) {
      toast({ title: "Delete failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Listing deleted" });
    }
  };

  return (
    <>
      <div className="cursor-pointer overflow-hidden" onClick={handleClick}>
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {listing.created_at && isRecent(listing.created_at) && (
            <span className="absolute bottom-2 left-2 rounded-md bg-card/95 px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
              Just listed
            </span>
          )}
          {hasExternalSource && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-md bg-foreground/85 px-2 py-1 text-[11px] font-medium text-background backdrop-blur">
              <ExternalLink className="h-3 w-3" />
              <span>via {prettySource(listing.source)}</span>
            </span>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="absolute top-2 right-2 rounded-full bg-card/90 p-1.5 text-destructive shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Delete listing"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              "{listing.title}" will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function isRecent(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
}
