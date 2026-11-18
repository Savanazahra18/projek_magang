'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import LogoutModal from './LogoutModal'
import { Icon } from '@/components/common/Icons'
import { DashboardProvider, useDashboard } from '@/context/DashboardContext'
import '@/app/dashboard/dashboard.css'
import '@/styles/mipro.css'
import '@/styles/spk.css'
import '@/styles/director.css'
import '@/styles/approval-proposal.css'
import '@/styles/logout-modal.css'

function LayoutInner({ children }: { children: ReactNode }) {
  const { sidebarOpen, toast, notify, isLogoutModalOpen, closeLogoutModal } = useDashboard()

  return (
    <div className={`db-app min-h-screen bg-app-bg font-sans ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <Sidebar />
      <div className="db-main min-h-screen">
        <Topbar />
        <main className="db-content bg-app-bg">{children}</main>
        <footer className="db-footer border-t border-app-border bg-app-surface">
          <span>© 2026 Relawan Nusantara. Semua hak dilindungi.</span>
          <div className="db-footer-links">
            <button type="button" onClick={() => notify('Halaman Kebijakan Privasi akan dibuka.')}>
              Kebijakan Privasi
            </button>
            <button type="button" onClick={() => notify('Halaman Syarat & Ketentuan akan dibuka.')}>
              Syarat &amp; Ketentuan
            </button>
            <button type="button" onClick={() => notify('Pusat bantuan Relawan Nusantara siap membantu Anda.')}>
              Pusat bantuan
            </button>
            <button type="button" onClick={() => notify('Bahasa aktif: Bahasa Indonesia.')}>
              <Icon name="globe" size={14} />
              <span>Bahasa Indonesia</span>
            </button>
          </div>
        </footer>
      </div>

      {toast && (
        <div className="db-toast fixed bottom-5 right-5 z-50 rounded-lg border border-app-border bg-app-surface px-4 py-3 shadow-lg" role="status">
          <span><Icon name="check" size={15} /></span>
          <p>{toast}</p>
        </div>
      )}

      {/* Interactive & Animative Logout Confirmation Card */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} />
    </div>
  )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <LayoutInner>{children}</LayoutInner>
    </DashboardProvider>
  )
}

