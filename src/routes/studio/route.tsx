import { createFileRoute, Outlet, type ErrorComponentProps } from "@tanstack/react-router";
import { AppShell } from "@/components/app/app-shell";
import { TriangleAlert } from "lucide-react";

function StudioError({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  return (
    <main className="mx-auto max-w-6xl px-5 py-16 text-center">
      <TriangleAlert className="mx-auto size-10 text-danger" strokeWidth={1.5} />
      <h1 className="mt-4 font-display text-2xl font-medium">Something went wrong</h1>
      <p className="mt-3 max-w-md mx-auto text-sm text-muted break-words">{message}</p>
      <a href="/studio" className="mt-6 inline-block text-sm text-sage underline-offset-4 hover:underline">
        Return to studio
      </a>
    </main>
  );
}

export const Route = createFileRoute("/studio")({
  component: () => (
    <AppShell kind="studio">
      <Outlet />
    </AppShell>
  ),
  errorComponent: StudioError,
});
