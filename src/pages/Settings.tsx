import { useRef, useState } from 'react'
import { useRecordStore } from '@/store/useRecordStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { toast } from '@/hooks/useToast'
import { exportJSON, exportSpreadsheet } from '@/lib/exporters'
import { parseImportFile } from '@/lib/importers'
import { CURRENCIES } from '@/lib/format'
import type { ImportMode, Theme } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Field, Select } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { SegmentOption } from '@/components/ui/SegmentedControl'
import {
  DownloadIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UploadIcon,
} from '@/components/ui/icons'
import type { ProfitRecord } from '@/types'

const themeOptions: SegmentOption<Theme>[] = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { value: 'system', label: 'System', icon: <MonitorIcon /> },
]

export function Settings() {
  const records = useRecordStore((s) => s.records)
  const importRecords = useRecordStore((s) => s.importRecords)
  const clearAll = useRecordStore((s) => s.clearAll)
  const { theme, setTheme, currency, setCurrency } = useSettingsStore()
  const { canInstall, installed, promptInstall } = useInstallPrompt()

  const fileInput = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<ProfitRecord[] | null>(null)
  const [clearing, setClearing] = useState(false)

  const handleExportJSON = () => {
    if (records.length === 0) return toast.error('Nothing to export yet')
    exportJSON(records)
    toast.success('Exported as JSON')
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (records.length === 0) return toast.error('Nothing to export yet')
    await exportSpreadsheet(records, format)
    toast.success(`Exported as ${format.toUpperCase()}`)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const parsed = await parseImportFile(file)
      setPendingImport(parsed)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed')
    } finally {
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const runImport = (mode: ImportMode) => {
    if (!pendingImport) return
    const count = importRecords(pendingImport, mode)
    toast.success(
      `Imported ${count} ${count === 1 ? 'record' : 'records'} (${mode})`,
    )
    setPendingImport(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Settings
      </h1>

      <SettingsSection title="Appearance" description="Choose how the app looks.">
        <SegmentedControl
          ariaLabel="Theme"
          options={themeOptions}
          value={theme}
          onChange={setTheme}
        />
      </SettingsSection>

      <SettingsSection
        title="Currency"
        description="Used to format every amount across the app."
      >
        <Field>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Currency"
          >
            {Object.entries(CURRENCIES).map(([code, { label }]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </SettingsSection>

      <SettingsSection
        title="Export records"
        description="Download a backup you can move to another device."
      >
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" onClick={handleExportJSON}>
            JSON
          </Button>
          <Button variant="secondary" onClick={() => handleExport('csv')}>
            CSV
          </Button>
          <Button variant="secondary" onClick={() => handleExport('xlsx')}>
            XLSX
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Import records"
        description="Load a JSON, CSV, or XLSX file. You'll choose whether to merge or replace."
      >
        <input
          ref={fileInput}
          type="file"
          accept=".json,.csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          variant="secondary"
          fullWidth
          onClick={() => fileInput.current?.click()}
        >
          <UploadIcon />
          Choose file
        </Button>
      </SettingsSection>

      {!installed && canInstall && (
        <SettingsSection
          title="Install app"
          description="Add Profit Tracker to your home screen for offline use."
        >
          <Button variant="secondary" fullWidth onClick={promptInstall}>
            <DownloadIcon />
            Install app
          </Button>
        </SettingsSection>
      )}

      <SettingsSection
        title="Danger zone"
        description="Permanently delete all records from this device."
      >
        <Button
          variant="danger"
          fullWidth
          onClick={() => setClearing(true)}
          disabled={records.length === 0}
        >
          Delete all records
        </Button>
      </SettingsSection>

      <p className="pt-2 text-center text-xs text-slate-400 dark:text-slate-600">
        Profit Tracker · data stays on this device
      </p>

      {/* Import mode chooser */}
      <Modal
        open={!!pendingImport}
        onClose={() => setPendingImport(null)}
        title="Import records"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Found{' '}
          <strong className="text-slate-900 dark:text-white">
            {pendingImport?.length}
          </strong>{' '}
          {pendingImport?.length === 1 ? 'record' : 'records'}. How should they be
          added?
        </p>
        <div className="mt-5 space-y-2">
          <ImportChoice
            title="Merge"
            description="Keep existing records and add these. Matching IDs are updated."
            onClick={() => runImport('merge')}
          />
          <ImportChoice
            title="Replace"
            description="Delete all current records and use only the imported ones."
            danger
            onClick={() => runImport('replace')}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={clearing}
        title="Delete all records?"
        message="Every record on this device will be permanently removed. Export a backup first if you want to keep a copy."
        confirmLabel="Delete everything"
        destructive
        onConfirm={() => {
          clearAll()
          toast.success('All records deleted')
          setClearing(false)
        }}
        onCancel={() => setClearing(false)}
      />
    </div>
  )
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="p-4">
      <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mb-3 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {children}
    </Card>
  )
}

function ImportChoice({
  title,
  description,
  danger,
  onClick,
}: {
  title: string
  description: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
    >
      <span
        className={
          danger
            ? 'text-sm font-semibold text-expense'
            : 'text-sm font-semibold text-slate-900 dark:text-white'
        }
      >
        {title}
      </span>
      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
        {description}
      </span>
    </button>
  )
}
