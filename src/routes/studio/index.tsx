import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStudioHome } from "@/lib/server/studio-fns";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/studio/")({
  component: StudioHome,
  head: () => ({ meta: [{ title: "Studio — Halden" }] }),
});

function StudioHome() {
  const q = useQuery({ queryKey: ["studio-home"], queryFn: () => getStudioHome() });
  if (q.isPending) return <p className="p-8 text-sm text-muted">Opening the studio…</p>;
  if (q.isError || !q.data) return <p className="p-8 text-sm text-danger">Couldn’t load the studio.</p>;
  const { clients, pending, active, leads, risk } = q.data;
  const watch = clients.filter((c) => c.at_risk || c.status === "lead");

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
      <p className="text-xs tracking-label text-moss uppercase">Coach workspace</p>
      <h1 className="mt-2 font-display text-display-sm font-medium">Good morning, Aria.</h1>
      <p className="mt-2 text-sm text-muted">
        A closed studio. Attention is the product. This view is seeded for your account
        so you can see the room as it runs.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat k="Active clients" v={String(active)} />
        <Stat k="Pending check-ins" v={String(pending)} />
        <Stat k="At risk" v={String(risk)} />
        <Stat k="Consults" v={String(leads)} />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-medium">Needs a look</h2>
            <Link to="/studio/check-ins" className="text-sm text-sage">
              Inbox
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {watch.map((c) => (
              <li key={c.id}>
                <Link
                  to="/studio/clients/$id"
                  params={{ id: c.id }}
                  className="block rounded-xl bg-surface p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{c.name}</p>
                    <Badge tone={c.at_risk ? "warn" : "default"}>{c.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{c.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-medium">The room</h2>
            <Link to="/studio/clients" className="text-sm text-sage">
              All clients
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line rounded-xl bg-surface shadow-soft">
            {clients
              .filter((c) => c.status === "active")
              .map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted">
                      {c.program_slug} · week {c.week_number} · {c.focus}
                    </p>
                  </div>
                  <p className="text-xs tabular-nums text-muted">
                    E{c.energy} S{c.sleep}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-soft">
      <p className="text-xs tracking-label text-muted uppercase">{k}</p>
      <p className="mt-2 font-display text-2xl tabular-nums">{v}</p>
    </div>
  );
}
