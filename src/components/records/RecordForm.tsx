import { useMemo, useState } from "react";
import type { RecordDraft, Transaction } from "@/types";
import { deriveTotals } from "@/lib/calculations";
import { nowISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Money } from "@/components/ui/Money";
import { TransactionEditor } from "./TransactionEditor";

function emptyRow(): Transaction {
  return { id: uid(), description: "", amount: 0 };
}

export function RecordForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: RecordDraft;
  submitLabel: string;
  onSubmit: (draft: RecordDraft) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const date = initial?.date ?? nowISO();
  const [income, setIncome] = useState<Transaction[]>(
    initial?.income?.length ? initial.income : [emptyRow()],
  );
  const [expenses, setExpenses] = useState<Transaction[]>(
    initial?.expenses?.length ? initial.expenses : [emptyRow()],
  );
  const [touched, setTouched] = useState(false);

  const totals = useMemo(
    () => deriveTotals({ income, expenses }),
    [income, expenses],
  );

  const titleError = touched && !title.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!title.trim()) return;
    onSubmit({ title, description, date, income, expenses });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" className="sm:col-span-2">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. July 2026"
            aria-invalid={titleError}
          />
          {titleError && (
            <p className="mt-1 text-xs text-expense">
              Give this record a title.
            </p>
          )}
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          className="sm:col-span-2"
        >
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes about this record"
            rows={2}
          />
        </Field>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <TransactionEditor
          title="Income"
          tone="income"
          items={income}
          total={totals.totalIncome}
          onChange={setIncome}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <TransactionEditor
          title="Expenses"
          tone="expense"
          items={expenses}
          total={totals.totalExpenses}
          onChange={setExpenses}
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3.5 text-white dark:bg-slate-800">
        <span className="text-sm font-medium text-slate-300">Net profit</span>
        <Money
          amount={totals.profit}
          tone="profit"
          signed
          className="text-xl font-semibold"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
