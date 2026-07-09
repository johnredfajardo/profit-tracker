import { useSettingsStore } from '@/store/useSettingsStore'
import type { SortKey } from '@/types'
import { Input, Select } from '@/components/ui/Field'
import { IconButton } from '@/components/ui/IconButton'
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from '@/components/ui/icons'

const sortLabels: Record<SortKey, string> = {
  date: 'Date',
  profit: 'Profit',
  income: 'Income',
  expenses: 'Expenses',
  title: 'Title',
}

export function SearchSortBar({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (value: string) => void
}) {
  const { sortKey, sortDirection, setSort } = useSettingsStore()

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <SearchIcon />
        </span>
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search records"
          aria-label="Search records"
          className="pl-9"
        />
      </div>

      <Select
        value={sortKey}
        onChange={(e) => setSort(e.target.value as SortKey, sortDirection)}
        aria-label="Sort by"
        className="w-auto"
      >
        {Object.entries(sortLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <IconButton
        label={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        onClick={() =>
          setSort(sortKey, sortDirection === 'asc' ? 'desc' : 'asc')
        }
        className="shrink-0 border border-slate-200 dark:border-slate-700"
      >
        {sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </IconButton>
    </div>
  )
}
