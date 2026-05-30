import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  images: string[];
  landlord_name: string;
  available: boolean;
  created_at: string;
  user_id: string | null;
  source?: string | null;
  source_url?: string | null;
}

interface ListingsContextType {
  listings: Listing[];
  loading: boolean;
  addListing: (listing: Omit<Listing, "id" | "created_at" | "user_id">) => Promise<void>;
  deleteListing: (id: string) => Promise<{ error: string | null }>;
  refreshListings: () => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false });
    if (!error && data) setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const addListing = async (data: Omit<Listing, "id" | "created_at" | "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("listings").insert({ ...data, user_id: user.id });
    if (!error) await fetchListings();
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      return { error: null };
    }
    return { error: error.message };
  };

  return (
    <ListingsContext.Provider value={{ listings, loading, addListing, deleteListing, refreshListings: fetchListings }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}
