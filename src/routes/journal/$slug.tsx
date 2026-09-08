import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";
import { getArticle, articles } from "@/lib/content";

export const Route = createFileRoute("/journal/$slug")({
  component: Article,
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article.title ?? "Journal"} — Halden` },
      { name: "description", content: loaderData?.article.dek ?? "" },
    ],
  }),
});

function Article() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs tracking-label text-moss uppercase">
          {article.category} · {article.read} · {article.date}
        </p>
        <h1 className="mt-4 font-display text-display-sm font-medium">{article.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{article.dek}</p>
        <img src={article.image} alt="" className="mt-10 aspect-3/2 w-full rounded-lg object-cover" />
        <div className="mt-10 space-y-5 text-base leading-relaxed text-ink-soft">
          {article.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <p className="mt-10 text-xs text-muted">
          Coaching notes, not medical advice. Halden does not diagnose or treat.
        </p>
      </article>
      <aside className="mx-auto max-w-3xl px-5 pb-20 md:px-8">
        <p className="text-xs tracking-label text-muted uppercase">Also in the journal</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {related.map((a) => (
            <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="text-sm">
              <span className="font-display text-lg font-medium">{a.title}</span>
            </Link>
          ))}
        </div>
      </aside>
    </SiteShell>
  );
}
