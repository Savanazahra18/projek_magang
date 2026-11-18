'use client'

import { useState, useMemo, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import FileDownloadCard from '@/components/FileDownloadCard'
import '@/styles/approval-proposal.css'

/* ==========================================================
   ICONS
   ========================================================== */
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

function ArrowBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

/* ==========================================================
   TYPES & FALLBACK
   ========================================================== */
export type ProposalStatus = 'Dalam tinjauan' | 'Perlu revisi' | 'Disetujui'

export interface ProposalItem {
  id: string
  title: string
  category: string
  location: string
  province: string
  date: string
  fileType: string
  fileSize: string
  fileName?: string
  fileUrl?: string
  status: ProposalStatus
  statusNote?: string
  actionText?: string
}

const fallbackProposals: ProposalItem[] = [
  {
    id: 'PR-2026-006',
    title: 'Beasiswa Anak Nusantara',
    category: 'Pendidikan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    date: '29 Okt 2026',
    fileType: 'PDF',
    fileSize: '2,4 MB',
    status: 'Perlu revisi',
    statusNote: 'Catatan peninjau tersedia',
    actionText: 'Lihat catatan',
  },
  {
    id: 'PR-2026-005',
    title: 'Air Bersih untuk Desa',
    category: 'Infrastruktur',
    location: 'Lombok Timur',
    province: 'Nusa Tenggara Barat',
    date: '28 Okt 2026',
    fileType: 'PDF',
    fileSize: '3,1 MB',
    status: 'Dalam tinjauan',
    statusNote: 'Menunggu peninjauan',
    actionText: 'Tinjau proposal',
  },
  {
    id: 'PR-2026-004',
    title: 'Pemberdayaan UMKM Perempuan',
    category: 'Ekonomi',
    location: 'Kab. Bogor',
    province: 'Jawa Barat',
    date: '27 Okt 2026',
    fileType: 'PDF',
    fileSize: '1,8 MB',
    status: 'Dalam tinjauan',
    statusNote: 'Menunggu peninjauan',
    actionText: 'Tinjau proposal',
  },
  {
    id: 'PR-2026-003',
    title: 'Bantuan Banjir Bandung',
    category: 'Kemanusiaan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    date: '25 Okt 2026',
    fileType: 'PDF',
    fileSize: '4,2 MB',
    status: 'Disetujui',
    statusNote: 'Peninjauan selesai',
    actionText: 'Lihat detail',
  },
  {
    id: 'PR-2026-002',
    title: 'Renovasi Sekolah Pelosok',
    category: 'Pendidikan',
    location: 'Kab. Cianjur',
    province: 'Jawa Barat',
    date: '23 Okt 2026',
    fileType: 'PDF',
    fileSize: '3,6 MB',
    status: 'Disetujui',
    statusNote: 'Peninjauan selesai',
    actionText: 'Lihat detail',
  },
  {
    id: 'PR-2026-001',
    title: 'Penghijauan Desa Lestari',
    category: 'Lingkungan',
    location: 'Gunungkidul',
    province: 'DI Yogyakarta',
    date: '21 Okt 2026',
    fileType: 'PDF',
    fileSize: '2,0 MB',
    status: 'Disetujui',
    statusNote: 'Peninjauan selesai',
    actionText: 'Lihat detail',
  },
]

export default function ApprovalProposalPage() {
  const { setSubCrumbs, notify } = useDashboard()

  const [view, setView] = useState<'list' | 'detail'>('list')
  const [proposals, setProposals] = useState<ProposalItem[]>([])
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Filters
  const [statusTab, setStatusTab] = useState<string>('Semua proposal')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [programFilter, setProgramFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')

  // Review Form in Detail View
  const [notesInput, setNotesInput] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Breadcrumbs sync
  useEffect(() => {
    if (view === 'list') {
      setSubCrumbs([])
    } else if (view === 'detail') {
      setSubCrumbs(['Detail pengajuan'])
    }
  }, [view, setSubCrumbs])

  // Fetch Proposals from PostgreSQL database (Live API shared with Program)
  const loadProposals = async () => {
    try {
      setIsLoading(true)
      const res = await api.getProposals()
      if (res && Array.isArray(res.proposals)) {
        const mapped: ProposalItem[] = res.proposals.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          province: p.province,
          date: p.date,
          fileType: p.file_type || p.fileType || 'PDF',
          fileSize: p.file_size || p.fileSize || '2,4 MB',
          fileName: p.file_name || undefined,
          fileUrl: p.file_url || undefined,
          status: p.status,
          statusNote: p.status_note || p.statusNote || (p.status === 'Disetujui' ? 'Peninjauan selesai' : p.status === 'Perlu revisi' ? 'Catatan peninjau tersedia' : 'Menunggu peninjauan'),
          actionText: p.status === 'Dalam tinjauan' ? 'Tinjau proposal' : p.status === 'Perlu revisi' ? 'Lihat catatan' : 'Lihat detail',
        }))
        setProposals(mapped)
      }
    } catch {
      // Fallback already pre-seeded
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProposals()
  }, [])

  // KPI Calculations
  const counts = useMemo(() => {
    const total = proposals.length
    const dalamTinjauan = proposals.filter((p) => p.status === 'Dalam tinjauan').length
    const perluRevisi = proposals.filter((p) => p.status === 'Perlu revisi').length
    const disetujui = proposals.filter((p) => p.status === 'Disetujui').length

    return {
      total,
      dalamTinjauan,
      perluRevisi,
      disetujui,
    }
  }, [proposals])

  // Filter options
  const programOptions = useMemo(() => {
    return Array.from(new Set(proposals.map((p) => p.category)))
  }, [proposals])

  const locationOptions = useMemo(() => {
    return Array.from(new Set(proposals.map((p) => p.location)))
  }, [proposals])

  // Filtered proposal list
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      // Tab filter
      if (statusTab === 'Dalam tinjauan' && p.status !== 'Dalam tinjauan') return false
      if (statusTab === 'Perlu revisi' && p.status !== 'Perlu revisi') return false
      if (statusTab === 'Disetujui' && p.status !== 'Disetujui') return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        if (!match) return false
      }

      // Dropdown filters
      if (programFilter !== 'all' && p.category !== programFilter) return false
      if (locationFilter !== 'all' && p.location !== locationFilter) return false

      return true
    })
  }, [proposals, statusTab, searchQuery, programFilter, locationFilter])

  // Open Detail View
  const handleOpenDetail = (p: ProposalItem) => {
    setSelectedProposal(p)
    setNotesInput(p.statusNote && p.statusNote !== 'Menunggu peninjauan' && p.statusNote !== 'Peninjauan selesai' ? p.statusNote : '')
    setView('detail')
  }

  // Handle Approve action (Syncs directly to PostgreSQL database)
  const handleApprove = async () => {
    if (!selectedProposal) return

    setIsSubmitting(true)
    const p = selectedProposal
    const note = notesInput.trim() || 'Peninjauan selesai'

    try {
      await api.updateProposalStatus(p.id, 'Disetujui', note)
      // Update local state
      setProposals((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? { ...item, status: 'Disetujui' as ProposalStatus, statusNote: note, actionText: 'Lihat detail' }
            : item
        )
      )
      setSelectedProposal({
        ...p,
        status: 'Disetujui',
        statusNote: note,
        actionText: 'Lihat detail',
      })
      notify(`Proposal ${p.id} — "${p.title}" berhasil disetujui! Status di Divisi Program telah sinkron menjadi Disetujui.`)
    } catch {
      notify(`Gagal menghubungkan ke server. Proposal diperbarui secara lokal.`)
      setProposals((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? { ...item, status: 'Disetujui' as ProposalStatus, statusNote: note }
            : item
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Revisi action (Syncs directly to PostgreSQL database)
  const handleRequestRevision = async () => {
    if (!selectedProposal) return

    if (!notesInput.trim()) {
      notify('Catatan peninjau wajib diisi untuk instruksi perbaikan kepada Divisi Program.')
      return
    }

    setIsSubmitting(true)
    const p = selectedProposal
    const note = notesInput.trim()

    try {
      await api.updateProposalStatus(p.id, 'Perlu revisi', note)
      // Update local state
      setProposals((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? { ...item, status: 'Perlu revisi' as ProposalStatus, statusNote: note, actionText: 'Lihat catatan' }
            : item
        )
      )
      setSelectedProposal({
        ...p,
        status: 'Perlu revisi',
        statusNote: note,
        actionText: 'Lihat catatan',
      })
      notify(`Proposal ${p.id} dikembalikan ke Divisi Program untuk revisi.`)
    } catch {
      notify(`Status proposal diperbarui secara lokal ke "Perlu revisi".`)
      setProposals((prev) =>
        prev.map((item) =>
          item.id === p.id
            ? { ...item, status: 'Perlu revisi' as ProposalStatus, statusNote: note }
            : item
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ==========================================================
     RENDER: DETAIL / REVIEW VIEW (IMAGE 2)
     ========================================================== */
  if (view === 'detail' && selectedProposal) {
    const p = selectedProposal

    return (
      <div className="app-prop-page">
        {/* Top Back Link */}
        <div>
          <button
            type="button"
            className="app-prop-back-link"
            onClick={() => setView('list')}
          >
            <ArrowBackIcon />
            <span>Kembali ke daftar proposal</span>
          </button>
        </div>

        {/* Heading */}
        <div className="app-prop-detail-header-row">
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#172324', margin: 0 }}>
              Detail approval Proposal
            </h1>
            <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
              Tinjau isi berkas dan metadata sebelum memberikan keputusan.
            </p>
          </div>

          <div>
            <span
              className={`app-prop-status-pill ${
                p.status === 'Dalam tinjauan'
                  ? 'status-review'
                  : p.status === 'Perlu revisi'
                  ? 'status-revision'
                  : 'status-approved'
              }`}
            >
              <span className="app-prop-status-dot" />
              <span>{p.status}</span>
            </span>
          </div>
        </div>

        {/* Proposal Summary Card */}
        <div className="app-prop-header-card">
          <div className="app-prop-header-card-left">
            <div className="app-prop-doc-avatar">
              <FileTextIcon />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#172324', margin: 0 }}>
                {p.title}
              </h2>
              <span style={{ fontSize: '12px', color: '#79898a' }}>
                {p.id} • {p.category}
              </span>
            </div>
          </div>

          <div className="app-prop-header-card-right">
            <PinIcon />
            <span>{p.location}, {p.province}</span>
          </div>
        </div>

        {/* 2 Columns: Paper Document Frame (Left) & Decision Controls (Right) */}
        <div className="app-prop-detail-grid">
          {/* Left: Unduh Berkas Proposal Pengaju */}
          <div className="app-prop-paper-container">
            <FileDownloadCard
              title={p.title}
              docNumber={p.id}
              category={p.category}
              date={p.date}
              location={`${p.location}, ${p.province}`}
              fileName={p.fileName}
              fileUrl={p.fileUrl}
              fileType={p.fileType}
              fileSize={p.fileSize}
              notes={p.statusNote}
              isRab={false}
            />
          </div>

          {/* Right: Decision Controls & Information */}
          <div className="app-prop-detail-side">
            {/* Card 1: Informasi Pengajuan */}
            <div className="app-prop-side-card">
              <h3>Informasi pengajuan</h3>
              <div className="app-prop-info-list">
                <div className="app-prop-info-row">
                  <span>Nomor pengajuan</span>
                  <strong>{p.id}</strong>
                </div>
                <div className="app-prop-info-row">
                  <span>Kategori program</span>
                  <strong>{p.category}</strong>
                </div>
                <div className="app-prop-info-row">
                  <span>Divisi pengaju</span>
                  <strong>Divisi Program</strong>
                </div>
                <div className="app-prop-info-row">
                  <span>Tanggal diajukan</span>
                  <strong>{p.date}</strong>
                </div>
                <div className="app-prop-info-row">
                  <span>Format &amp; ukuran</span>
                  <strong>{p.fileType} • {p.fileSize}</strong>
                </div>
                <div className="app-prop-info-row">
                  <span>Lokasi</span>
                  <strong>{p.location}, {p.province}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Keputusan Peninjau */}
            <div className="app-prop-side-card">
              <h3>Keputusan peninjau</h3>
              <p className="app-prop-decision-desc">
                {p.status === 'Disetujui'
                  ? 'Proposal telah disetujui dan siap berlanjut ke tahap pengajuan RAB dan SPK.'
                  : p.status === 'Perlu revisi'
                  ? 'Proposal dikembalikan ke Divisi Program dengan catatan revisi di bawah.'
                  : 'Belum ada keputusan. Dokumen masih menunggu hasil peninjauan Anda.'}
              </p>

              <div>
                <label className="app-prop-textarea-label" htmlFor="reviewNote">
                  <span>Catatan peninjau</span>
                  <span className="app-prop-req-text">Wajib untuk revisi *</span>
                </label>
                <textarea
                  id="reviewNote"
                  className="app-prop-textarea"
                  rows={4}
                  maxLength={1000}
                  placeholder="Tulis hasil tinjauan atau bagian yang perlu diperbaiki oleh pengaju..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
                <div className="app-prop-char-count">{notesInput.length} / 1.000</div>
              </div>

              <p className="app-prop-note-caption">
                Catatan wajib diisi saat meminta revisi; opsional untuk persetujuan.
              </p>

              <div className="app-prop-decision-actions">
                <button
                  type="button"
                  className="app-prop-btn-revisi"
                  disabled={isSubmitting}
                  onClick={handleRequestRevision}
                >
                  <EditIcon />
                  <span>Revisi</span>
                </button>

                <button
                  type="button"
                  className="app-prop-btn-approve"
                  disabled={isSubmitting}
                  onClick={handleApprove}
                >
                  <CheckCircleIcon />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Approve'}</span>
                </button>
              </div>

              <div className="app-prop-decision-hint">
                <InfoIcon />
                <span>
                  <strong>Approve</strong> menyetujui pengajuan ini secara resmi. <strong>Revisi</strong> mengembalikan dokumen kepada pengaju beserta catatan perbaikan.
                </span>
              </div>
            </div>

            {/* Card 3: Fokus Peninjauan */}
            <div className="app-prop-side-card">
              <div className="app-prop-focus-title">
                <ShieldCheckIcon />
                <span>Fokus peninjauan</span>
              </div>
              <div className="app-prop-focus-list">
                <div>• Kesesuaian tujuan dan kebutuhan masyarakat sasaran.</div>
                <div>• Kejelasan lokasi dan rencana tahapan pelaksanaan.</div>
                <div>• Kelengkapan isi proposal dan hasil yang ditargetkan.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================
     RENDER: LIST VIEW (IMAGE 1)
     ========================================================== */
  return (
    <div className="app-prop-page">
      {/* 1. Header Section */}
      <div className="app-prop-header">
        <div className="app-prop-title-box">
          <h1>Approval Proposal</h1>
          <p>Tinjau kelayakan proposal Divisi Program dan tetapkan tindak lanjut pengajuan.</p>
        </div>

        <div>
          <button
            type="button"
            className="app-prop-period-btn"
            onClick={() => notify('Filter periode aktif: Semua periode')}
          >
            <CalendarIcon />
            <span>Semua periode</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (4 Cards) */}
      <div className="app-prop-kpis">
        {/* Card 1: Dalam tinjauan (Hero Teal) */}
        <div
          className={`app-prop-kpi-card hero-teal ${statusTab === 'Dalam tinjauan' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Dalam tinjauan')}
        >
          <div className="app-prop-kpi-top">
            <span className="app-prop-kpi-label">Dalam tinjauan</span>
            <span className="app-prop-kpi-icon">
              <ClockIcon />
            </span>
          </div>
          <strong className="app-prop-kpi-num">{counts.dalamTinjauan} proposal</strong>
          <span className="app-prop-kpi-desc">Menunggu hasil peninjauan Anda</span>
        </div>

        {/* Card 2: Total diajukan */}
        <div
          className={`app-prop-kpi-card ${statusTab === 'Semua proposal' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Semua proposal')}
        >
          <div className="app-prop-kpi-top">
            <span className="app-prop-kpi-label">Total diajukan</span>
            <span className="app-prop-kpi-icon">
              <FileTextIcon />
            </span>
          </div>
          <strong className="app-prop-kpi-num">{counts.total} proposal</strong>
          <span className="app-prop-kpi-desc">Seluruh proposal terkirim</span>
        </div>

        {/* Card 3: Perlu revisi */}
        <div
          className={`app-prop-kpi-card ${statusTab === 'Perlu revisi' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Perlu revisi')}
        >
          <div className="app-prop-kpi-top">
            <span className="app-prop-kpi-label">Perlu revisi</span>
            <span className="app-prop-kpi-icon" style={{ color: '#c97b10' }}>
              <EditIcon />
            </span>
          </div>
          <strong className="app-prop-kpi-num">{counts.perluRevisi} proposal</strong>
          <span className="app-prop-kpi-desc">Menunggu perbaikan Divisi Program</span>
        </div>

        {/* Card 4: Disetujui */}
        <div
          className={`app-prop-kpi-card ${statusTab === 'Disetujui' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Disetujui')}
        >
          <div className="app-prop-kpi-top">
            <span className="app-prop-kpi-label">Disetujui</span>
            <span className="app-prop-kpi-icon" style={{ color: '#1f8448' }}>
              <CheckCircleIcon />
            </span>
          </div>
          <strong className="app-prop-kpi-num">{counts.disetujui} proposal</strong>
          <span className="app-prop-kpi-desc">Siap ke tahap berikutnya</span>
        </div>
      </div>

      {/* 3. Main Card: Daftar Proposal */}
      <div className="app-prop-table-card">
        {/* Card Heading */}
        <div className="app-prop-card-head">
          <h2>Daftar proposal</h2>
          <p>Dokumen pengajuan Divisi Program • Tinjau berkas sebelum memberikan keputusan.</p>
        </div>

        {/* Tabs Bar */}
        <div className="app-prop-tabs-bar">
          <button
            type="button"
            className={`app-prop-tab-pill ${statusTab === 'Semua proposal' ? 'active' : ''}`}
            onClick={() => setStatusTab('Semua proposal')}
          >
            Semua proposal {counts.total}
          </button>
          <button
            type="button"
            className={`app-prop-tab-pill ${statusTab === 'Dalam tinjauan' ? 'active' : ''}`}
            onClick={() => setStatusTab('Dalam tinjauan')}
          >
            Dalam tinjauan {counts.dalamTinjauan}
          </button>
          <button
            type="button"
            className={`app-prop-tab-pill ${statusTab === 'Perlu revisi' ? 'active' : ''}`}
            onClick={() => setStatusTab('Perlu revisi')}
          >
            Perlu revisi {counts.perluRevisi}
          </button>
          <button
            type="button"
            className={`app-prop-tab-pill ${statusTab === 'Disetujui' ? 'active' : ''}`}
            onClick={() => setStatusTab('Disetujui')}
          >
            Disetujui {counts.disetujui}
          </button>
        </div>

        {/* Toolbar: Search & 2 Dropdowns */}
        <div className="app-prop-toolbar">
          <div className="app-prop-search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari nama atau nomor proposal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="app-prop-filters-right">
            {/* Filter Program */}
            <div className="app-prop-dropdown">
              <SlidersIcon />
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="all">Semua program</option>
                {programOptions.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Lokasi */}
            <div className="app-prop-dropdown">
              <PinIcon />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">Semua lokasi</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="app-prop-table-responsive">
          {isLoading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#79898a', fontSize: '13px' }}>
              Memuat data proposal dari database...
            </div>
          ) : filteredProposals.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#79898a', fontSize: '13px' }}>
              Tidak ada proposal yang sesuai dengan filter.
            </div>
          ) : (
            <table className="app-prop-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>PROPOSAL</th>
                  <th style={{ width: '22%' }}>LOKASI</th>
                  <th style={{ width: '16%' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>TGL. DIAJUKAN</span>
                      <ChevronDownIcon />
                    </div>
                  </th>
                  <th style={{ width: '12%' }}>BERKAS</th>
                  <th style={{ width: '12%' }}>STATUS</th>
                  <th style={{ width: '10%', textAlign: 'right' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="app-prop-row-clickable"
                  >
                    {/* Proposal Title & Code */}
                    <td>
                      <div className="app-prop-doc-cell">
                        <strong className="app-prop-doc-title">{item.title}</strong>
                        <span className="app-prop-doc-meta">
                          {item.id} • {item.category}
                        </span>
                      </div>
                    </td>

                    {/* Lokasi */}
                    <td>
                      <div className="app-prop-loc-cell">
                        <strong className="app-prop-loc-name">{item.location}</strong>
                        <span className="app-prop-loc-prov">{item.province}</span>
                      </div>
                    </td>

                    {/* Tgl. Diajukan */}
                    <td>
                      <span style={{ fontSize: '12px', color: '#556667', whiteSpace: 'nowrap' }}>
                        {item.date}
                      </span>
                    </td>

                    {/* Berkas */}
                    <td>
                      <div className="app-prop-file-chip">
                        <span className="app-prop-file-icon">
                          <FileTextIcon />
                        </span>
                        <div className="app-prop-file-text">
                          <strong>{item.fileType}</strong>
                          <small>{item.fileSize}</small>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <div className="app-prop-status-wrap">
                        <span
                          className={`app-prop-status-pill ${
                            item.status === 'Dalam tinjauan'
                              ? 'status-review'
                              : item.status === 'Perlu revisi'
                              ? 'status-revision'
                              : 'status-approved'
                          }`}
                        >
                          <span className="app-prop-status-dot" />
                          <span>{item.status}</span>
                        </span>
                        <span className="app-prop-status-hint">
                          {item.status === 'Dalam tinjauan'
                            ? 'Menunggu peninjauan'
                            : item.status === 'Perlu revisi'
                            ? 'Catatan peninjau tersedia'
                            : 'Peninjauan selesai'}
                        </span>
                      </div>
                    </td>

                    {/* Tindakan */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="app-prop-btn-action"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDetail(item)
                        }}
                      >
                        <span>
                          {item.status === 'Dalam tinjauan'
                            ? 'Tinjau proposal'
                            : item.status === 'Perlu revisi'
                            ? 'Lihat catatan'
                            : 'Lihat detail'}
                        </span>
                        <ArrowUpRightIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="app-prop-pagination">
          <span>Menampilkan 1–{filteredProposals.length} dari {filteredProposals.length} proposal</span>
          <div className="app-prop-pagination-right">
            <span>10 per halaman</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <button type="button" className="dir-p-btn">&lt;</button>
              <button type="button" className="dir-p-btn active">1</button>
              <button type="button" className="dir-p-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Banner Card */}
      <div className="app-prop-banner-card">
        <div className="app-prop-banner-left">
          <div className="app-prop-shield-icon">
            <ShieldCheckIcon />
          </div>
          <div className="app-prop-banner-content">
            <strong>Keputusan dimulai dari dokumen yang lengkap</strong>
            <p>
              Periksa tujuan program, lokasi penerima manfaat, dan isi lampiran proposal. Berikan catatan yang jelas bila diperlukan revisi.
            </p>
            <small>Berkas proposal berasal dari unggahan Divisi Program, dalam format PDF atau Word.</small>
          </div>
        </div>

        <div className="app-prop-banner-right">
          <span className="app-prop-banner-step">Buka berkas → Tinjau → Putuskan</span>
          <span className="app-prop-banner-note">
            Persetujuan atau pengembalian dilakukan setelah dokumen ditinjau, bukan langsung dari daftar.
          </span>
        </div>
      </div>

      {/* 5. Footer Bar */}
      <div className="dir-footer-bar">
        <span>Internal &amp; rahasia • Relawan Nusantara</span>
        <span>Ruang persetujuan direktur</span>
      </div>
    </div>
  )
}
