import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({ meta: [{ title: "Terms — Halden" }] }),
});

function Terms() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 text-sm leading-relaxed text-ink-soft md:px-8 md:py-24">
        <h1 className="font-display text-display-sm font-medium text-ink">Terms</h1>
        <p className="mt-6">
          Halden provides health coaching. It is not medical care, psychotherapy, or
          nutrition prescription in the clinical sense. Nothing on this site is a
          diagnosis or a guarantee of outcome.
        </p>
        <p className="mt-4">
          Consultations are a fit conversation. Enrollment in Foundation, Continuum,
          or Private Studio is a separate agreement covering fees, cancellation, and
          the studio’s 24-client cap.
        </p>
        <p className="mt-4">
          You are responsible for involving a licensed clinician for medical questions.
          If you are in crisis or this is an emergency, contact local emergency
          services.
        </p>
      </article>
    </SiteShell>
  );
}
