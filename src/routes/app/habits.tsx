import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format, parseISO } from "date-fns";
import { getHabits, toggleHabitToday } from "@/lib/server/client-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/habits")({
  component: Habits,
  head: () => ({ meta: [{ title: "Habits — Halden" }] }),
});

function Habits() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["habits"], queryFn: () => getHabits() });
  const toggle = useMutation({
    mutationFn: (habitId: string) => toggleHabitToday({ data: { habitId } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["habits"] });
      void qc.invalidateQueries({ queryKey: ["client-home"] });
    },
  });

  if (q.isPending) return <p className="p-8 text-sm text-muted">Loading habits…</p>;
  if (q.isError || !q.data) return <p className="p-8 text-sm text-danger">Couldn’t load habits.</p>;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(parseISO(q.data.today), i - 13);
    return format(d, "yyyy-MM-dd");
  });

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">Habits that survive Tuesdays.</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Tap today to log. The grid is the last two weeks — grey is a miss, sage is a keep.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl bg-surface p-4 shadow-soft">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr>
              <th className="pb-3 pr-4 text-xs font-medium text-muted">Habit</th>
              {days.map((d) => (
                <th key={d} className="pb-3 text-center text-[10px] font-medium text-muted">
                  {format(parseISO(d), "d")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.data.habits.map((h) => (
              <tr key={h.id} className="border-t border-line">
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => toggle.mutate(h.id)}
                    className="text-left text-sm font-medium hover:text-sage"
                  >
                    {h.name}
                    <span className="mt-0.5 block text-xs font-normal text-muted">{h.cue}</span>
                  </button>
                </td>
                {days.map((d) => {
                  const on = q.data.logs.some((l) => l.habit_id === h.id && l.day.slice(0, 10) === d);
                  const isToday = d === q.data.today;
                  return (
                    <td key={d} className="py-3">
                      <span
                        className={cn(
                          "mx-auto block size-4 rounded-sm",
                          on ? "bg-sage" : "bg-paper-deep",
                          isToday && "ring-1 ring-sage/40",
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
