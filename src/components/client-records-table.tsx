import { useState, useEffect } from "react";
import { Edit2, Trash2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRecords } from "@/lib/records";
import { formatPkr } from "@/lib/utils";
import { useSearch } from "@/lib/search-context";

export function ClientRecordsTable() {
  const { records, loading, refreshRecords, addRecord, updateRecord, deleteRecord } = useRecords();
  const { headerSearch } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<typeof records[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableSearch, setTableSearch] = useState("");
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    phone: "",
    amount: "",
    accountRef: "",
    purpose: "",
    address: "",
  });

  // Load records on mount and reset pagination when searches change
  useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  // Reset pagination to page 1 when either search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, headerSearch]);

  // Use only Supabase data (no fallback to mock data)
  // Apply table search (name or phone only) and header search (all text columns)
  const filteredRecords = records.filter((record) => {
    const lowerTableSearch = tableSearch.toLowerCase();
    const lowerHeaderSearch = headerSearch.toLowerCase();

    // Table search: filter by name or phone only
    const matchesTableSearch = !tableSearch || 
      record.name.toLowerCase().includes(lowerTableSearch) ||
      record.phone.toLowerCase().includes(lowerTableSearch);

    // Header search: filter across all text columns
    const matchesHeaderSearch = !headerSearch ||
      record.name.toLowerCase().includes(lowerHeaderSearch) ||
      record.phone.toLowerCase().includes(lowerHeaderSearch) ||
      record.accountRef.toLowerCase().includes(lowerHeaderSearch) ||
      record.purpose.toLowerCase().includes(lowerHeaderSearch) ||
      record.address.toLowerCase().includes(lowerHeaderSearch);

    return matchesTableSearch && matchesHeaderSearch;
  });

  const allRecords = filteredRecords;

  // Pagination logic
  const totalPages = Math.ceil(allRecords.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayRecords = allRecords.slice(indexOfFirstItem, indexOfLastItem);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Client Records</h2>
          <p className="text-sm text-gray-500 mt-1">Manage client contributions and details.</p>
        </div>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or phone…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 px-4 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
              <p className="text-sm text-gray-600">Loading records from Supabase...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && allRecords.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-gray-600">No records found</p>
              <p className="text-xs text-gray-500 mt-1">Click "Add Record" to create your first entry</p>
            </div>
          </div>
        )}

        {/* Horizontal Scroll Wrapper for Mobile */}
        {!loading && allRecords.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* Table Head */}
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Ref.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {displayRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {record.name}
                          {record.is_edited && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-600 border border-yellow-200 cursor-help">
                                    Edited
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="text-xs space-y-2">
                                    <p className="font-semibold text-gray-900">Previous Values:</p>
                                    {record.previous_data ? (
                                      <div className="space-y-1 text-gray-700">
                                        {Object.entries(record.previous_data).map(([key, value]: [string, any]) => (
                                          <div key={key}>
                                            <span className="font-medium">{key}:</span> {String(value)}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-gray-600">No history available</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {record.phone}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                        {formatPkr(record.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {record.accountRef}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {record.purpose}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {record.address}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingRecord(record);
                              setIsEditMode(true);
                              setFormData({
                                date: record.date,
                                name: record.name,
                                phone: record.phone,
                                amount: String(record.amount),
                                accountRef: record.accountRef,
                                purpose: record.purpose,
                                address: record.address,
                              });
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
                                try {
                                  await deleteRecord(record.id);
                                  console.log("✅ Record deleted successfully");
                                } catch (error) {
                                  console.error("❌ Error deleting record:", error);
                                  alert("Failed to delete record. Check console for details.");
                                }
                              }
                            }}
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-3 sm:px-6 rounded-b-xl">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allRecords.length)} of {allRecords.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Record Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setIsEditMode(false);
          setEditingRecord(null);
          setFormData({
            date: new Date().toISOString().split("T")[0],
            name: "",
            phone: "",
            amount: "",
            accountRef: "",
            purpose: "",
            address: "",
          });
        }
      }}>
        <DialogContent className="bg-white rounded-xl border border-gray-200 shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Record" : "Add New Record"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Date and Amount Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="h-9 border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="h-9 border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9 border-gray-200 text-sm"
              />
            </div>

            {/* Phone and Account Ref Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="+92 3XX XXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9 border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountRef" className="text-sm font-medium text-gray-700">
                  Account Ref.
                </Label>
                <Input
                  id="accountRef"
                  type="text"
                  placeholder="REF-1042"
                  value={formData.accountRef}
                  onChange={(e) =>
                    setFormData({ ...formData, accountRef: e.target.value })
                  }
                  className="h-9 border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                Purpose
              </Label>
              <Input
                id="purpose"
                type="text"
                placeholder="HP, Building Fund, Tithe…"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                className="h-9 border-gray-200 text-sm"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Street, City, Postal Code…"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border-gray-200 text-sm resize-none"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  
                  // Validate form data
                  if (!formData.name || !formData.phone || !formData.amount || !formData.date) {
                    console.error("Missing required fields: name, phone, amount, and date are required");
                    alert("Please fill in all required fields: Name, Phone, Amount, and Date");
                    setIsSubmitting(false);
                    return;
                  }
                  
                  if (isEditMode && editingRecord) {
                    // Edit mode: compare old vs new values and store only changed fields
                    const previousData: Record<string, any> = {};
                    let hasChanges = false;

                    // Compare each field
                    if (editingRecord.date !== formData.date) {
                      previousData.date = editingRecord.date;
                      hasChanges = true;
                    }
                    if (editingRecord.name !== formData.name) {
                      previousData.name = editingRecord.name;
                      hasChanges = true;
                    }
                    if (editingRecord.phone !== formData.phone) {
                      previousData.phone = editingRecord.phone;
                      hasChanges = true;
                    }
                    if (String(editingRecord.amount) !== formData.amount) {
                      previousData.amount = editingRecord.amount;
                      hasChanges = true;
                    }
                    if (editingRecord.accountRef !== formData.accountRef) {
                      previousData.accountRef = editingRecord.accountRef;
                      hasChanges = true;
                    }
                    if (editingRecord.purpose !== formData.purpose) {
                      previousData.purpose = editingRecord.purpose;
                      hasChanges = true;
                    }
                    if (editingRecord.address !== formData.address) {
                      previousData.address = editingRecord.address;
                      hasChanges = true;
                    }

                    if (!hasChanges) {
                      console.log("ℹ️ No changes detected");
                      alert("No changes were made to this record.");
                      setIsSubmitting(false);
                      return;
                    }

                    // Update record with comparison data
                    await updateRecord(editingRecord.id, formData, previousData);
                    console.log("✅ Record updated successfully");
                  } else {
                    // Add mode
                    await addRecord(formData);
                    console.log("✅ Record inserted successfully");
                  }
                  
                  // Close modal
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditingRecord(null);
                  
                  // Reset form
                  setFormData({
                    date: new Date().toISOString().split("T")[0],
                    name: "",
                    phone: "",
                    amount: "",
                    accountRef: "",
                    purpose: "",
                    address: "",
                  });
                  
                  // Reset pagination to page 1 to see the new/updated record
                  setCurrentPage(1);
                } catch (error) {
                  console.error("❌ Error saving record:", error);
                  alert("Failed to save record. Check console for details.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Record" : "Save Record")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
