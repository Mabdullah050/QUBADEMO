import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppShell><SettingsInner /></AppShell>
  ),
});

function SettingsInner() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your workspace preferences.</p>
      </div>
      <Card className="p-6 space-y-5">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? ""} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}
