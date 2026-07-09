import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecordStore } from "@/store/useRecordStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { toast } from "@/hooks/useToast";
import { computeStats, filterRecords, sortRecords } from "@/lib/stats";
import type { ProfitRecord } from "@/types";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlusIcon, SearchIcon, WalletIcon } from "@/components/ui/icons";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { SearchSortBar } from "@/components/dashboard/SearchSortBar";
import { RecordCard } from "@/components/records/RecordCard";

export function Dashboard() {
  const navigate = useNavigate();
  const records = useRecordStore((s) => s.records);
  const deleteRecord = useRecordStore((s) => s.deleteRecord);
  const duplicateRecord = useRecordStore((s) => s.duplicateRecord);
  const { sortKey, sortDirection } = useSettingsStore();

  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ProfitRecord | null>(null);

  const stats = useMemo(() => computeStats(records), [records]);
  const visible = useMemo(() => {
    const filtered = filterRecords(records, query);
    return sortRecords(filtered, sortKey, sortDirection);
  }, [records, query, sortKey, sortDirection]);

  const handleDuplicate = (id: string) => {
    duplicateRecord(id);
    toast.success("Record duplicated");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteRecord(pendingDelete.id);
    toast.success("Record deleted");
    setPendingDelete(null);
  };

  const hasRecords = records.length > 0;

  return (
    <div className="space-y-5">
      <InstallPrompt />

      <div className="flex items-center justify-between">
        <div className="space-x-1">
          <h1 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
            Your records
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Income, expenses, and profit at a glance.
          </p>
        </div>
        <Button onClick={() => navigate("/new")} className="shrink-0" size="md">
          <PlusIcon />
          New
        </Button>
      </div>

      {hasRecords && <StatsBar stats={stats} />}

      {hasRecords && <SearchSortBar query={query} onQueryChange={setQuery} />}

      {!hasRecords ? (
        <EmptyState
          icon={<WalletIcon />}
          title="No records yet"
          description="Create your first record to start tracking income, expenses, and profit."
          action={
            <Button onClick={() => navigate("/new")}>
              <PlusIcon />
              Create record
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No matches"
          description="No records match your search. Try a different term."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onEdit={(id) => navigate(`/record/${id}/edit`)}
              onDuplicate={handleDuplicate}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete record?"
        message={`"${pendingDelete?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
