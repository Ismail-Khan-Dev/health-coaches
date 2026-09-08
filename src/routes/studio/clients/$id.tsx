import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getStudioClient, saveCoachNote } from "@/lib/server/studio-fns";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fromNow } from "@/lib/format";

export const Route = createFileRoute("/studio/clients/$id")({
  component: ClientFile,
  head: () => ({ meta: [{ title: "Client — Halden" }] }),
});

function ClientFile() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["studio-client", id],
    queryFn: () => getStudioClient({ data: { id } }),
  });
  const [note, setNote] = useState("");
  useEffect(() => {
    if (q.data?.client.note) setNote(q.data.client.note);
  }, [q.data]);
  const save = useMutation({
    mutationFn: () => saveCoachNote({ data: { id, note } }),
    onSuccess: () => {
      toast.success("Note kept.");
      void qc.invalidateQueries({ queryKey: ["studio-client", id] });
    },
  });

  if (q.isPending) return <p className="p-8 text-sm text-muted">Opening the file…</p>;
  if (!q.data) {
    return (
      <p className="p-8 text-sm text-muted">
        No client at this address. <Link to="/studio/clients">Back</Link>
      </p>
    );
  }
  const { client, checkins } = q.data;

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:px-8">
      <Link to="/studio/clients" className="text-xs text-muted">
        ← Clients
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-display-sm font-medium">{client.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {client.role_label} · {client.program_slug} · week {client.week_number}
          </p>
        </div>
        <div className="flex gap-2">
          {client.at_risk && <Badge tone="warn">at risk</Badge>}
          <Badge>{client.status}</Badge>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Meter label="Energy" n={client.energy} />
        <Meter label="Sleep" n={client.sleep} />
        <Meter label="Consistency" n={client.consistency} />
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        <span className="text-muted">Focus · </span>
        {client.focus}
      </p>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Label htmlFor="note">Private note</Label>
        <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button type="submit" size="sm" disabled={save.isPending}>
          Save note
        </Button>
      </form>
      <h2 className="mt-10 font-display text-xl font-medium">Check-ins</h2>
      <ul className="mt-4 space-y-3">
        {checkins.length === 0 && <p className="text-sm text-muted">None yet.</p>}
        {checkins.map((c) => (
          <li key={c.id} className="rounded-xl bg-surface p-4 shadow-soft">
            <p className="text-xs text-muted">
              {c.week_label} · {fromNow(c.created_at)} · {c.status}
            </p>
            <p className="mt-2 text-sm">{c.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Meter({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-soft">
      <p className="text-xs tracking-label text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{n}/10</p>
      <div className="mt-2 h-1 rounded-full bg-paper-deep">
        <div className="h-full bg-sage" style={{ width: `${n * 10}%` }} />
      </div>
    </div>
  );
}
