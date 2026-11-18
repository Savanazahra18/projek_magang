'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'
import { api, getFullUploadUrl } from '@/lib/api'

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

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function WorkflowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6" />
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

function FileTextIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

/* ==========================================================
   TYPES & DATA
   ========================================================== */
export type DocType = 'Proposal' | 'RAB' | 'SPK'
export type DocStatus = 'Menunggu' | 'Perlu revisi' | 'Disetujui' | 'Draf'

export interface DirectorDoc {
  id: string
  code: string
  title: string
  type: DocType
  subType?: string
  unit: string
  amount: string
  amountNum?: number
  location?: string
  status: DocStatus
  date: string
  note?: string
  fileName?: string
  fileUrl?: string
  fileType?: string
  fileSize?: string
}

const initialDocs: DirectorDoc[] = [
  {
    id: 'doc-1',
    code: 'PR-2026-005',
    title: 'Air Bersih untuk Desa',
    type: 'Proposal',
    subType: 'Infrastruktur',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Lombok Timur',
    status: 'Menunggu',
    date: '28 Okt 2026',
    note: 'Proposal pembangunan 2 unit sumur bor & pipanisasi air bersih warga.',
  },
  {
    id: 'doc-2',
    code: 'PR-2026-004',
    title: 'Pemberdayaan UMKM Perempuan',
    type: 'Proposal',
    subType: 'Ekonomi',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Kab. Bogor',
    status: 'Menunggu',
    date: '27 Okt 2026',
    note: 'Pengajuan pendampingan usaha mikro perempuan dan sertifikasi P-IRT.',
  },
  {
    id: 'doc-3',
    code: 'RAB-2026-039',
    title: 'RAB Distribusi Air Bersih Musim Kemarau',
    type: 'RAB',
    subType: 'Sosial',
    unit: 'Divisi Sosial',
    amount: 'Rp82.500.000',
    amountNum: 82500000,
    location: 'Lombok Timur',
    status: 'Menunggu',
    date: '28 Okt 2026',
    note: 'Rincian anggaran sewa truk tangki dan pengadaan tandon penampungan darurat.',
  },
  {
    id: 'doc-4',
    code: 'PR-2026-006',
    title: 'Beasiswa Anak Nusantara',
    type: 'Proposal',
    subType: 'Pendidikan',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Kab. Bandung',
    status: 'Perlu revisi',
    date: '29 Okt 2026',
    note: 'Catatan peninjau: Harap perbarui data verifikasi penerima manfaat batch 4.',
  },
  {
    id: 'doc-5',
    code: 'RAB-2026-028',
    title: 'RAB Renovasi Sarana Sekolah Pelosok',
    type: 'RAB',
    subType: 'Pendidikan',
    unit: 'Divisi Pendidikan',
    amount: 'Rp95.000.000',
    amountNum: 95000000,
    location: 'Kab. Cianjur',
    status: 'Disetujui',
    date: '23 Okt 2026',
    note: 'RAB telah disetujui komite, siap proses SPK pengerjaan fisik.',
  },
  {
    id: 'doc-6',
    code: 'PR-2026-003',
    title: 'Bantuan Banjir Bandung',
    type: 'Proposal',
    subType: 'Kemanusiaan',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Kab. Bandung',
    status: 'Disetujui',
    date: '25 Okt 2026',
    note: 'Disetujui untuk posko tanggap darurat dan dapur umum warga Dayeuhkolot.',
  },
  {
    id: 'doc-7',
    code: 'RAB-2026-042',
    title: 'RAB Pelatihan Relawan Siaga Bencana',
    type: 'RAB',
    subType: 'Kesiapsiagaan',
    unit: 'Divisi Kesiapsiagaan',
    amount: 'Rp45.200.000',
    amountNum: 45200000,
    location: 'Kab. Bandung',
    status: 'Menunggu',
    date: '29 Okt 2026',
    note: 'Anggaran modul pelatihan, instruktur vertical rescue, dan sertifikasi.',
  },
  {
    id: 'doc-8',
    code: 'RAB-2026-035',
    title: 'RAB Modal Usaha UMKM Perempuan',
    type: 'RAB',
    subType: 'Ekonomi',
    unit: 'Divisi Ekonomi',
    amount: 'Rp65.000.000',
    amountNum: 65000000,
    location: 'Kab. Bogor',
    status: 'Menunggu',
    date: '27 Okt 2026',
    note: 'Hibah alat produksi dan workshop branding digital UMKM lokal.',
  },
  {
    id: 'doc-9',
    code: 'SPK-2026-042',
    title: 'SPK Pelatihan Relawan Siaga Bencana',
    type: 'SPK',
    subType: 'Kesiapsiagaan',
    unit: 'Divisi Program',
    amount: 'Rp45.200.000',
    amountNum: 45200000,
    location: 'Kab. Bandung',
    status: 'Draf',
    date: '29 Okt 2026',
    note: 'Draf surat perintah kerja siap diterbitkan setelah persetujuan.',
  },
  {
    id: 'doc-10',
    code: 'RAB-2026-031',
    title: 'RAB Posko Logistik Bencana Banjir',
    type: 'RAB',
    subType: 'Kemanusiaan',
    unit: 'Divisi Tanggap Darurat',
    amount: 'Rp120.000.000',
    amountNum: 120000000,
    location: 'Kab. Bandung',
    status: 'Disetujui',
    date: '25 Okt 2026',
  },
  {
    id: 'doc-11',
    code: 'PR-2026-002',
    title: 'Renovasi Sekolah Pelosok',
    type: 'Proposal',
    subType: 'Pendidikan',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Kab. Cianjur',
    status: 'Disetujui',
    date: '23 Okt 2026',
  },
  {
    id: 'doc-12',
    code: 'PR-2026-001',
    title: 'Penghijauan Desa Lestari',
    type: 'Proposal',
    subType: 'Lingkungan',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Gunungkidul',
    status: 'Disetujui',
    date: '21 Okt 2026',
  },
  {
    id: 'doc-13',
    code: 'RAB-2026-024',
    title: 'RAB Bibit Pohon Penghijauan Desa Lestari',
    type: 'RAB',
    subType: 'Lingkungan',
    unit: 'Divisi Lingkungan',
    amount: 'Rp20.800.000',
    amountNum: 20800000,
    location: 'Gunungkidul',
    status: 'Disetujui',
    date: '21 Okt 2026',
  },
  {
    id: 'doc-14',
    code: 'RAB-2026-019',
    title: 'RAB Layanan Kesehatan Lansia Terpencil',
    type: 'RAB',
    subType: 'Kesehatan',
    unit: 'Divisi Kesehatan',
    amount: 'Rp38.200.000',
    amountNum: 38200000,
    location: 'Tasikmalaya',
    status: 'Perlu revisi',
    date: '18 Okt 2026',
    note: 'Mohon tinjau ulang komponen honor dokter spesialis dan obat-obatan.',
  },
  {
    id: 'doc-15',
    code: 'RAB-2026-015',
    title: 'RAB Dapur Gizi Balita Stunting',
    type: 'RAB',
    subType: 'Kesehatan',
    unit: 'Divisi Kesehatan',
    amount: 'Rp42.000.000',
    amountNum: 42000000,
    location: 'Kab. Sukabumi',
    status: 'Perlu revisi',
    date: '15 Okt 2026',
  },
  {
    id: 'doc-16',
    code: 'RAB-2026-011',
    title: 'RAB Penyaluran Pangan Yatim Piatu',
    type: 'RAB',
    subType: 'Sosial',
    unit: 'Divisi Sosial',
    amount: 'Rp32.500.000',
    amountNum: 32500000,
    location: 'Kota Bandung',
    status: 'Disetujui',
    date: '12 Okt 2026',
  },
  {
    id: 'doc-17',
    code: 'RAB-2026-008',
    title: 'RAB Sumur Resapan Air Bersih Wonosari',
    type: 'RAB',
    subType: 'Infrastruktur',
    unit: 'Divisi Infrastruktur',
    amount: 'Rp68.000.000',
    amountNum: 68000000,
    location: 'Gunungkidul',
    status: 'Disetujui',
    date: '08 Okt 2026',
  },
  {
    id: 'doc-18',
    code: 'RAB-2026-004',
    title: 'RAB Perlengkapan Belajar Anak Pesisir',
    type: 'RAB',
    subType: 'Pendidikan',
    unit: 'Divisi Pendidikan',
    amount: 'Rp25.000.000',
    amountNum: 25000000,
    location: 'Pangandaran',
    status: 'Disetujui',
    date: '05 Okt 2026',
  },
  {
    id: 'doc-19',
    code: 'RAB-2026-002',
    title: 'RAB Pemeriksaan Gigi Gratis Anak Yatim',
    type: 'RAB',
    subType: 'Kesehatan',
    unit: 'Divisi Kesehatan',
    amount: 'Rp19.500.000',
    amountNum: 19500000,
    location: 'Kota Cimahi',
    status: 'Disetujui',
    date: '02 Okt 2026',
  },
  {
    id: 'doc-20',
    code: 'PR-2025-099',
    title: 'Kemitraan Pendidikan Vokasi Terpadu',
    type: 'Proposal',
    subType: 'Pendidikan',
    unit: 'Divisi Program',
    amount: '—',
    location: 'Kab. Bandung',
    status: 'Disetujui',
    date: '28 Sep 2026',
  },
  {
    id: 'doc-21',
    code: 'RAB-2025-098',
    title: 'RAB Vokasi Keterampilan Menjahit',
    type: 'RAB',
    subType: 'Ekonomi',
    unit: 'Divisi Ekonomi',
    amount: 'Rp35.000.000',
    amountNum: 35000000,
    location: 'Kab. Bandung',
    status: 'Disetujui',
    date: '28 Sep 2026',
  },
]

export default function DirectorDashboard() {
  const router = useRouter()
  const { notify } = useDashboard()

  const [docs, setDocs] = useState<DirectorDoc[]>([])
  const [activeTab, setActiveTab] = useState<string>('Semua dokumen')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDoc, setSelectedDoc] = useState<DirectorDoc | null>(null)
  const [revisionNoteInput, setRevisionNoteInput] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)

  // Sync with live PostgreSQL proposals, DSS (RAB), and SPK
  useEffect(() => {
    Promise.all([
      api.getProposals().catch(() => null),
      api.getDssEvaluations().catch(() => null),
      api.getSpkList().catch(() => null),
    ]).then(([propRes, dssRes, spkRes]) => {
      const liveDocs: DirectorDoc[] = []

      if (Array.isArray(propRes?.proposals)) {
        propRes.proposals.forEach((p: any, idx: number) => {
          const mappedStatus: DocStatus =
            p.status === 'Dalam tinjauan'
              ? 'Menunggu'
              : p.status === 'Disetujui'
              ? 'Disetujui'
              : p.status === 'Perlu revisi'
              ? 'Perlu revisi'
              : 'Menunggu'
          liveDocs.push({
            id: `prop-${p.id || idx}`,
            code: p.id,
            title: p.title,
            type: 'Proposal',
            subType: p.category || 'Umum',
            unit: 'Divisi Program',
            amount: '—',
            location: p.location || 'Jawa Barat',
            status: mappedStatus,
            date: p.date || '-',
            note: p.status_note || 'Pengajuan proposal program dari Divisi Program.',
            fileName: p.file_name || undefined,
            fileUrl: p.file_url || undefined,
            fileType: p.file_type || 'PDF',
            fileSize: p.file_size || '2.4 MB',
          })
        })
      }

      if (Array.isArray(dssRes?.evaluations)) {
        dssRes.evaluations.forEach((e: any, idx: number) => {
          const mappedStatus: DocStatus =
            e.status === 'Dalam telaah'
              ? 'Menunggu'
              : e.status === 'Disetujui'
              ? 'Disetujui'
              : e.status === 'Perlu revisi'
              ? 'Perlu revisi'
              : 'Menunggu'
          const digits = String(e.estimated_budget || '').replace(/\D/g, '')
          liveDocs.push({
            id: `rab-${e.id || idx}`,
            code: e.id,
            title: e.title,
            type: 'RAB',
            subType: e.category || 'Umum',
            unit: e.division || e.category || 'Divisi Program',
            amount: e.estimated_budget || 'Rp 0',
            amountNum: digits ? Number(digits) : 0,
            location: e.location || 'Jawa Barat',
            status: mappedStatus,
            date: e.date || '-',
            note: e.evaluation_notes || e.status_note || 'Pengajuan RAB program dari Divisi Program.',
            fileName: e.file_name || undefined,
            fileUrl: e.file_url || undefined,
            fileType: e.file_type || 'Excel/PDF',
            fileSize: e.file_size || '3.4 MB',
          })
        })
      }

      const spkList = spkRes?.spks || spkRes?.data
      if (Array.isArray(spkList)) {
        spkList.forEach((s: any, idx: number) => {
          const mappedStatus: DocStatus =
            s.status === 'Draf'
              ? 'Draf'
              : s.status === 'Perlu revisi'
              ? 'Perlu revisi'
              : s.status === 'Dalam tinjauan'
              ? 'Menunggu'
              : 'Disetujui'
          liveDocs.push({
            id: `spk-${s.id || idx}`,
            code: s.spk_number || s.id,
            title: s.program_name || 'Dokumen SPK',
            type: 'SPK',
            subType: s.category || 'Umum',
            unit: s.first_party || 'Divisi Program',
            amount: s.budget_formatted || s.budget_amount || 'Rp 0',
            amountNum: Number(s.budget) || 0,
            location: s.location || 'Jawa Barat',
            status: mappedStatus,
            date: s.start_date || '-',
            note: s.notes || s.scope_of_work || 'Dokumen Surat Perintah Kerja.',
            fileName: s.file_name || undefined,
            fileUrl: s.file_url || undefined,
            fileType: s.file_type || 'PDF',
            fileSize: s.file_size || '2.5 MB',
          })
        })
      }

      setDocs(liveDocs)
    })
  }, [])

  // Calculations for KPI Cards
  const counts = useMemo(() => {
    const waiting = docs.filter((d) => d.status === 'Menunggu')
    const waitingProp = waiting.filter((d) => d.type === 'Proposal').length
    const waitingRab = waiting.filter((d) => d.type === 'RAB').length
    const waitingSpk = waiting.filter((d) => d.type === 'SPK').length

    const approved = docs.filter((d) => d.status === 'Disetujui')
    const approvedProp = approved.filter((d) => d.type === 'Proposal').length
    const approvedRab = approved.filter((d) => d.type === 'RAB').length
    const approvedSpk = approved.filter((d) => d.type === 'SPK').length

    const revised = docs.filter((d) => d.status === 'Perlu revisi')
    const revisedProp = revised.filter((d) => d.type === 'Proposal').length
    const revisedRab = revised.filter((d) => d.type === 'RAB').length
    const revisedSpk = revised.filter((d) => d.type === 'SPK').length

    const draft = docs.filter((d) => d.status === 'Draf')

    return {
      waitingTotal: waiting.length,
      waitingProp,
      waitingRab,
      waitingSpk,
      approvedTotal: approved.length,
      approvedProp,
      approvedRab,
      approvedSpk,
      revisedTotal: revised.length,
      revisedProp,
      revisedRab,
      revisedSpk,
      draftTotal: draft.length,
      allTotal: docs.length,
    }
  }, [docs])

  // Filtered documents for the bottom table
  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      // Tab filter
      if (activeTab === 'Dalam tinjauan' && d.status !== 'Menunggu') return false
      if (activeTab === 'Disetujui' && d.status !== 'Disetujui') return false
      if (activeTab === 'Perlu revisi' && d.status !== 'Perlu revisi') return false
      if (activeTab === 'Draf' && d.status !== 'Draf') return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          d.title.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.unit.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [docs, activeTab, searchQuery])

  // Top 3 urgent decision items
  const decisionItems = useMemo(() => {
    return docs.filter((d) => d.status === 'Menunggu').slice(0, 3)
  }, [docs])

  // Director Actions (Syncs to PostgreSQL database)
  const handleApprove = async (doc: DirectorDoc) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'Disetujui' } : d))
    )
    setSelectedDoc(null)

    if (doc.type === 'Proposal') {
      try {
        await api.updateProposalStatus(doc.code, 'Disetujui', 'Peninjauan selesai')
      } catch (err) {
        console.error('Error updating proposal status to backend:', err)
      }
    } else if (doc.type === 'RAB') {
      try {
        await api.updateDssStatus(doc.code, 'Disetujui', 'Telaah selesai disahkan')
      } catch (err) {
        console.error('Error updating DSS status to backend:', err)
      }
    }

    notify(`Dokumen ${doc.code} — "${doc.title}" berhasil disetujui.`)
  }

  const handleRequestRevision = async (doc: DirectorDoc) => {
    if (!revisionNoteInput.trim()) {
      notify('Silakan tuliskan catatan revisi untuk Divisi Program.')
      return
    }

    const note = revisionNoteInput
    setDocs((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? { ...d, status: 'Perlu revisi', note }
          : d
      )
    )
    setShowRevisionModal(false)
    setSelectedDoc(null)
    setRevisionNoteInput('')

    if (doc.type === 'Proposal') {
      try {
        await api.updateProposalStatus(doc.code, 'Perlu revisi', note)
      } catch (err) {
        console.error('Error updating proposal status to backend:', err)
      }
    } else if (doc.type === 'RAB') {
      try {
        await api.updateDssStatus(doc.code, 'Perlu revisi', note)
      } catch (err) {
        console.error('Error updating DSS status to backend:', err)
      }
    }

    notify(`Dokumen ${doc.code} dikembalikan ke Divisi Program untuk revisi.`)
  }

  return (
    <div className="dir-page">
      {/* 1. Header Row */}
      <div className="dir-header">
        <div className="dir-header-title">
          <h1>Dasbor direktur</h1>
          <p>Pantau pengajuan, tinjau anggaran, dan tetapkan keputusan dalam satu ruang kerja.</p>
        </div>

        <div className="dir-header-actions">
          <span className="dir-date-sub">Senin, 2 November 2026 • Semua periode</span>
          <button
            type="button"
            className="dir-period-btn"
            onClick={() => notify('Filter periode aktif: Semua periode 2026.')}
          >
            <CalendarIcon />
            <span>Semua periode</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards */}
      <div className="dir-kpis">
        {/* Card 1: Menunggu keputusan (Hero Solid Teal) */}
        <div
          className="dir-kpi-card hero-teal"
          onClick={() => setActiveTab('Dalam tinjauan')}
        >
          <div className="dir-kpi-top">
            <span className="dir-kpi-label">Menunggu keputusan</span>
            <span className="dir-kpi-icon">
              <ClockIcon />
            </span>
          </div>
          <strong className="dir-kpi-num">{counts.waitingTotal} dokumen</strong>
          <span className="dir-kpi-desc">
            {counts.waitingProp} proposal • {counts.waitingRab} RAB • {counts.waitingSpk} SPK
          </span>
        </div>

        {/* Card 2: Dokumen disetujui */}
        <div
          className="dir-kpi-card"
          onClick={() => setActiveTab('Disetujui')}
        >
          <div className="dir-kpi-top">
            <span className="dir-kpi-label">Dokumen disetujui</span>
            <span className="dir-kpi-icon" style={{ color: '#1f8448' }}>
              <CheckCircleIcon />
            </span>
          </div>
          <strong className="dir-kpi-num">{counts.approvedTotal} dokumen</strong>
          <span className="dir-kpi-desc">
            {counts.approvedProp} proposal • {counts.approvedRab} RAB • {counts.approvedSpk} SPK
          </span>
        </div>

        {/* Card 3: Dikembalikan untuk revisi */}
        <div
          className="dir-kpi-card"
          onClick={() => setActiveTab('Perlu revisi')}
        >
          <div className="dir-kpi-top">
            <span className="dir-kpi-label">Dikembalikan untuk revisi</span>
            <span className="dir-kpi-icon" style={{ color: '#c97b10' }}>
              <EditIcon />
            </span>
          </div>
          <strong className="dir-kpi-num">{counts.revisedTotal} dokumen</strong>
          <span className="dir-kpi-desc">
            {counts.revisedProp} proposal • {counts.revisedRab} RAB • {counts.revisedSpk} SPK
          </span>
        </div>

        {/* Card 4: SPK dalam draf */}
        <div
          className="dir-kpi-card"
          onClick={() => setActiveTab('Draf')}
        >
          <div className="dir-kpi-top">
            <span className="dir-kpi-label">SPK dalam draf</span>
            <span className="dir-kpi-icon">
              <FolderIcon />
            </span>
          </div>
          <strong className="dir-kpi-num">{counts.draftTotal} draf</strong>
          <span className="dir-kpi-desc">
            {counts.draftTotal} SPK draf tersedia
          </span>
        </div>
      </div>

      {/* 3. Middle Section: Memerlukan Keputusan (Left) & Alur Persetujuan (Right) */}
      <div className="dir-middle-grid">
        {/* Left Column: Memerlukan Keputusan */}
        <div className="dir-card">
          <div className="dir-card-head">
            <div>
              <div className="dir-card-title-row">
                <h2>Memerlukan keputusan</h2>
                <span className="dir-pill-count">{counts.waitingTotal}</span>
              </div>
              <p>Pengajuan Divisi Program. Tinjau dokumen sebelum menyetujui.</p>
            </div>
            <Link
              href="/director/approval-proposal"
              className="dir-link-action"
            >
              <span>Lihat semua antrean</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="dir-decision-list">
            {decisionItems.map((item) => (
              <div key={item.id} className="dir-decision-item">
                <div className="dir-decision-left">
                  <div className="dir-item-icon">
                    <FileTextIcon />
                  </div>
                  <div className="dir-item-meta">
                    <strong className="dir-item-title">{item.title}</strong>
                    <span className="dir-item-sub">
                      {item.code} • {item.subType || item.type} • {item.amount !== '—' ? item.amount : item.location}
                    </span>
                  </div>
                </div>

                <div className="dir-decision-right">
                  <span className="dir-status-cell waiting">
                    <span className="dir-status-dot" style={{ background: '#d93829' }} />
                    <span style={{ color: '#d93829' }}>Dalam tinjauan</span>
                  </span>

                  <button
                    type="button"
                    className="dir-btn-tinjau"
                    onClick={() => setSelectedDoc(item)}
                  >
                    <span>Tinjau</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ))}
            {decisionItems.length === 0 && (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#6f7d7e', fontSize: 13 }}>
                Tidak ada dokumen yang menunggu keputusan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alur Persetujuan */}
        <div className="dir-card">
          <div className="dir-card-head">
            <div>
              <h2>Alur persetujuan</h2>
              <p>{counts.waitingTotal} dokumen dalam tinjauan</p>
            </div>
            <span style={{ color: '#8b999a' }}>
              <WorkflowIcon />
            </span>
          </div>

          <div className="dir-workflow-list">
            {/* Row 1: Review proposal */}
            <div className="dir-workflow-item">
              <div className="dir-workflow-row">
                <span className="dir-wf-label">Review proposal</span>
                <span className="dir-wf-count">{counts.waitingProp}</span>
              </div>
              <div className="dir-wf-track">
                <div
                  className="dir-wf-bar"
                  style={{ width: `${(counts.waitingProp / (counts.waitingTotal || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Row 2: Approval DSS */}
            <div className="dir-workflow-item">
              <div className="dir-workflow-row">
                <span className="dir-wf-label">Approval DSS</span>
                <span className="dir-wf-count">{counts.waitingRab}</span>
              </div>
              <div className="dir-wf-track">
                <div
                  className="dir-wf-bar"
                  style={{ width: `${(counts.waitingRab / (counts.waitingTotal || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Row 3: Approval Laporan */}
            <div className="dir-workflow-item">
              <div className="dir-workflow-row">
                <span className="dir-wf-label">Approval Laporan</span>
                <span className="dir-wf-count">{counts.waitingSpk}</span>
              </div>
              <div className="dir-wf-track">
                <div
                  className="dir-wf-bar"
                  style={{ width: `${(counts.waitingSpk / (counts.waitingTotal || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Note */}
            <div className="dir-wf-note">
              <ClockIcon />
              <span>SPK belum diajukan: <strong>{counts.draftTotal} draf</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Table Card: Dokumen Pengajuan */}
      <div className="dir-table-container">
        {/* Table Header Row */}
        <div className="dir-table-header-row">
          <div className="dir-table-header-left">
            <h2>Dokumen pengajuan</h2>
            <p>Seluruh proposal, RAB, dan SPK dari Divisi Program.</p>
          </div>

          <div className="dir-table-header-right">
            <div className="dir-table-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Cari nama atau nomor dokumen"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="dir-btn-tool"
              onClick={() => notify('Filter dokumen tingkat lanjut.')}
            >
              <SlidersIcon />
              <span>Filter</span>
            </button>

            <button
              type="button"
              className="dir-btn-tool"
              onClick={() => notify(`Mengekspor ${counts.allTotal} daftar dokumen ke berkas Excel/CSV...`)}
            >
              <DownloadIcon />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="dir-tabs-bar">
          <button
            type="button"
            className={`dir-tab-pill ${activeTab === 'Semua dokumen' ? 'active' : ''}`}
            onClick={() => setActiveTab('Semua dokumen')}
          >
            Semua dokumen {counts.allTotal}
          </button>
          <button
            type="button"
            className={`dir-tab-pill ${activeTab === 'Dalam tinjauan' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dalam tinjauan')}
          >
            Dalam tinjauan {counts.waitingTotal}
          </button>
          <button
            type="button"
            className={`dir-tab-pill ${activeTab === 'Disetujui' ? 'active' : ''}`}
            onClick={() => setActiveTab('Disetujui')}
          >
            Disetujui {counts.approvedTotal}
          </button>
          <button
            type="button"
            className={`dir-tab-pill ${activeTab === 'Perlu revisi' ? 'active' : ''}`}
            onClick={() => setActiveTab('Perlu revisi')}
          >
            Perlu revisi {counts.revisedTotal}
          </button>
          <button
            type="button"
            className={`dir-tab-pill ${activeTab === 'Draf' ? 'active' : ''}`}
            onClick={() => setActiveTab('Draf')}
          >
            Draf {counts.draftTotal}
          </button>
        </div>

        {/* Responsive Table */}
        <div className="dir-table-responsive">
          <table className="dir-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>NAMA DOKUMEN</th>
                <th style={{ width: '12%' }}>JENIS</th>
                <th style={{ width: '16%' }}>UNIT PENGAJU</th>
                <th style={{ width: '16%' }}>NILAI PENGAJUAN</th>
                <th style={{ width: '12%' }}>STATUS</th>
                <th style={{ width: '10%' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>DIAJUKAN</span>
                    <ChevronDownIcon />
                  </div>
                </th>
                <th style={{ width: '6%', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.slice(0, 6).map((item) => (
                <tr key={item.id} onClick={() => setSelectedDoc(item)} style={{ cursor: 'pointer' }}>
                  {/* Nama Dokumen */}
                  <td>
                    <div className="dir-doc-cell">
                      <strong className="dir-doc-title">{item.title}</strong>
                      <span className="dir-doc-id">{item.code}</span>
                    </div>
                  </td>

                  {/* Jenis */}
                  <td>
                    <span className="dir-type-cell">{item.type}</span>
                  </td>

                  {/* Unit Pengaju */}
                  <td>
                    <span className="dir-unit-cell">{item.unit}</span>
                  </td>

                  {/* Nilai Pengajuan */}
                  <td>
                    <span className="dir-nominal-cell">{item.amount}</span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`dir-status-cell ${
                        item.status === 'Menunggu'
                          ? 'waiting'
                          : item.status === 'Perlu revisi'
                          ? 'revision'
                          : item.status === 'Disetujui'
                          ? 'approved'
                          : 'draft'
                      }`}
                    >
                      <span className="dir-status-dot" />
                      <span>{item.status}</span>
                    </span>
                  </td>

                  {/* Diajukan */}
                  <td>
                    <span style={{ fontSize: '12px', color: '#556667', whiteSpace: 'nowrap' }}>
                      {item.date}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="dir-action-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDoc(item)
                      }}
                      title="Lihat detail pengajuan"
                    >
                      <ArrowUpRightIcon />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px 16px', color: '#6f7d7e', fontSize: 13 }}>
                    Tidak ada dokumen pengajuan yang tersedia di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="dir-pagination">
          <span>Menampilkan {Math.min(filteredDocs.length, 6)} dari {filteredDocs.length} dokumen</span>
          <div className="dir-pagination-controls">
            <button type="button" className="dir-p-btn">
              &lt;
            </button>
            <button type="button" className="dir-p-btn active">
              1
            </button>
            <button type="button" className="dir-p-btn">
              2
            </button>
            <button type="button" className="dir-p-btn">
              3
            </button>
            <span style={{ padding: '0 4px', color: '#9aa8a9' }}>..</span>
            <button type="button" className="dir-p-btn">
              4
            </button>
            <button type="button" className="dir-p-btn">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 5. Page Bottom Footer Notes */}
      <div className="dir-footer-bar">
        <span>Internal &amp; rahasia • Relawan Nusantara</span>
        <span>Data diperbarui 2 November 2026, 09.00 WIB</span>
      </div>

      {/* ==========================================================
         6. MODAL TINJAUAN & KEPUTUSAN DIREKTUR
         ========================================================== */}
      {selectedDoc && !showRevisionModal && (
        <div className="dir-modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="dir-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dir-modal-top">
              <div>
                <span className="dir-pill-count">{selectedDoc.code}</span>
                <h2 className="dir-modal-title" style={{ marginTop: '6px' }}>
                  {selectedDoc.title}
                </h2>
                <p className="dir-modal-sub">
                  Diajukan oleh {selectedDoc.unit} pada {selectedDoc.date}
                </p>
              </div>
              <button
                type="button"
                className="dir-action-icon-btn"
                onClick={() => setSelectedDoc(null)}
                aria-label="Tutup modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="dir-modal-grid">
              <div className="dir-modal-field">
                <span className="dir-modal-label">Jenis Dokumen</span>
                <strong className="dir-modal-val">{selectedDoc.type} ({selectedDoc.subType || 'Program'})</strong>
              </div>

              <div className="dir-modal-field">
                <span className="dir-modal-label">Nilai Pengajuan</span>
                <strong className="dir-modal-val" style={{ color: '#078780' }}>
                  {selectedDoc.amount !== '—' ? selectedDoc.amount : 'Sesuai Pagu Program'}
                </strong>
              </div>

              <div className="dir-modal-field">
                <span className="dir-modal-label">Wilayah Pelaksanaan</span>
                <strong className="dir-modal-val">{selectedDoc.location || 'Jawa Barat'}</strong>
              </div>

              <div className="dir-modal-field">
                <span className="dir-modal-label">Status Saat Ini</span>
                <strong
                  className="dir-modal-val"
                  style={{
                    color:
                      selectedDoc.status === 'Disetujui'
                        ? '#1f8448'
                        : selectedDoc.status === 'Perlu revisi'
                        ? '#2b6cb0'
                        : '#c97b10',
                  }}
                >
                  {selectedDoc.status}
                </strong>
              </div>

              {selectedDoc.note && (
                <div className="dir-modal-field full">
                  <span className="dir-modal-label">Keterangan / Catatan Pengajuan</span>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#556667', background: '#f8fafb', padding: '10px 12px', borderRadius: '8px', border: '1px solid #edf1f1' }}>
                    {selectedDoc.note}
                  </p>
                </div>
              )}
              {selectedDoc.fileUrl && (
                <div className="dir-modal-field full">
                  <span className="dir-modal-label">Berkas Lampiran Pengaju</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#eef6f5', border: '1px solid #b8dfdb', borderRadius: '8px', marginTop: 4 }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#078780', display: 'block' }}>
                        {selectedDoc.fileName || `${selectedDoc.title}.${(selectedDoc.fileType || 'pdf').toLowerCase()}`}
                      </strong>
                      <small style={{ fontSize: '11px', color: '#556667' }}>
                        Format {selectedDoc.fileType} • {selectedDoc.fileSize} • Tersimpan di server
                      </small>
                    </div>
                    <a
                      href={getFullUploadUrl(selectedDoc.fileUrl, true)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dir-btn-revise"
                      style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '11.5px', background: '#078780', color: '#fff', border: 0 }}
                    >
                      Unduh Berkas Asli
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="dir-modal-actions">
              <button
                type="button"
                className="dir-btn-close"
                onClick={() => setSelectedDoc(null)}
              >
                Tutup
              </button>

              {selectedDoc.status !== 'Perlu revisi' && (
                <button
                  type="button"
                  className="dir-btn-revise"
                  onClick={() => setShowRevisionModal(true)}
                >
                  <EditIcon />
                  <span>Kembalikan untuk Revisi</span>
                </button>
              )}

              {selectedDoc.status !== 'Disetujui' && (
                <button
                  type="button"
                  className="dir-btn-approve"
                  onClick={() => handleApprove(selectedDoc)}
                >
                  <CheckCircleIcon />
                  <span>Setujui Dokumen</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Masukkan Catatan Revisi */}
      {selectedDoc && showRevisionModal && (
        <div className="dir-modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="dir-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dir-modal-top">
              <div>
                <h2 className="dir-modal-title">Kembalikan untuk Revisi</h2>
                <p className="dir-modal-sub">
                  Berikan instruksi revisi yang jelas untuk {selectedDoc.code} — {selectedDoc.title}.
                </p>
              </div>
              <button
                type="button"
                className="dir-action-icon-btn"
                onClick={() => setShowRevisionModal(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="revNote" style={{ fontSize: '12px', fontWeight: 600, color: '#172324' }}>
                Catatan Revisi Direktur <span style={{ color: '#d93829' }}>*</span>
              </label>
              <textarea
                id="revNote"
                rows={4}
                placeholder="Contoh: Mohon tinjau kembali rincian anggaran honor pelaksana serta sesuaikan estimasi penerima manfaat..."
                value={revisionNoteInput}
                onChange={(e) => setRevisionNoteInput(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #dfe6e7',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              {selectedDoc.fileUrl && (
                <div className="dir-modal-field full">
                  <span className="dir-modal-label">Berkas Lampiran Pengaju</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#eef6f5', border: '1px solid #b8dfdb', borderRadius: '8px', marginTop: 4 }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#078780', display: 'block' }}>
                        {selectedDoc.fileName || `${selectedDoc.title}.${(selectedDoc.fileType || 'pdf').toLowerCase()}`}
                      </strong>
                      <small style={{ fontSize: '11px', color: '#556667' }}>
                        Format {selectedDoc.fileType} • {selectedDoc.fileSize} • Tersimpan di server
                      </small>
                    </div>
                    <a
                      href={getFullUploadUrl(selectedDoc.fileUrl, true)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dir-btn-revise"
                      style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '11.5px', background: '#078780', color: '#fff', border: 0 }}
                    >
                      Unduh Berkas Asli
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="dir-modal-actions">
              <button
                type="button"
                className="dir-btn-close"
                onClick={() => setShowRevisionModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="dir-btn-revise"
                style={{ background: '#b06000', color: '#fff', border: 0 }}
                onClick={() => handleRequestRevision(selectedDoc)}
              >
                Kirim Catatan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

