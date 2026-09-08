import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authEnabled, authClient, signIn } from "@/lib/auth/client";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SiteShell } from "@/components/marketing/site-header";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — Halden" }] }),
});

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message || "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message || "Could not sign in.");
      }
      window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto grid min-h-[70svh] max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
        <div>
          <Wordmark />
          <h1 className="mt-8 font-display text-display-sm font-medium">
            {mode === "in" ? "Return to the studio." : "Open a portal."}
          </h1>
          <p className="mt-4 text-sm text-muted">
            The client portal is for people in a program — and for those who have just
            booked a consultation. Coaching notes stay here, not in an inbox.
          </p>
        </div>
        <div className="rounded-xl bg-surface p-6 shadow-soft md:p-8">
          {!authEnabled ? (
            <p className="text-sm text-muted">Sign-in is disabled in this environment.</p>
          ) : (
            <>
              <div className="flex gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => signIn(p.providerId, { callbackURL: "/app" })}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <p className="my-5 text-center text-xs tracking-label text-muted uppercase">
                or email
              </p>
              <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
                {mode === "up" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
                </Button>
              </form>
              <button
                type="button"
                className="mt-4 w-full text-center text-sm text-muted underline-offset-4 hover:underline"
                onClick={() => {
                  setMode(mode === "in" ? "up" : "in");
                  setError(null);
                }}
              >
                {mode === "in" ? "Need an account?" : "Already have an account?"}
              </button>
              <p className="mt-4 text-center text-xs text-muted">
                <Link to="/" className="underline-offset-4 hover:underline">
                  Back to Halden
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </SiteShell>
  );
}
