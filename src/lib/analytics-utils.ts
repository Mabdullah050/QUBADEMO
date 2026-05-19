import type { Record } from "@/lib/records";

export interface PurposeData {
  name: string;
  value: number;
}

export interface DateTrendData {
  date: string;
  amount: number;
}

/**
 * Group records by purpose and sum amounts
 */
export function groupByPurpose(records: Record[]): PurposeData[] {
  const grouped = records.reduce<Record<string, number>>((acc, record) => {
    if (record.purpose) {
      acc[record.purpose] = (acc[record.purpose] || 0) + record.amount;
    }
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Group records by date and sum amounts to show trend
 */
export function groupByDate(records: Record[]): DateTrendData[] {
  const grouped = records.reduce<Record<string, number>>((acc, record) => {
    const date = record.date;
    acc[date] = (acc[date] || 0) + record.amount;
    return acc;
  }, {});

  // Sort by date and return
  return Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Premium SaaS color palette for charts
 */
export const CHART_COLORS = [
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];
