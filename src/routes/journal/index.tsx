import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { articles } from "@/lib/content";

export const Route = createFileRoute("/journal/")({
  component: Journal,
  head: () => ({ meta: [{ title: "Journal — Halden" }] }),
});

function Journal() {
  const [featured, ...rest] = articles;
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">Journal</p>
        <h1 className="mt-4 font-display text-display font-medium">Notes from the studio.</h1>
        {featured && (
          <Link
            to="/journal/$slug"
            params={{ slug: featured.slug }}
            className="mt-12 grid items-center gap-8 md:grid-cols-2"
          >
            <img src={featured.image} alt="" className="aspect-4/3 w-full rounded-lg object-cover" />
            <div>
              <p className="text-xs text-muted">
                {featured.category} · {featured.read}
              </p>
              <h2 className="mt-2 font-display text-display-sm font-medium">{featured.title}</h2>
              <p className="mt-3 text-ink-soft">{featured.dek}</p>
            </div>
          </Link>
        )}
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }}>
              <img src={a.image} alt="" className="aspect-4/3 w-full rounded-lg object-cover" />
              <p className="mt-3 text-xs text-muted">
                {a.category} · {a.read}
              </p>
              <h3 className="mt-1 font-display text-xl font-medium">{a.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{a.dek}</p>
            </Link>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
