import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { useRecords } from "@/lib/records";
import { formatPkr } from "@/lib/utils";
import { groupByPurpose, groupByDate, CHART_COLORS } from "@/lib/analytics-utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  component: () => (
    <AppShell><AnalyticsInner /></AppShell>
  ),
});

function AnalyticsInner() {
  const { records, refreshRecords } = useRecords();

  useEffect(() => {
    void refreshRecords();
  }, [refreshRecords]);

  // Process data
  const purposeData = useMemo(() => groupByPurpose(records), [records]);
  const trendData = useMemo(() => groupByDate(records), [records]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive insights into your contribution data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purpose Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Amount by Purpose</h2>
          {purposeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {purposeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatPkr(value)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: "1rem" }}
                  formatter={(value: string) => {
                    const data = purposeData.find(d => d.name === value);
                    return data ? `${value} - ${formatPkr(data.value)}` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend Over Time</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: "#6B7280" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => formatPkr(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatPkr(records.reduce((sum, r) => sum + r.amount, 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{records.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-600">Purposes</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{purposeData.length}</p>
        </div>
      </div>
    </div>
  );
}
