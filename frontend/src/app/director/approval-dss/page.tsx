'use client'

import { useState, useMemo, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import FileDownloadCard from '@/components/FileDownloadCard'
import '@/styles/approval-dss.css'

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

/* ==========================================================
   TYPES & DATA
   ========================================================== */
export interface RabDocItem {
  id: string
  program_id?: string
  title: string
  category: string
  division?: string
  location: string
  province: string
  estimated_budget: string
  date: string
  file_type?: string
  file_size?: string
  file_name?: string
  file_url?: string
  status: 'Dalam telaah' | 'Perlu revisi' | 'Disetujui'
  status_note?: string
  action_text?: string
  evaluation_notes?: string
}

const FALLBACK_RAB_DATA: RabDocItem[] = [
  {
    id: 'RAB-2026-042',
    program_id: 'PR-2026-042',
    title: 'RAB Pelatihan Relawan Siaga Bencana',
    division: 'Divisi Kesiapsiagaan',
    category: 'Kesiapsiagaan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp45.200.000',
    date: '29 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3,4 MB',
    status: 'Perlu revisi',
    status_note: 'Catatan reviewer tersedia',
    action_text: 'Lihat catatan',
    evaluation_notes: 'Mohon lampirkan rincian biaya konsumsi per hari dan kurangi pagu transport maksimal 15% sesuai standar acuan DSS.',
  },
  {
    id: 'RAB-2026-039',
    program_id: 'PR-2026-039',
    title: 'RAB Distribusi Air Bersih Musim Kemarau',
    division: 'Divisi Sosial',
    category: 'Sosial',
    location: 'Lombok Timur',
    province: 'Nusa Tenggara Barat',
    estimated_budget: 'Rp82.500.000',
    date: '28 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '4,1 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Tinjau RAB',
    evaluation_notes: 'Sedang dalam proses evaluasi kelayakan pagu armada tangki air dan distribusi jeriken warga.',
  },
  {
    id: 'RAB-2026-035',
    program_id: 'PR-2026-035',
    title: 'RAB Modal Usaha UMKM Perempuan Berdaya',
    division: 'Divisi Ekonomi',
    category: 'Ekonomi',
    location: 'Kab. Bogor',
    province: 'Jawa Barat',
    estimated_budget: 'Rp65.000.000',
    date: '27 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2,8 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Tinjau RAB',
    evaluation_notes: 'Verifikasi rincian modal alat produksi dan bahan baku untuk kelompok UMKM binaan.',
  },
  {
    id: 'RAB-2026-031',
    program_id: 'PR-2026-031',
    title: 'RAB Posko Logistik Bencana Banjir',
    division: 'Divisi Tanggap Darurat',
    category: 'Kemanusiaan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp120.000.000',
    date: '25 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '5,2 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'RAB telah disetujui komite pagu darurat bencana. Siap proses penerbitan SPK pencairan.',
  },
  {
    id: 'RAB-2026-028',
    program_id: 'PR-2026-028',
    title: 'RAB Renovasi Sarana Sekolah Pelosok',
    division: 'Divisi Pendidikan',
    category: 'Pendidikan',
    location: 'Kab. Cianjur',
    province: 'Jawa Barat',
    estimated_budget: 'Rp95.000.000',
    date: '23 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3,9 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Kelayakan RAB renovasi gedung kelas dan fasilitas sanitasi sekolah selesai disahkan.',
  },
  {
    id: 'RAB-2026-024',
    program_id: 'PR-2026-024',
    title: 'RAB Bibit Pohon Penghijauan Desa Lestari',
    division: 'Divisi Lingkungan',
    category: 'Lingkungan',
    location: 'Gunungkidul',
    province: 'DI Yogyakarta',
    estimated_budget: 'Rp20.800.000',
    date: '21 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1,9 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'RAB bibit dan sarana tanam disetujui sesuai HPS standar konservasi hutan.',
  },
  {
    id: 'RAB-2026-021',
    program_id: 'PR-2026-021',
    title: 'RAB Bantuan Nutrisi Balita Stunting',
    division: 'Divisi Kesehatan',
    category: 'Kesehatan',
    location: 'Kab. Garut',
    province: 'Jawa Barat',
    estimated_budget: 'Rp35.000.000',
    date: '19 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2,4 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Paket makanan bergizi dan suplemen balita selama 90 hari disetujui.',
  },
  {
    id: 'RAB-2026-018',
    program_id: 'PR-2026-018',
    title: 'RAB Layanan Kesehatan Keliling Terpencil',
    division: 'Divisi Kesehatan',
    category: 'Kesehatan',
    location: 'Sumba Barat',
    province: 'Nusa Tenggara Timur',
    estimated_budget: 'Rp52.000.000',
    date: '17 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3,1 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Tinjau RAB',
    evaluation_notes: 'Pemeriksaan estimasi BBM armada ambulans keliling dan honorarium tenaga medis.',
  },
  {
    id: 'RAB-2026-015',
    program_id: 'PR-2026-015',
    title: 'RAB Pemberdayaan Tani Hidroponik Perkotaan',
    division: 'Divisi Ekonomi',
    category: 'Ekonomi',
    location: 'Kota Depok',
    province: 'Jawa Barat',
    estimated_budget: 'Rp28.000.000',
    date: '15 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2,2 MB',
    status: 'Perlu revisi',
    status_note: 'Catatan reviewer tersedia',
    action_text: 'Lihat catatan',
    evaluation_notes: 'Rincian instalasi hidroponik perlu melampirkan 3 surat penawaran harga vendor pembanding.',
  },
  {
    id: 'RAB-2026-012',
    program_id: 'PR-2026-012',
    title: 'RAB Dapur Umum Tanggap Bencana Gempa',
    division: 'Divisi Tanggap Darurat',
    category: 'Kemanusiaan',
    location: 'Kab. Majene',
    province: 'Sulawesi Barat',
    estimated_budget: 'Rp44.000.000',
    date: '12 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '4,5 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Dapur umum darurat disetujui sesuai pagu tanggap kebencanaan.',
  },
  {
    id: 'RAB-2026-009',
    program_id: 'PR-2026-009',
    title: 'RAB Pengadaan Buku & Pojok Baca Anak',
    division: 'Divisi Pendidikan',
    category: 'Pendidikan',
    location: 'Kab. Lebak',
    province: 'Banten',
    estimated_budget: 'Rp18.500.000',
    date: '10 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1,8 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Pengadaan 500 eksemplar buku dan rak baca anak disetujui.',
  },
  {
    id: 'RAB-2026-006',
    program_id: 'PR-2026-006',
    title: 'RAB Beasiswa Pendidikan Anak Nusantara',
    division: 'Divisi Pendidikan',
    category: 'Pendidikan',
    location: 'Kab. Jayapura',
    province: 'Papua',
    estimated_budget: 'Rp25.000.000',
    date: '08 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2,7 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Tinjau RAB',
    evaluation_notes: 'Validasi berkas administrasi calon penerima beasiswa sedang berlangsung.',
  },
  {
    id: 'RAB-2026-004',
    program_id: 'PR-2026-004',
    title: 'RAB Sosialisasi Sanitasi Hidup Bersih',
    division: 'Divisi Sosial',
    category: 'Sosial',
    location: 'Kab. Sukabumi',
    province: 'Jawa Barat',
    estimated_budget: 'Rp15.000.000',
    date: '05 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1,6 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Penyuluhan dan paket hygiene kit disetujui.',
  },
  {
    id: 'RAB-2026-001',
    program_id: 'PR-2026-001',
    title: 'RAB Pembinaan Karang Taruna Produktif',
    division: 'Divisi Ekonomi',
    category: 'Ekonomi',
    location: 'Kab. Pasuruan',
    province: 'Jawa Timur',
    estimated_budget: 'Rp17.000.000',
    date: '01 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2,1 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Pelatihan keterampilan sablon dan peralatan usaha karang taruna disetujui.',
  },
]

export default function ApprovalDssPage() {
  const { notify } = useDashboard()

  // Views: 'list' or 'detail'
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedRab, setSelectedRab] = useState<RabDocItem | null>(null)

  // Data state
  const [rabs, setRabs] = useState<RabDocItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Counts
  const [counts, setCounts] = useState({
    total: 0,
    dalamTelaah: 0,
    perluRevisi: 0,
    disetujui: 0,
  })

  // Filters
  const [activeTab, setActiveTab] = useState<'Semua' | 'Dalam penelaahan' | 'Perlu revisi' | 'Disetujui'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('Semua')
  const [locationFilter, setLocationFilter] = useState('Semua')

  // Pagination
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(6)

  // Detail decision review input
  const [reviewerNotes, setReviewerNotes] = useState('')

  // Fetch DSS evaluations from PostgreSQL backend
  const loadDssData = async () => {
    setIsLoading(true)
    try {
      const res = await api.getDssEvaluations()
      if (res && Array.isArray(res.evaluations)) {
        const mapped: RabDocItem[] = res.evaluations.map((item: any) => {
          let statusStr: 'Dalam telaah' | 'Perlu revisi' | 'Disetujui' = 'Dalam telaah'
          const s = (item.status || '').toLowerCase()
          if (s.includes('revisi')) statusStr = 'Perlu revisi'
          else if (s.includes('setuju')) statusStr = 'Disetujui'

          let actionStr = 'Tinjau RAB'
          if (statusStr === 'Perlu revisi') actionStr = 'Lihat catatan'
          else if (statusStr === 'Disetujui') actionStr = 'Lihat detail'

          return {
            id: item.id,
            program_id: item.program_id,
            title: item.title,
            category: item.category || 'Program',
            division: item.division || item.category || 'Divisi Program',
            location: item.location || 'Kab. Bandung',
            province: item.province || 'Jawa Barat',
            estimated_budget: item.estimated_budget || 'Rp0',
            date: item.date || '28 Okt 2026',
            file_type: item.file_type || 'Excel/PDF',
            file_size: item.file_size || '3,4 MB',
            file_name: item.file_name || undefined,
            file_url: item.file_url || undefined,
            status: statusStr,
            status_note: item.status_note || (statusStr === 'Perlu revisi' ? 'Catatan reviewer tersedia' : statusStr === 'Disetujui' ? 'Telaah selesai disahkan' : 'Menunggu peninjauan'),
            action_text: actionStr,
            evaluation_notes: item.evaluation_notes || '',
          }
        })
        setRabs(mapped)

        if (res.counts) {
          setCounts({
            total: res.counts.total ?? mapped.length,
            dalamTelaah: res.counts.dalamTelaah ?? mapped.filter(r => r.status === 'Dalam telaah').length,
            perluRevisi: res.counts.perluRevisi ?? mapped.filter(r => r.status === 'Perlu revisi').length,
            disetujui: res.counts.disetujui ?? mapped.filter(r => r.status === 'Disetujui').length,
          })
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDssData()
  }, [])

  // Filtered Rabs
  const filteredRabs = useMemo(() => {
    return rabs.filter((rab) => {
      // Tab filter
      if (activeTab === 'Dalam penelaahan' && rab.status !== 'Dalam telaah') return false
      if (activeTab === 'Perlu revisi' && rab.status !== 'Perlu revisi') return false
      if (activeTab === 'Disetujui' && rab.status !== 'Disetujui') return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = rab.title.toLowerCase().includes(q)
        const matchId = rab.id.toLowerCase().includes(q)
        const matchLoc = rab.location.toLowerCase().includes(q) || rab.province.toLowerCase().includes(q)
        const matchDiv = (rab.division || '').toLowerCase().includes(q)
        if (!matchTitle && !matchId && !matchLoc && !matchDiv) return false
      }

      // Dropdown Program
      if (programFilter !== 'Semua') {
        const cat = (rab.category || '').toLowerCase()
        const div = (rab.division || '').toLowerCase()
        if (!cat.includes(programFilter.toLowerCase()) && !div.includes(programFilter.toLowerCase())) {
          return false
        }
      }

      // Dropdown Location
      if (locationFilter !== 'Semua') {
        const loc = `${rab.location} ${rab.province}`.toLowerCase()
        if (!loc.includes(locationFilter.toLowerCase())) {
          return false
        }
      }

      return true
    })
  }, [rabs, activeTab, searchQuery, programFilter, locationFilter])

  // Pagination calculation
  const totalPages = Math.ceil(filteredRabs.length / perPage) || 1
  const paginatedRabs = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredRabs.slice(start, start + perPage)
  }, [filteredRabs, page, perPage])

  // Open detail view
  const openDetail = (rab: RabDocItem) => {
    setSelectedRab(rab)
    setReviewerNotes(rab.evaluation_notes || '')
    setView('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Approve
  const handleApprove = async () => {
    if (!selectedRab) return
    setIsSubmitting(true)
    try {
      await api.updateDssStatus(selectedRab.id, 'Disetujui', reviewerNotes)
      notify(`RAB ${selectedRab.id} (${selectedRab.title}) berhasil disetujui oleh Direktur Utama! Status tersinkronisasi ke Program.`)
      
      // Update local state immediately
      setRabs((prev) =>
        prev.map((r) =>
          r.id === selectedRab.id
            ? { ...r, status: 'Disetujui', status_note: 'Telaah selesai disahkan', action_text: 'Lihat detail', evaluation_notes: reviewerNotes }
            : r
        )
      )
      setSelectedRab((prev) =>
        prev ? { ...prev, status: 'Disetujui', status_note: 'Telaah selesai disahkan', evaluation_notes: reviewerNotes } : null
      )
      // Reload from backend for exact counts
      loadDssData()
    } catch {
      notify(`Gagal memperbarui status ${selectedRab.id}. Coba beberapa saat lagi.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Revisi
  const handleRevise = async () => {
    if (!selectedRab) return
    if (!reviewerNotes.trim()) {
      notify('Catatan peninjau wajib diisi untuk pengembalian revisi anggaran!')
      return
    }
    setIsSubmitting(true)
    try {
      await api.updateDssStatus(selectedRab.id, 'Perlu revisi', reviewerNotes)
      notify(`RAB ${selectedRab.id} dikembalikan kepada Divisi Program dengan catatan perbaikan anggaran.`)

      // Update local state immediately
      setRabs((prev) =>
        prev.map((r) =>
          r.id === selectedRab.id
            ? { ...r, status: 'Perlu revisi', status_note: 'Catatan reviewer tersedia', action_text: 'Lihat catatan', evaluation_notes: reviewerNotes }
            : r
        )
      )
      setSelectedRab((prev) =>
        prev ? { ...prev, status: 'Perlu revisi', status_note: 'Catatan reviewer tersedia', evaluation_notes: reviewerNotes } : null
      )
      loadDssData()
    } catch {
      notify(`Gagal memperbarui status ${selectedRab.id}. Coba beberapa saat lagi.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ==========================================================
     DETAIL VIEW (Matching Image 2)
     ========================================================== */
  if (view === 'detail' && selectedRab) {
    const isWaterProject = selectedRab.id === 'RAB-2026-039' || selectedRab.title.toLowerCase().includes('air bersih')
    const totalAmountDisplay = selectedRab.estimated_budget || 'Rp82.500.000'

    return (
      <div className="app-dss-detail-wrap">
        {/* Top Back Row & Status Pill */}
        <div className="app-dss-back-row">
          <button
            type="button"
            className="app-dss-back-link"
            onClick={() => setView('list')}
          >
            ← Kembali ke daftar RAB
          </button>

          <span className={`app-dss-status-pill ${
            selectedRab.status === 'Dalam telaah'
              ? 'dalam-telaah'
              : selectedRab.status === 'Perlu revisi'
              ? 'perlu-revisi'
              : 'disetujui'
          }`}>
            <span className="app-dss-status-dot" />
            {selectedRab.status}
          </span>
        </div>

        {/* Title */}
        <div className="app-dss-detail-title-box">
          <h1>Detail approval RAB</h1>
          <p>Tinjau isi berkas dan metadata sebelum memberikan keputusan.</p>
        </div>

        {/* Header Summary Card */}
        <div className="app-dss-summary-card">
          <div className="app-dss-summary-left">
            <div className="app-dss-summary-icon">
              <FileTextIcon />
            </div>
            <div>
              <div className="app-dss-summary-title">{selectedRab.title}</div>
              <div className="app-dss-summary-sub">
                {selectedRab.id} • {selectedRab.division || selectedRab.category}
              </div>
            </div>
          </div>
          <div className="app-dss-summary-right">
            <PinIcon />
            <div>
              <strong>{selectedRab.location}</strong>
              <div style={{ fontSize: '11.5px', color: '#79898a' }}>{selectedRab.province}</div>
            </div>
          </div>
        </div>

        {/* Grid: Left Paper Preview & Right Sidebar */}
        <div className="app-dss-detail-grid">
          {/* Left Column: Unduh Berkas RAB Pengaju */}
          <div className="app-dss-preview-container">
            <FileDownloadCard
              title={selectedRab.title}
              docNumber={selectedRab.id}
              category={selectedRab.division || selectedRab.category}
              date={selectedRab.date}
              location={`${selectedRab.location}, ${selectedRab.province}`}
              amount={totalAmountDisplay}
              fileName={selectedRab.file_name}
              fileUrl={selectedRab.file_url}
              fileType={selectedRab.file_type}
              fileSize={selectedRab.file_size}
              notes={selectedRab.evaluation_notes}
              isRab={true}
            />
          </div>

          {/* Right Column: Actions & Details */}
          <div className="app-dss-side-container">
            {/* Card 1: Informasi Pengajuan */}
            <div className="app-dss-side-card">
              <h3>Informasi pengajuan</h3>

              <div className="app-dss-amount-box">
                <span className="lbl">Total anggaran diajukan</span>
                <strong className="val">{totalAmountDisplay}</strong>
              </div>

              <div className="app-dss-kv-list">
                <div className="app-dss-kv-item">
                  <span className="k">Nomor pengajuan</span>
                  <strong className="v">{selectedRab.id}</strong>
                </div>
                <div className="app-dss-kv-item">
                  <span className="k">Divisi pengaju</span>
                  <strong className="v">{selectedRab.division || selectedRab.category}</strong>
                </div>
                <div className="app-dss-kv-item">
                  <span className="k">Tanggal diajukan</span>
                  <strong className="v">{selectedRab.date}</strong>
                </div>
                <div className="app-dss-kv-item">
                  <span className="k">Format & ukuran</span>
                  <strong className="v">{selectedRab.file_type || 'Excel/PDF'} • {selectedRab.file_size || '4,1 MB'}</strong>
                </div>
                <div className="app-dss-kv-item">
                  <span className="k">Lokasi</span>
                  <strong className="v">{selectedRab.location}, {selectedRab.province}</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Keputusan Peninjau */}
            <div className="app-dss-side-card">
              <h3>Keputusan peninjau</h3>

              <p className="app-dss-decision-sub">
                {selectedRab.status === 'Disetujui'
                  ? 'Dokumen telah disetujui oleh Direktur Utama. Siap untuk tahap penerbitan SPK pencairan.'
                  : selectedRab.status === 'Perlu revisi'
                  ? 'Dokumen dikembalikan ke Divisi Program untuk perbaikan komponen anggaran.'
                  : 'Belum ada keputusan. Dokumen masih menunggu hasil peninjauan Anda.'}
              </p>

              <div className="app-dss-textarea-wrap">
                <div className="app-dss-notes-label">
                  <span>Catatan peninjau</span>
                  <span className="req">Wajib untuk revisi *</span>
                </div>
                <textarea
                  className="app-dss-textarea"
                  value={reviewerNotes}
                  maxLength={1000}
                  placeholder="Tulis hasil tinjauan atau bagian yang perlu diperbaiki oleh pengaju..."
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReviewerNotes(e.target.value)}
                />
                <span className="app-dss-char-count">{reviewerNotes.length} / 1.000</span>
              </div>

              <p className="app-dss-notes-hint">
                Catatan wajib diisi saat meminta revisi; opsional untuk persetujuan.
              </p>

              <div className="app-dss-decision-actions">
                <button
                  type="button"
                  className="app-dss-btn-revisi"
                  disabled={isSubmitting}
                  onClick={handleRevise}
                >
                  <EditIcon />
                  Revisi
                </button>
                <button
                  type="button"
                  className="app-dss-btn-approve"
                  disabled={isSubmitting}
                  onClick={handleApprove}
                >
                  <CheckCircleIcon />
                  {isSubmitting ? 'Memproses...' : 'Approve'}
                </button>
              </div>

              <div className="app-dss-decision-notice">
                ℹ <strong>Approve</strong> menyetujui pengajuan ini. <strong>Revisi</strong> mengembalikan dokumen kepada pengaju beserta catatan perbaikan.
              </div>
            </div>

            {/* Card 3: Fokus Peninjauan */}
            <div className="app-dss-fokus-card">
              <div className="app-dss-fokus-title">
                <ShieldCheckIcon />
                Fokus peninjauan
              </div>
              <div className="app-dss-fokus-list">
                <div className="app-dss-fokus-item">
                  <span className="star">✦</span>
                  <span>Kewajaran volume dan harga satuan biaya.</span>
                </div>
                <div className="app-dss-fokus-item">
                  <span className="star">✦</span>
                  <span>Konsistensi rincian dengan total {totalAmountDisplay}.</span>
                </div>
                <div className="app-dss-fokus-item">
                  <span className="star">✦</span>
                  <span>Kesesuaian kebutuhan program dan pagu anggaran.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================
     LIST VIEW (Matching Image 1)
     ========================================================== */
  return (
    <div className="app-dss-page">
      {/* Header */}
      <div className="app-dss-header">
        <div className="app-dss-title-box">
          <h1>Approval DSS</h1>
          <p>Telaah kelayakan biaya dan lampiran DSS (Rencana Anggaran Biaya) dari Divisi Program.</p>
        </div>
        <button
          type="button"
          className="app-dss-period-btn"
          onClick={() => notify('Filter periode aktif: Semua periode')}
        >
          <CalendarIcon />
          Semua periode
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="app-dss-kpis">
        {/* Card 1 Hero Teal */}
        <div
          className={`app-dss-kpi-card hero-teal ${activeTab === 'Dalam penelaahan' ? 'selected' : ''}`}
          onClick={() => { setActiveTab('Dalam penelaahan'); setPage(1) }}
        >
          <div className="app-dss-kpi-head">
            <span className="app-dss-kpi-label">Dalam penelaahan</span>
            <span className="app-dss-kpi-icon"><ClockIcon /></span>
          </div>
          <span className="app-dss-kpi-val">{counts.dalamTelaah} dokumen</span>
          <span className="app-dss-kpi-sub">Menunggu evaluasi komite</span>
        </div>

        {/* Card 2 Total */}
        <div
          className={`app-dss-kpi-card ${activeTab === 'Semua' ? 'selected' : ''}`}
          onClick={() => { setActiveTab('Semua'); setPage(1) }}
        >
          <div className="app-dss-kpi-head">
            <span className="app-dss-kpi-label">Total RAB diajukan</span>
            <span className="app-dss-kpi-icon"><FileTextIcon /></span>
          </div>
          <span className="app-dss-kpi-val">{counts.total} dokumen</span>
          <span className="app-dss-kpi-sub">Seluruh pengajuan terdaftar</span>
        </div>

        {/* Card 3 Perlu Revisi */}
        <div
          className={`app-dss-kpi-card ${activeTab === 'Perlu revisi' ? 'selected' : ''}`}
          onClick={() => { setActiveTab('Perlu revisi'); setPage(1) }}
        >
          <div className="app-dss-kpi-head">
            <span className="app-dss-kpi-label">Perlu revisi anggaran</span>
            <span className="app-dss-kpi-icon"><EditIcon /></span>
          </div>
          <span className="app-dss-kpi-val">{counts.perluRevisi} dokumen</span>
          <span className="app-dss-kpi-sub">Periksa catatan reviewer</span>
        </div>

        {/* Card 4 Disetujui */}
        <div
          className={`app-dss-kpi-card ${activeTab === 'Disetujui' ? 'selected' : ''}`}
          onClick={() => { setActiveTab('Disetujui'); setPage(1) }}
        >
          <div className="app-dss-kpi-head">
            <span className="app-dss-kpi-label">RAB disetujui</span>
            <span className="app-dss-kpi-icon"><CheckCircleIcon /></span>
          </div>
          <span className="app-dss-kpi-val">{counts.disetujui} dokumen</span>
          <span className="app-dss-kpi-sub">Siap pencairan & tahap SPK</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="app-dss-card">
        <div className="app-dss-card-header">
          <h2>Daftar pengajuan RAB</h2>
          <p>
            Nominal ditampilkan per dokumen • {filteredRabs.length} pengajuan terlihat dari {counts.total} dokumen terdaftar.
          </p>
        </div>

        {/* Tabs */}
        <div className="app-dss-tabs-wrap">
          <div className="app-dss-tabs">
            <button
              type="button"
              className={`app-dss-tab-btn ${activeTab === 'Semua' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Semua'); setPage(1) }}
            >
              Semua RAB {counts.total}
            </button>
            <button
              type="button"
              className={`app-dss-tab-btn ${activeTab === 'Dalam penelaahan' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Dalam penelaahan'); setPage(1) }}
            >
              Dalam penelaahan {counts.dalamTelaah}
            </button>
            <button
              type="button"
              className={`app-dss-tab-btn ${activeTab === 'Perlu revisi' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Perlu revisi'); setPage(1) }}
            >
              Perlu revisi {counts.perluRevisi}
            </button>
            <button
              type="button"
              className={`app-dss-tab-btn ${activeTab === 'Disetujui' ? 'active' : ''}`}
              onClick={() => { setActiveTab('Disetujui'); setPage(1) }}
            >
              Disetujui {counts.disetujui}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="app-dss-toolbar">
          <div className="app-dss-search-wrap">
            <SearchIcon />
            <input
              type="text"
              className="app-dss-search-input"
              placeholder="Cari nama atau nomor RAB..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <select
            className="app-dss-filter-select"
            value={programFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setProgramFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="Semua">Semua program ⌵</option>
            <option value="Kesiapsiagaan">Kesiapsiagaan</option>
            <option value="Sosial">Sosial</option>
            <option value="Ekonomi">Ekonomi</option>
            <option value="Kemanusiaan">Kemanusiaan</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Lingkungan">Lingkungan</option>
            <option value="Kesehatan">Kesehatan</option>
          </select>

          <select
            className="app-dss-filter-select"
            value={locationFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setLocationFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="Semua">Semua lokasi ⌵</option>
            <option value="Bandung">Kab. Bandung</option>
            <option value="Lombok">Lombok Timur</option>
            <option value="Bogor">Kab. Bogor</option>
            <option value="Cianjur">Kab. Cianjur</option>
            <option value="Gunungkidul">Gunungkidul</option>
            <option value="Garut">Kab. Garut</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="app-dss-table-responsive">
          <table className="app-dss-table">
            <thead>
              <tr>
                <th>DOKUMEN RAB</th>
                <th>PROGRAM & LOKASI</th>
                <th>NOMINAL RAB</th>
                <th>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    TGL. PENGAJUAN
                    <ChevronDownIcon />
                  </span>
                </th>
                <th>LAMPIRAN & FORMAT</th>
                <th>STATUS DSS</th>
                <th style={{ textAlign: 'right' }}>TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRabs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#79898a' }}>
                    Tidak ada pengajuan RAB yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedRabs.map((rab) => {
                  const isPending = rab.status === 'Dalam telaah'
                  const isRevise = rab.status === 'Perlu revisi'
                  const isApproved = rab.status === 'Disetujui'

                  return (
                    <tr key={rab.id}>
                      {/* Dokumen RAB */}
                      <td>
                        <strong className="app-dss-doc-title">{rab.title}</strong>
                        <span className="app-dss-doc-code">
                          {rab.id} • {rab.division || rab.category}
                        </span>
                      </td>

                      {/* Program & Lokasi */}
                      <td>
                        <span className="app-dss-loc-city">{rab.location}</span>
                        <span className="app-dss-loc-prov">{rab.province}</span>
                      </td>

                      {/* Nominal RAB */}
                      <td>
                        <strong className="app-dss-nominal">{rab.estimated_budget}</strong>
                      </td>

                      {/* Tgl Pengajuan */}
                      <td style={{ color: '#556667' }}>{rab.date}</td>

                      {/* Lampiran & Format */}
                      <td>
                        <div className="app-dss-file-cell">
                          <FileTextIcon />
                          <div>
                            <span className="app-dss-file-name">{rab.file_type || 'Excel/PDF'}</span>
                            <span className="app-dss-file-size">{rab.file_size || '3,4 MB'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status DSS */}
                      <td>
                        <div className="app-dss-status-wrap">
                          <span
                            className={`app-dss-status-pill ${
                              isPending
                                ? 'dalam-telaah'
                                : isRevise
                                ? 'perlu-revisi'
                                : 'disetujui'
                            }`}
                          >
                            <span className="app-dss-status-dot" />
                            {rab.status}
                          </span>
                          <span className="app-dss-status-sub">{rab.status_note}</span>
                        </div>
                      </td>

                      {/* Tindakan */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="app-dss-action-btn"
                          onClick={() => openDetail(rab)}
                        >
                          <span>{rab.action_text || (isPending ? 'Tinjau RAB' : isRevise ? 'Lihat catatan' : 'Lihat detail')}</span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="app-dss-pagination">
          <div>
            Menampilkan {filteredRabs.length > 0 ? (page - 1) * perPage + 1 : 0}-
            {Math.min(page * perPage, filteredRabs.length)} dari {filteredRabs.length} pengajuan RAB
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              style={{
                height: '28px',
                padding: '0 8px',
                border: '1px solid #dfe6e7',
                borderRadius: '6px',
                background: '#fff',
                fontSize: '12px',
                color: '#3b4b4c',
                cursor: 'pointer',
              }}
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value))
                setPage(1)
              }}
            >
              <option value={6}>6 per halaman</option>
              <option value={10}>10 per halaman</option>
              <option value={15}>15 per halaman</option>
            </select>

            <div className="app-dss-pages">
              <button
                type="button"
                className="app-dss-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                aria-label="Halaman sebelumnya"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  className={`app-dss-page-btn ${page === pNum ? 'active' : ''}`}
                  onClick={() => setPage(pNum)}
                >
                  {pNum}
                </button>
              ))}

              <button
                type="button"
                className="app-dss-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                aria-label="Halaman berikutnya"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context Card (Matching Image 1) */}
      <div className="app-dss-context-card">
        <div className="app-dss-context-head">
          <span className="app-dss-context-title">Konteks unggahan Divisi Program</span>
          <span className="app-dss-context-sub">Contoh pada halaman unggah • bukan detail baris terpilih</span>
        </div>

        <div className="app-dss-context-grid">
          <div className="app-dss-context-item">
            <span className="label">Program terkait</span>
            <strong className="val">PR-2026-006 • Beasiswa Anak Nusantara</strong>
          </div>
          <div className="app-dss-context-item">
            <span className="label">Estimasi total anggaran</span>
            <strong className="val">Rp45.200.000</strong>
          </div>
          <div className="app-dss-context-item">
            <span className="label">Lampiran resmi</span>
            <strong className="val">.xlsx, .xls, atau .pdf • Maks. 25 MB</strong>
          </div>
        </div>

        <div className="app-dss-context-foot">
          <span className="app-dss-context-note">
            Catatan: Rincian alokasi biaya transportasi, konsumsi peserta, dan material modul belajar selama fase program 3 bulan.
          </span>
          <span className="app-dss-context-tip">
            Periksa kesesuaian program, rincian biaya, dan hasil validasi pagu DSS sebelum memberikan keputusan.
          </span>
        </div>
      </div>
    </div>
  )
}

