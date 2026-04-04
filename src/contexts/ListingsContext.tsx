import { createContext, useContext, useState, type ReactNode } from "react";
import { mockListings, type Listing } from "@/data/mockListings";

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, "id" | "listed">) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(mockListings);

  const addListing = (data: Omit<Listing, "id" | "listed">) => {
    const newListing: Listing = {
      ...data,
      id: `listing-${Date.now()}`,
      listed: "Just listed",
    };
    setListings((prev) => [newListing, ...prev]);
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}
