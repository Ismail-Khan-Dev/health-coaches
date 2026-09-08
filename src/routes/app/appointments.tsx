import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelAppointment, getAppointments } from "@/lib/server/client-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatWhen } from "@/lib/format";

export const Route = createFileRoute("/app/appointments")({
  component: Appointments,
  head: () => ({ meta: [{ title: "Appointments — Halden" }] }),
});

function Appointments() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["appts"], queryFn: () => getAppointments() });
  const cancel = useMutation({
    mutationFn: (id: string) => cancelAppointment({ data: { id } }),
    onSuccess: () => {
      toast.success("Released that time.");
      void qc.invalidateQueries({ queryKey: ["appts"] });
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-medium">Appointments</h1>
          <p className="mt-2 text-sm text-muted">Pacific time. Cancel with as much notice as you can.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/book">Book</Link>
        </Button>
      </div>
      {q.isPending && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {q.data?.length === 0 && (
        <p className="mt-8 rounded-xl bg-surface p-6 text-sm text-muted">No sessions on the calendar.</p>
      )}
      <ul className="mt-8 space-y-3">
        {q.data?.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 rounded-xl bg-surface p-4 shadow-soft">
            <div>
              <p className="font-medium">{a.service_name}</p>
              <p className="text-sm text-muted">
                {formatWhen(a.starts_at)} · {a.duration_min} min
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={a.status === "scheduled" ? "sage" : a.status === "cancelled" ? "danger" : "default"}>
                {a.status}
              </Badge>
              {a.status === "scheduled" && (
                <Button size="sm" variant="ghost" onClick={() => cancel.mutate(a.id)}>
                  Cancel
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
