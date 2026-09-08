import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <p className="text-xs tracking-label text-muted uppercase">404</p>
      <h1 className="font-display text-display-sm font-medium">
        This page is not in the studio.
      </h1>
      <a href="/" className="text-sm text-sage underline-offset-4 hover:underline">
        Return home
      </a>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
  });
}
