import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientHome, toggleHabitToday } from "@/lib/server/client-fns";
import { getProgram } from "@/lib/content";
import { formatWhen } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  component: ClientHome,
  head: () => ({ meta: [{ title: "Today — Halden" }] }),
});

function ClientHome() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["client-home"], queryFn: () => getClientHome() });
  const toggle = useMutation({
    mutationFn: (habitId: string) => toggleHabitToday({ data: { habitId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-home"] }),
  });

  if (q.isPending) return <p className="p-8 text-sm text-muted">Gathering today…</p>;
  if (q.isError) {
    return (
      <p className="p-8 text-sm text-danger">
        Couldn’t open the portal. Sign in again if this persists.
      </p>
    );
  }
  const d = q.data;
  const program = getProgram(d.profile.program_slug);
  const first = d.profile.display_name?.split(" ")[0] ?? "there";
  const doneCount = d.habits.filter((h) => h.done).length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <p className="text-xs tracking-label text-moss uppercase">
        {program?.name} · week {d.profile.week_number}
      </p>
      <h1 className="mt-2 font-display text-display-sm font-medium">
        Today, {first}.
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        The question is not whether the week is perfect. It is what this day can hold.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Habits kept today" value={`${doneCount}/${d.habits.length}`} />
        <Stat label="This week’s logs" value={`${d.weekHabitCount}`} />
        <Stat
          label="Next session"
          value={d.nextAppt ? formatWhen(d.nextAppt.starts_at) : "None held"}
        />
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium">Today’s anchors</h2>
          <Link to="/app/habits" className="text-sm text-sage">
            All habits
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-xl bg-surface shadow-soft">
          {d.habits.map((h) => (
            <li key={h.id} className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                aria-pressed={h.done}
                onClick={() => toggle.mutate(h.id)}
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-full border transition-colors",
                  h.done ? "border-sage bg-sage text-sage-fg" : "border-line",
                )}
              >
                <span className="sr-only">Toggle {h.name}</span>
                {h.done ? "✓" : ""}
              </button>
              <div>
                <p className={cn("text-sm font-medium", h.done && "text-muted")}>{h.name}</p>
                <p className="text-xs text-muted">{h.cue}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-surface p-5 shadow-soft">
          <h2 className="font-display text-xl font-medium">From Aria</h2>
          {d.latestMsg ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d.latestMsg.body}</p>
              <Link to="/app/messages" className="mt-4 inline-block text-sm text-sage">
                Open the thread
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">No notes yet.</p>
          )}
        </section>
        <section className="rounded-xl bg-surface p-5 shadow-soft">
          <h2 className="font-display text-xl font-medium">Check-in</h2>
          {d.openCheck?.status === "submitted" ? (
            <p className="mt-3 text-sm text-ink-soft">
              {d.openCheck.week_label} is with Aria. She’ll reply on a studio day.
            </p>
          ) : (
            <p className="mt-3 text-sm text-ink-soft">
              A short letter beats a confession. Send the pattern.
            </p>
          )}
          <Link to="/app/check-ins" className="mt-4 inline-block text-sm text-sage">
            Write this week
          </Link>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">Goals, quietly</h2>
        <ul className="mt-4 space-y-4">
          {d.goals.map((g) => (
            <li key={g.id}>
              <div className="flex justify-between text-sm">
                <span>{g.title}</span>
                <span className="tabular-nums text-muted">{g.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-deep">
                <div className="h-full bg-sage" style={{ width: `${g.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-soft">
      <p className="text-xs tracking-label text-muted uppercase">{label}</p>
      <p className="mt-2 font-display text-xl font-medium">{value}</p>
    </div>
  );
}
