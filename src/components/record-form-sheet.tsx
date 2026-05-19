import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Record } from "@/lib/records";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Record | null;
  onSubmit: (data: Omit<Record, "id">) => Promise<void>;
};

const empty: Omit<Record, "id"> = {
  date: new Date().toISOString().slice(0, 10),
  name: "",
  phone: "",
  amount: 0,
  accountRef: "",
  purpose: "",
  address: "",
};

export function RecordFormSheet({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Record, "id">>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : empty);
      setSaving(false);
    }
  }, [open, initial]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Record" : "Add New Record"}</SheetTitle>
          <SheetDescription>
            {initial ? "Update the details below." : "Fill in the client's contribution details."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="grid gap-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" min={0} required value={form.amount} onChange={(e) => update("amount", Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254 …" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ref">Account Ref.</Label>
              <Input id="ref" required value={form.accountRef} onChange={(e) => update("accountRef", e.target.value)} placeholder="REF-1042" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purpose">Purpose</Label>
            <Input id="purpose" required value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Tithe, Offering, Building Fund…" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" required rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, City" />
          </div>

          <SheetFooter className="mt-2 flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</>
              ) : initial ? "Save changes" : "Create record"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
