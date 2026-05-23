import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { getTierByProductId, type SubscriptionTier } from "@/lib/subscriptions";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: "landlord" | "tenant" | null;
  profile: { display_name: string | null; avatar_url: string | null } | null;
  subscribed: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionEnd: string | null;
  checkingSubscription: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"landlord" | "tenant" | null>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  const fetchUserData = (userId: string) => {
    // Fire-and-forget — no await inside auth callbacks
    Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("display_name, avatar_url").eq("user_id", userId).maybeSingle(),
    ]).then(([{ data: roles }, { data: prof }]) => {
      if (roles && roles.length > 0) {
        setRole(roles[0].role as "landlord" | "tenant");
      } else {
        setRole(null);
      }
      setProfile(prof || null);
    });
  };

  const checkSubscription = useCallback(async () => {
    if (!session) return;
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) {
        console.error("Subscription check error:", error);
        return;
      }
      setSubscribed(data?.subscribed || false);
      setSubscriptionTier(data?.product_id ? getTierByProductId(data.product_id) : null);
      setSubscriptionEnd(data?.subscription_end || null);
    } catch (err) {
      console.error("Subscription check failed:", err);
    } finally {
      setCheckingSubscription(false);
    }
  }, [session]);

  useEffect(() => {
    let lastUserId: string | null = null;

    // 1. Set up listener FIRST (catches auth events that fire during getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      const newUserId = newSession?.user?.id ?? null;
      if (newUserId) {
        // Only re-fetch role/profile when the user actually changes.
        // Token refresh events fire repeatedly and re-fetching causes
        // role to briefly flip to null, triggering redirect loops.
        if (newUserId !== lastUserId) {
          lastUserId = newUserId;
          fetchUserData(newUserId);
        }
      } else {
        lastUserId = null;
        setRole(null);
        setProfile(null);
        setSubscribed(false);
        setSubscriptionTier(null);
        setSubscriptionEnd(null);
      }
      setLoading(false);
    });

    // 2. THEN restore session from storage
    supabase.auth.getSession().then(({ data: { session: restoredSession } }) => {
      setSession(restoredSession);
      setUser(restoredSession?.user ?? null);
      const restoredId = restoredSession?.user?.id ?? null;
      if (restoredId && restoredId !== lastUserId) {
        lastUserId = restoredId;
        fetchUserData(restoredId);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session) {
      checkSubscription();
    }
  }, [session, checkSubscription]);

  // Auto-refresh subscription every 60 seconds
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null);
    setSubscribed(false);
    setSubscriptionTier(null);
    setSubscriptionEnd(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, role, profile,
      subscribed, subscriptionTier, subscriptionEnd, checkingSubscription,
      refreshSubscription: checkSubscription,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
