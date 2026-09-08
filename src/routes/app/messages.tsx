import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "@/lib/server/client-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatWhen } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/messages")({
  component: Messages,
  head: () => ({ meta: [{ title: "Messages — Halden" }] }),
});

function Messages() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["messages"], queryFn: () => getMessages() });
  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: () => sendMessage({ data: { body } }),
    onSuccess: () => {
      setBody("");
      void qc.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return (
    <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">With Aria</h1>
      <p className="mt-2 text-sm text-muted">Studio days: Tuesday through Friday. Not for emergencies.</p>
      <div className="mt-6 flex-1 space-y-4">
        {q.isPending && <p className="text-sm text-muted">Loading the thread…</p>}
        {q.data?.length === 0 && (
          <p className="rounded-xl bg-surface p-6 text-sm text-muted">
            No notes yet. Start with the truth of the week.
          </p>
        )}
        {q.data?.map((m) => (
          <article
            key={m.id}
            className={cn(
              "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
              m.author === "coach" ? "bg-sage text-sage-fg" : "ml-auto bg-surface text-ink",
            )}
          >
            <p>{m.body}</p>
            <p className={cn("mt-2 text-[10px]", m.author === "coach" ? "opacity-70" : "text-muted")}>
              {m.author === "coach" ? "Aria" : "You"} · {formatWhen(m.created_at)}
            </p>
          </article>
        ))}
      </div>
      <form
        className="sticky bottom-20 mt-6 flex gap-2 bg-paper py-3 md:bottom-0"
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) send.mutate();
        }}
      >
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write to Aria…"
          className="min-h-12"
        />
        <Button type="submit" disabled={send.isPending || !body.trim()}>
          Send
        </Button>
      </form>
    </main>
  );
}
