import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { getProgram, faqs } from "@/lib/content";

export const Route = createFileRoute("/programs/$slug")({
  component: ProgramDetail,
  loader: ({ params }) => {
    const program = getProgram(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.program.name ?? "Program"} — Halden` }],
  }),
});

function ProgramDetail() {
  const { program } = Route.useLoaderData();
  return (
    <SiteShell>
      <main>
        <section className="mx-auto grid max-w-6xl items-end gap-8 px-5 pt-14 md:grid-cols-2 md:px-8 md:pt-20">
          <div>
            <p className="text-xs tracking-label text-moss uppercase">
              {program.duration} · {program.cadence}
            </p>
            <h1 className="mt-3 font-display text-display font-medium">{program.name}</h1>
            <p className="mt-5 max-w-md text-lg text-ink-soft">{program.promise}</p>
            <p className="mt-6 font-display text-2xl">{program.price}</p>
            <p className="text-sm text-muted">{program.priceNote}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/book">Book a consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/assess">See if it fits</Link>
              </Button>
            </div>
          </div>
          <img src={program.image} alt="" className="aspect-4/3 w-full rounded-lg object-cover" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-2xl font-medium">Who it is for</h2>
            <p className="mt-3 text-ink-soft">{program.who}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium">What is included</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              {program.includes.map((item) => (
                <li key={item} className="border-l-2 border-sage/40 pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
            <h2 className="font-display text-display-sm font-medium">The arc</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {program.weeks.map((w) => (
                <article key={w.title}>
                  <h3 className="font-display text-xl font-medium">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <h2 className="font-display text-2xl font-medium">Before you book</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.slice(0, 4).map((f) => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <Button asChild className="mt-8">
            <Link to="/book">Book a consultation</Link>
          </Button>
        </section>
      </main>
    </SiteShell>
  );
}
