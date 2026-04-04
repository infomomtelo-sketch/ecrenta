import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, Building2, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { user, profile, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <Link
        to="/auth"
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Sign In
      </Link>
    );
  }

  const initials = (profile?.display_name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full bg-secondary p-1 pr-2 transition-colors hover:bg-accent"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
          <div className="border-b border-border px-3 pb-2 pt-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {profile?.display_name || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {role && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {role === "landlord" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-0.5">
            {role === "landlord" && (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" /> Dashboard
              </Link>
            )}
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
