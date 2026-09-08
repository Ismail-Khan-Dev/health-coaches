import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import {
  assessmentQuestions,
  getProgram,
  recommendProgram,
  templateSummary,
  type Answers,
} from "@/lib/content";
import { personalizeAssessment } from "@/lib/server/ai-fns";
import { saveAssessment } from "@/lib/server/client-fns";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assess")({
  component: Assess,
  head: () => ({
    meta: [
      { title: "Assessment — Halden" },
      {
        name: "description",
        content: "A short lifestyle assessment to see whether Halden coaching is a fit. Not a diagnosis.",
      },
    ],
  }),
});

function Assess() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const { user } = useCurrentUserState();

  const personalize = useMutation({
    mutationFn: (a: Answers) => personalizeAssessment({ data: { answers: a } }),
    onSuccess: async (res) => {
      setSlug(res.programSlug);
      setSummary(res.summary);
      if (user) {
        try {
          await saveAssessment({
            data: { answers, recommendedSlug: res.programSlug, summary: res.summary },
          });
        } catch {
          toast.error("Could not save your assessment. Your recommendation is still shown.");
        }
      }
    },
    onError: () => {
      const program = recommendProgram(answers);
      setSlug(program.slug);
      setSummary(templateSummary(answers, program));
    },
  });

  const total = assessmentQuestions.length;
  const current = assessmentQuestions[step];
  const done = summary && slug;
  const program = slug ? getProgram(slug) : null;
  const progress = done ? 100 : Math.round((step / total) * 100);

  const canNext = current ? Boolean(answers[current.id]) : false;

  const title = useMemo(() => {
    if (done) return "A possible fit — not a verdict.";
    return "A conversation, in eight questions.";
  }, [done]);

  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-xs tracking-label text-moss uppercase">Assessment</p>
        <h1 className="mt-3 font-display text-display-sm font-medium">{title}</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          This is not a diagnosis, lab, or medical screening. It is a way to see
          whether the studio’s way of working matches the week you actually have.
        </p>
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full bg-sage transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {done && program ? (
          <section className="mt-10">
            <p className="text-base leading-relaxed text-ink-soft">{summary}</p>
            <article className="mt-8 overflow-hidden rounded-xl bg-surface shadow-soft">
              <img src={program.image} alt="" className="aspect-16/9 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs tracking-label text-muted uppercase">{program.duration}</p>
                <h2 className="mt-1 font-display text-2xl font-medium">{program.name}</h2>
                <p className="mt-2 text-sm text-ink-soft">{program.promise}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link to="/book">Book a consultation</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/programs/$slug" params={{ slug: program.slug }}>
                      Read the program
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
            <button
              type="button"
              className="mt-6 text-sm text-muted underline-offset-4 hover:underline"
              onClick={() => {
                setStep(0);
                setAnswers({});
                setSummary(null);
                setSlug(null);
              }}
            >
              Start over
            </button>
          </section>
        ) : current ? (
          <section className="mt-10">
            <p className="text-xs text-muted">
              {step + 1} of {total}
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium md:text-3xl">{current.prompt}</h2>
            {"note" in current && current.note ? (
              <p className="mt-2 text-sm text-muted">{current.note}</p>
            ) : null}
            <div className="mt-8 grid gap-3">
              {current.options.map((o) => {
                const on = answers[current.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [current.id]: o.id }))}
                    className={cn(
                      "rounded-lg border px-4 py-4 text-left text-sm transition-colors duration-150",
                      on
                        ? "border-sage bg-sage/10 text-ink"
                        : "border-line bg-surface text-ink-soft hover:border-line-strong",
                    )}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                className="text-sm text-muted disabled:opacity-40"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </button>
              {step < total - 1 ? (
                <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                  Continue
                </Button>
              ) : (
                <Button
                  disabled={!canNext || personalize.isPending}
                  onClick={() => personalize.mutate(answers)}
                >
                  {personalize.isPending ? "Reading your week…" : "See the recommendation"}
                </Button>
              )}
            </div>
          </section>
        ) : null}
      </main>
    </SiteShell>
  );
}
