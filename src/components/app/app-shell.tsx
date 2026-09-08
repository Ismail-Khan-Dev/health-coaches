import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Library,
  MessageSquare,
  Repeat,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Wordmark } from "@/components/mark";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const CLIENT_NAV = [
  { to: "/app", label: "Today", icon: LayoutDashboard },
  { to: "/app/plan", label: "Plan", icon: ClipboardList },
  { to: "/app/habits", label: "Habits", icon: Repeat },
  { to: "/app/progress", label: "Progress", icon: TrendingUp },
  { to: "/app/check-ins", label: "Check-ins", icon: Inbox },
  { to: "/app/messages", label: "Messages", icon: MessageSquare },
  { to: "/app/appointments", label: "Appointments", icon: Calendar },
  { to: "/app/resources", label: "Resources", icon: Library },
  { to: "/app/profile", label: "Profile", icon: Settings },
] as const;

const STUDIO_NAV = [
  { to: "/studio", label: "Overview", icon: LayoutDashboard },
  { to: "/studio/clients", label: "Clients", icon: Users },
  { to: "/studio/check-ins", label: "Check-ins", icon: Inbox },
  { to: "/studio/appointments", label: "Calendar", icon: Calendar },
  { to: "/studio/messages", label: "Messages", icon: MessageSquare },
] as const;

const CLIENT_MOBILE = [
  { to: "/app", label: "Today", icon: LayoutDashboard },
  { to: "/app/habits", label: "Habits", icon: Repeat },
  { to: "/app/check-ins", label: "Check-in", icon: Inbox },
  { to: "/app/messages", label: "Notes", icon: MessageSquare },
  { to: "/app/plan", label: "More", icon: ClipboardList },
] as const;

const STUDIO_MOBILE = [
  { to: "/studio", label: "Home", icon: LayoutDashboard },
  { to: "/studio/clients", label: "Clients", icon: Users },
  { to: "/studio/check-ins", label: "Inbox", icon: Inbox },
  { to: "/studio/messages", label: "Notes", icon: MessageSquare },
  { to: "/studio/appointments", label: "Cal", icon: Calendar },
] as const;

export function AppShell({
  kind,
  children,
}: {
  kind: "client" | "studio";
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = kind === "client" ? CLIENT_NAV : STUDIO_NAV;
  const mobile = kind === "client" ? CLIENT_MOBILE : STUDIO_MOBILE;

  if (isPending) {
    return (
      <div className="grid min-h-svh place-items-center bg-paper">
        <p className="text-sm text-muted">Opening the studio…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-svh bg-paper md:grid md:grid-cols-[15.5rem_1fr]">
      <aside className="hidden border-r border-line md:flex md:flex-col">
        <div className="flex h-16 items-center px-5">
          <Link to="/">
            <Wordmark />
          </Link>
        </div>
        <div className="px-3">
          <div className="grid grid-cols-2 gap-1 rounded-md bg-paper-deep p-1 text-xs">
            <Link
              to="/app"
              className={cn(
                "rounded-sm py-2 text-center",
                kind === "client" ? "bg-surface font-medium" : "text-muted",
              )}
            >
              You
            </Link>
            <Link
              to="/studio"
              className={cn(
                "rounded-sm py-2 text-center",
                kind === "studio" ? "bg-surface font-medium" : "text-muted",
              )}
            >
              Studio
            </Link>
          </div>
        </div>
        <nav className="mt-4 flex-1 space-y-0.5 px-3" aria-label="App">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm",
                  active ? "bg-sage/10 text-sage" : "text-ink-soft hover:bg-ink/5",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line px-5 py-4 text-sm">
          <p className="truncate font-medium">{user.displayName ?? user.primaryEmail}</p>
          <button
            type="button"
            className="mt-1 text-xs text-muted underline-offset-4 hover:underline"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-h-svh flex-col pb-20 md:pb-0">
        <header className="flex h-14 items-center justify-between border-b border-line px-4 md:hidden">
          <Link to="/">
            <Wordmark />
          </Link>
          <Link
            to={kind === "client" ? "/studio" : "/app"}
            className="text-xs tracking-label text-muted uppercase"
          >
            {kind === "client" ? "Studio" : "You"}
          </Link>
        </header>
        <div className="flex-1">{children}</div>
        <nav
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-paper/95 backdrop-blur md:hidden"
          aria-label="Mobile"
        >
          {mobile.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[10px]",
                  active ? "text-sage" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
