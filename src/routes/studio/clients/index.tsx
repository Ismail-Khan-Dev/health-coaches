import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudioHome } from "@/lib/server/studio-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/studio/clients/")({
  component: Clients,
  head: () => ({ meta: [{ title: "Clients — Halden" }] }),
});

function Clients() {
  const q = useQuery({ queryKey: ["studio-home"], queryFn: () => getStudioHome() });
  const [qstr, setQstr] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(() => {
    return (q.data?.clients ?? []).filter((c) => {
      const hit = c.name.toLowerCase().includes(qstr.toLowerCase());
      const st = status === "all" || c.status === status;
      return hit && st;
    });
  }, [q.data, qstr, status]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">Clients</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search"
          value={qstr}
          onChange={(e) => setQstr(e.target.value)}
          aria-label="Search clients"
        />
        <div className="flex gap-2">
          {["all", "active", "lead", "paused"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-2 text-xs capitalize ${status === s ? "bg-sage text-sage-fg" : "bg-paper-deep"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {q.isPending && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {rows.length === 0 && !q.isPending && (
        <p className="mt-8 text-sm text-muted">No one matches that.</p>
      )}
      <ul className="mt-6 divide-y divide-line rounded-xl bg-surface shadow-soft">
        {rows.map((c) => (
          <li key={c.id}>
            <Link
              to="/studio/clients/$id"
              params={{ id: c.id }}
              className="flex items-center justify-between gap-4 px-4 py-4"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted">
                  {c.role_label} · {c.program_slug} · {c.focus}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {c.at_risk && <Badge tone="warn">at risk</Badge>}
                <Badge>{c.status}</Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
