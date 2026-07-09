import { useNavigate, useParams } from "react-router-dom";
import { useRecordStore } from "@/store/useRecordStore";
import { toast } from "@/hooks/useToast";
import type { RecordDraft } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { RecordForm } from "@/components/records/RecordForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function RecordFormPage({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const getRecord = useRecordStore((s) => s.getRecord);
  const createRecord = useRecordStore((s) => s.createRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);

  const existing = mode === "edit" && id ? getRecord(id) : undefined;

  if (mode === "edit" && !existing) {
    return (
      <div>
        <PageHeader title="Edit record" onBack={() => navigate("/")} />
        <EmptyState
          title="Record not found"
          description="This record may have been deleted."
          action={
            <Button onClick={() => navigate("/")}>Back to records</Button>
          }
        />
      </div>
    );
  }

  const initial: RecordDraft | undefined = existing
    ? {
        title: existing.title,
        description: existing.description ?? "",
        date: existing.date,
        income: existing.income,
        expenses: existing.expenses,
      }
    : undefined;

  const handleSubmit = (draft: RecordDraft) => {
    if (mode === "edit" && existing) {
      updateRecord(existing.id, draft);
      toast.success("Record updated");
      navigate(`/record/${existing.id}`);
    } else {
      const created = createRecord(draft);
      toast.success("Record created");
      navigate(`/record/${created.id}`);
    }
  };

  return (
    <div>
      <PageHeader
        title={mode === "edit" ? "Edit record" : "New record"}
        onBack={() => navigate(-1)}
      />
      <RecordForm
        initial={initial}
        submitLabel={mode === "edit" ? "Save changes" : "Create record"}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
