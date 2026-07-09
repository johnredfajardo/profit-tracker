import { useNavigate } from "react-router-dom";
import type { ProfitRecord } from "@/types";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Money } from "@/components/ui/Money";
import { CopyIcon, EditIcon, TrashIcon } from "@/components/ui/icons";

type RecordCardProps = {
  record: ProfitRecord;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (record: ProfitRecord) => void;
};

export function RecordCard({
  record,
  onEdit,
  onDuplicate,
  onDelete,
}: RecordCardProps) {
  const navigate = useNavigate();
  const open = () => navigate(`/record/${record.id}`);

  return (
    <Card interactive className="p-4">
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={open}
          className="min-w-0 flex-1 text-left focus:outline-none"
        >
          <h3 className="truncate font-display text-base font-semibold text-slate-900 dark:text-white">
            {record.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            {formatDate(record.date)}
          </p>
        </button>

        <div className="flex shrink-0 items-center">
          <IconButton label="Edit record" onClick={() => onEdit(record.id)}>
            <EditIcon />
          </IconButton>
          <IconButton
            label="Duplicate record"
            onClick={() => onDuplicate(record.id)}
          >
            <CopyIcon />
          </IconButton>
          <IconButton
            label="Delete record"
            tone="danger"
            onClick={() => onDelete(record)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <button
        onClick={open}
        className="mt-3 grid w-full grid-cols-3 gap-2 text-left focus:outline-none"
      >
        <Column label="Income" amount={record.totalIncome} tone="income" />
        <Column label="Expenses" amount={record.totalExpenses} tone="expense" />
        <Column label="Profit" amount={record.profit} tone="profit" signed />
      </button>
    </Card>
  );
}

function Column({
  label,
  amount,
  tone,
  signed,
}: {
  label: string;
  amount: number;
  tone: "income" | "expense" | "profit";
  signed?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <Money
        amount={amount}
        tone={tone}
        signed={signed}
        className="mt-0.5 block text-sm font-semibold"
      />
    </div>
  );
}
