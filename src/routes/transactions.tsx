import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ClientRecordsTable } from "@/components/client-records-table";

export const Route = createFileRoute("/transactions")({
  component: () => (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">All contribution records.</p>
        </div>
        <ClientRecordsTable />
      </div>
    </AppShell>
  ),
});
