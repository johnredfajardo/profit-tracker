import type { Transaction } from "@/types";
import { uid } from "@/lib/id";
import { Input } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Money } from "@/components/ui/Money";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type TransactionEditorProps = {
  title: string;
  tone: "income" | "expense";
  items: Transaction[];
  total: number;
  onChange: (items: Transaction[]) => void;
};

export function TransactionEditor({
  title,
  tone,
  items,
  total,
  onChange,
}: TransactionEditorProps) {
  const update = (id: string, patch: Partial<Transaction>) =>
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  const remove = (id: string) =>
    onChange(items.filter((item) => item.id !== id));

  const add = () =>
    onChange([...items, { id: uid(), description: "", amount: 0 }]);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              tone === "income" ? "bg-income" : "bg-expense",
            )}
          />
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <Money amount={total} tone={tone} className="text-sm font-semibold" />
      </div>

      <div className="space-y-2 divide-y divide-slate-200 dark:divide-slate-800 md:divide-y-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center md:flex-row flex-col-reverse gap-2 pb-2 first:pt-0 md:pt-0"
          >
            <Input
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Description"
              aria-label={`${title} description`}
              className="flex-1"
            />
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={item.amount === 0 ? "" : item.amount}
              onChange={(e) =>
                update(item.id, {
                  amount: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              placeholder="0.00"
              aria-label={`${title} amount`}
              className="text-left md:text-right font-mono tabular-nums w-auto md:w-[20%]"
            />
            <IconButton
              label="Remove entry"
              tone="danger"
              onClick={() => remove(item.id)}
              className="shrink-0 self-end md:self-center"
            >
              <TrashIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className={cn(
          "mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-sm font-medium transition-colors",
          tone === "income"
            ? "border-income/40 text-income hover:bg-income-light dark:hover:bg-income/10"
            : "border-expense/40 text-expense hover:bg-expense-light dark:hover:bg-expense/10",
        )}
      >
        <PlusIcon />
        Add {tone === "income" ? "income" : "expense"}
      </button>
    </section>
  );
}
