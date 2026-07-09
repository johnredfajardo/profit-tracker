# Profit Tracker

A personal, offline-first Progressive Web App for tracking profit by recording
income and expenses per record. All data lives in your browser's Local Storage —
there is no backend and no account. Move your data between devices by exporting
and importing JSON or spreadsheet files.

Built with React + Vite, TypeScript, Tailwind CSS, and Zustand.

## Features

- **Dashboard** — every record as a clean card showing title, date, total income,
  total expenses, and net profit, plus aggregate statistics (total profit, income,
  expenses, and record count).
- **Search & sort** — filter by any text; sort by date, profit, income, expenses,
  or title, ascending or descending.
- **Create / edit** — a record has a title, optional description, date, and any
  number of income and expense entries. Totals and net profit update live.
- **Record details** — full ledger breakdown with edit, duplicate, delete, and back.
- **Duplicate** a record in one tap.
- **Settings**
  - Appearance: light, dark, or system theme (persisted).
  - Currency: format every amount in one of several currencies (defaults to ₱ PHP).
  - Export all records as JSON, CSV, or XLSX.
  - Import from JSON, CSV, or XLSX, choosing to **merge** (add to existing, updating
    matching IDs) or **replace** (swap out everything).
  - Delete all records.
- **PWA** — installable, works fully offline, caches its own assets, and shows an
  install prompt when the browser offers one.
- **Toasts** for create, update, delete, import, and export.
- **Confirmation dialogs** before any destructive action.
- Mobile-first, responsive, keyboard-accessible, with reduced-motion support.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Build and preview a production bundle:

```bash
npm run build    # type-check + build into dist/
npm run preview  # serve the built app locally
```

> The service worker and install prompt only run on the built app served over
> http(s) — use `npm run preview` (or deploy) to test offline/install behavior,
> not the dev server.

## Deploying

`npm run build` produces a static `dist/` folder you can host anywhere (Netlify,
Vercel, GitHub Pages, any static host). The app uses hash-based routing, so it
works on static hosts without any SPA rewrite rules.

## Moving data between devices

Because everything is stored locally, use **Settings → Export** on the first
device and **Settings → Import** on the second. JSON keeps a perfect copy;
CSV/XLSX are convenient for editing in a spreadsheet — each income/expense entry
becomes one row, grouped back into records on import.

## Project structure

```
src/
├── components/
│   ├── dashboard/   StatsBar, SearchSortBar
│   ├── layout/      AppLayout, PageHeader, InstallPrompt
│   ├── records/     RecordCard, RecordForm, TransactionEditor
│   └── ui/          Button, Card, Field, Modal, ConfirmDialog, Toaster, Money, …
├── hooks/           useTheme, useToast, useInstallPrompt
├── lib/             calculations, stats, format, normalize, exporters, importers
├── pages/           Dashboard, RecordFormPage, RecordDetailsPage, Settings
├── store/           useRecordStore, useSettingsStore (Zustand + persist)
├── types/           shared TypeScript types
├── App.tsx          routes
└── main.tsx         entry
```

### State & persistence

Two Zustand stores, each persisted to Local Storage:

- `useRecordStore` (`profit-tracker-records`) — the records and all CRUD,
  duplicate, and import operations. Totals are always recomputed from entries,
  so imported files can never carry stale numbers.
- `useSettingsStore` (`profit-tracker-settings`) — theme, currency, and sort
  preferences. The theme is also read by a tiny inline script in `index.html`
  before first paint to avoid a flash of the wrong theme.

## Tech

React 18, Vite 5, TypeScript, Tailwind CSS 3, Zustand 4, `vite-plugin-pwa`
(Workbox), and SheetJS (`xlsx`) — lazy-loaded only when you import or export a
spreadsheet, so it stays out of the initial bundle.
