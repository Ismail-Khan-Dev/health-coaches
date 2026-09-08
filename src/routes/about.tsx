import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { values, methodSteps } from "@/lib/content";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [{ title: "The studio — Halden" }, { name: "description", content: "Aria Halden and the closed coaching studio in Mill Valley." }],
  }),
});

function About() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">The studio</p>
        <h1 className="mt-4 max-w-3xl font-display text-display font-medium">
          A closed room, on purpose.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Halden takes twenty-four clients. That is not a marketing scarcity — it is
          the number of people Aria can actually know. If the waitlist is long, it
          is because the alternative is a funnel with her name on it.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <img src="/images/studio.jpg" alt="Studio interior" className="aspect-4/3 rounded-lg object-cover md:col-span-2 md:aspect-auto md:h-full" />
          <img src="/images/cup.jpg" alt="Ceramic cup" className="aspect-square rounded-lg object-cover" />
        </div>

        <section className="mt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="font-display text-display-sm font-medium">Aria Halden</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-ink-soft md:col-span-8">
            <p>
              Aria spent six years as a research associate in human metabolism,
              writing papers that were correct and useless the moment they met a
              school run. She left the lab, took the credentials with her, and opened
              a studio where the unit of work is a week a person can actually live.
            </p>
            <p>
              She coaches in Mill Valley and on video. She reads every check-in
              herself. She will not perform warmth she does not feel, and she will
              not pretend coaching is medicine.
            </p>
            <ul className="grid gap-2 text-sm text-ink sm:grid-cols-2">
              <li>MSc Human Nutrition, King’s College London</li>
              <li>Precision Nutrition Level 2</li>
              <li>ACE Health Coach</li>
              <li>11 years in private practice</li>
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-display-sm font-medium">What we hold.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-surface p-6 shadow-soft">
                <h3 className="font-display text-xl font-medium">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-line pt-16">
          <h2 className="font-display text-display-sm font-medium">The method, without theatre.</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {methodSteps.map((s) => (
              <li key={s.n}>
                <p className="text-moss">{s.n}</p>
                <h3 className="mt-2 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 grid items-center gap-10 md:grid-cols-2">
          <img src="/images/desk.jpg" alt="Writing desk" className="rounded-lg object-cover" />
          <div>
            <h2 className="font-display text-display-sm font-medium">Why people stay.</h2>
            <p className="mt-4 text-ink-soft">
              Not because the advice is secret. Because someone is still in the room
              when the advice stops being easy. Continuity is the product. The rest
              is furniture.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/book">Book a consultation</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/programs">See programs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
