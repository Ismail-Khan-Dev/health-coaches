import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { stories } from "@/lib/content";

export const Route = createFileRoute("/stories/")({
  component: Stories,
  head: () => ({ meta: [{ title: "Stories — Halden" }] }),
});

function Stories() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">Stories</p>
        <h1 className="mt-4 max-w-3xl font-display text-display font-medium">
          Continuity, not spectacle.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          These are composites drawn from the kinds of weeks we see — names and
          details changed. No before-and-after photography. No promised numbers.
        </p>
        <div className="mt-14 grid gap-12">
          {stories.map((s) => (
            <Link
              key={s.slug}
              to="/stories/$slug"
              params={{ slug: s.slug }}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <img src={s.image} alt="" className="aspect-4/3 w-full rounded-lg object-cover" />
              <div>
                <p className="text-xs tracking-label text-muted uppercase">{s.role}</p>
                <blockquote className="mt-3 font-display text-display-sm font-medium leading-snug">
                  “{s.quote}”
                </blockquote>
                <p className="mt-4 text-sm text-ink-soft">{s.challenge}</p>
                <p className="mt-4 text-sm font-medium text-sage">{s.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
