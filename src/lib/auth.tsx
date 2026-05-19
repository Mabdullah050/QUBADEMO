import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// NOTE: Swap these stubs with Supabase auth calls later.
// e.g. supabase.auth.signInWithPassword, signInWithOAuth({ provider: "google" }), signOut.

type User = { email: string; name: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "crm.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const signInWithEmail = async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    persist({ email, name: email.split("@")[0] || "User" });
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    persist({ email: "user@gmail.com", name: "Google User" });
    setLoading(false);
  };

  const signOut = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
