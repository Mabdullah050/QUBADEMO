import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
      <path fill="#34A853" d="M3.9 7.4l3.2 2.3C8 7.9 9.8 6.5 12 6.5c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 8.2 2.5 4.9 4.6 3.9 7.4z" opacity="0" />
      <path fill="#4285F4" d="M21.4 12.3c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1v3.3c3.2 0 5.9-1.1 7.8-2.9 1.7-1.7 2.6-4.1 2.6-6.8z" />
      <path fill="#FBBC05" d="M5.6 14.3a5.9 5.9 0 010-4.6L2.4 7.4a9.5 9.5 0 000 9.2l3.2-2.3z" />
      <path fill="#34A853" d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 1-3.3 1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.3C4.9 19.4 8.2 21.5 12 21.5z" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"email" | "google" | null>(null);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMode("email");
    await signInWithEmail(email, password);
    navigate({ to: "/" });
  };

  const handleGoogle = async () => {
    setMode("google");
    await signInWithGoogle();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-background to-blue-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-border/60">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your Client Records workspace
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 gap-3 font-medium"
          onClick={handleGoogle}
          disabled={loading}
        >
          {mode === "google" && loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or with email</span>
          </div>
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" className="text-xs text-primary hover:underline">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
            {mode === "email" && loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New here?{" "}
          <button className="text-primary font-medium hover:underline">Create an account</button>
        </p>
      </Card>
    </div>
  );
}
