import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { BRAND, faqs } from "@/lib/content";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Halden" }] }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <main className="mx-auto grid max-w-6xl gap-14 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="text-xs tracking-label text-moss uppercase">Contact</p>
          <h1 className="mt-4 font-display text-display-sm font-medium">Write to the studio.</h1>
          <p className="mt-4 text-ink-soft">
            For press, partnerships, or a question that is not a booking. Consultations
            are scheduled on the booking page — this form is for everything else.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-xs tracking-label text-muted uppercase">Email</dt>
              <dd className="mt-1">{BRAND.email}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-label text-muted uppercase">Studio</dt>
              <dd className="mt-1">{BRAND.location}</dd>
            </div>
          </dl>
          <Button asChild className="mt-8">
            <Link to="/book">Book a consultation</Link>
          </Button>
        </div>
        <div className="rounded-xl bg-surface p-6 shadow-soft md:p-8">
          {sent ? (
            <div>
              <h2 className="font-display text-2xl font-medium">Received.</h2>
              <p className="mt-3 text-sm text-ink-soft">
                Aria’s studio days are Tuesday through Friday. You’ll hear back within
                one of them.
              </p>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                toast.success("Message received.");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" name="msg" required />
              </div>
              <Button type="submit" className="w-full">
                Send
              </Button>
              <p className="text-xs text-muted">
                Do not include medical records or anything you would not put on a postcard.
              </p>
            </form>
          )}
        </div>
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl">A few answers first</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {faqs.slice(0, 4).map((f) => (
              <div key={f.q} className="rounded-lg border border-line p-4">
                <p className="font-medium">{f.q}</p>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
