import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getStudioCheckins, markCheckinReviewed } from "@/lib/server/studio-fns";
import { draftCheckinReply } from "@/lib/server/ai-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fromNow } from "@/lib/format";

export const Route = createFileRoute("/studio/check-ins")({
  component: StudioCheckins,
  head: () => ({ meta: [{ title: "Check-ins — Studio" }] }),
});

function StudioCheckins() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["studio-checkins"], queryFn: () => getStudioCheckins() });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const review = useMutation({
    mutationFn: (id: string) => markCheckinReviewed({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["studio-checkins"] }),
  });
  const draft = useMutation({
    mutationFn: (id: string) => draftCheckinReply({ data: { id } }),
    onSuccess: (res, id) => {
      if (res.ok) setDrafts((d) => ({ ...d, [id]: res.draft }));
      else toast.error("Could not draft.");
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">Check-in inbox</h1>
      <p className="mt-2 text-sm text-muted">
        Read, draft, mark reviewed. Drafts are suggestions — you still send the human letter.
      </p>
      {q.isPending && <p className="mt-8 text-sm text-muted">Loading…</p>}
      <ul className="mt-8 space-y-4">
        {q.data?.map((c) => (
          <li key={c.id} className="rounded-xl bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{c.name}</p>
              <Badge tone={c.status === "pending" ? "warn" : "sage"}>{c.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted">
              {c.week_label} · E{c.energy} S{c.sleep} · {fromNow(c.created_at)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            {drafts[c.id] && (
              <p className="mt-3 border-l-2 border-sage/40 pl-3 text-sm italic">{drafts[c.id]}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={draft.isPending}
                onClick={() => draft.mutate(c.id)}
              >
                {draft.isPending ? "Drafting…" : "Draft a reply"}
              </Button>
              {c.status === "pending" && (
                <Button size="sm" onClick={() => review.mutate(c.id)}>
                  Mark reviewed
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
