import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/marketing/site-header";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({ meta: [{ title: "Privacy — Halden" }] }),
});

function Privacy() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 text-sm leading-relaxed text-ink-soft md:px-8 md:py-24">
        <h1 className="font-display text-display-sm font-medium text-ink">Privacy</h1>
        <p className="mt-6">
          Health-related notes you share in the portal are treated as sensitive. We
          collect only what the studio needs to coach: account identity, check-ins,
          habits, messages, and appointments.
        </p>
        <p className="mt-4">
          We do not sell data. We do not use your notes to train public models. Access
          inside the product is limited to you and, for coaching records, to the studio
          account working with you.
        </p>
        <p className="mt-4">
          Payments, if you enroll, are processed by a third-party processor. We do not
          store raw card numbers.
        </p>
        <p className="mt-4">
          You may request export or deletion of your account data by writing to
          studio@halden.practice. Some records may be retained where we are required to
          keep them.
        </p>
      </article>
    </SiteShell>
  );
}
