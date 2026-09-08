import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteShell, StickyCta } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { programs, stories, faqs, methodSteps, articles } from "@/lib/content";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-8 pt-14 md:px-8 md:pt-24">
          <p className="text-xs tracking-label text-moss uppercase">Private coaching studio</p>
          <h1 className="mt-5 max-w-4xl font-display text-display font-medium">
            The quiet work of feeling well again.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Halden is a 24-client studio for people whose lives work — except in the
            body that has to carry them. We rebuild energy, sleep, and food rhythm
            without the performance of wellness.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link to="/book">Book a consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/assess">Take the assessment</Link>
            </Button>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
            {[
              ["24", "clients at a time"],
              ["11 yrs", "private practice"],
              ["MSc", "human nutrition"],
              ["0", "medical claims"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-3xl font-medium">{k}</dt>
                <dd className="mt-1 text-sm text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <figure className="px-0 md:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden md:rounded-xl">
            <img
              src="/images/forest.jpg"
              alt="A mossy woodland path at first light"
              className="aspect-16/9 w-full object-cover"
            />
          </div>
          <figcaption className="mx-auto mt-3 max-w-6xl px-5 text-xs text-muted md:px-8">
            The work is unglamorous on purpose. Most plans die on a Tuesday.
          </figcaption>
        </figure>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
          <div className="md:col-span-5">
            <p className="text-xs tracking-label text-moss uppercase">The problem</p>
            <h2 className="mt-3 font-display text-display-sm font-medium">
              You do not need another Monday.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-ink-soft md:col-span-7">
            <p>
              The people who write to Halden are not undisciplined. They run companies,
              raise children, keep other people alive. They have already bought the
              program, read the book, and white-knuckled January.
            </p>
            <p>
              What they have not had is a week designed for the life they actually live
              — and a person who notices when that week starts to slip. Information is
              cheap. Attention is the scarce thing.
            </p>
            <p>
              We do not promise a number, a personality, or a diagnosis. We promise a
              relationship that makes the next right action obvious, and stays when it
              stops being obvious.
            </p>
          </div>
        </section>

        <section className="bg-sage text-sage-fg">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <div>
              <p className="text-xs tracking-label uppercase opacity-70">Philosophy</p>
              <blockquote className="mt-4 font-display text-display-sm font-medium leading-snug">
                “Most people do not need more information. They need a week that can
                hold, and someone who notices when it does not.”
              </blockquote>
              <p className="mt-6 text-sm opacity-80">Aria Halden, principal coach</p>
            </div>
            <div className="relative">
              <img
                src="/images/studio.jpg"
                alt="The Halden studio, two chairs by a window"
                className="h-full max-h-[28rem] w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-label text-moss uppercase">Programs</p>
              <h2 className="mt-3 font-display text-display-sm font-medium">
                Three rooms. A closed studio.
              </h2>
            </div>
            <Link
              to="/programs"
              className="hidden items-center gap-1 text-sm text-sage md:inline-flex"
            >
              All programs <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {programs.map((p) => (
              <Link
                key={p.slug}
                to="/programs/$slug"
                params={{ slug: p.slug }}
                className="group overflow-hidden rounded-xl bg-surface shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
              >
                <img src={p.image} alt="" className="aspect-4/3 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs tracking-label text-muted uppercase">{p.duration}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.promise}</p>
                  <p className="mt-5 text-sm font-medium text-sage">
                    {p.price}{" "}
                    <ArrowUpRight className="inline size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <p className="text-xs tracking-label text-moss uppercase">Method</p>
            <h2 className="mt-3 max-w-xl font-display text-display-sm font-medium">
              Observe. Subtract. Anchor. Adjust.
            </h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-4">
              {methodSteps.map((s) => (
                <li key={s.n}>
                  <p className="font-display text-2xl text-moss">{s.n}</p>
                  <h3 className="mt-3 font-display text-xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" className="mt-10">
              <Link to="/about">How the studio works</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="text-xs tracking-label text-moss uppercase">Stories</p>
          <h2 className="mt-3 font-display text-display-sm font-medium">
            Not transformations. Continuity.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {stories.map((s) => (
              <Link key={s.slug} to="/stories/$slug" params={{ slug: s.slug }} className="group">
                <img
                  src={s.image}
                  alt=""
                  className="aspect-4/3 w-full rounded-lg object-cover"
                />
                <p className="mt-4 text-xs tracking-label text-muted uppercase">{s.role}</p>
                <blockquote className="mt-2 font-display text-xl font-medium leading-snug">
                  “{s.quote}”
                </blockquote>
                <p className="mt-2 text-sm text-sage">
                  {s.name} <ArrowRight className="inline size-3.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 md:grid-cols-2 md:px-8">
          <img
            src="/images/desk.jpg"
            alt="Aria’s desk: journals, fountain pen, botanicals"
            className="aspect-3/2 w-full rounded-lg object-cover"
          />
          <div>
            <p className="text-xs tracking-label text-moss uppercase">Your coach</p>
            <h2 className="mt-3 font-display text-display-sm font-medium">Aria Halden</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Six years in a metabolic research lab. Then too many papers that could not
              survive a real Tuesday. The studio exists so the work has to.
            </p>
            <p className="mt-3 text-sm text-muted">
              MSc Human Nutrition · Precision Nutrition L2 · 11 years private practice
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/about">Meet Aria</Link>
            </Button>
          </div>
        </section>

        <section className="bg-paper-deep/50">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
            <div>
              <p className="text-xs tracking-label text-moss uppercase">Journal</p>
              <h2 className="mt-3 font-display text-display-sm font-medium">
                Notes from the studio.
              </h2>
              <p className="mt-4 max-w-sm text-sm text-muted">
                Method, not motivation. Written for people who are tired of being
                talked to as a funnel.
              </p>
            </div>
            <ul className="divide-y divide-line">
              {articles.slice(0, 3).map((a) => (
                <li key={a.slug} className="py-4 first:pt-0">
                  <Link to="/journal/$slug" params={{ slug: a.slug }} className="group">
                    <p className="text-xs text-muted">
                      {a.category} · {a.read}
                    </p>
                    <p className="mt-1 font-display text-xl font-medium group-hover:text-sage">
                      {a.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
          <h2 className="font-display text-display-sm font-medium">Questions, answered.</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none font-medium text-ink [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {f.q}
                    <span className="text-muted transition-transform duration-150 group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <h2 className="max-w-2xl font-display text-display-sm font-medium">
              If the week is the problem, let us look at the week.
            </h2>
            <p className="mt-4 max-w-lg text-sm text-paper/70">
              A complimentary 45-minute consultation with Aria. No pitch deck. A
              conversation about whether this room is the right one.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="paper">
                <Link to="/book">Book a consultation</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-paper hover:bg-white/10">
                <Link to="/assess">Take the assessment</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <div className="h-16 md:hidden" />
      <StickyCta />
    </SiteShell>
  );
}
