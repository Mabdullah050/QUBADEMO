import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { supabase } from "@/supabaseClient";

export type Record = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  phone: string;
  amount: number;
  accountRef: string;
  purpose: string;
  address: string;
  is_edited?: boolean;
  previous_data?: Record<string, any>;
};

type RecordsContextValue = {
  records: Record[];
  loading: boolean;
  refreshRecords: () => Promise<void>;
  addRecord: (r: Omit<Record, "id">) => Promise<void>;
  updateRecord: (id: string, r: Omit<Record, "id">) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
};

const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRecords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_records")
      .select("*")
      .order("record_date", { ascending: false });
    if (error) {
      console.error("Failed to load records", error);
      setLoading(false);
      return;
    }
    setRecords(
      ((data ?? []) as any[]).map((row) => ({
        id: row.id,
        date: row.record_date,
        name: row.name,
        phone: row.phone,
        amount: row.amount,
        accountRef: row.account_ref,
        purpose: row.purpose,
        address: row.address,
        is_edited: row.is_edited,
        previous_data: row.previous_data,
      }))
    );
    setLoading(false);
  }, []);

  const addRecord = useCallback(
    async (r: Omit<Record, "id">) => {
      const { error } = await supabase.from("client_records").insert({
        record_date: r.date,
        name: r.name,
        phone: r.phone,
        amount: r.amount,
        account_ref: r.accountRef,
        purpose: r.purpose,
        address: r.address,
      });
      if (error) {
        console.error("Failed to add record", error);
        return;
      }
      await refreshRecords();
    },
    [refreshRecords]
  );

  const updateRecord = useCallback(
    async (
      id: string,
      r: Omit<Record, "id">,
      previousData?: Record<string, any>
    ) => {
      const { error } = await supabase.from("client_records").update({
        record_date: r.date,
        name: r.name,
        phone: r.phone,
        amount: r.amount,
        account_ref: r.accountRef,
        purpose: r.purpose,
        address: r.address,
        is_edited: true,
        previous_data: previousData || null,
      }).eq("id", id);
      if (error) {
        console.error("Failed to update record", error);
        return;
      }
      await refreshRecords();
    },
    [refreshRecords]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("client_records").delete().eq("id", id);
      if (error) {
        console.error("Failed to delete record", error);
        return;
      }
      await refreshRecords();
    },
    [refreshRecords]
  );

  return (
    <RecordsContext.Provider value={{ records, loading, refreshRecords, addRecord, updateRecord, deleteRecord }}>
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error("useRecords must be used within RecordsProvider");
  return ctx;
}
