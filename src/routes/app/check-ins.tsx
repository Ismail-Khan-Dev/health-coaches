import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCheckins, submitCheckin } from "@/lib/server/client-fns";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fromNow } from "@/lib/format";

export const Route = createFileRoute("/app/check-ins")({
  component: Checkins,
  head: () => ({ meta: [{ title: "Check-ins — Halden" }] }),
});

function Checkins() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["checkins"], queryFn: () => getCheckins() });
  const [energy, setEnergy] = useState(6);
  const [sleep, setSleep] = useState(6);
  const [mood, setMood] = useState(6);
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [questions, setQuestions] = useState("");
  const submit = useMutation({
    mutationFn: () =>
      submitCheckin({
        data: { energy, sleep, mood, wins, challenges, questions },
      }),
    onSuccess: () => {
      toast.success("Check-in sent to Aria.");
      setWins("");
      setChallenges("");
      setQuestions("");
      void qc.invalidateQueries({ queryKey: ["checkins"] });
    },
    onError: () => toast.error("Could not send the check-in."),
  });

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-5 py-8 lg:grid-cols-[1fr_20rem] md:px-8">
      <div>
        <h1 className="font-display text-display-sm font-medium">The weekly letter.</h1>
        <p className="mt-2 text-sm text-muted">
          Skip the confession. Send the pattern. Aria reads these on studio days.
        </p>
        <form
          className="mt-8 space-y-5 rounded-xl bg-surface p-5 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <Scale label="Energy" value={energy} onChange={setEnergy} />
          <Scale label="Sleep" value={sleep} onChange={setSleep} />
          <Scale label="Mood" value={mood} onChange={setMood} />
          <div className="space-y-2">
            <Label htmlFor="wins">What held</Label>
            <Textarea id="wins" value={wins} onChange={(e) => setWins(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ch">Where it slipped</Label>
            <Textarea id="ch" value={challenges} onChange={(e) => setChallenges(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q">A question for Aria</Label>
            <Textarea id="q" value={questions} onChange={(e) => setQuestions(e.target.value)} />
          </div>
          <Button type="submit" disabled={submit.isPending}>
            {submit.isPending ? "Sending…" : "Send check-in"}
          </Button>
        </form>
      </div>
      <aside>
        <h2 className="text-xs tracking-label text-muted uppercase">History</h2>
        {q.isPending && <p className="mt-3 text-sm text-muted">Loading…</p>}
        <ul className="mt-4 space-y-4">
          {q.data?.map((c) => (
            <li key={c.id} className="rounded-lg border border-line p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{c.week_label}</p>
                <Badge tone={c.status === "reviewed" ? "sage" : "default"}>{c.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted">
                E {c.energy} · S {c.sleep} · {fromNow(c.created_at)}
              </p>
              {c.wins && <p className="mt-2 text-sm text-ink-soft">{c.wins}</p>}
              {c.coach_reply && (
                <p className="mt-3 border-l-2 border-sage/40 pl-3 text-sm italic text-ink-soft">
                  {c.coach_reply}
                </p>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}

function Scale({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs tracking-label text-muted uppercase">
        <span>{label}</span>
        <span className="tabular-nums">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        aria-label={`${label}: ${value} out of 10`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-sage"
      />
    </div>
  );
}
