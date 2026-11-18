'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Icon, IconName } from '@/components/common/Icons'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'

interface MenuItem {
  label: string
  href: string
  icon: IconName
  implemented: boolean
  badge?: string
}

const programMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'grid', implemented: true },
  { label: 'Request Program', href: '/dashboard/request-program', icon: 'inbox', implemented: true },
  { label: 'Assessment', href: '/dashboard/assessment', icon: 'clipboard', implemented: true },
  { label: 'Proposal', href: '/dashboard/proposal', icon: 'file', implemented: true },
  { label: 'MIPro', href: '/dashboard/mipro', icon: 'layers', implemented: true },
  { label: 'DSS (RAB)', href: '/dashboard/dss', icon: 'calc', implemented: true },
  { label: 'SPK', href: '/dashboard/spk', icon: 'fileText', implemented: true },
  { label: 'Monev', href: '/dashboard/monev', icon: 'pulse', implemented: true },
  { label: 'Laporan & CA', href: '/dashboard/laporan-ca', icon: 'chart', implemented: false },
  { label: 'Laporan Final', href: '/dashboard/laporan-final', icon: 'files', implemented: false },
]

const directorMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/director', icon: 'grid', implemented: true },
  { label: 'Approval Proposal', href: '/director/approval-proposal', icon: 'checkCircle', implemented: true, badge: '0' },
  { label: 'Approval DSS', href: '/director/approval-dss', icon: 'file', implemented: true, badge: '0' },
  { label: 'Approval Laporan', href: '/director/approval-laporan', icon: 'fileCheck', implemented: false },
]

const financeMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/finance', icon: 'grid', implemented: true },
  { label: 'Verifikasi Dana Masuk', href: '/finance/verifikasi-dana-masuk', icon: 'inbox', implemented: true },
  { label: 'Pencairan Anggaran', href: '/finance/pencairan-anggaran', icon: 'send', implemented: true, badge: '0' },
  { label: 'Verifikasi Bukti CA', href: '/finance/verifikasi-bukti-ca', icon: 'fileCheck', implemented: true },
  { label: 'Fiksasi Sumber Dana', href: '/finance/fiksasi-sumber-dana', icon: 'layers', implemented: true },
  { label: 'Review & Approval RAB', href: '/finance/review-approval-rab', icon: 'calc', implemented: true, badge: '0' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, setRole, setSubCrumbs, notify, openLogoutModal } = useDashboard()

  const isDirector = pathname.startsWith('/director') || role === 'direktur'
  const isFinance = pathname.startsWith('/finance') || role === 'keuangan'
  const [proposalWaitingCount, setProposalWaitingCount] = useState<number>(0)
  const [dssWaitingCount, setDssWaitingCount] = useState<number>(0)
  const [spkCount, setSpkCount] = useState<number>(0)

  useEffect(() => {
    if (isDirector || isFinance) {
      api.getProposals()
        .then((res) => {
          if (res && res.counts && typeof res.counts.dalamTinjauan === 'number') {
            setProposalWaitingCount(res.counts.dalamTinjauan)
          }
        })
        .catch(() => {})

      api.getDssEvaluations()
        .then((res) => {
          if (res && res.counts && typeof res.counts.dalamTelaah === 'number') {
            setDssWaitingCount(res.counts.dalamTelaah)
          }
        })
        .catch(() => {})

      api.getSpkList()
        .then((res) => {
          const list = res?.spks || res?.data
          if (Array.isArray(list)) {
            setSpkCount(list.length)
          }
        })
        .catch(() => {})
    }
  }, [isDirector, isFinance, pathname])

  const activeMenuItems = isFinance ? financeMenuItems : isDirector ? directorMenuItems : programMenuItems

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (!item.implemented) {
      e.preventDefault()
      notify(`Modul ${item.label} akan segera tersedia.`)
      return
    }
    setSubCrumbs([])
  }

  const handleLogout = () => {
    openLogoutModal()
  }

  return (
    <aside className="db-sidebar border-r border-app-border bg-white text-app-text">
      {/* Brand */}
      <div className="db-brand">
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M7 30L10.2 6H29.5L28.6 11.4H14.8L12.3 30H7Z" fill="#057A6E" />
          <path d="M15.4 30L17.4 15.2H29.2L27.2 30H22.1L23.5 19.8H21.7L20.3 30H15.4Z" fill="#078780" />
        </svg>
        <div>
          <strong>Relawan<br />Nusantara</strong>
          <span>Bergerak bersama, berdampak nyata.</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="db-role rounded-xl border border-app-border bg-app-bg">
        <span className="db-role-icon bg-teal-soft text-teal"><Icon name="briefcase" size={17} /></span>
        <div>
          <strong>
            {isFinance ? 'Pengguna Keuangan' : isDirector ? 'Pengguna Direktur' : 'Pengguna Program'}
          </strong>
          <small>
            {isFinance ? 'Divisi Keuangan' : isDirector ? 'Direktur Utama' : 'Divisi Program'}
          </small>
        </div>
      </div>

      {/* Menu Nav */}
      <nav className="db-nav text-sm">
        <small className="db-nav-label">
          {isFinance ? 'MENU KEUANGAN' : isDirector ? 'MENU DIREKTUR' : 'MENU PROGRAM'}
        </small>
        {activeMenuItems.map((item) => {
          const isActive =
            item.href === '/dashboard' || item.href === '/director' || item.href === '/finance'
              ? pathname === item.href
              : item.href === '/director/approval-dss'
              ? pathname.startsWith('/director/approval-dss') || pathname.startsWith('/director/approval-rab')
              : item.href === '/finance/review-approval-rab'
              ? pathname.startsWith('/finance/review-approval-rab') || pathname.startsWith('/finance/verifikasi-rab')
              : item.href === '/finance/pencairan-anggaran'
              ? pathname.startsWith('/finance/pencairan-anggaran') || pathname.startsWith('/finance/disbursement')
              : item.href === '/finance/verifikasi-bukti-ca'
              ? pathname.startsWith('/finance/verifikasi-bukti-ca') || pathname.startsWith('/finance/laporan-ca')
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={isActive ? 'active' : ''}
              onClick={(e) => handleMenuClick(item, e)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="db-nav-badge">
                  {item.label === 'Approval Proposal'
                    ? String(proposalWaitingCount)
                    : item.label === 'Approval DSS' || item.label === 'Approval RAB' || item.label.includes('Review & Approval RAB') || item.label.includes('Verifikasi Anggaran')
                    ? String(dssWaitingCount)
                    : item.label.includes('Pencairan')
                    ? String(spkCount)
                    : item.badge}
                </span>
              )}
              {isActive && <i className="db-nav-dot" />}
            </Link>
          )
        })}
      </nav>

      {/* User Card */}
      <div className="db-user border-t border-app-border">
        <span className="db-avatar bg-teal-soft text-teal">
          {isFinance ? 'SR' : isDirector ? 'AP' : 'CK'}
        </span>
        <div>
          <strong>
            {isFinance ? 'Siti Rahma' : isDirector ? 'Aditya Pratama' : 'Cikipi'}
          </strong>
          <small>
            {isFinance ? 'Divisi Keuangan' : isDirector ? 'Direktur Utama' : 'Tim Program'}
          </small>
        </div>
        <button
          type="button"
          aria-label="Keluar / Logout"
          title="Keluar dari akun"
          onClick={handleLogout}
        >
          <Icon name="logout" size={17} />
        </button>
      </div>
    </aside>
  )
}
