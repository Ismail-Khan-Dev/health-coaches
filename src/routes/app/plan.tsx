import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlan, togglePlanItem } from "@/lib/server/client-fns";
import { getProgram } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/plan")({
  component: Plan,
  head: () => ({ meta: [{ title: "Plan — Halden" }] }),
});

function Plan() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["plan"], queryFn: () => getPlan() });
  const toggle = useMutation({
    mutationFn: (id: string) => togglePlanItem({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plan"] }),
  });
  if (q.isPending) return <p className="p-8 text-sm text-muted">Opening the week…</p>;
  if (q.isError || !q.data) return <p className="p-8 text-sm text-danger">Couldn’t load the plan.</p>;
  const program = getProgram(q.data.profile?.program_slug ?? "foundation");

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <p className="text-xs tracking-label text-moss uppercase">
        {program?.name} · week {q.data.profile?.week_number}
      </p>
      <h1 className="mt-2 font-display text-display-sm font-medium">This week’s living plan.</h1>
      <p className="mt-2 text-sm text-muted">
        Aria revises this after sessions. Check off what actually happened — not what you meant.
      </p>
      <ul className="mt-8 space-y-3">
        {q.data.items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle.mutate(item.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl bg-surface p-4 text-left shadow-soft",
                item.done && "opacity-70",
              )}
            >
              <span className="w-10 shrink-0 text-xs tracking-label text-moss uppercase">
                {item.weekday}
              </span>
              <span>
                <span className={cn("block font-medium", item.done && "line-through")}>
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{item.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
