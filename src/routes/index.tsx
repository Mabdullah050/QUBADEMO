import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ClientRecordsTable } from "@/components/client-records-table";
import { useRecords } from "@/lib/records";
import { formatPkr } from "@/lib/utils";
import { Users, Wallet, Activity, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function StatCard({
  label, value, hint, icon: Icon, accent,
}: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }>; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-2 tracking-tight text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            {hint}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { records } = useRecords();
  const total = records.reduce((s, r) => s + r.amount, 0);
  
  // Calculate records from the last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= sevenDaysAgo && recordDate <= now;
  }).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your client records and contribution activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Total Records"
          value={records.length.toString()}
          hint="+12% vs last month"
          icon={Users}
          accent="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Total Amount Donated"
          value={formatPkr(total)}
          hint="+8.2% vs last month"
          icon={Wallet}
          accent="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Recent Activity"
          value={`${recent} entries`}
          hint="In the last 7 days"
          icon={Activity}
          accent="bg-amber-100 text-amber-700"
        />
      </div>

      <ClientRecordsTable />
    </div>
  );
}
