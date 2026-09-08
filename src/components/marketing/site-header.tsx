import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/about", label: "The studio" },
  { to: "/programs", label: "Programs" },
  { to: "/stories", label: "Stories" },
  { to: "/journal", label: "Journal" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.25rem] md:px-8">
        <Link to="/" aria-label="Halden home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <AuthLinks user={user} isPending={isPending} />
          <Button asChild size="sm">
            <Link to="/book">Book a consultation</Link>
          </Button>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-md md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-line bg-paper transition-[max-height,opacity] duration-250 ease-out",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/assess" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-base">
            Assessment
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-base">
            Contact
          </Link>
          <div className="mt-2 flex flex-col gap-2 pb-2">
            <AuthLinks user={user} isPending={isPending} onNavigate={() => setOpen(false)} />
            <Button asChild>
              <Link to="/book" onClick={() => setOpen(false)}>
                Book a consultation
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function AuthLinks({
  user,
  isPending,
  onNavigate,
}: {
  user: { displayName: string | null; primaryEmail: string | null } | null;
  isPending: boolean;
  onNavigate?: () => void;
}) {
  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-ink/10" />;
  }
  if (!user) {
    return (
      <Link
        to="/login"
        onClick={onNavigate}
        className="px-2 py-2 text-sm text-ink-soft hover:text-ink"
      >
        Client portal
      </Link>
    );
  }
  const label = user.displayName ?? user.primaryEmail ?? "Portal";
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Link to="/app" onClick={onNavigate} className="text-ink-soft hover:text-ink">
        {label.split(" ")[0]}
      </Link>
      <Link to="/studio" onClick={onNavigate} className="text-ink-soft hover:text-ink">
        Studio
      </Link>
      <button
        type="button"
        className="text-muted underline-offset-4 hover:underline"
        onClick={() => void signOut()}
      >
        Sign out
      </button>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm text-muted">
            A private coaching studio for people whose lives work — except in the body
            that has to carry them.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-label text-muted uppercase">Visit</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:underline">
                The studio
              </Link>
            </li>
            <li>
              <Link to="/programs" className="hover:underline">
                Programs
              </Link>
            </li>
            <li>
              <Link to="/assess" className="hover:underline">
                Assessment
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:underline">
                Book
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-label text-muted uppercase">Studio</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/journal" className="hover:underline">
                Journal
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs leading-relaxed text-muted md:px-8">
          Halden provides health coaching, not medical care. We do not diagnose, treat,
          or prescribe. If you have a medical concern, speak with a licensed clinician.
          If this is an emergency, contact local emergency services.
        </p>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
      <Button asChild className="w-full">
        <Link to="/book">Book a consultation</Link>
      </Button>
    </div>
  );
}
