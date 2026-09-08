import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { resources } from "@/lib/content";
import { getFavorites, toggleFavorite } from "@/lib/server/client-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/resources")({
  component: Resources,
  head: () => ({ meta: [{ title: "Resources — Halden" }] }),
});

function Resources() {
  const qc = useQueryClient();
  const favs = useQuery({ queryKey: ["favs"], queryFn: () => getFavorites() });
  const toggle = useMutation({
    mutationFn: (slug: string) => toggleFavorite({ data: { slug } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favs"] }),
  });
  const set = new Set(favs.data ?? []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">The library.</h1>
      <p className="mt-2 text-sm text-muted">
        Short, specific, meant to be used on an ordinary day. Not a content mill.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {resources.map((r) => (
          <article key={r.slug} className="overflow-hidden rounded-xl bg-surface shadow-soft">
            <img src={r.image} alt="" className="aspect-16/9 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-label text-muted uppercase">
                    {r.kind} · {r.minutes} min · {r.category}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-medium">{r.title}</h2>
                </div>
                <button
                  type="button"
                  aria-label="Save"
                  onClick={() => toggle.mutate(r.slug)}
                  className="grid size-11 place-items-center"
                >
                  <Bookmark
                    className={cn("size-5", set.has(r.slug) ? "fill-sage text-sage" : "text-muted")}
                  />
                </button>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{r.blurb}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
