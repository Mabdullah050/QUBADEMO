import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Search, Plus } from "lucide-react";
import { useRecords, type Record } from "@/lib/records";
import { formatPkr } from "@/lib/utils";
import { RecordFormSheet } from "./record-form-sheet";

const PAGE_SIZE = 6;

export function RecordsTable() {
  const { records, loading, refreshRecords, addRecord, updateRecord, deleteRecord } = useRecords();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Record | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void refreshRecords();
  }, [refreshRecords]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.name, r.phone, r.accountRef, r.purpose, r.address].some((v) => v.toLowerCase().includes(q))
    );
  }, [records, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAdd = () => { setEditing(null); setSheetOpen(true); };
  const openEdit = (r: Record) => { setEditing(r); setSheetOpen(true); };

  const handleSubmit = async (data: Omit<Record, "id">) => {
    if (editing) await updateRecord(editing.id, data);
    else await addRecord(data);
  };

  const deleteTarget = records.find((r) => r.id === deletingId);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b">
        <div>
          <h2 className="text-lg font-semibold">All Records</h2>
          <p className="text-sm text-muted-foreground">Manage client contributions and details.</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add New Record
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Account Ref.</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  Loading records…
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  No records found.
                </TableCell>
              </TableRow>
            ) : paged.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30">
                <TableCell className="whitespace-nowrap text-muted-foreground">{r.date}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="whitespace-nowrap">{r.phone}</TableCell>
                <TableCell className="text-right font-semibold">{formatPkr(r.amount)}</TableCell>
                <TableCell><Badge variant="secondary" className="font-mono text-xs">{r.accountRef}</Badge></TableCell>
                <TableCell>{r.purpose}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{r.address}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingId(r.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Showing {paged.length} of {filtered.length} records
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="text-sm px-2">Page {currentPage} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>

      <RecordFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-medium text-foreground">{deleteTarget?.name}</span>'s record.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingId) await deleteRecord(deletingId);
                setDeletingId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
