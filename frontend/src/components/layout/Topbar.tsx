'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/common/Icons'
import { useDashboard } from '@/context/DashboardContext'

export default function Topbar() {
  const pathname = usePathname()
  const { toggleSidebar, subCrumbs, setSubCrumbs, notify, role, openLogoutModal } = useDashboard()

  const isDirector = pathname.startsWith('/director') || role === 'direktur'
  const isFinance = pathname.startsWith('/finance') || role === 'keuangan'

  // Module info based on pathname
  const getModuleInfo = (): { name: string; href: string } => {
    if (pathname === '/finance') {
      return { name: 'Dasbor Keuangan', href: '/finance' }
    }
    if (pathname.startsWith('/finance/verifikasi-dana-masuk')) {
      return { name: 'Verifikasi Dana Masuk', href: '/finance/verifikasi-dana-masuk' }
    }
    if (pathname.startsWith('/finance/pencairan-anggaran') || pathname.startsWith('/finance/disbursement')) {
      return { name: 'Pencairan Anggaran', href: '/finance/pencairan-anggaran' }
    }
    if (pathname.startsWith('/finance/verifikasi-bukti-ca') || pathname.startsWith('/finance/laporan-ca')) {
      return { name: 'Verifikasi Bukti CA', href: '/finance/verifikasi-bukti-ca' }
    }
    if (pathname.startsWith('/finance/fiksasi-sumber-dana')) {
      return { name: 'Fiksasi Sumber Dana', href: '/finance/fiksasi-sumber-dana' }
    }
    if (pathname.startsWith('/finance/review-approval-rab') || pathname.startsWith('/finance/verifikasi-rab')) {
      return { name: 'Review & Approval RAB', href: '/finance/review-approval-rab' }
    }
    if (pathname === '/director') {
      return { name: 'Ringkasan', href: '/director' }
    }
    if (pathname.startsWith('/director/approval-proposal')) {
      return { name: 'Approval Proposal', href: '/director/approval-proposal' }
    }
    if (pathname.startsWith('/director/approval-dss') || pathname.startsWith('/director/approval-rab')) {
      return { name: 'Approval DSS', href: '/director/approval-dss' }
    }
    if (pathname.startsWith('/director/approval-laporan')) {
      return { name: 'Approval Laporan', href: '/director/approval-laporan' }
    }
    if (pathname.startsWith('/dashboard/request-program')) {
      return { name: 'Request Program', href: '/dashboard/request-program' }
    }
    if (pathname.startsWith('/dashboard/assessment')) {
      return { name: 'Assessment', href: '/dashboard/assessment' }
    }
    if (pathname.startsWith('/dashboard/proposal')) {
      return { name: 'Proposal', href: '/dashboard/proposal' }
    }
    const slugMap: Record<string, string> = {
      mipro: 'MIPro',
      dss: 'DSS (RAB)',
      spk: 'SPK',
      monev: 'Monitoring & Evaluasi',
      'laporan-ca': 'Laporan & CA',
      'laporan-final': 'Laporan Final',
    }
    for (const [slug, label] of Object.entries(slugMap)) {
      if (pathname.startsWith(`/dashboard/${slug}`)) {
        return { name: label, href: `/dashboard/${slug}` }
      }
    }
    return { name: 'Dashboard', href: '/dashboard' }
  }

  const currentModule = getModuleInfo()

  // Build breadcrumbs
  const crumbs: { label: string; href?: string; onClick?: () => void }[] = isFinance
    ? [{ label: 'Ruang kerja keuangan', href: '/finance', onClick: () => setSubCrumbs([]) }]
    : isDirector
    ? [{ label: 'Ruang direktur', href: '/director', onClick: () => setSubCrumbs([]) }]
    : [{ label: 'Ruang kerja program', href: '/dashboard', onClick: () => setSubCrumbs([]) }]

  if (isFinance) {
    if (currentModule.name !== 'Dasbor Keuangan' || subCrumbs.length > 0) {
      crumbs.push({
        label: currentModule.name,
        href: currentModule.href,
        onClick: () => setSubCrumbs([]),
      })
    } else {
      crumbs.push({ label: 'Dasbor' })
    }
  } else if (isDirector) {
    if (currentModule.name !== 'Ringkasan' || subCrumbs.length > 0) {
      crumbs.push({
        label: currentModule.name,
        href: currentModule.href,
        onClick: () => setSubCrumbs([]),
      })
    } else {
      crumbs.push({ label: 'Ringkasan' })
    }
  } else {
    if (currentModule.name !== 'Dashboard' || subCrumbs.length > 0) {
      crumbs.push({
        label: currentModule.name,
        href: currentModule.href,
        onClick: () => setSubCrumbs([]),
      })
    } else {
      crumbs.push({ label: 'Dashboard' })
    }
  }

  subCrumbs.forEach((sub, i) => {
    crumbs.push({
      label: sub,
      onClick: i < subCrumbs.length - 1 ? () => setSubCrumbs(subCrumbs.slice(0, i + 1)) : undefined,
    })
  })

  return (
    <header className="db-topbar border-b border-app-border bg-white">
      <div className="db-top-left">
        <button
          type="button"
          className="db-hamburger-btn"
          aria-label="Toggle menu navigasi"
          onClick={toggleSidebar}
          title="Buka / Tutup Sidebar"
        >
          <Icon name="menu" size={19} />
        </button>

        <nav className="db-breadcrumb" aria-label="Navigasi halaman">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1

            return (
              <span
                key={`${crumb.label}-${idx}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}
              >
                {idx > 0 && (
                  <span className="db-crumb-sep">
                    <Icon name="chevronRight" size={13} />
                  </span>
                )}
                {isLast ? (
                  <strong className="db-crumb-current">{crumb.label}</strong>
                ) : crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="db-crumb-btn"
                    onClick={crumb.onClick}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="db-crumb-btn"
                    onClick={crumb.onClick}
                  >
                    {crumb.label}
                  </button>
                )}
              </span>
            )
          })}
        </nav>
      </div>

      <div className="db-top-actions">
        {/* Search */}
        <label className="db-search border border-app-border bg-app-bg focus-within:border-teal">
          <Icon name="search" size={16} />
          <input
            placeholder={
              isFinance
                ? 'Cari anggaran, RAB, atau SPK pencairan...'
                : isDirector
                ? 'Cari pengajuan, proposal, atau RAB...'
                : 'Cari program atau dokumen...'
            }
          />
        </label>

        {/* Notifications */}
        <button
          className="db-icon-btn db-has-dot"
          aria-label="Notifikasi"
          onClick={() =>
            notify(
              isFinance
                ? 'Ada pengajuan anggaran yang menunggu verifikasi keuangan.'
                : isDirector
                ? 'Ada 6 dokumen pengajuan menunggu keputusan Anda.'
                : 'Anda memiliki 8 tugas yang perlu diperhatikan.'
            )
          }
        >
          <Icon name="bell" size={19} />
        </button>

        {/* User Profile Pill */}
        <div
          className="db-user-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 8px',
            userSelect: 'none',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
          }}
        >
          <span className="db-avatar small" style={{ margin: 0 }}>
            {isFinance ? 'SR' : isDirector ? 'AP' : 'CK'}
          </span>
          <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--db-text, #172324)' }}>
              {isFinance ? 'Siti Rahma' : isDirector ? 'Aditya Pratama' : 'Cikipi'}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--db-muted, #79898a)' }}>
              {isFinance ? 'Divisi Keuangan' : isDirector ? 'Direktur Utama' : 'Tim Program'}
            </div>
          </div>
          <button
            type="button"
            aria-label="Keluar / Logout"
            title="Keluar dari akun"
            onClick={openLogoutModal}
            style={{
              border: 0,
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.background = '#fee2e2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <Icon name="logout" size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
