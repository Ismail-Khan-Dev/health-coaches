import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getProgress } from "@/lib/server/client-fns";

export const Route = createFileRoute("/app/progress")({
  component: Progress,
  head: () => ({ meta: [{ title: "Progress — Halden" }] }),
});

function Progress() {
  const q = useQuery({ queryKey: ["progress"], queryFn: () => getProgress() });
  if (q.isPending) return <p className="p-8 text-sm text-muted">Reading the weeks…</p>;
  if (q.isError || !q.data) return <p className="p-8 text-sm text-danger">Couldn’t load progress.</p>;

  const chart = q.data.checkins.map((c) => ({
    name: c.week_label,
    energy: c.energy ?? 0,
    sleep: c.sleep ?? 0,
    mood: c.mood ?? 0,
  }));

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">What the weeks are saying.</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Not a dashboard for its own sake. Energy, sleep, and the habits you actually kept.
      </p>

      <section className="mt-8 rounded-xl bg-surface p-5 shadow-soft">
        <h2 className="text-sm font-medium">Check-in trends</h2>
        {chart.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Submit a check-in to see the line.</p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid stroke="#DDD4C4" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#6F685C" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="#6F685C" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="energy" stroke="#31483E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sleep" stroke="#5C7266" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mood" stroke="#1B1914" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-2 text-xs text-muted">Sage energy · moss sleep · ink mood. Scale of ten.</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-medium">Goals</h2>
        <ul className="mt-4 space-y-5">
          {q.data.goals.map((g) => (
            <li key={g.id}>
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{g.title}</p>
                  <p className="text-sm text-muted">{g.detail}</p>
                </div>
                <p className="tabular-nums text-sm text-muted">{g.progress}%</p>
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
