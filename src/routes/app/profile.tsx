import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/lib/server/client-fns";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Profile — Halden" }] }),
});

function Profile() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const [name, setName] = useState("");
  const [tz, setTz] = useState("America/Los_Angeles");
  useEffect(() => {
    if (q.data) {
      setName(q.data.display_name ?? "");
      setTz(q.data.timezone);
    }
  }, [q.data]);
  const save = useMutation({
    mutationFn: () => updateProfile({ data: { displayName: name, timezone: tz } }),
    onSuccess: () => {
      toast.success("Saved.");
      void qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return (
    <main className="mx-auto max-w-xl px-5 py-8 md:px-8">
      <h1 className="font-display text-display-sm font-medium">Profile</h1>
      <p className="mt-2 text-sm text-muted">{user?.primaryEmail}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="n">Name</Label>
          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tz">Timezone</Label>
          <Input id="tz" value={tz} onChange={(e) => setTz(e.target.value)} />
        </div>
        <Button type="submit" disabled={save.isPending}>
          Save
        </Button>
      </form>
      <div className="mt-10 space-y-3 text-sm">
        <Link to="/privacy" className="block text-sage">
          Privacy
        </Link>
        <Link to="/studio" className="block text-sage">
          Open coach studio
        </Link>
        <button type="button" className="text-muted underline-offset-4 hover:underline" onClick={() => void signOut()}>
          Sign out
        </button>
      </div>
    </main>
  );
}
