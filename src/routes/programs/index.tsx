import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { programs } from "@/lib/content";

export const Route = createFileRoute("/programs/")({
  component: Programs,
  head: () => ({ meta: [{ title: "Programs — Halden" }] }),
});

function Programs() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">Programs</p>
        <h1 className="mt-4 max-w-3xl font-display text-display font-medium">
          Choose a room, not a funnel.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          Every engagement is with Aria. The difference is duration, cadence, and
          how tightly we hold the calendar.
        </p>
        <div className="mt-14 space-y-16">
          {programs.map((p, i) => (
            <article
              key={p.slug}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <img
                src={p.image}
                alt=""
                className={`aspect-4/3 w-full rounded-lg object-cover ${i % 2 ? "md:order-2" : ""}`}
              />
              <div>
                <p className="text-xs tracking-label text-muted uppercase">
                  {p.duration} · {p.cadence}
                </p>
                <h2 className="mt-2 font-display text-display-sm font-medium">{p.name}</h2>
                <p className="mt-3 text-ink-soft">{p.promise}</p>
                <p className="mt-3 text-sm text-muted">{p.who}</p>
                <p className="mt-5 font-medium">{p.price}</p>
                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link to="/programs/$slug" params={{ slug: p.slug }}>
                      View {p.name}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/book">Book</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
