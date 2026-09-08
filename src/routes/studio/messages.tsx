import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStudioHome } from "@/lib/server/studio-fns";

export const Route = createFileRoute("/studio/messages")({
  component: StudioMessages,
  head: () => ({ meta: [{ title: "Messages — Studio" }] }),
});

function StudioMessages() {
  const q = useQuery({ queryKey: ["studio-home"], queryFn: () => getStudioHome() });
  return (
    <main className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">Threads</h1>
      <p className="mt-2 text-sm text-muted">Open a client file to keep the letter with the person.</p>
      <ul className="mt-8 divide-y divide-line rounded-xl bg-surface shadow-soft">
        {q.data?.clients
          .filter((c) => c.status === "active")
          .map((c) => (
            <li key={c.id}>
              <Link
                to="/studio/clients/$id"
                params={{ id: c.id }}
                className="flex items-center justify-between px-4 py-4"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted">{c.note}</p>
                </div>
                <p className="text-xs text-muted">{c.last_checkin}</p>
              </Link>
            </li>
          ))}
      </ul>
    </main>
  );
}
