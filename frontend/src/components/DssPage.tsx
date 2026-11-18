'use client'

import { useState, useMemo, useEffect, ReactNode, ChangeEvent, useRef } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { api, getFullUploadUrl } from '@/lib/api'
import { Icon as CommonIcon } from '@/components/common/Icons'

/* ==========================================================
   ICONS
   ========================================================== */
type IconName =
  | 'file' | 'clock' | 'fileEdit' | 'checkCircle' | 'search'
  | 'filter' | 'pin' | 'calendar' | 'plus' | 'arrowUpRight'
  | 'arrowDown' | 'chevronRight' | 'chevronLeft' | 'upload' | 'send'
  | 'info' | 'close' | 'chevronDown'

const icons: Record<IconName, ReactNode> = {
  file: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  clock: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  fileEdit: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  checkCircle: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
  plus: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
  chevronDown: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  upload: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  close: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
}

function Icon({ name }: { name: IconName }) {
  return <>{icons[name] || null}</>
}

/* ==========================================================
   TYPES & DEFAULT DATA
   ========================================================== */
export interface RabItem {
  id: string
  program_id?: string
  title: string
  category?: string
  division: string
  location: string
  province: string
  estimated_budget: string
  date: string
  file_type: string
  file_size: string
  file_name?: string
  file_url?: string
  status: 'Perlu revisi' | 'Dalam telaah' | 'Disetujui'
  status_note: string
  action_text: string
  evaluation_notes?: string
}

const INITIAL_RAB_DATA: RabItem[] = [
  {
    id: 'RAB-2026-042',
    program_id: 'PR-2026-042',
    title: 'RAB Pelatihan Relawan Siaga Bencana',
    division: 'Divisi Kesiapsiagaan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 45.200.000',
    date: '29 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.4 MB',
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
    location: 'Lombok Timur',
    province: 'Nusa Tenggara Barat',
    estimated_budget: 'Rp 82.500.000',
    date: '28 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '4.1 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Sedang dalam proses evaluasi kelayakan pagu armada tangki air dan distribusi jeriken warga.',
  },
  {
    id: 'RAB-2026-035',
    program_id: 'PR-2026-035',
    title: 'RAB Modal Usaha UMKM Perempuan Berdaya',
    division: 'Divisi Ekonomi',
    location: 'Kab. Bogor',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 65.000.000',
    date: '27 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.8 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Verifikasi rincian modal alat produksi dan bahan baku untuk kelompok UMKM binaan.',
  },
  {
    id: 'RAB-2026-031',
    program_id: 'PR-2026-031',
    title: 'RAB Posko Logistik Bencana Banjir',
    division: 'Divisi Tanggap Darurat',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 120.000.000',
    date: '25 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '5.2 MB',
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
    location: 'Kab. Cianjur',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 95.000.000',
    date: '23 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.9 MB',
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
    location: 'Gunungkidul',
    province: 'DI Yogyakarta',
    estimated_budget: 'Rp 20.800.000',
    date: '21 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1.9 MB',
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
    location: 'Kab. Garut',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 35.000.000',
    date: '19 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.4 MB',
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
    location: 'Sumba Barat',
    province: 'Nusa Tenggara Timur',
    estimated_budget: 'Rp 52.000.000',
    date: '17 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.1 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Pemeriksaan estimasi BBM armada ambulans keliling dan honorarium tenaga medis.',
  },
  {
    id: 'RAB-2026-015',
    program_id: 'PR-2026-015',
    title: 'RAB Pemberdayaan Tani Hidroponik Perkotaan',
    division: 'Divisi Ekonomi',
    location: 'Kota Depok',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 28.000.000',
    date: '15 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.2 MB',
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
    location: 'Kab. Majene',
    province: 'Sulawesi Barat',
    estimated_budget: 'Rp 44.000.000',
    date: '12 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '4.5 MB',
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
    location: 'Kab. Lebak',
    province: 'Banten',
    estimated_budget: 'Rp 18.500.000',
    date: '10 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1.8 MB',
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
    location: 'Kab. Jayapura',
    province: 'Papua',
    estimated_budget: 'Rp 25.000.000',
    date: '08 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.7 MB',
    status: 'Dalam telaah',
    status_note: 'Menunggu peninjauan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Validasi berkas administrasi calon penerima beasiswa sedang berlangsung.',
  },
  {
    id: 'RAB-2026-004',
    program_id: 'PR-2026-004',
    title: 'RAB Sosialisasi Sanitasi Hidup Bersih',
    division: 'Divisi Sosial',
    location: 'Kab. Sukabumi',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 15.000.000',
    date: '05 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '1.6 MB',
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
    location: 'Kab. Pasuruan',
    province: 'Jawa Timur',
    estimated_budget: 'Rp 17.000.000',
    date: '01 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.1 MB',
    status: 'Disetujui',
    status_note: 'Telaah selesai disahkan',
    action_text: 'Lihat detail',
    evaluation_notes: 'Pelatihan keterampilan sablon dan peralatan usaha karang taruna disetujui.',
  },
]

const SAMPLE_PROGRAMS = [
  'PR-2026-006 - Beasiswa Anak Nusantara',
  'PR-2026-005 - Air Bersih untuk Desa',
  'PR-2026-004 - Pemberdayaan UMKM Perempuan',
  'PR-2026-003 - Bantuan Banjir Bandung',
  'PR-2026-002 - Renovasi Sekolah Pelosok',
  'PR-2026-001 - Penghijauan Desa Lestari',
]

export default function DssPage() {
  const { setSubCrumbs, notify } = useDashboard()

  // Views: 'list' | 'upload' | 'detail'
  const [view, setView] = useState<'list' | 'upload' | 'detail'>('list')

  // Data state
  const [rabList, setRabList] = useState<RabItem[]>([])
  const [counts, setCounts] = useState({
    total: 0,
    totalAmount: 'Rp 0',
    dalamTelaah: 0,
    dalamTelaahAmount: 'Rp 0',
    perluRevisi: 0,
    perluRevisiAmount: 'Rp 0',
    disetujui: 0,
    disetujuiAmount: 'Rp 0',
  })

  // Filters state
  const [activeTab, setActiveTab] = useState<'Semua' | 'Dalam penelaahan' | 'Perlu revisi' | 'Disetujui'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Semua')
  const [locationFilter, setLocationFilter] = useState('Semua')
  const [periodFilter, setPeriodFilter] = useState('Semua')

  // Pagination
  const [page, setPage] = useState(1)
  const perPage = 10

  // Selected Detail Item
  const [selectedRab, setSelectedRab] = useState<RabItem | null>(null)

  // Upload Form State
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [budgetInput, setBudgetInput] = useState('Rp 45.200.000')
  const [notesInput, setNotesInput] = useState(
    'Rincian alokasi biaya transportasi, konsumsi peserta, dan material modul belajar selama fase program 3 bulan.'
  )
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState('')
  const [rawUploadedFile, setRawUploadedFile] = useState<File | null>(null)
  const [revisingRab, setRevisingRab] = useState<RabItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch live from backend on mount
  useEffect(() => {
    let ignore = false
    const fetchData = async () => {
      try {
        const [res, propRes] = await Promise.all([
          api.getDssEvaluations(),
          api.getProposals().catch(() => null),
        ])
        if (!ignore && Array.isArray(propRes?.proposals)) {
          const progOptions = propRes.proposals.map((p: any) => `${p.id} - ${p.title}`)
          setAvailablePrograms(progOptions)
          setSelectedProgram(progOptions[0] || '')
        }
        if (!ignore && Array.isArray(res?.evaluations)) {
          const mapped: RabItem[] = res.evaluations.map((e: any) => ({
            id: e.id,
            program_id: e.program_id,
            title: e.title,
            division: e.division || e.category || 'Divisi Program',
            location: e.location || 'Kab. Bandung',
            province: e.province || 'Jawa Barat',
            estimated_budget: e.estimated_budget || 'Rp 0',
            date: e.date || '29 Okt 2026',
            file_type: e.file_type || 'Excel/PDF',
            file_size: e.file_size || '3.4 MB',
            file_name: e.file_name || undefined,
            file_url: e.file_url || undefined,
            status: e.status?.includes('revisi')
              ? 'Perlu revisi'
              : e.status?.includes('setuju')
              ? 'Disetujui'
              : 'Dalam telaah',
            status_note: e.status_note || (e.status?.includes('revisi') ? 'Catatan reviewer tersedia' : e.status?.includes('setuju') ? 'Telaah selesai disahkan' : 'Menunggu peninjauan'),
            action_text: e.status?.includes('revisi') ? 'Lihat catatan' : 'Lihat detail',
            evaluation_notes: e.evaluation_notes,
          }))
          setRabList(mapped)
          if (res.counts) {
            setCounts(res.counts)
          }
        }
      } catch (err) {
        // Fallback to initial seed
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [])

  // Sync breadcrumbs
  useEffect(() => {
    if (view === 'list') {
      setSubCrumbs(['DSS (RAB)'])
    } else if (view === 'detail') {
      setSubCrumbs(['DSS (RAB)', 'Detail RAB'])
    } else {
      setSubCrumbs(['DSS (RAB)', revisingRab ? `Unggah Revisi (${revisingRab.id})` : 'Unggah Rencana Anggaran Biaya'])
    }
  }, [view, revisingRab, setSubCrumbs])

  // Filtered Items
  const filteredList = useMemo(() => {
    return rabList.filter((item) => {
      // Tab filter
      if (activeTab === 'Dalam penelaahan' && item.status !== 'Dalam telaah') return false
      if (activeTab === 'Perlu revisi' && item.status !== 'Perlu revisi') return false
      if (activeTab === 'Disetujui' && item.status !== 'Disetujui') return false

      // Category filter
      if (categoryFilter !== 'Semua' && item.division !== categoryFilter) return false

      // Location filter
      if (locationFilter !== 'Semua' && !item.location.toLowerCase().includes(locationFilter.toLowerCase()) && !item.province.toLowerCase().includes(locationFilter.toLowerCase())) return false

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.division.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q)
        if (!matches) return false
      }

      return true
    })
  }, [rabList, activeTab, categoryFilter, locationFilter, searchQuery])

  // Pagination slice
  const totalItems = filteredList.length
  const paginatedList = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredList.slice(start, start + perPage)
  }, [filteredList, page])

  // Handle Action Click (Lihat catatan / Lihat detail)
  const handleOpenAction = (item: RabItem) => {
    setSelectedRab(item)
    setView('detail')
  }

  // Handle File Input Selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeStr =
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`
      setUploadedFileName(file.name)
      setUploadedFileSize(sizeStr)
      setRawUploadedFile(file)
      notify(`Berkas "${file.name}" (${sizeStr}) siap diunggah.`)
    }
  }

  // Handle Submit Form
  const handleSubmitRab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawUploadedFile && !uploadedFileName) {
      notify('Silakan pilih berkas RAB terlebih dahulu.')
      return
    }
    if (!selectedProgram && !revisingRab) {
      notify('Silakan pilih program terkait.')
      return
    }

    setIsSubmitting(true)
    try {
      let fileUrl: string | undefined = undefined
      let fileName = uploadedFileName
      let fileSize = uploadedFileSize || '100 KB'
      const extUpper = fileName.includes('.') ? fileName.split('.').pop()!.toUpperCase() : 'XLSX'
      let fileType = extUpper

      if (rawUploadedFile) {
        const upRes = await api.uploadFile(rawUploadedFile)
        if (upRes?.url) {
          fileUrl = upRes.url
          fileName = upRes.originalName || rawUploadedFile.name
          fileSize = upRes.size || fileSize
          fileType = upRes.extension || extUpper
        }
      }

      if (revisingRab) {
        const res = await api.updateDssStatus(revisingRab.id, 'Dalam telaah', notesInput, {
          fileUrl,
          fileName,
          fileType,
          fileSize,
        })
        const updatedRaw = res?.evaluation || {}
        const updatedItem: RabItem = {
          ...revisingRab,
          file_type: updatedRaw.file_type || fileType,
          file_size: updatedRaw.file_size || fileSize,
          file_name: updatedRaw.file_name || fileName,
          file_url: updatedRaw.file_url || fileUrl,
          status: 'Dalam telaah',
          status_note: 'Menunggu peninjauan',
          evaluation_notes: notesInput,
        }
        setRabList((prev) => prev.map((r) => (r.id === revisingRab.id ? updatedItem : r)))
        setSelectedRab(updatedItem)
        setRevisingRab(null)
        setRawUploadedFile(null)
        setUploadedFileName('')
        notify(`Berkas RAB untuk ${revisingRab.id} berhasil diperbarui!`)
        setView('detail')
        return
      }

      const sepIdx = selectedProgram.indexOf(' - ')
      const progCode = sepIdx !== -1 ? selectedProgram.slice(0, sepIdx).trim() : selectedProgram.split('-')[0]?.trim() || 'PR-2026-000'
      const progTitle = sepIdx !== -1 ? selectedProgram.slice(sepIdx + 3).trim() : selectedProgram

      const payload = {
        programId: progCode,
        title: `RAB ${progTitle}`,
        category: 'Divisi Program',
        estimatedBudget: budgetInput,
        notes: notesInput,
        fileName,
        fileSize,
        fileType,
        fileUrl,
      }

      const res = await api.createDssEvaluation(payload)
      const raw = res?.evaluation || {}
      const createdItem: RabItem = {
        id: raw.id || `RAB-2026-${String(rabList.length + 1).padStart(3, '0')}`,
        program_id: raw.program_id || progCode,
        title: raw.title || `RAB ${progTitle}`,
        division: raw.division || 'Divisi Program',
        location: raw.location || 'Kab. Bandung',
        province: raw.province || 'Jawa Barat',
        estimated_budget: raw.estimated_budget || budgetInput,
        date: raw.date || '12 Nov 2026',
        file_type: raw.file_type || fileType,
        file_size: raw.file_size || fileSize,
        file_name: raw.file_name || fileName,
        file_url: raw.file_url || fileUrl,
        status: 'Dalam telaah',
        status_note: 'Menunggu peninjauan',
        action_text: 'Lihat detail',
        evaluation_notes: raw.evaluation_notes || notesInput,
      }

      setRabList((prev) => [createdItem, ...prev])
      setCounts((prev) => ({
        ...prev,
        total: prev.total + 1,
        dalamTelaah: prev.dalamTelaah + 1,
      }))
      setRawUploadedFile(null)
      setUploadedFileName('')

      notify(`Pengajuan ${createdItem.id} beserta berkas "${fileName}" berhasil dikirim ke sistem DSS!`)
      setView('list')
    } catch (err: any) {
      notify(err?.message || 'Gagal mengirim pengajuan RAB.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================================
  // RENDER: VIEW 2 - UNGGAH RENCANA ANGGARAN BIAYA
  // ==========================================================
  if (view === 'upload') {
    return (
      <div className="dss-upload-page">
        {/* Title Row */}
        <div className="dss-header-row">
          <div className="dss-title-group">
            <h1 className="dss-main-title">DSS (Rencana Anggaran Biaya)</h1>
            <p className="dss-subtitle">
              Unggah berkas spreadsheet/dokumen RAB kegiatan program untuk diproses dalam sistem pendukung keputusan (DSS).
            </p>
          </div>
          <button
            type="button"
            className="dss-btn-secondary"
            onClick={() => (selectedRab ? setView('detail') : setView('list'))}
            style={{ height: 38, padding: '0 16px', borderRadius: 8, cursor: 'pointer' }}
          >
            ← Kembali ke Daftar RAB
          </button>
        </div>

        {/* Upload Form Card */}
        <div className="dss-upload-card">
          <div className="dss-upload-card-head">
            <h2 className="dss-upload-card-title">Unggah berkas RAB</h2>
            <p className="dss-upload-card-subtitle">
              Unggah format template RAB resmi (.xlsx, .xls, atau .pdf) yang telah dilengkapi rincian biaya kegiatan.
            </p>
          </div>

          <form onSubmit={handleSubmitRab}>
            {/* Drag & Drop Upload Zone */}
            <div
              className="dss-dropzone"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div className="dss-dropzone-icon">
                <Icon name="upload" />
              </div>
              <p className="dss-dropzone-title">Tarik dan letakkan berkas RAB di sini</p>
              <p className="dss-dropzone-muted">atau pilih berkas dari perangkat Anda</p>
              <button
                type="button"
                className="dss-dropzone-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                Pilih berkas
              </button>
              <p className="dss-dropzone-hint">
                Mendukung format Excel (.xlsx), Spreadsheet, atau PDF (Maks. 25 MB). Gunakan template RAB resmi Relawan Nusantara.
              </p>

              {uploadedFileName && (
                <div className="dss-selected-file-badge">
                  <Icon name="file" />
                  <span>{uploadedFileName}</span>
                  <small style={{ color: '#688985', fontWeight: 500 }}>({uploadedFileSize})</small>
                </div>
              )}
            </div>

            {/* 2-Columns Form Row */}
            <div className="dss-form-row">
              <div className="dss-form-col">
                <label className="dss-form-label">
                  Program Terkait <span className="req">*</span>
                </label>
                <select
                  className="dss-form-select"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  required
                >
                  {availablePrograms.length === 0 ? (
                    <option value="">Belum ada program di database</option>
                  ) : (
                    availablePrograms.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="dss-form-col">
                <label className="dss-form-label">
                  Estimasi Total Anggaran <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="dss-form-input"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Rp 45.200.000"
                  required
                />
              </div>
            </div>

            {/* Full-Width Notes Field */}
            <div className="dss-form-col" style={{ marginBottom: 18 }}>
              <label className="dss-form-label">Catatan / Keterangan Pengajuan</label>
              <textarea
                className="dss-form-textarea"
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Rincian alokasi biaya transportasi, konsumsi peserta, dan material modul belajar selama fase program 3 bulan."
              />
            </div>

            {/* Footer Row */}
            <div className="dss-card-footer">
              <div className="dss-footer-note">
                <Icon name="info" />
                <span>Format RAB akan divalidasi otomatis oleh kalkulator pagu anggaran DSS.</span>
              </div>
              <button type="submit" className="dss-submit-btn" disabled={isSubmitting}>
                <Icon name="send" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim pengajuan RAB'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================================
  // VIEW 3: DETAIL RAB (SESUAI FORMAT HALAMAN PROPOSAL)
  // ==========================================================
  if (view === 'detail' && selectedRab) {
    const r = selectedRab
    return (
      <div className="prop-detail-page">
        <div className="prop-upload-nav">
          <button
            type="button"
            className="prop-back-link"
            onClick={() => {
              setView('list')
              setSelectedRab(null)
            }}
          >
            <CommonIcon name="back" />
            <span>Kembali ke daftar pengajuan anggaran (RAB)</span>
          </button>
        </div>

        <div className="prop-detail-header">
          <div>
            <div className="prop-detail-id-row">
              <span className="prop-id-badge">{r.id}</span>
              <span className="prop-cat-badge">{r.division || r.category || 'Divisi Program'}</span>
              <span
                className={`prop-status-pill ${
                  r.status === 'Disetujui'
                    ? 'prop-status-green'
                    : r.status === 'Dalam telaah'
                    ? 'prop-status-blue'
                    : 'prop-status-orange'
                }`}
              >
                <span className="prop-dot" />
                <span>{r.status}</span>
              </span>
            </div>
            <h1>{r.title}</h1>
            <p>
              {r.location}, {r.province} • Diajukan pada {r.date}
            </p>
          </div>

          <div className="prop-detail-actions">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() => {
                if (r.file_url) {
                  window.open(getFullUploadUrl(r.file_url, true), '_blank')
                } else {
                  notify(
                    `Berkas fisik untuk ${r.id} belum diunggah. Gunakan tombol "Unggah Revisi / Berkas" untuk melampirkan berkas.`
                  )
                }
              }}
            >
              <CommonIcon name="download" />
              <span>
                Unduh {r.file_type || 'Excel/PDF'} ({r.file_size || '1.8 MB'})
              </span>
            </button>
            <button
              type="button"
              className="db-btn db-btn-primary"
              onClick={() => {
                setRevisingRab(r)
                setSelectedProgram(r.program_id ? `${r.program_id} - ${r.title}` : r.title)
                setBudgetInput(r.estimated_budget)
                setNotesInput(r.evaluation_notes || '')
                setView('upload')
              }}
            >
              <CommonIcon name="plus" />
              <span>{r.file_url ? 'Unggah Revisi RAB' : 'Unggah Berkas RAB'}</span>
            </button>
          </div>
        </div>

        {/* Status notice */}
        {r.status === 'Perlu revisi' ? (
          <div className="prop-notice-alert warning">
            <span className="prop-notice-icon">⚠️</span>
            <div>
              <strong>Catatan Peninjau / Evaluasi Direktur Tersedia</strong>
              <p>
                {r.evaluation_notes ||
                  r.status_note ||
                  'Mohon periksa komponen rincian biaya operasional dan sesuaikan pagu unit cost sesuai acuan DSS.'}
              </p>
            </div>
          </div>
        ) : r.status === 'Disetujui' ? (
          <div className="prop-notice-alert success">
            <span className="prop-notice-icon">✅</span>
            <div>
              <strong>Rencana Anggaran Biaya (RAB) Telah Disetujui</strong>
              <p>
                {r.evaluation_notes ||
                  r.status_note ||
                  'Anggaran biaya telah ditelaah dan disetujui. Siap diproses untuk penerbitan SPK dan pencairan dana termin.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="prop-notice-alert info">
            <span className="prop-notice-icon">ℹ️</span>
            <div>
              <strong>Dalam Proses Penelaahan Anggaran (DSS)</strong>
              <p>
                {r.evaluation_notes ||
                  r.status_note ||
                  'Pengajuan anggaran biaya sedang dalam telaah kelayakan pagu oleh tim reviewer program dan divisi keuangan.'}
              </p>
            </div>
          </div>
        )}

        <div className="prop-detail-grid">
          <div className="prop-detail-card">
            <h3>Ringkasan Rencana Anggaran Biaya</h3>
            <div className="prop-info-list">
              <div className="prop-info-row">
                <span>Nama Program / Kegiatan</span>
                <strong>{r.title}</strong>
              </div>
              <div className="prop-info-row">
                <span>Total Estimasi Anggaran</span>
                <strong style={{ color: '#078780', fontSize: '15px' }}>{r.estimated_budget}</strong>
              </div>
              <div className="prop-info-row">
                <span>Divisi Pengaju</span>
                <strong>{r.division || r.category || 'Divisi Program'}</strong>
              </div>
              <div className="prop-info-row">
                <span>Wilayah Sasaran</span>
                <strong>
                  {r.location}, {r.province}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Tanggal Diajukan</span>
                <strong>{r.date}</strong>
              </div>
              <div className="prop-info-row">
                <span>Format Lampiran Berkas</span>
                <strong>
                  {r.file_type || 'Excel/PDF'} • {r.file_size || '1.8 MB'}
                </strong>
              </div>
              {r.program_id && (
                <div className="prop-info-row">
                  <span>ID Program Terkait</span>
                  <strong>{r.program_id}</strong>
                </div>
              )}
              <div className="prop-info-row">
                <span>Keterangan Penelaahan</span>
                <strong style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {r.evaluation_notes || r.status_note || 'Menunggu hasil telaah'}
                </strong>
              </div>
            </div>
          </div>

          <div className="prop-detail-card">
            <h3>Dokumen Lampiran Berkas RAB</h3>
            <div className="prop-file-box">
              <span className="prop-file-chip-icon big">
                <CommonIcon name="pdf" />
              </span>
              <div className="prop-file-meta-box">
                <strong>
                  {r.file_name ||
                    `${r.title.replace(/\s+/g, '_')}.${(r.file_type && r.file_type.toLowerCase().includes('excel') ? 'xlsx' : 'pdf')}`}
                </strong>
                <small>
                  {r.file_size || '1.8 MB'} • {r.file_url ? 'Berkas RAB terunggah di server' : 'Belum ada berkas fisik'}
                </small>
              </div>
              <button
                type="button"
                className="prop-btn-download-icon"
                onClick={() => {
                  if (r.file_url) {
                    window.open(getFullUploadUrl(r.file_url, true), '_blank')
                  } else {
                    notify(`Berkas fisik belum tersedia. Silakan klik "Unggah Berkas RAB" di kanan atas.`)
                  }
                }}
                title="Unduh Berkas RAB"
              >
                <CommonIcon name="download" />
              </button>
            </div>

            {/* Standar Alokasi DSS Biaya */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                background: '#fafcfc',
                border: '1px solid #edf1f1',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#172324' }}>
                Komposisi Standar Alokasi DSS:
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Pelaksanaan &amp; Logistik (60%)</span>
                <strong>Tepat Sasaran</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Sarana &amp; Alat Pendukung (25%)</span>
                <strong>Sesuai Pagu</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Operasional &amp; Monev (15%)</span>
                <strong>Maksimal 15%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================
  // RENDER: VIEW 1 - MAIN LIST VIEW (MATCHING IMAGE 1)
  // ==========================================================
  return (
    <div className="dss-container">
      {/* 1. Header Title Row */}
      <div className="dss-header-row">
        <div className="dss-title-group">
          <div className="dss-title-badge-wrap">
            <h1 className="dss-main-title">DSS (Rencana Anggaran Biaya)</h1>
            <span className="dss-data-badge">Data Anggaran</span>
          </div>
          <p className="dss-subtitle">
            Pantau pengajuan anggaran kegiatan, telaah kelayakan biaya, dan tindak lanjut persetujuan RAB.
          </p>
        </div>

        <div className="dss-action-wrap">
          <button
            type="button"
            className="dss-primary-btn"
            onClick={() => setView('upload')}
          >
            <Icon name="plus" />
            <span>+ Buat Pengajuan RAB</span>
          </button>
          <span className="dss-btn-subtext">Lanjut ke unggah lampiran RAB</span>
        </div>
      </div>

      {/* 2. 4 Stat KPI Cards */}
      <div className="dss-kpi-grid">
        {/* Card 1: Total */}
        <div className="dss-kpi-card">
          <div className="dss-kpi-info">
            <span className="dss-kpi-label">Total RAB Diajukan</span>
            <div className="dss-kpi-val">
              <strong>{counts.total}</strong>
              <span className="dss-kpi-amount">({counts.totalAmount})</span>
            </div>
            <span className="dss-kpi-sub">Seluruh pengajuan terdaftar</span>
          </div>
          <div className="dss-kpi-icon-box green">
            <Icon name="file" />
          </div>
        </div>

        {/* Card 2: Dalam Penelaahan */}
        <div className="dss-kpi-card">
          <div className="dss-kpi-info">
            <span className="dss-kpi-label">Dalam Penelaahan</span>
            <div className="dss-kpi-val">
              <strong>{counts.dalamTelaah}</strong>
              <span className="dss-kpi-amount">({counts.dalamTelaahAmount})</span>
            </div>
            <span className="dss-kpi-sub">Menunggu evaluasi komite</span>
          </div>
          <div className="dss-kpi-icon-box blue">
            <Icon name="clock" />
          </div>
        </div>

        {/* Card 3: Perlu Revisi */}
        <div className="dss-kpi-card">
          <div className="dss-kpi-info">
            <span className="dss-kpi-label">Perlu Revisi Anggaran</span>
            <div className="dss-kpi-val">
              <strong>{counts.perluRevisi}</strong>
              <span className="dss-kpi-amount">({counts.perluRevisiAmount})</span>
            </div>
            <span className="dss-kpi-sub">Periksa catatan reviewer</span>
          </div>
          <div className="dss-kpi-icon-box orange">
            <Icon name="fileEdit" />
          </div>
        </div>

        {/* Card 4: Disetujui */}
        <div className="dss-kpi-card">
          <div className="dss-kpi-info">
            <span className="dss-kpi-label">RAB Disetujui</span>
            <div className="dss-kpi-val">
              <strong>{counts.disetujui}</strong>
              <span className="dss-kpi-amount">({counts.disetujuiAmount})</span>
            </div>
            <span className="dss-kpi-sub">Siap pencairan & tahap SPK</span>
          </div>
          <div className="dss-kpi-icon-box green">
            <Icon name="checkCircle" />
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs Bar */}
      <div className="dss-tabs-bar">
        <div className="dss-tabs-group">
          <button
            type="button"
            className={`dss-tab-btn ${activeTab === 'Semua' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Semua')
              setPage(1)
            }}
          >
            Semua ({counts.total})
          </button>
          <button
            type="button"
            className={`dss-tab-btn ${activeTab === 'Dalam penelaahan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Dalam penelaahan')
              setPage(1)
            }}
          >
            Dalam penelaahan ({counts.dalamTelaah})
          </button>
          <button
            type="button"
            className={`dss-tab-btn ${activeTab === 'Perlu revisi' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Perlu revisi')
              setPage(1)
            }}
          >
            Perlu revisi ({counts.perluRevisi})
          </button>
          <button
            type="button"
            className={`dss-tab-btn ${activeTab === 'Disetujui' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Disetujui')
              setPage(1)
            }}
          >
            Disetujui ({counts.disetujui})
          </button>
        </div>

        <span className="dss-tabs-note">Menampilkan seluruh pengajuan RAB tahun berjalan</span>
      </div>

      {/* 4. Toolbar: Search Box & 3 Filters */}
      <div className="dss-toolbar">
        {/* Search */}
        <div className="dss-search-wrap">
          <Icon name="search" />
          <input
            type="text"
            className="dss-search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Cari nomor RAB, nama program, atau divisi..."
          />
        </div>

        {/* 3 Dropdown Filters */}
        <div className="dss-filters-group">
          {/* Dropdown 1: Kategori Program */}
          <div className="dss-filter-select-wrap">
            <span className="dss-filter-icon">
              <Icon name="filter" />
            </span>
            <select
              className="dss-filter-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="Semua">Semua kategori program</option>
              <option value="Divisi Kesiapsiagaan">Divisi Kesiapsiagaan</option>
              <option value="Divisi Sosial">Divisi Sosial</option>
              <option value="Divisi Ekonomi">Divisi Ekonomi</option>
              <option value="Divisi Tanggap Darurat">Divisi Tanggap Darurat</option>
              <option value="Divisi Pendidikan">Divisi Pendidikan</option>
              <option value="Divisi Lingkungan">Divisi Lingkungan</option>
              <option value="Divisi Kesehatan">Divisi Kesehatan</option>
            </select>
            <span className="dss-filter-arrow">
              <Icon name="chevronDown" />
            </span>
          </div>

          {/* Dropdown 2: Wilayah */}
          <div className="dss-filter-select-wrap">
            <span className="dss-filter-icon">
              <Icon name="pin" />
            </span>
            <select
              className="dss-filter-select"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="Semua">Semua wilayah</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
              <option value="DI Yogyakarta">DI Yogyakarta</option>
              <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
              <option value="Sulawesi Barat">Sulawesi Barat</option>
              <option value="Banten">Banten</option>
              <option value="Papua">Papua</option>
              <option value="Jawa Timur">Jawa Timur</option>
            </select>
            <span className="dss-filter-arrow">
              <Icon name="chevronDown" />
            </span>
          </div>

          {/* Dropdown 3: Periode */}
          <div className="dss-filter-select-wrap">
            <span className="dss-filter-icon">
              <Icon name="calendar" />
            </span>
            <select
              className="dss-filter-select"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value="Semua">Semua periode</option>
              <option value="2026">Tahun 2026</option>
              <option value="Okt 2026">Oktober 2026</option>
              <option value="Sep 2026">September 2026</option>
            </select>
            <span className="dss-filter-arrow">
              <Icon name="chevronDown" />
            </span>
          </div>
        </div>
      </div>

      {/* 5. Data Table Card */}
      <div className="dss-table-card">
        <div className="dss-table-responsive">
          <table className="dss-table">
            <thead>
              <tr>
                <th>DOKUMEN RAB</th>
                <th>PROGRAM & LOKASI</th>
                <th>NOMINAL RAB</th>
                <th className="sortable">
                  TGL. PENGAJUAN <Icon name="arrowDown" />
                </th>
                <th>LAMPIRAN & FORMAT</th>
                <th>STATUS DSS</th>
                <th>TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px 20px', color: '#889899' }}>
                    Tidak ada dokumen RAB yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenAction(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Dokumen RAB */}
                    <td>
                      <p className="dss-doc-title">{item.title}</p>
                      <p className="dss-doc-meta">
                        {item.id} • {item.division}
                      </p>
                    </td>

                    {/* Program & Lokasi */}
                    <td>
                      <p className="dss-loc-city">{item.location}</p>
                      <p className="dss-loc-prov">{item.province}</p>
                    </td>

                    {/* Nominal RAB */}
                    <td>
                      <p className="dss-nominal-val">{item.estimated_budget}</p>
                    </td>

                    {/* Tgl Pengajuan */}
                    <td>
                      <p className="dss-date-val">{item.date}</p>
                    </td>

                    {/* Lampiran & Format */}
                    <td>
                      <div className="dss-file-cell">
                        <span className="dss-file-icon">
                          <Icon name="file" />
                        </span>
                        <div className="dss-file-info">
                          <span className="dss-file-name">{item.file_type}</span>
                          <span className="dss-file-size">{item.file_size}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status DSS */}
                    <td>
                      <div className="dss-status-cell">
                        <span
                          className={`dss-status-pill ${
                            item.status === 'Perlu revisi'
                              ? 'revisi'
                              : item.status === 'Dalam telaah'
                              ? 'telaah'
                              : 'disetujui'
                          }`}
                        >
                          <span className="dss-status-dot" />
                          <span>{item.status}</span>
                        </span>
                        <span className="dss-status-subnote">{item.status_note}</span>
                      </div>
                    </td>

                    {/* Tindakan */}
                    <td>
                      <button
                        type="button"
                        className="dss-action-link"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenAction(item)
                        }}
                      >
                        <span>{item.action_text || (item.status === 'Perlu revisi' ? 'Lihat catatan' : 'Lihat detail')}</span>
                        <Icon name="arrowUpRight" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Bar */}
        <div className="dss-pagination-bar">
          <span>
            Menampilkan {totalItems > 0 ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, totalItems)} dari {totalItems} pengajuan RAB
          </span>

          <div className="dss-pagination-controls">
            <select className="dss-per-page-select" defaultValue="10">
              <option value="10">10 per halaman</option>
              <option value="20">20 per halaman</option>
            </select>

            <div className="dss-page-btns">
              <button
                type="button"
                className="dss-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Icon name="chevronLeft" />
              </button>
              <button
                type="button"
                className={`dss-page-btn ${page === 1 ? 'active' : ''}`}
                onClick={() => setPage(1)}
              >
                1
              </button>
              {totalItems > perPage && (
                <button
                  type="button"
                  className={`dss-page-btn ${page === 2 ? 'active' : ''}`}
                  onClick={() => setPage(2)}
                >
                  2
                </button>
              )}
              <button
                type="button"
                className="dss-page-btn"
                onClick={() => setPage((p) => Math.min(Math.ceil(totalItems / perPage), p + 1))}
                disabled={page * perPage >= totalItems}
              >
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
