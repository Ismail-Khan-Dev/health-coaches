import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { SiteShell } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { services } from "@/lib/content";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { createBooking } from "@/lib/server/client-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  component: Book,
  head: () => ({ meta: [{ title: "Book a consultation — Halden" }] }),
});

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

function days() {
  const out: Date[] = [];
  let d = addDays(startOfDay(new Date()), 1);
  while (out.length < 12) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(d);
    d = addDays(d, 1);
  }
  return out;
}

function Book() {
  const { user, isPending } = useCurrentUserState();
  const [service, setService] = useState<(typeof services)[number]>(services[0]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);
  const options = useMemo(() => days(), []);

  if (needAuth) {
    if (isPending) return null;
    if (!user) return <RedirectToSignIn to="/login" />;
  }

  async function confirm() {
    if (!date || !time) return;
    if (!user) {
      setNeedAuth(true);
      return;
    }
    setConfirming(true);
    const starts = new Date(date);
    const [hh, mm] = time.split(":").map(Number);
    starts.setHours(hh, mm, 0, 0);
    try {
      await createBooking({
        data: {
          serviceSlug: service.slug,
          serviceName: service.name,
          startsAt: starts.toISOString(),
          notes,
        },
      });
      setDone(true);
      toast.success("Consultation reserved.");
    } catch {
      toast.error("Could not reserve that time. Sign in and try again.");
      setNeedAuth(true);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <SiteShell>
      <main className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-xs tracking-label text-moss uppercase">Booking</p>
        <h1 className="mt-3 font-display text-display-sm font-medium">
          Forty-five minutes. The truth of your week.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Discovery consultations are complimentary. If the studio is not the right
          room, Aria will say so.
        </p>

        {done ? (
          <section className="mt-12 rounded-xl bg-surface p-8 shadow-soft">
            <h2 className="font-display text-2xl font-medium">You are on the calendar.</h2>
            <p className="mt-3 text-ink-soft">
              {service.name} · {date ? format(date, "EEEE d MMMM") : ""} at {time}.
              A confirmation sits in your portal. Come as you are — notes optional.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/app/appointments">Open portal</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Home</Link>
              </Button>
            </div>
          </section>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem]">
            <div className="space-y-10">
              <section>
                <h2 className="text-xs tracking-label text-muted uppercase">1 · Service</h2>
                <div className="mt-4 grid gap-3">
                  {services.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setService(s)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        service.slug === s.slug
                          ? "border-sage bg-sage/10"
                          : "border-line bg-surface hover:border-line-strong",
                      )}
                    >
                      <p className="font-medium">{s.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        {s.duration} min · {s.price}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">{s.blurb}</p>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xs tracking-label text-muted uppercase">2 · Day</h2>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {options.map((d) => {
                    const on = date && d.toDateString() === date.toDateString();
                    const past = isBefore(d, startOfDay(new Date()));
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        disabled={past}
                        onClick={() => {
                          setDate(d);
                          setTime(null);
                        }}
                        className={cn(
                          "rounded-md border px-2 py-3 text-sm",
                          on ? "border-sage bg-sage text-sage-fg" : "border-line bg-surface",
                        )}
                      >
                        <span className="block text-xs opacity-80">{format(d, "EEE")}</span>
                        {format(d, "d MMM")}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section>
                <h2 className="text-xs tracking-label text-muted uppercase">3 · Time</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      disabled={!date}
                      onClick={() => setTime(t)}
                      className={cn(
                        "h-11 rounded-md border px-4 text-sm disabled:opacity-40",
                        time === t ? "border-sage bg-sage text-sage-fg" : "border-line bg-surface",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>
              <section className="space-y-3">
                <h2 className="text-xs tracking-label text-muted uppercase">4 · Notes</h2>
                <Label htmlFor="notes">Anything Aria should know</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="The truth of the week is more useful than a highlight reel."
                />
              </section>
            </div>
            <aside className="h-fit rounded-xl bg-sage p-6 text-sage-fg lg:sticky lg:top-24">
              <p className="text-xs tracking-label uppercase opacity-70">Hold</p>
              <p className="mt-3 font-display text-2xl font-medium">{service.name}</p>
              <p className="mt-2 text-sm opacity-80">
                {date ? format(date, "EEEE d MMMM") : "Pick a day"}
                {time ? ` · ${time}` : ""}
              </p>
              <p className="mt-4 text-sm opacity-80">{service.price} · {service.duration} minutes</p>
              <Button
                variant="paper"
                className="mt-6 w-full"
                disabled={!date || !time || confirming}
                onClick={() => void confirm()}
              >
                {user ? (confirming ? "Reserving…" : "Confirm") : "Sign in to confirm"}
              </Button>
              {!user && (
                <p className="mt-3 text-xs opacity-70">
                  The portal is how we hold the appointment.{" "}
                  <Link to="/login" className="underline">
                    Sign in
                  </Link>
                </p>
              )}
            </aside>
          </div>
        )}
      </main>
    </SiteShell>
  );
}
