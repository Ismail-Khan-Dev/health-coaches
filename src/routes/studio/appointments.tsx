import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, format, startOfWeek } from "date-fns";

export const Route = createFileRoute("/studio/appointments")({
  component: StudioCalendar,
  head: () => ({ meta: [{ title: "Calendar — Studio" }] }),
});

const NAMES = ["Priya Raman", "Eliot Hart", "Nadia Okonkwo", "Thomas Berg", "Camille Renard"];

function StudioCalendar() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(start, i));
  const slots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">This week</h1>
      <p className="mt-2 text-sm text-muted">Studio days. White space is protected on purpose.</p>
      <div className="mt-8 overflow-x-auto">
        <div className="grid min-w-[40rem] grid-cols-6 gap-px rounded-xl bg-line p-px">
          <div className="bg-surface p-3 text-xs text-muted">Time</div>
          {days.map((d) => (
            <div key={d.toISOString()} className="bg-surface p-3 text-xs font-medium">
              {format(d, "EEE d")}
            </div>
          ))}
          {slots.map((t, si) => (
            <Fragment key={t}>
              <div className="bg-surface p-3 text-xs tabular-nums text-muted">{t}</div>
              {days.map((d, di) => {
                const fill = (si + di) % 4 === 0;
                const name = NAMES[(si + di) % NAMES.length];
                return (
                  <div key={`${t}-${d.toISOString()}`} className="min-h-16 bg-paper p-2">
                    {fill ? (
                      <div className="rounded-md bg-sage/10 px-2 py-2 text-xs text-sage">{name}</div>
                    ) : null}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}
