import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { getStory } from "@/lib/content";

export const Route = createFileRoute("/stories/$slug")({
  component: Story,
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.story.name ?? "Story"} — Halden` }],
  }),
});

function Story() {
  const { story } = Route.useLoaderData();
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">{story.role}</p>
        <h1 className="mt-4 font-display text-display-sm font-medium">“{story.quote}”</h1>
        <p className="mt-4 text-sm text-muted">{story.name}</p>
        <img src={story.image} alt="" className="mt-10 aspect-4/3 w-full rounded-lg object-cover" />
        <div className="mt-12 space-y-10">
          <section>
            <h2 className="text-xs tracking-label text-muted uppercase">The week</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{story.challenge}</p>
          </section>
          <section>
            <h2 className="text-xs tracking-label text-muted uppercase">The work</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{story.approach}</p>
          </section>
          <section>
            <h2 className="text-xs tracking-label text-muted uppercase">What held</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{story.outcome}</p>
          </section>
        </div>
        <p className="mt-10 text-xs text-muted">
          Composite narrative for illustration. Not a medical case and not a guarantee
          of similar results.
        </p>
        <Button asChild className="mt-8">
          <Link to="/book">Book a consultation</Link>
        </Button>
      </article>
    </SiteShell>
  );
}
