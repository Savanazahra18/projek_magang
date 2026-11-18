'use client'

import { useState, useMemo, ChangeEvent, DragEvent, ReactNode, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { api, getFullUploadUrl } from '@/lib/api'

/* ==========================================================
   ICONS
   ========================================================== */
type IconName =
  | 'file' | 'clock' | 'fileEdit' | 'checkCircle' | 'search'
  | 'sliders' | 'pin' | 'calendar' | 'download' | 'plus' | 'arrowUpRight'
  | 'arrowDown' | 'chevronRight' | 'chevronLeft' | 'upload' | 'send'
  | 'close' | 'pdf' | 'back'

const icons: Record<IconName, ReactNode> = {
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  fileEdit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  checkCircle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  sliders: (
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
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  arrowUpRight: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  arrowDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  upload: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m8 16 4-4 4 4" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  close: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  pdf: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
}

function Icon({ name }: { name: IconName }) {
  return <>{icons[name]}</>
}

/* ==========================================================
   DATA TYPES & INITIAL PROPOSALS
   ========================================================== */
type ProposalStatus = 'Perlu revisi' | 'Dalam tinjauan' | 'Disetujui'

interface ProposalItem {
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
  statusNote: string
  actionText: string
}

const initialProposals: ProposalItem[] = [
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
    actionText: 'Lihat detail',
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
    actionText: 'Lihat detail',
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

/* ==========================================================
   COMPONENT
   ========================================================== */
export default function ProposalPage({
  notify: propNotify,
  onSubCrumbsChange,
}: {
  notify?: (msg: string) => void
  onSubCrumbsChange?: (crumbs: string[]) => void
} = {}) {
  const { notify: ctxNotify, setSubCrumbs } = useDashboard()
  const notify = propNotify || ctxNotify

  // Navigation view: 'list' | 'upload' | 'detail'
  const [view, setView] = useState<'list' | 'upload' | 'detail'>('list')
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null)
  const [revisingProposal, setRevisingProposal] = useState<ProposalItem | null>(null)

  const switchView = (targetView: 'list' | 'upload' | 'detail', prop?: ProposalItem) => {
    setView(targetView)
    if (targetView === 'list') {
      setSelectedProposal(null)
      setRevisingProposal(null)
      onSubCrumbsChange ? onSubCrumbsChange([]) : setSubCrumbs([])
    } else if (targetView === 'upload') {
      if (prop) {
        setRevisingProposal(prop)
        setProposalTitleInput(prop.title)
        setProposalCategoryInput(prop.category)
        setProposalLocationInput(`${prop.location}, ${prop.province}`)
      } else {
        setRevisingProposal(null)
      }
      setSelectedProposal(null)
      onSubCrumbsChange
        ? onSubCrumbsChange(['Unggah Berkas Proposal'])
        : setSubCrumbs(['Unggah Berkas Proposal'])
    } else if (targetView === 'detail') {
      setRevisingProposal(null)
      if (prop) setSelectedProposal(prop)
      onSubCrumbsChange
        ? onSubCrumbsChange(['Detail Proposal'])
        : setSubCrumbs(['Detail Proposal'])
    }
  }

  useEffect(() => {
    if (view === 'list') {
      onSubCrumbsChange ? onSubCrumbsChange([]) : setSubCrumbs([])
    }
  }, [view, onSubCrumbsChange, setSubCrumbs])

  // Proposal data list (fetched from PostgreSQL API)
  const [proposals, setProposals] = useState<ProposalItem[]>([])

  useEffect(() => {
    api.getProposals()
      .then((res) => {
        if (res && Array.isArray(res.proposals)) {
          // Normalize fields if needed
          const mapped = res.proposals.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            location: p.location,
            province: p.province,
            date: p.date,
            fileType: p.file_type || p.fileType || 'PDF',
            fileSize: p.file_size || p.fileSize || '2,4 MB',
            fileName: p.file_name || p.fileName || undefined,
            fileUrl: p.file_url || p.fileUrl || undefined,
            status: p.status,
            statusNote: p.status_note || p.statusNote || 'Tersedia',
            actionText: p.action_text || p.actionText || 'Lihat detail',
          }))
          setProposals(mapped)
        }
      })
      .catch((e) => console.warn('Gagal fetch proposals dari API:', e))
  }, [])

  // Filters & Search
  const [statusTab, setStatusTab] = useState<'Semua' | ProposalStatus>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('Semua program')
  const [selectedLocation, setSelectedLocation] = useState('Semua lokasi')
  const [selectedTime, setSelectedTime] = useState('Semua waktu')

  // Upload view state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; rawFile?: File } | null>(null)
  const [proposalTitleInput, setProposalTitleInput] = useState('')
  const [proposalCategoryInput, setProposalCategoryInput] = useState('Pendidikan')
  const [proposalLocationInput, setProposalLocationInput] = useState('Kab. Bandung, Jawa Barat')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // KPI counts
  const counts = useMemo(() => {
    return {
      total: proposals.length,
      dalamTinjauan: proposals.filter((p) => p.status === 'Dalam tinjauan').length,
      perluRevisi: proposals.filter((p) => p.status === 'Perlu revisi').length,
      disetujui: proposals.filter((p) => p.status === 'Disetujui').length,
    }
  }, [proposals])

  // Program & Location filter options
  const programOptions = useMemo(() => {
    return ['Semua program', ...Array.from(new Set(proposals.map((p) => p.category)))]
  }, [proposals])

  const locationOptions = useMemo(() => {
    return ['Semua lokasi', ...Array.from(new Set(proposals.map((p) => p.location)))]
  }, [proposals])

  // Filtered proposal list
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchStatus = statusTab === 'Semua' || p.status === statusTab
      const matchSearch =
        `${p.id} ${p.title} ${p.category} ${p.location} ${p.province}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      const matchProgram = selectedProgram === 'Semua program' || p.category === selectedProgram
      const matchLocation = selectedLocation === 'Semua lokasi' || p.location === selectedLocation
      return matchStatus && matchSearch && matchProgram && matchLocation
    })
  }, [proposals, statusTab, searchQuery, selectedProgram, selectedLocation])

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    const sizeStr =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`
    setUploadedFile({
      name: file.name,
      size: sizeStr,
      rawFile: file,
    })
    // Auto-fill title from filename if empty
    if (!proposalTitleInput) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
      setProposalTitleInput(nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1))
    }
    notify(`Berkas "${file.name}" (${sizeStr}) berhasil dipilih.`)
  }

  // Handle submit proposal in upload view
  const handleSubmitProposal = async () => {
    if (!uploadedFile) {
      notify('Silakan pilih berkas proposal terlebih dahulu.')
      return
    }

    setIsSubmitting(true)
    try {
      const loc = proposalLocationInput.split(',')[0].trim() || 'Kab. Bandung'
      const prov = proposalLocationInput.split(',')[1]?.trim() || 'Jawa Barat'
      const title = proposalTitleInput || uploadedFile.name.replace(/\.[^/.]+$/, '')

      let fileUrl: string | undefined = undefined
      let fileName = uploadedFile.name
      let fileSize = uploadedFile.size
      const extUpper = uploadedFile.name.includes('.')
        ? uploadedFile.name.split('.').pop()!.toUpperCase()
        : 'PDF'
      let fileType = extUpper

      if (uploadedFile.rawFile) {
        const upRes = await api.uploadFile(uploadedFile.rawFile)
        if (upRes?.url) {
          fileUrl = upRes.url
          fileName = upRes.originalName || uploadedFile.name
          fileSize = upRes.size || uploadedFile.size
          fileType = upRes.extension || extUpper
        }
      }

      if (revisingProposal) {
        const res = await api.updateProposalStatus(
          revisingProposal.id,
          'Dalam tinjauan',
          'Berkas proposal telah diperbarui oleh Divisi Program',
          { fileUrl, fileName, fileType, fileSize }
        )
        const updatedRaw = res?.proposal || {}
        const updatedItem: ProposalItem = {
          ...revisingProposal,
          fileType: updatedRaw.file_type || fileType,
          fileSize: updatedRaw.file_size || fileSize,
          fileName: updatedRaw.file_name || fileName,
          fileUrl: updatedRaw.file_url || fileUrl,
          status: 'Dalam tinjauan',
          statusNote: 'Berkas proposal telah diperbarui oleh Divisi Program',
        }
        setProposals((prev) => prev.map((item) => (item.id === revisingProposal.id ? updatedItem : item)))
        setUploadedFile(null)
        setProposalTitleInput('')
        switchView('detail', updatedItem)
        notify(`Berkas untuk Proposal ${revisingProposal.id} berhasil diperbarui!`)
        return
      }

      const res = await api.createProposal({
        title,
        category: proposalCategoryInput,
        location: loc,
        province: prov,
        fileType,
        fileSize,
        fileName,
        fileUrl,
      })

      const raw = res.proposal || {}
      const created: ProposalItem = {
        id: raw.id || `PR-2026-00${proposals.length + 1}`,
        title: raw.title || title,
        category: raw.category || proposalCategoryInput,
        location: raw.location || loc,
        province: raw.province || prov,
        date: raw.date || '30 Okt 2026',
        fileType: raw.file_type || fileType,
        fileSize: raw.file_size || fileSize,
        fileName: raw.file_name || fileName,
        fileUrl: raw.file_url || fileUrl,
        status: raw.status || 'Dalam tinjauan',
        statusNote: raw.status_note || 'Menunggu peninjauan',
        actionText: raw.action_text || 'Lihat detail',
      }

      setProposals([created, ...proposals])
      setUploadedFile(null)
      setProposalTitleInput('')
      switchView('list')
      notify(`Proposal "${created.title}" (${created.id}) berhasil diunggah dan disimpan ke database!`)
    } catch (err: any) {
      console.warn(err)
      notify(`Gagal menyimpan proposal: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render status badge
  const renderStatusBadge = (status: ProposalStatus, note: string) => {
    const toneClass =
      status === 'Disetujui'
        ? 'prop-status-green'
        : status === 'Dalam tinjauan'
        ? 'prop-status-blue'
        : 'prop-status-orange'

    return (
      <div className="prop-status-cell">
        <span className={`prop-status-pill ${toneClass}`}>
          <span className="prop-dot" />
          <span>{status}</span>
        </span>
        <small className="prop-status-note">{note}</small>
      </div>
    )
  }

  /* ==========================================================
     VIEW 3: DETAIL PROPOSAL
     ========================================================== */
  if (view === 'detail' && selectedProposal) {
    const p = selectedProposal
    return (
      <div className="prop-detail-page">
        <div className="prop-upload-nav">
          <button type="button" className="prop-back-link" onClick={() => switchView('list')}>
            <Icon name="back" />
            <span>Kembali ke daftar proposal</span>
          </button>
        </div>

        <div className="prop-detail-header">
          <div>
            <div className="prop-detail-id-row">
              <span className="prop-id-badge">{p.id}</span>
              <span className="prop-cat-badge">{p.category}</span>
              <span className={`prop-status-pill ${p.status === 'Disetujui' ? 'prop-status-green' : p.status === 'Dalam tinjauan' ? 'prop-status-blue' : 'prop-status-orange'}`}>
                <span className="prop-dot" />
                <span>{p.status}</span>
              </span>
            </div>
            <h1>{p.title}</h1>
            <p>{p.location}, {p.province} • Diajukan pada {p.date}</p>
          </div>

          <div className="prop-detail-actions">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() => {
                if (p.fileUrl) {
                  window.open(getFullUploadUrl(p.fileUrl, true), '_blank')
                } else {
                  notify(`Berkas fisik untuk ${p.id} belum diunggah. Gunakan tombol "Unggah Revisi / Berkas" untuk melampirkan berkas.`)
                }
              }}
            >
              <Icon name="download" />
              <span>Unduh {p.fileType} ({p.fileSize})</span>
            </button>
            <button
              type="button"
              className="db-btn db-btn-primary"
              onClick={() => switchView('upload', p)}
            >
              <Icon name="plus" />
              <span>{p.fileUrl ? 'Unggah Revisi' : 'Unggah Berkas'}</span>
            </button>
          </div>
        </div>

        {/* Status notice */}
        {p.status === 'Perlu revisi' ? (
          <div className="prop-notice-alert warning">
            <span className="prop-notice-icon">⚠️</span>
            <div>
              <strong>Catatan Peninjau Direktur Tersedia</strong>
              <p>{p.statusNote || 'Mohon periksa bagian RAB komponen logistik dan perbarui lampiran profil kelompok sasaran penerima manfaat.'}</p>
            </div>
          </div>
        ) : p.status === 'Disetujui' ? (
          <div className="prop-notice-alert success">
            <span className="prop-notice-icon">✅</span>
            <div>
              <strong>Proposal Telah Disetujui</strong>
              <p>{p.statusNote || 'Proposal telah disetujui oleh Direktur Utama dan siap untuk penerbitan MOU / SPK kemitraan.'}</p>
            </div>
          </div>
        ) : (
          <div className="prop-notice-alert info">
            <span className="prop-notice-icon">ℹ️</span>
            <div>
              <strong>Dalam Proses Peninjauan</strong>
              <p>Proposal saat ini sedang ditinjau oleh Komite Program. Estimasi hasil peninjauan: 1-2 hari kerja.</p>
            </div>
          </div>
        )}

        <div className="prop-detail-grid">
          <div className="prop-detail-card">
            <h3>Ringkasan Proposal</h3>
            <div className="prop-info-list">
              <div className="prop-info-row">
                <span>Nama Program</span>
                <strong>{p.title}</strong>
              </div>
              <div className="prop-info-row">
                <span>Wilayah Sasaran</span>
                <strong>{p.location}, {p.province}</strong>
              </div>
              <div className="prop-info-row">
                <span>Kategori Rumpun</span>
                <strong>{p.category}</strong>
              </div>
              <div className="prop-info-row">
                <span>Tanggal Diajukan</span>
                <strong>{p.date}</strong>
              </div>
              <div className="prop-info-row">
                <span>Dokumen Berkas</span>
                <strong>{p.fileType} • {p.fileSize}</strong>
              </div>
            </div>
          </div>

          <div className="prop-detail-card">
            <h3>Dokumen Lampiran Berkas</h3>
            <div className="prop-file-box">
              <span className="prop-file-chip-icon big">
                <Icon name="pdf" />
              </span>
              <div className="prop-file-meta-box">
                <strong>{p.fileName || `${p.title.replace(/\s+/g, '_')}.${(p.fileType || 'pdf').toLowerCase()}`}</strong>
                <small>{p.fileSize} • {p.fileUrl ? 'Berkas terunggah di server' : 'Belum ada berkas fisik'}</small>
              </div>
              <button
                type="button"
                className="prop-btn-download-icon"
                onClick={() => {
                  if (p.fileUrl) {
                    window.open(getFullUploadUrl(p.fileUrl, true), '_blank')
                  } else {
                    notify(`Berkas fisik belum tersedia. Silakan klik "Unggah Berkas" di kanan atas.`)
                  }
                }}
                title="Unduh Berkas"
              >
                <Icon name="download" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================
     VIEW 2: UNGGAH BERKAS PROPOSAL
     ========================================================== */
  if (view === 'upload') {
    return (
      <div className="prop-upload-page">
        {/* Topback */}
        <div className="prop-upload-nav">
          <button type="button" className="prop-back-link" onClick={() => switchView('list')}>
            <Icon name="back" />
            <span>Kembali ke daftar proposal</span>
          </button>
        </div>

        {/* Heading */}
        <div className="prop-upload-heading">
          <h1>Proposal</h1>
          <p>Unggah berkas proposal Anda untuk diajukan.</p>
        </div>

        {/* Upload Card */}
        <div className="prop-upload-card">
          <div className="prop-upload-card-head">
            <h2>Unggah berkas proposal</h2>
            <p>Cukup unggah dokumen proposal yang telah Anda siapkan.</p>
          </div>

          {/* Dropzone */}
          <div
            className={`prop-dropzone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileProposalInput"
              className="prop-file-hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
            />

            <div className="prop-dropzone-icon">
              <Icon name="upload" />
            </div>

            <strong className="prop-dropzone-title">Tarik dan letakkan berkas proposal di sini</strong>
            <span className="prop-dropzone-sub">atau pilih berkas dari perangkat Anda</span>

            <label htmlFor="fileProposalInput" className="prop-btn-choose">
              Pilih berkas
            </label>

            <small className="prop-dropzone-format">Dokumen proposal, misalnya PDF atau Word.</small>
          </div>

          {/* Form inputs if file selected */}
          {uploadedFile && (
            <div className="prop-file-meta-form">
              <div className="prop-field">
                <label>Judul / Nama Proposal</label>
                <input
                  type="text"
                  value={proposalTitleInput}
                  onChange={(e) => setProposalTitleInput(e.target.value)}
                  placeholder="Contoh: Beasiswa Pendidikan Berkelanjutan..."
                />
              </div>

              <div className="prop-field-row">
                <div className="prop-field">
                  <label>Kategori / Program</label>
                  <select
                    value={proposalCategoryInput}
                    onChange={(e) => setProposalCategoryInput(e.target.value)}
                  >
                    <option>Pendidikan</option>
                    <option>Infrastruktur</option>
                    <option>Ekonomi</option>
                    <option>Kemanusiaan</option>
                    <option>Lingkungan</option>
                    <option>Kesehatan</option>
                  </select>
                </div>
                <div className="prop-field">
                  <label>Lokasi Sasaran</label>
                  <input
                    type="text"
                    value={proposalLocationInput}
                    onChange={(e) => setProposalLocationInput(e.target.value)}
                    placeholder="Contoh: Kab. Bandung, Jawa Barat"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Card */}
          <div className="prop-upload-footer">
            <div className="prop-file-status">
              {uploadedFile ? (
                <div className="prop-file-chosen">
                  <span className="prop-file-type-badge">PDF / DOC</span>
                  <div className="prop-file-details">
                    <strong>{uploadedFile.name}</strong>
                    <small>{uploadedFile.size} • Berkas siap dikirim</small>
                  </div>
                  <button
                    type="button"
                    className="prop-file-clear"
                    onClick={() => setUploadedFile(null)}
                    title="Hapus berkas"
                  >
                    <Icon name="close" />
                  </button>
                </div>
              ) : (
                <div className="prop-no-file">
                  <strong>Belum ada berkas dipilih</strong>
                  <small>Pilih berkas terlebih dahulu untuk mengirim proposal.</small>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`prop-btn-send ${uploadedFile ? 'active' : 'disabled'}`}
              disabled={!uploadedFile || isSubmitting}
              onClick={handleSubmitProposal}
            >
              <Icon name="send" />
              <span>{isSubmitting ? 'Mengirim proposal...' : 'Kirim proposal'}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================
     VIEW 1: DAFTAR PROPOSAL
     ========================================================== */
  return (
    <div className="prop-page">
      {/* Heading */}
      <div className="prop-heading">
        <div>
          <div className="prop-title-row">
            <h1>Proposal</h1>
            <span className="prop-tag-pill">Data ilustratif</span>
          </div>
          <p>Pantau proposal yang telah diajukan dan tindak lanjutnya di satu tempat.</p>
        </div>

        <div className="prop-action-box">
          <button
            type="button"
            className="prop-btn-add"
            onClick={() => switchView('upload')}
          >
            <Icon name="plus" />
            <span>Tambah proposal</span>
          </button>
          <small className="prop-add-hint">Lanjut ke unggah berkas</small>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="prop-kpis">
        {/* Total diajukan */}
        <div
          className={`prop-kpi-card ${statusTab === 'Semua' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Semua')}
        >
          <div className="prop-kpi-top">
            <span className="prop-kpi-label">Total diajukan</span>
            <span className="prop-kpi-icon teal">
              <Icon name="file" />
            </span>
          </div>
          <strong className="prop-kpi-value">{counts.total}</strong>
          <small className="prop-kpi-sub">Seluruh proposal terkirim</small>
        </div>

        {/* Dalam tinjauan */}
        <div
          className={`prop-kpi-card ${statusTab === 'Dalam tinjauan' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Dalam tinjauan')}
        >
          <div className="prop-kpi-top">
            <span className="prop-kpi-label">Dalam tinjauan</span>
            <span className="prop-kpi-icon blue">
              <Icon name="clock" />
            </span>
          </div>
          <strong className="prop-kpi-value">{counts.dalamTinjauan}</strong>
          <small className="prop-kpi-sub">Menunggu hasil peninjauan</small>
        </div>

        {/* Perlu revisi */}
        <div
          className={`prop-kpi-card ${statusTab === 'Perlu revisi' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Perlu revisi')}
        >
          <div className="prop-kpi-top">
            <span className="prop-kpi-label">Perlu revisi</span>
            <span className="prop-kpi-icon yellow">
              <Icon name="fileEdit" />
            </span>
          </div>
          <strong className="prop-kpi-value">{counts.perluRevisi}</strong>
          <small className="prop-kpi-sub">Periksa catatan peninjau</small>
        </div>

        {/* Disetujui */}
        <div
          className={`prop-kpi-card ${statusTab === 'Disetujui' ? 'selected' : ''}`}
          onClick={() => setStatusTab('Disetujui')}
        >
          <div className="prop-kpi-top">
            <span className="prop-kpi-label">Disetujui</span>
            <span className="prop-kpi-icon green">
              <Icon name="checkCircle" />
            </span>
          </div>
          <strong className="prop-kpi-value">{counts.disetujui}</strong>
          <small className="prop-kpi-sub">Siap ke tahap berikutnya</small>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="prop-table-card">
        {/* Status Tabs Bar */}
        <div className="prop-tabs-bar">
          <div className="prop-tab-pills">
            <button
              type="button"
              className={`prop-tab ${statusTab === 'Semua' ? 'active' : ''}`}
              onClick={() => setStatusTab('Semua')}
            >
              Semua ({counts.total})
            </button>
            <button
              type="button"
              className={`prop-tab ${statusTab === 'Dalam tinjauan' ? 'active' : ''}`}
              onClick={() => setStatusTab('Dalam tinjauan')}
            >
              Dalam tinjauan ({counts.dalamTinjauan})
            </button>
            <button
              type="button"
              className={`prop-tab ${statusTab === 'Perlu revisi' ? 'active' : ''}`}
              onClick={() => setStatusTab('Perlu revisi')}
            >
              Perlu revisi ({counts.perluRevisi})
            </button>
            <button
              type="button"
              className={`prop-tab ${statusTab === 'Disetujui' ? 'active' : ''}`}
              onClick={() => setStatusTab('Disetujui')}
            >
              Disetujui ({counts.disetujui})
            </button>
          </div>
          <span className="prop-tabs-info">Hanya proposal yang telah diajukan</span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="prop-toolbar">
          <div className="prop-search-box">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Cari nama atau nomor proposal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="prop-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <Icon name="close" />
              </button>
            )}
          </div>

          <div className="prop-filters-row">
            {/* Filter Program */}
            <div className="prop-filter-dropdown">
              <Icon name="sliders" />
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                {programOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Lokasi */}
            <div className="prop-filter-dropdown">
              <Icon name="pin" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Waktu */}
            <div className="prop-filter-dropdown">
              <Icon name="calendar" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option>Semua waktu</option>
                <option>Bulan ini (Okt 2026)</option>
                <option>Bulan lalu (Sep 2026)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="prop-table-responsive">
          <table className="prop-table">
            <thead>
              <tr>
                <th className="col-proposal">PROPOSAL</th>
                <th className="col-location">LOKASI</th>
                <th className="col-date">
                  <span className="prop-sort-th">
                    TGL. DIAJUKAN <Icon name="arrowDown" />
                  </span>
                </th>
                <th className="col-file">BERKAS</th>
                <th className="col-status">STATUS</th>
                <th className="col-action">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((row) => (
                <tr key={row.id}>
                  {/* Proposal & ID */}
                  <td
                    className="col-proposal"
                    style={{ cursor: 'pointer' }}
                    onClick={() => switchView('detail', row)}
                    title="Klik untuk membuka detail proposal"
                  >
                    <strong className="prop-item-title">{row.title}</strong>
                    <span className="prop-item-id">
                      {row.id} • {row.category}
                    </span>
                  </td>

                  {/* Lokasi */}
                  <td className="col-location">
                    <strong className="prop-location-main">{row.location}</strong>
                    <span className="prop-location-sub">{row.province}</span>
                  </td>

                  {/* Tanggal Diajukan */}
                  <td className="col-date">{row.date}</td>

                  {/* Berkas */}
                  <td className="col-file">
                    <div className="prop-file-chip">
                      <span className="prop-file-chip-icon">
                        <Icon name="pdf" />
                      </span>
                      <div>
                        <strong>{row.fileType}</strong>
                        <small>{row.fileSize}</small>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="col-status">{renderStatusBadge(row.status, row.statusNote)}</td>

                  {/* Tindakan */}
                  <td className="col-action">
                    <button
                      type="button"
                      className={`prop-action-link ${
                        row.status === 'Perlu revisi' ? 'revisi' : ''
                      }`}
                      onClick={() => switchView('detail', row)}
                      title={`Buka detail proposal ${row.title}`}
                    >
                      <span>{row.actionText}</span>
                      <Icon name="arrowUpRight" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProposals.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="prop-empty-state">
                      <Icon name="search" />
                      <strong>Tidak ada proposal yang sesuai</strong>
                      <p>Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
                      <button
                        type="button"
                        className="prop-btn-reset"
                        onClick={() => {
                          setStatusTab('Semua')
                          setSearchQuery('')
                          setSelectedProgram('Semua program')
                          setSelectedLocation('Semua lokasi')
                        }}
                      >
                        Reset semua filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="prop-table-footer">
          <span className="prop-footer-info">
            Menampilkan 1-{filteredProposals.length} dari {filteredProposals.length} proposal
          </span>

          <div className="prop-footer-controls">
            <div className="prop-page-size-selector">
              <select defaultValue="10">
                <option value="10">10 per halaman</option>
                <option value="20">20 per halaman</option>
                <option value="50">50 per halaman</option>
              </select>
            </div>

            <div className="prop-pagination-buttons">
              <button type="button" className="prop-pag-btn" disabled>
                <Icon name="chevronLeft" />
              </button>
              <button type="button" className="prop-pag-btn active">
                1
              </button>
              <button type="button" className="prop-pag-btn" disabled>
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

