import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from '@/components/ui/Toaster'
import { Dashboard } from '@/pages/Dashboard'
import { RecordFormPage } from '@/pages/RecordFormPage'
import { RecordDetailsPage } from '@/pages/RecordDetailsPage'
import { Settings } from '@/pages/Settings'

export default function App() {
  useTheme()

  return (
    // HashRouter keeps deep links working when the PWA is opened offline or
    // served from a static host without SPA rewrites.
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new" element={<RecordFormPage mode="create" />} />
          <Route path="record/:id" element={<RecordDetailsPage />} />
          <Route
            path="record/:id/edit"
            element={<RecordFormPage mode="edit" />}
          />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </HashRouter>
  )
}
