'use client'

import { useState, useMemo, ChangeEvent, FormEvent, useEffect, useRef } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import { Icon as CommonIcon } from '@/components/common/Icons'

/* ==========================================================
   ICONS
   ========================================================== */
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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

function FileTextIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function PdfFileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

/* ==========================================================
   TYPES & HELPERS
   ========================================================== */
export type SpkStatus = 'Dalam pelaksanaan' | 'Selesai'

export interface SpkItem {
  id: string
  spk_number: string
  program_name: string
  category: string
  first_party: string
  second_party: string
  second_party_role: string
  contact_number: string
  location: string
  province: string
  budget: number
  budget_formatted?: string
  payment_terms?: string
  start_date: string
  end_date: string
  scope_of_work?: string
  target_output?: string
  notes?: string
  status: SpkStatus
  file_type?: string
  file_size?: string
  created_at?: string
}

const fallbackSpks: SpkItem[] = [
  {
    id: 'spk-001',
    spk_number: 'SPK-2026-042',
    program_name: 'Pelatihan Relawan Siaga Bencana',
    category: 'Kesiapsiagaan',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Forum Pengurangan Risiko Bencana',
    second_party_role: 'Mitra Pelaksana Lapangan',
    contact_number: '081234567890',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    budget: 45200000,
    payment_terms: 'Termin 1 (50%), Termin 2 (40%), Termin 3 (10%)',
    start_date: '29 Okt 2026',
    end_date: '30 Nov 2026',
    scope_of_work: 'Penyelenggaraan simulasi kebencanaan, pelatihan vertical rescue, dan sertifikasi relawan madya.',
    target_output: '60 personel relawan terlatih dan tersertifikasi tanggap bencana.',
    status: 'Dalam pelaksanaan',
    file_type: 'PDF',
    file_size: '3,4 MB',
  },
  {
    id: 'spk-002',
    spk_number: 'SPK-2026-039',
    program_name: 'Distribusi Air Bersih Musim Kemarau',
    category: 'Sosial',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Kelompok Swadaya Masyarakat Sambelia',
    second_party_role: 'Pelaksana Teknis Lapangan',
    contact_number: '082198765432',
    location: 'Lombok Timur',
    province: 'Nusa Tenggara Barat',
    budget: 82500000,
    payment_terms: 'Termin 1 (40%), Termin 2 (40%), Pelunasan (20%)',
    start_date: '28 Okt 2026',
    end_date: '15 Des 2026',
    scope_of_work: 'Pengeboran sumur sedalam 60m, pemasangan toren air kapasitas 5.000 liter, dan instalasi pipa warga.',
    target_output: '2 unit sumur bor & pipanisasi air bersih ke 240 kepala keluarga.',
    status: 'Dalam pelaksanaan',
    file_type: 'PDF',
    file_size: '4,1 MB',
  },
  {
    id: 'spk-003',
    spk_number: 'SPK-2026-035',
    program_name: 'Modal Usaha UMKM Perempuan Berdaya',
    category: 'Ekonomi',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Koperasi Wanita Berdaya Bogor',
    second_party_role: 'Mitra Penyelenggara',
    contact_number: '085711223344',
    location: 'Kab. Bogor',
    province: 'Jawa Barat',
    budget: 65000000,
    payment_terms: 'Termin 1 (60%), Termin 2 (40%)',
    start_date: '27 Okt 2026',
    end_date: '20 Des 2026',
    scope_of_work: 'Penyelenggaraan workshop digital marketing, sertifikasi halal/P-IRT, dan hibah modal usaha bergulir.',
    target_output: '50 pelaku usaha perempuan tersertifikasi & terhubung ke pasar daring.',
    status: 'Dalam pelaksanaan',
    file_type: 'PDF',
    file_size: '2,8 MB',
  },
  {
    id: 'spk-004',
    spk_number: 'SPK-2026-031',
    program_name: 'Posko Logistik Bencana Banjir',
    category: 'Kemanusiaan',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Koordinator Relawan Dayeuhkolot',
    second_party_role: 'Koordinator Posko Lapangan',
    contact_number: '081399887766',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    budget: 120000000,
    payment_terms: 'Pencairan 100% cepat tanggap darurat',
    start_date: '25 Okt 2026',
    end_date: '08 Nov 2026',
    scope_of_work: 'Pendirian dapur umum, suplai makanan siap santap 2.000 porsi/hari, dan evakuasi korban terdampak.',
    target_output: '3.500 warga terdampak menerima bantuan logistik dan pangan.',
    status: 'Selesai',
    file_type: 'PDF',
    file_size: '5,2 MB',
  },
  {
    id: 'spk-005',
    spk_number: 'SPK-2026-028',
    program_name: 'Renovasi Sarana Sekolah Pelosok',
    category: 'Pendidikan',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Komite Pembangunan Madrasah Cianjur',
    second_party_role: 'Panitia Pembangunan Swakelola',
    contact_number: '081822334455',
    location: 'Kab. Cianjur',
    province: 'Jawa Barat',
    budget: 95000000,
    payment_terms: 'Termin 1 (50%), Termin 2 (30%), Termin 3 (20%)',
    start_date: '23 Okt 2026',
    end_date: '10 Jan 2027',
    scope_of_work: 'Perbaikan atap bocor 3 ruang kelas, pembangunan 2 unit MCK sekolah, dan penyediaan meja kursi belajar.',
    target_output: 'Fasilitas belajar 120 murid madrasah kembali layak dan aman digunakan.',
    status: 'Dalam pelaksanaan',
    file_type: 'PDF',
    file_size: '3,9 MB',
  },
  {
    id: 'spk-006',
    spk_number: 'SPK-2026-024',
    program_name: 'Penanaman 10.000 Pohon Agroforestri',
    category: 'Lingkungan',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: 'Kelompok Tani Hutan Wana Lestari',
    second_party_role: 'Pengelola Lahan Konservasi',
    contact_number: '087811992288',
    location: 'Gunungkidul',
    province: 'DI Yogyakarta',
    budget: 20800000,
    payment_terms: 'Termin 1 (70%) pengadaan bibit, Termin 2 (30%) monitoring tanam',
    start_date: '21 Okt 2026',
    end_date: '30 Nov 2026',
    scope_of_work: 'Pengadaan bibit sengon & alpukat, pematokan lubang tanam, dan penanaman bersama 100 relawan lokal.',
    target_output: '10.000 bibit pohon tertanam di area kritis seluas 15 hektar.',
    status: 'Selesai',
    file_type: 'PDF',
    file_size: '1,9 MB',
  },
]

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

function formatJuta(val: number): string {
  const jt = val / 1000000
  return `Rp ${jt.toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt`
}

function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  return digits ? parseInt(digits, 10) : 0
}

function formatRupiahInput(value: string): string {
  const num = parseCurrencyInput(value)
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

/* ==========================================================
   MAIN COMPONENT
   ========================================================== */
export default function SpkPage() {
  const { setSubCrumbs, notify } = useDashboard()

  const [view, setView] = useState<'list' | 'form' | 'detail'>('list')
  const [spks, setSpks] = useState<SpkItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedSpk, setSelectedSpk] = useState<SpkItem | null>(null)

  const handleOpenDetail = (item: SpkItem) => {
    setSelectedSpk(item)
    setView('detail')
  }

  // Filters & Tabs
  const [statusTab, setStatusTab] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [provinceFilter, setProvinceFilter] = useState<string>('all')
  const [periodFilter, setPeriodFilter] = useState<string>('all')

  // Uploaded File state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    program_name: '',
    category: 'Pendidikan',
    first_party: 'Divisi Program Relawan Nusantara',
    second_party: '',
    second_party_role: 'Mitra Pelaksana Lapangan',
    contact_number: '',
    location: '',
    province: 'Jawa Barat',
    budget_raw: '',
    start_date: '',
    end_date: '',
    scope_of_work: '',
    payment_terms: 'Termin 1 (50%), Termin 2 (40%), Termin 3 (10%)',
    target_output: '',
    notes: '',
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Sync breadcrumbs
  useEffect(() => {
    if (view === 'list') {
      setSubCrumbs([])
    } else if (view === 'form') {
      setSubCrumbs(['SPK', 'Unggah Dokumen SPK'])
    } else if (view === 'detail') {
      setSubCrumbs(['SPK', 'Detail SPK'])
    }
  }, [view, setSubCrumbs])

  // Load data from backend
  const loadSpks = async () => {
    try {
      setIsLoading(true)
      const res = await api.getSpkList()
      const list = res?.spks || res?.data
      if (Array.isArray(list)) {
        // Map data ensuring no "Menunggu TTD"
        const mapped = list.map((item: any) => ({
          ...item,
          status: item.status === 'Selesai' ? 'Selesai' : 'Dalam pelaksanaan',
        }))
        setSpks(mapped)
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSpks()
  }, [])

  // KPI Calculations (3 cards: Total, Dalam Pelaksanaan, Selesai)
  const counts = useMemo(() => {
    const totalCount = spks.length
    const totalBudget = spks.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0)

    const inProgress = spks.filter((s) => s.status === 'Dalam pelaksanaan')
    const inProgressBudget = inProgress.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0)

    const completed = spks.filter((s) => s.status === 'Selesai')
    const completedBudget = completed.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0)

    return {
      totalCount,
      totalBudget,
      inProgressCount: inProgress.length,
      inProgressBudget,
      completedCount: completed.length,
      completedBudget,
    }
  }, [spks])

  // Categories & Provinces for filters
  const categoryOptions = useMemo(() => {
    return Array.from(new Set(spks.map((s) => s.category).filter(Boolean)))
  }, [spks])

  const provinceOptions = useMemo(() => {
    return Array.from(new Set(spks.map((s) => s.province).filter(Boolean)))
  }, [spks])

  // Filtered List
  const filteredSpks = useMemo(() => {
    return spks.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          item.spk_number?.toLowerCase().includes(q) ||
          item.program_name?.toLowerCase().includes(q) ||
          item.second_party?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
        if (!match) return false
      }
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false
      }
      if (provinceFilter !== 'all' && item.province !== provinceFilter) {
        return false
      }
      return true
    })
  }, [spks, searchQuery, categoryFilter, provinceFilter])

  // Form input handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'budget_raw') {
      const formatted = formatRupiahInput(value)
      setFormData((prev) => ({ ...prev, budget_raw: formatted }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // File drag & drop / picker handler
  const handleFileSelect = (file: File) => {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    const isDoc = file.name.endsWith('.doc') || file.name.endsWith('.docx')
    setUploadedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: isDoc ? 'DOCX' : 'PDF',
    })
    // Auto-fill program name if empty
    if (!formData.program_name.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
      setFormData((prev) => ({ ...prev, program_name: cleanName }))
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Handle Form Submit (Unggah & Simpan Dokumen SPK)
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.program_name.trim()) {
      notify('Nama Program wajib diisi.')
      return
    }
    if (!formData.second_party.trim()) {
      notify('Nama Pihak Kedua / Penerima Tugas wajib diisi.')
      return
    }
    if (!formData.budget_raw) {
      notify('Nilai Anggaran SPK wajib diisi.')
      return
    }

    const budgetNum = parseCurrencyInput(formData.budget_raw)
    const docFileType = uploadedFile ? uploadedFile.type : 'PDF'
    const docFileSize = uploadedFile ? uploadedFile.size : '2,8 MB'

    setFormSubmitting(true)
    try {
      const payload = {
        program_name: formData.program_name,
        category: formData.category,
        first_party: formData.first_party,
        second_party: formData.second_party,
        second_party_role: formData.second_party_role,
        contact_number: formData.contact_number,
        location: formData.location || 'Kab. Bandung',
        province: formData.province || 'Jawa Barat',
        budget: budgetNum,
        payment_terms: formData.payment_terms,
        start_date: formData.start_date || '01 Nov 2026',
        end_date: formData.end_date || '31 Des 2026',
        scope_of_work: formData.scope_of_work,
        target_output: formData.target_output,
        notes: formData.notes,
        status: 'Dalam pelaksanaan',
        file_type: docFileType,
        file_size: docFileSize,
      }

      const res = await api.createSpk(payload)
      const createdItem = res?.spk || res?.data
      if (createdItem) {
        setSpks((prev) => [
          {
            ...createdItem,
            file_type: docFileType,
            file_size: docFileSize,
            status: 'Dalam pelaksanaan',
          },
          ...prev,
        ])
      } else {
        const newNum = spks.length + 45
        const newLocalItem: SpkItem = {
          id: `spk-${Date.now()}`,
          spk_number: `SPK-2026-0${newNum}`,
          ...payload,
          status: 'Dalam pelaksanaan',
          file_type: docFileType,
          file_size: docFileSize,
        }
        setSpks((prev) => [newLocalItem, ...prev])
      }

      notify(`Dokumen SPK untuk "${formData.program_name}" berhasil diunggah dan disimpan ke daftar dokumen!`)
      setFormData({
        program_name: '',
        category: 'Pendidikan',
        first_party: 'Divisi Program Relawan Nusantara',
        second_party: '',
        second_party_role: 'Mitra Pelaksana Lapangan',
        contact_number: '',
        location: '',
        province: 'Jawa Barat',
        budget_raw: '',
        start_date: '',
        end_date: '',
        scope_of_work: '',
        payment_terms: 'Termin 1 (50%), Termin 2 (40%), Termin 3 (10%)',
        target_output: '',
        notes: '',
      })
      setUploadedFile(null)
      setView('list')
    } catch {
      notify('Dokumen SPK berhasil disimpan ke daftar dokumen lokal.')
      setView('list')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Update status handler (simple: Dalam pelaksanaan or Selesai)
  const handleUpdateStatus = async (id: string, newStatus: SpkStatus) => {
    try {
      await api.updateSpkStatus(id, newStatus)
      setSpks((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
      if (selectedSpk && selectedSpk.id === id) {
        setSelectedSpk({ ...selectedSpk, status: newStatus })
      }
      notify(`Status SPK diperbarui menjadi "${newStatus}".`)
    } catch {
      setSpks((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
      notify(`Status diperbarui menjadi "${newStatus}".`)
    }
  }

  /* ==========================================================
     RENDER: FORM & UPLOAD VIEW
     ========================================================== */
  if (view === 'form') {
    return (
      <div className="spk-form-page">
        {/* Back Button & Heading */}
        <div className="spk-form-header">
          <button
            type="button"
            className="spk-back-btn"
            onClick={() => setView('list')}
            aria-label="Kembali ke daftar SPK"
          >
            <ArrowBackIcon />
            <span>Kembali ke daftar SPK</span>
          </button>

          <div className="spk-form-heading">
            <div className="spk-title-row">
              <h1>Unggah Dokumen SPK (Surat Perintah Kerja)</h1>
              <span className="spk-tag-pill">Unggah &amp; Catat Dokumen</span>
            </div>
            <p>
              Unggah berkas dokumen SPK dan lengkapi rincian penugasan mitra untuk disimpan langsung dalam daftar arsip resmi Divisi Program.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="spk-form-card">
          {/* File Upload Zone */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#172324', marginBottom: '8px' }}>
              Berkas Dokumen SPK (PDF / Word)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            <div
              className={`spk-upload-dropzone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="spk-upload-icon-circle">
                <UploadIcon />
              </div>
              <strong className="spk-upload-title">
                {uploadedFile ? 'Ganti Berkas Dokumen SPK' : 'Tarik dan letakkan berkas SPK di sini'}
              </strong>
              <span className="spk-upload-sub">atau klik untuk memilih berkas dari perangkat Anda</span>
              <span className="spk-upload-format-note">Mendukung format PDF, DOC, atau DOCX (Maksimal 25 MB)</span>

              {uploadedFile && (
                <div
                  className="spk-file-chosen-box"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="spk-file-chosen-info">
                    <span className="spk-file-chosen-badge">{uploadedFile.type}</span>
                    <div>
                      <span className="spk-file-chosen-name">{uploadedFile.name}</span>
                      <span className="spk-file-chosen-size">{uploadedFile.size} • Siap disimpan</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="spk-file-remove-btn"
                    onClick={() => setUploadedFile(null)}
                    title="Hapus berkas terpilih"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="spk-form-grid">
            {/* 1. Nama Program */}
            <div className="spk-field-group col-span-2">
              <label htmlFor="program_name">
                <span>Nama Program / Kegiatan <span className="spk-required">*</span></span>
                <span className="spk-field-badge">Wajib</span>
              </label>
              <input
                id="program_name"
                name="program_name"
                type="text"
                placeholder="Contoh: Program Sumur Bor dan Pipanisasi Desa Sukamaju"
                value={formData.program_name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 2. Kategori Program */}
            <div className="spk-field-group">
              <label htmlFor="category">
                <span>Kategori Program <span className="spk-required">*</span></span>
                <span className="spk-field-badge">Pilihan</span>
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Kemanusiaan">Kemanusiaan</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Lingkungan">Lingkungan</option>
                <option value="Sosial">Sosial</option>
                <option value="Kesiapsiagaan">Kesiapsiagaan</option>
              </select>
            </div>

            {/* 3. Pihak Pertama / Pemberi Tugas */}
            <div className="spk-field-group">
              <label htmlFor="first_party">
                <span>Pihak Pertama (Pemberi Tugas)</span>
              </label>
              <input
                id="first_party"
                name="first_party"
                type="text"
                value={formData.first_party}
                onChange={handleInputChange}
              />
            </div>

            {/* 4. Nama Pihak Kedua / Penerima Tugas */}
            <div className="spk-field-group">
              <label htmlFor="second_party">
                <span>Pihak Kedua (Penerima Tugas) <span className="spk-required">*</span></span>
                <span className="spk-field-badge">Wajib</span>
              </label>
              <input
                id="second_party"
                name="second_party"
                type="text"
                placeholder="Nama Yayasan / Koperasi / Koordinator Lapangan"
                value={formData.second_party}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 5. Peran / Jabatan Penerima Tugas */}
            <div className="spk-field-group">
              <label htmlFor="second_party_role">
                <span>Peran / Jabatan Penerima Tugas</span>
              </label>
              <input
                id="second_party_role"
                name="second_party_role"
                type="text"
                placeholder="Contoh: Mitra Pelaksana Lapangan / Koordinator Wilayah"
                value={formData.second_party_role}
                onChange={handleInputChange}
              />
            </div>

            {/* 6. Nomor Kontak / WhatsApp */}
            <div className="spk-field-group">
              <label htmlFor="contact_number">
                <span>Nomor Kontak / WhatsApp</span>
              </label>
              <input
                id="contact_number"
                name="contact_number"
                type="tel"
                placeholder="Contoh: 081234567890"
                value={formData.contact_number}
                onChange={handleInputChange}
              />
            </div>

            {/* 7. Provinsi Pelaksanaan */}
            <div className="spk-field-group">
              <label htmlFor="province">
                <span>Wilayah Provinsi <span className="spk-required">*</span></span>
              </label>
              <select id="province" name="province" value={formData.province} onChange={handleInputChange}>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
                <option value="DI Yogyakarta">DI Yogyakarta</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
              </select>
            </div>

            {/* 8. Lokasi Pelaksanaan Program */}
            <div className="spk-field-group col-span-2">
              <label htmlFor="location">
                <span>Lokasi Pelaksanaan Program <span className="spk-required">*</span></span>
              </label>
              <textarea
                id="location"
                name="location"
                rows={2}
                placeholder="Tuliskan alamat lengkap, desa/kelurahan, kecamatan, dan kabupaten/kota..."
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 9. Nilai Anggaran / Kontrak SPK */}
            <div className="spk-field-group">
              <label htmlFor="budget_raw">
                <span>Nilai Anggaran / Kontrak SPK <span className="spk-required">*</span></span>
              </label>
              <div className="spk-input-prefix-box">
                <span className="spk-input-prefix">Rp</span>
                <input
                  id="budget_raw"
                  name="budget_raw"
                  type="text"
                  placeholder="0"
                  value={formData.budget_raw}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* 10. Ketentuan Pembayaran & Termin */}
            <div className="spk-field-group">
              <label htmlFor="payment_terms">
                <span>Ketentuan Pembayaran &amp; Termin</span>
              </label>
              <input
                id="payment_terms"
                name="payment_terms"
                type="text"
                placeholder="Contoh: Termin 1 (50%), Termin 2 (40%), Termin 3 (10%)"
                value={formData.payment_terms}
                onChange={handleInputChange}
              />
            </div>

            {/* 11. Tanggal Mulai & Tanggal Selesai */}
            <div className="spk-field-group">
              <label htmlFor="start_date">
                <span>Tanggal Mulai Pelaksanaan</span>
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="spk-field-group">
              <label htmlFor="end_date">
                <span>Tanggal Selesai Pelaksanaan</span>
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>

            {/* 12. Ruang Lingkup Pekerjaan / Uraian Tugas */}
            <div className="spk-field-group col-span-2">
              <label htmlFor="scope_of_work">
                <span>Ruang Lingkup Pekerjaan / Uraian Tugas <span className="spk-required">*</span></span>
              </label>
              <textarea
                id="scope_of_work"
                name="scope_of_work"
                rows={3}
                placeholder="Rincikan lingkup tanggung jawab pihak kedua, tahapan teknis, dan standar penyelesaian lapangan..."
                value={formData.scope_of_work}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 13. Target Output yang Diharapkan */}
            <div className="spk-field-group col-span-2">
              <label htmlFor="target_output">
                <span>Target Output yang Diinginkan</span>
              </label>
              <textarea
                id="target_output"
                name="target_output"
                rows={2}
                placeholder="Contoh: Tersedianya 2 unit sarana sanitasi layak pakai serta laporan pertanggungjawaban lengkap."
                value={formData.target_output}
                onChange={handleInputChange}
              />
            </div>

            {/* 14. Catatan / Syarat Khusus */}
            <div className="spk-field-group col-span-2">
              <label htmlFor="notes">
                <span>Catatan / Syarat Khusus Pelaksanaan</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Contoh: Wajib melampirkan dokumentasi foto berkoordinat GPS dan bukti kuitansi bermaterai untuk setiap termin."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="spk-form-actions">
            <button
              type="button"
              className="spk-btn-secondary"
              onClick={() => setView('list')}
              disabled={formSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="spk-btn-primary"
              disabled={formSubmitting}
            >
              <UploadIcon />
              <span>{formSubmitting ? 'Menyimpan SPK...' : 'Unggah & Simpan Dokumen SPK'}</span>
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ==========================================================
  // VIEW 3: DETAIL SPK (SESUAI FORMAT HALAMAN DSS / PROPOSAL)
  // ==========================================================
  if (view === 'detail' && selectedSpk) {
    const s = selectedSpk
    return (
      <div className="prop-detail-page">
        {/* Navigasi Kembali */}
        <div className="prop-upload-nav">
          <button
            type="button"
            className="prop-back-link"
            onClick={() => {
              setView('list')
              setSelectedSpk(null)
            }}
          >
            <CommonIcon name="back" />
            <span>Kembali ke daftar Surat Perintah Kerja (SPK)</span>
          </button>
        </div>

        {/* Header Dokumen SPK */}
        <div className="prop-detail-header">
          <div>
            <div className="prop-detail-id-row">
              <span className="prop-id-badge">{s.spk_number}</span>
              <span className="prop-cat-badge">Divisi {s.category}</span>
              <span
                className={`prop-status-pill ${
                  s.status === 'Selesai'
                    ? 'prop-status-green'
                    : 'prop-status-blue'
                }`}
              >
                <span className="prop-dot" />
                <span>{s.status}</span>
              </span>
            </div>
            <h1>{s.program_name}</h1>
            <p>
              {s.location}, {s.province} • Periode Pelaksanaan: {s.start_date || '-'} s/d {s.end_date || '-'}
            </p>
          </div>

          <div className="prop-detail-actions">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() => {
                notify(`Mengunduh dokumen resmi SPK: ${s.spk_number}...`)
              }}
            >
              <CommonIcon name="download" />
              <span>
                Unduh {s.file_type || 'PDF'} ({s.file_size || '3.2 MB'})
              </span>
            </button>
            <button
              type="button"
              className="db-btn db-btn-primary"
              onClick={() => {
                const nextStatus: SpkStatus = s.status === 'Selesai' ? 'Dalam pelaksanaan' : 'Selesai'
                handleUpdateStatus(s.id, nextStatus)
              }}
            >
              <CommonIcon name="check" />
              <span>{s.status === 'Selesai' ? 'Tandai Dalam Pelaksanaan' : 'Tandai Selesai'}</span>
            </button>
          </div>
        </div>

        {/* Banner Status SPK */}
        {s.status === 'Selesai' ? (
          <div className="prop-notice-alert success">
            <span className="prop-notice-icon">✅</span>
            <div>
              <strong>Surat Perintah Kerja (SPK) Telah Selesai Dilaksanakan</strong>
              <p>
                Seluruh klausul penugasan program telah diselesaikan oleh pihak pelaksana ({s.second_party}). Laporan pertanggungjawaban (LPJ) dan dokumentasi kegiatan telah diverifikasi.
              </p>
            </div>
          </div>
        ) : (
          <div className="prop-notice-alert info">
            <span className="prop-notice-icon">ℹ️</span>
            <div>
              <strong>Surat Perintah Kerja (SPK) Sedang Dalam Pelaksanaan</strong>
              <p>
                Pelaksanaan program di lapangan sedang berjalan sesuai arahan dan spesifikasi kerja. Progres kegiatan dan kepatuhan anggaran dipantau berkala oleh Divisi Program.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Detail Grid */}
        <div className="prop-detail-grid">
          {/* Kolom Kiri: Ringkasan Detail SPK */}
          <div className="prop-detail-card">
            <h3>Ringkasan Surat Perintah Kerja (SPK)</h3>
            <div className="prop-info-list">
              <div className="prop-info-row">
                <span>Nama Program / Kegiatan</span>
                <strong>{s.program_name}</strong>
              </div>
              <div className="prop-info-row">
                <span>Nomor Dokumen SPK</span>
                <strong>{s.spk_number}</strong>
              </div>
              <div className="prop-info-row">
                <span>Nilai Kontrak / Anggaran</span>
                <strong style={{ color: '#078780', fontSize: '15px' }}>
                  {formatCurrency(Number(s.budget) || 0)}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Pihak Pertama (Pemberi Tugas)</span>
                <strong>{s.first_party || 'Divisi Program Relawan Nusantara'}</strong>
              </div>
              <div className="prop-info-row">
                <span>Pihak Kedua (Pelaksana)</span>
                <strong>{s.second_party}</strong>
              </div>
              <div className="prop-info-row">
                <span>Peran / Jabatan Pihak Kedua</span>
                <strong>{s.second_party_role || 'Mitra Pelaksana Lapangan'}</strong>
              </div>
              <div className="prop-info-row">
                <span>Kontak Pelaksana</span>
                <strong>{s.contact_number || '-'}</strong>
              </div>
              <div className="prop-info-row">
                <span>Wilayah Sasaran</span>
                <strong>
                  {s.location}, {s.province}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Periode Waktu Pelaksanaan</span>
                <strong>
                  {s.start_date || '-'} s/d {s.end_date || '-'}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Ketentuan &amp; Termin Pembayaran</span>
                <strong style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {s.payment_terms || 'Pembayaran disalurkan sesuai tahapan progres dan verifikasi LPJ.'}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Ruang Lingkup Pekerjaan</span>
                <strong style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {s.scope_of_work || 'Melaksanakan seluruh kegiatan program sesuai arahan dan spesifikasi teknis Relawan Nusantara.'}
                </strong>
              </div>
              <div className="prop-info-row">
                <span>Target Output Program</span>
                <strong style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {s.target_output || 'Tercapainya sasaran penerima manfaat serta laporan pertanggungjawaban lengkap.'}
                </strong>
              </div>
              {s.notes && (
                <div className="prop-info-row">
                  <span>Catatan Khusus</span>
                  <strong style={{ maxWidth: '60%', textAlign: 'right' }}>{s.notes}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Berkas Lampiran & Standar Klausul */}
          <div className="prop-detail-card">
            <h3>Dokumen Lampiran Berkas SPK</h3>
            <div className="prop-file-box">
              <span className="prop-file-chip-icon big">
                <CommonIcon name="pdf" />
              </span>
              <div className="prop-file-meta-box">
                <strong>
                  {`${s.spk_number}_${s.program_name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                </strong>
                <small>
                  {s.file_size || '3.2 MB'} • Dokumen SPK resmi &amp; berkekuatan hukum
                </small>
              </div>
              <button
                type="button"
                className="prop-btn-download-icon"
                onClick={() => notify(`Mengunduh dokumen berkas ${s.spk_number}...`)}
                title="Unduh Berkas SPK"
              >
                <CommonIcon name="download" />
              </button>
            </div>

            {/* Klausul Pokok SPK */}
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
                Kewajiban Pokok Pihak Pelaksana:
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Pelaporan Progres</span>
                <strong>Mingguan ke Koordinator</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Akuntabilitas Anggaran</span>
                <strong>Faktur &amp; Kuitansi Sah</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#556667' }}>
                <span>Penyerahan LPJ Akhir</span>
                <strong>Maks. 7 Hari Pasca Kegiatan</strong>
              </div>
            </div>

            {/* Aksi Tambahan */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="db-btn db-btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setView('form')
                }}
              >
                <CommonIcon name="plus" />
                <span>+ Buat / Terbitkan SPK Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================
     RENDER: LIST VIEW
     ========================================================== */
  return (
    <div className="spk-page">
      {/* 1. Header Section */}
      <div className="spk-heading">
        <div>
          <div className="spk-title-row">
            <h1>SPK (Surat Perintah Kerja)</h1>
            <span className="spk-tag-pill">Dokumen Penugasan Resmi</span>
          </div>
          <p>
            Daftar seluruh dokumen Surat Perintah Kerja (SPK) penugasan lapangan yang telah diterbitkan dan diunggah Divisi Program.
          </p>
        </div>

        <div className="spk-action-box">
          <button
            type="button"
            className="spk-btn-add"
            onClick={() => setView('form')}
          >
            <UploadIcon />
            <span>+ Unggah SPK</span>
          </button>
          <span className="spk-add-hint">Unggah &amp; catat berkas SPK baru</span>
        </div>
      </div>

      {/* 2. KPI Cards Grid (3 Clean Cards) */}
      <div className="spk-kpis">
        {/* Card 1: Total SPK */}
        <div className="spk-kpi-card">
          <div className="spk-kpi-top">
            <span className="spk-kpi-label">Total SPK Terdaftar</span>
            <span className="spk-kpi-icon teal">
              <FileTextIcon />
            </span>
          </div>
          <div className="spk-kpi-val-row">
            <strong className="spk-kpi-value">{counts.totalCount}</strong>
            <span className="spk-kpi-budget">Dokumen</span>
          </div>
          <small className="spk-kpi-sub">Seluruh berkas dokumen SPK resmi terdaftar</small>
        </div>

        {/* Card 2: Total Anggaran */}
        <div className="spk-kpi-card">
          <div className="spk-kpi-top">
            <span className="spk-kpi-label">Total Nilai Anggaran</span>
            <span className="spk-kpi-icon blue">
              <ClockIcon />
            </span>
          </div>
          <div className="spk-kpi-val-row">
            <strong className="spk-kpi-value">{formatJuta(counts.totalBudget)}</strong>
          </div>
          <small className="spk-kpi-sub">Akumulasi anggaran penugasan mitra</small>
        </div>

        {/* Card 3: Berkas Resmi */}
        <div className="spk-kpi-card">
          <div className="spk-kpi-top">
            <span className="spk-kpi-label">Format Dokumen</span>
            <span className="spk-kpi-icon green">
              <CheckCircleIcon />
            </span>
          </div>
          <div className="spk-kpi-val-row">
            <strong className="spk-kpi-value">PDF / Word</strong>
          </div>
          <small className="spk-kpi-sub">100% berkas resmi tersimpan dalam arsip</small>
        </div>
      </div>

      {/* 3. Main Unified Table Card */}
      <div className="spk-table-card">
        {/* Search & Filter Toolbar */}
        <div className="spk-toolbar">
          <div className="spk-search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Cari nomor SPK, nama program, atau penerima tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="spk-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Bersihkan pencarian"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="spk-filters-row">
            {/* Filter Kategori */}
            <div className="spk-filter-dropdown">
              <SlidersIcon />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Semua kategori program</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Wilayah */}
            <div className="spk-filter-dropdown">
              <PinIcon />
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
              >
                <option value="all">Semua wilayah</option>
                {provinceOptions.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Periode */}
            <div className="spk-filter-dropdown">
              <CalendarIcon />
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="all">Semua periode</option>
                <option value="2026">Tahun 2026</option>
                <option value="2025">Tahun 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="spk-table-responsive">
          {isLoading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#79898a', fontSize: '13px' }}>
              Memuat data dokumen SPK...
            </div>
          ) : filteredSpks.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#79898a', fontSize: '13px' }}>
              Tidak ada dokumen SPK yang sesuai dengan filter pencarian.
            </div>
          ) : (
            <table className="spk-table">
              <thead>
                <tr>
                  <th style={{ width: '26%' }}>DOKUMEN SPK</th>
                  <th style={{ width: '20%' }}>PELAKSANA &amp; LOKASI</th>
                  <th style={{ width: '18%' }}>NILAI ANGGARAN</th>
                  <th style={{ width: '14%' }}>STATUS</th>
                  <th style={{ width: '12%' }}>BERKAS</th>
                  <th style={{ width: '10%' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpks.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="spk-row-clickable"
                  >
                    {/* Dokumen SPK */}
                    <td>
                      <div className="spk-doc-cell">
                        <strong className="spk-doc-title">{item.program_name}</strong>
                        <span className="spk-doc-sub">
                          {item.spk_number} • Divisi {item.category}
                        </span>
                      </div>
                    </td>

                    {/* Pelaksana & Lokasi */}
                    <td>
                      <div className="spk-assignee-cell">
                        <strong className="spk-assignee-name">{item.second_party}</strong>
                        <span className="spk-assignee-loc">
                          {item.location}, {item.province}
                        </span>
                      </div>
                    </td>

                    {/* Nilai Anggaran */}
                    <td>
                      <div className="spk-budget-cell">
                        <strong className="spk-budget-val">{formatCurrency(Number(item.budget) || 0)}</strong>
                        <span className="spk-budget-terms">{item.payment_terms || '3 Termin Pembayaran'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`spk-status-pill ${
                          item.status === 'Selesai' ? 'status-completed' : 'status-progress'
                        }`}
                      >
                        <span className="spk-status-dot" />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Lampiran & Format */}
                    <td>
                      <div className="spk-file-chip">
                        <span className="spk-file-chip-icon">
                          <PdfFileIcon />
                        </span>
                        <div className="spk-file-chip-meta">
                          <strong>{item.file_type || 'PDF'}</strong>
                          <small>{item.file_size || '3.2 MB'}</small>
                        </div>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td>
                      <button
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#078780',
                          fontWeight: 600,
                          fontSize: '12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 0',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDetail(item)
                        }}
                      >
                        <span>Detail</span>
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
        <div className="spk-pagination">
          <span className="spk-page-count">
            Menampilkan 1–{filteredSpks.length} dari {filteredSpks.length} dokumen SPK
          </span>
          <div className="spk-pagination-right">
            <span className="spk-per-page">10 per halaman</span>
            <div className="spk-page-numbers">
              <button type="button" className="spk-page-btn active">
                1
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
