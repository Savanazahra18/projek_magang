'use client'

import { ReactNode, useMemo, useState, useEffect } from 'react'
import RequestProgramForm from './RequestProgramForm'
import RequestProgramForm2 from './RequestProgramForm2'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'

/* ==========================================================
   ICONS
   ========================================================== */
type IconName =
  | 'download' | 'plus' | 'database' | 'check' | 'clock' | 'users'
  | 'chevronRight' | 'chevronLeft' | 'search' | 'settings' | 'arrowUp' | 'arrowDown' | 'close' | 'back'
  | 'inbox' | 'file' | 'shield' | 'pulse' | 'edit' | 'alert' | 'eye'

const paths: Record<IconName, ReactNode> = {
  download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M4 20h16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" /><path d="M16 5a3 3 0 010 6M18 14c2 .6 3 2.7 3 6" /></>,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  chevronLeft: <path d="M15 18l-6-6 6-6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2h-4V21a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9A1.7 1.7 0 003 14H2.8v-4H3a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 001.9.3A1.7 1.7 0 0010 3V2.8h4V3a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.2v4H21a1.7 1.7 0 00-1.6 1z" /></>,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  inbox: <><path d="M4 13l2-7h12l2 7v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /><path d="M4 13h5l2 3h2l2-3h5" /></>,
  file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />,
  pulse: <><circle cx="12" cy="12" r="9" /><path d="M7 12h2l2-4 2 8 2-4h2" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
  alert: <><path d="M12 3L2 20h20L12 3z" /><path d="M12 10v4M12 17h.01" /></>,
  eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></>,
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

/* ==========================================================
   DATA (ilustratif — nanti diganti data dari backend)
   ========================================================== */
type Priority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'
type Status = 'Baru' | 'Diproses' | 'Menunggu persetujuan' | 'Selesai'

export type RequestRow = {
  id: string
  title: string
  type: string
  priority: Priority
  requester: string
  location: string
  beneficiary: string
  pic: string
  status: Status
  date?: string
  deadline?: string
  category?: string
  description?: string
  applicantName?: string
  contact?: string
  targetGroup?: string
  estimatedBudget?: string
  outputMitra?: string
  bahanPermintaan?: string[]
  alasanMendesak?: string
  linkPendukung?: string
  originId?: string
  originTitle?: string
  proposalId?: string
  proposalTitle?: string
  miproId?: string
  monevId?: string
}

const requests: RequestRow[] = [
  {
    id: 'REQ-2026-038',
    title: 'UMKM Tangguh Sembalun',
    type: 'Request RAB',
    priority: 'Sedang',
    requester: 'Koperasi Sembalun',
    location: 'Lombok Timur, Nusa Tenggara Barat',
    beneficiary: '260 orang / 85 pelaku usaha',
    pic: 'Aulia Rahman',
    status: 'Selesai',
    date: '10 Oktober 2026',
    deadline: '24 Oktober 2026',
    category: 'Pemberdayaan Ekonomi',
    description: 'Pendampingan usaha dan penguatan modal peralatan produksi bagi pelaku UMKM lokal pasca pemulihan ekonomi di kawasan Sembalun.',
    applicantName: 'Hendra Wijaya',
    contact: 'hendra@kopsembalun.id',
    targetGroup: 'Pelaku usaha mikro & kelompok tani',
    estimatedBudget: 'Rp 65.000.000',
    outputMitra: 'Tersusunnya RAB pengadaan alat produksi komunal dan pelatihan manajemen keuangan untuk 85 pelaku UMKM.',
    bahanPermintaan: ['RAB', 'Pitchdeck / Rencana Penyaluran'],
    linkPendukung: 'https://drive.google.com/drive/folders/umkm-sembalun',
    originId: 'BD-2026-009',
    originTitle: 'Assessment Ekonomi Sembalun',
    proposalId: 'PRO-2026-014',
    proposalTitle: 'Penguatan UMKM Sembalun',
    miproId: 'MIP-2026-019',
    monevId: 'MON-2026-025',
  },
  {
    id: 'REQ-2026-041',
    title: 'Air Bersih Cisarua',
    type: 'Request Proposal',
    priority: 'Tinggi',
    requester: 'Yayasan Tirta Bakti',
    location: 'Cisarua, Kab. Bogor',
    beneficiary: '420 orang / 126 KK',
    pic: 'Rani Putri',
    status: 'Diproses',
    date: '14 Oktober 2026',
    deadline: '28 Oktober 2026',
    category: 'Air & Sanitasi',
    description: 'Masyarakat membutuhkan akses air bersih yang stabil, aman, dan terjangkau. Sumber eksisting tidak mencukupi terutama pada musim kemarau.',
    applicantName: 'Budi Santoso',
    contact: 'budi@tirtabakti.id',
    targetGroup: 'Keluarga rentan & lansia',
    estimatedBudget: 'Rp 85.000.000',
    outputMitra: 'Terbangunnya 1 unit bak penampungan air bersih kapasitas 10.000 liter dan jaringan pipa distribusi ke 126 KK.',
    bahanPermintaan: ['Proposal', 'RAB'],
    alasanMendesak: 'Debit mata air warga turun drastis memasuki puncak musim kemarau sehingga warga harus berjalan 2 km.',
    linkPendukung: 'https://drive.google.com/drive/folders/air-bersih-cisarua',
    originId: 'BD-2026-012',
    originTitle: 'Assessment Cisarua',
    proposalId: 'PRO-2026-018',
    proposalTitle: 'Akses Air Bersih',
    miproId: 'MIP-2026-024',
    monevId: 'MON-2026-031',
  },
  {
    id: 'REQ-2026-052',
    title: 'Hunian Aman Cugenang',
    type: 'Permohonan Bantuan',
    priority: 'Kritis',
    requester: 'Forum Warga Cugenang',
    location: 'Cugenang, Kab. Cianjur',
    beneficiary: '188 keluarga / 640 jiwa',
    pic: 'Dimas Arga',
    status: 'Menunggu persetujuan',
    date: '18 Oktober 2026',
    deadline: '01 November 2026',
    category: 'Kebencanaan & Hunian',
    description: 'Perbaikan hunian sementara dan penyediaan fasilitas sanitasi komunal bagi keluarga terdampak bencana gempa bumi.',
    applicantName: 'Dedi Kurniawan',
    contact: 'dedi.cugenang@warga.id',
    targetGroup: 'Keluarga terdampak bencana & balita',
    estimatedBudget: 'Rp 145.000.000',
    outputMitra: 'Tersedianya 30 unit hunian sementara (huntara) layak huni dan 6 titik MCK komunal darurat.',
    bahanPermintaan: ['Proposal', 'Assessment', 'RAB'],
    alasanMendesak: 'Musim hujan sudah tiba sementara warga masih bertahan di tenda darurat yang mulai bocor.',
    linkPendukung: 'https://drive.google.com/drive/folders/hunian-cugenang',
    originId: 'BD-2026-015',
    originTitle: 'Assessment Cugenang',
    proposalId: 'PRO-2026-021',
    proposalTitle: 'Hunian Darurat Cugenang',
    miproId: 'MIP-2026-028',
    monevId: 'MON-2026-034',
  },
  {
    id: 'REQ-2026-067',
    title: 'Sekolah Siaga Bencana',
    type: 'Request Assessment',
    priority: 'Tinggi',
    requester: 'SDN Wonosari 2',
    location: 'Wonosari, Gunungkidul',
    beneficiary: '315 siswa / 28 guru',
    pic: 'Sinta Dewi',
    status: 'Baru',
    date: '21 Oktober 2026',
    deadline: '04 November 2026',
    category: 'Pendidikan & Kebencanaan',
    description: 'Edukasi kesiapsiagaan bencana, simulasi evakuasi mandiri, serta pemetaan titik kumpul aman di lingkungan sekolah.',
    applicantName: 'Sri Wahyuni, S.Pd.',
    contact: 'info@sdnwonosari2.sch.id',
    targetGroup: 'Siswa sekolah dasar & tenaga pendidik',
    estimatedBudget: 'Rp 32.000.000',
    outputMitra: 'Terlaksananya 2 hari pelatihan dan simulasi evakuasi bencana serta pemasangan rambu jalur evakuasi sekolah.',
    bahanPermintaan: ['Assessment', 'Proposal'],
    alasanMendesak: 'Sekolah berada di zona rawan gempa dan belum memiliki SOP evakuasi bagi siswa.',
    linkPendukung: 'https://drive.google.com/drive/folders/sekolah-siaga-wonosari',
    originId: 'BD-2026-019',
    originTitle: 'Assessment Gunungkidul',
    proposalId: 'PRO-2026-025',
    proposalTitle: 'Sekolah Tangguh Bencana',
    miproId: 'MIP-2026-030',
    monevId: 'MON-2026-038',
  },
  {
    id: 'REQ-2026-071',
    title: 'Klinik Bergerak Lombok',
    type: 'Request Proposal',
    priority: 'Sedang',
    requester: 'Sehat Bersama',
    location: 'Tanjung, Lombok Utara',
    beneficiary: '540 orang / 160 KK',
    pic: 'Nadia Sari',
    status: 'Diproses',
    date: '24 Oktober 2026',
    deadline: '07 November 2026',
    category: 'Kesehatan Masyarakat',
    description: 'Layanan pemeriksaan kesehatan keliling dan pemberian obat-obatan dasar untuk masyarakat di wilayah terpencil.',
    applicantName: 'dr. Farhan Hakim',
    contact: 'farhan@sehatbersama.org',
    targetGroup: 'Lansia, ibu hamil & anak-anak',
    estimatedBudget: 'Rp 58.000.000',
    outputMitra: 'Terselenggaranya layanan pengobatan gratis di 4 desa terpencil beserta penyuluhan gizi keluarga.',
    bahanPermintaan: ['Proposal', 'Pitchdeck / Rencana Penyaluran'],
    linkPendukung: 'https://drive.google.com/drive/folders/klinik-lombok',
    originId: 'BD-2026-022',
    originTitle: 'Assessment Kesehatan Lombok',
    proposalId: 'PRO-2026-029',
    proposalTitle: 'Layanan Klinik Bergerak',
    miproId: 'MIP-2026-033',
    monevId: 'MON-2026-041',
  },
  {
    id: 'REQ-2026-074',
    title: 'Dapur Umum Garut',
    type: 'Permohonan Bantuan',
    priority: 'Kritis',
    requester: 'Relawan Garut Bergerak',
    location: 'Tarogong Kidul, Kab. Garut',
    beneficiary: '320 keluarga / 1.100 jiwa',
    pic: 'Dimas Arga',
    status: 'Baru',
    date: '27 Oktober 2026',
    deadline: '03 November 2026',
    category: 'Tanggap Darurat & Pangan',
    description: 'Penyediaan logistik bahan pangan dan operasional dapur umum darurat bagi warga terdampak banjir luapan sungai.',
    applicantName: 'Kang Rizal Pratama',
    contact: 'rizal@garutbergerak.id',
    targetGroup: 'Warga pengungsi & kelompok rentan',
    estimatedBudget: 'Rp 48.000.000',
    outputMitra: 'Distribusi 3.300 paket makanan siap saji selama masa tanggap darurat 7 hari di posko pengungsian.',
    bahanPermintaan: ['RAB', 'Assessment'],
    alasanMendesak: 'Akses dapur warga masih terendam lumpur banjir sehingga kebutuhan makanan siap saji sangat mendesak.',
    linkPendukung: 'https://drive.google.com/drive/folders/dapur-umum-garut',
    originId: 'BD-2026-026',
    originTitle: 'Assessment Darurat Garut',
    proposalId: 'PRO-2026-032',
    proposalTitle: 'Dapur Umum Tanggap Banjir',
    miproId: 'MIP-2026-036',
    monevId: 'MON-2026-044',
  },
  {
    id: 'REQ-2026-079',
    title: 'Perpustakaan Desa Sleman',
    type: 'Request RAB',
    priority: 'Rendah',
    requester: 'Karang Taruna Sleman',
    location: 'Ngaglik, Kab. Sleman',
    beneficiary: '150 siswa / 45 remaja',
    pic: 'Aulia Rahman',
    status: 'Menunggu persetujuan',
    date: '30 Oktober 2026',
    deadline: '13 November 2026',
    category: 'Pendidikan & Literasi',
    description: 'Pengadaan buku bacaan anak, rak perpustakaan desa, dan penyelenggaraan pojok literasi akhir pekan.',
    applicantName: 'Bagus Setiawan',
    contact: 'bagus@ktsleman.org',
    targetGroup: 'Anak usia sekolah & remaja desa',
    estimatedBudget: 'Rp 22.500.000',
    outputMitra: 'Tersedianya 500 koleksi buku anak dan remaja serta 4 unit rak buku di balai warga.',
    bahanPermintaan: ['RAB', 'Proposal'],
    linkPendukung: 'https://drive.google.com/drive/folders/perpustakaan-sleman',
    originId: 'BD-2026-030',
    originTitle: 'Assessment Literasi Sleman',
    proposalId: 'PRO-2026-035',
    proposalTitle: 'Taman Bacaan Masyarakat',
    miproId: 'MIP-2026-039',
    monevId: 'MON-2026-047',
  },
  {
    id: 'REQ-2026-083',
    title: 'Pangan Sehat Balita',
    type: 'Request Assessment',
    priority: 'Tinggi',
    requester: 'Posyandu Melati',
    location: 'Oebobo, Kota Kupang',
    beneficiary: '210 balita / 180 ibu',
    pic: 'Rani Putri',
    status: 'Baru',
    date: '02 November 2026',
    deadline: '16 November 2026',
    category: 'Kesehatan & Gizi',
    description: 'Program pemberian makanan tambahan (PMT) bergizi dan pemantauan tumbuh kembang balita untuk pencegahan stunting.',
    applicantName: 'Maria Goreti',
    contact: 'maria.posyandumelati@kupang.id',
    targetGroup: 'Balita gizi kurang & ibu menyusui',
    estimatedBudget: 'Rp 40.000.000',
    outputMitra: 'Pemberian paket PMT protein hewani selama 90 hari dan edukasi gizi bagi 180 ibu balita.',
    bahanPermintaan: ['Assessment', 'Proposal', 'RAB'],
    alasanMendesak: 'Ditemukan peningkatan angka balita bawah garis merah (BGM) pada penimbangan bulanan terakhir.',
    linkPendukung: 'https://drive.google.com/drive/folders/pangan-balita-kupang',
    originId: 'BD-2026-033',
    originTitle: 'Assessment Gizi Kupang',
    proposalId: 'PRO-2026-039',
    proposalTitle: 'Intervensi Gizi Balita',
    miproId: 'MIP-2026-042',
    monevId: 'MON-2026-050',
  },
]

const PER_PAGE = 4
const ALL = 'Semua'

const statusTone: Record<Status, string> = {
  Selesai: 'green', Diproses: 'blue', 'Menunggu persetujuan': 'orange', Baru: 'gray',
}

/* ==========================================================
   COMPONENT
   ========================================================== */
export default function RequestProgram({
  notify: propNotify,
  onSubCrumbsChange,
}: {
  notify?: (msg: string) => void
  onSubCrumbsChange?: (crumbs: string[]) => void
} = {}) {
  const { notify: ctxNotify, setSubCrumbs } = useDashboard()
  const notify = propNotify || ctxNotify

  const [view, setView] = useState<'list' | 'create1' | 'create2' | 'detail'>('list')
  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const switchView = (
    targetView: 'list' | 'create1' | 'create2' | 'detail',
    reqItem?: RequestRow,
    editMode = false
  ) => {
    setView(targetView)
    setIsEditing(editMode)
    if (targetView === 'list') {
      setSelectedRequest(null)
      onSubCrumbsChange ? onSubCrumbsChange([]) : setSubCrumbs([])
    } else if (targetView === 'create1') {
      if (!editMode) setSelectedRequest(null)
      const crumb = editMode ? ['Ubah Request Program'] : ['Ajukan Request (Mitra)']
      onSubCrumbsChange ? onSubCrumbsChange(crumb) : setSubCrumbs(crumb)
    } else if (targetView === 'create2') {
      if (!editMode) setSelectedRequest(null)
      const crumb = editMode ? ['Ubah Assessment Program'] : ['Assessment Program Lapangan']
      onSubCrumbsChange ? onSubCrumbsChange(crumb) : setSubCrumbs(crumb)
    } else if (targetView === 'detail') {
      if (reqItem) setSelectedRequest(reqItem)
      onSubCrumbsChange
        ? onSubCrumbsChange(['Detail Request Program'])
        : setSubCrumbs(['Detail Request Program'])
    }
  }

  useEffect(() => {
    if (view === 'list') {
      onSubCrumbsChange ? onSubCrumbsChange([]) : setSubCrumbs([])
    }
  }, [view, onSubCrumbsChange, setSubCrumbs])

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [items, setItems] = useState<RequestRow[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState(ALL)
  const [priority, setPriority] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.getRequestPrograms()
      .then((res) => {
        const list = res?.requests || res?.data
        if (Array.isArray(list)) {
          const mapped: RequestRow[] = list.map((r: any) => ({
            id: r.id,
            title: r.program_name || r.title || 'Program Lapangan',
            type: r.category ? (r.category.startsWith('Request') ? r.category : `Request ${r.category}`) : (r.type || 'Permohonan Bantuan'),
            priority: (r.priority as Priority) || 'Sedang',
            requester: r.applicant_name || r.requester || 'Masyarakat',
            location: r.location || 'Wilayah Program',
            beneficiary: r.estimated_budget || r.beneficiary || 'Penerima Manfaat',
            pic: r.pic || r.applicant_name || 'Tim Program',
            status: ((r.status === 'Dalam antrean' ? 'Diproses' : r.status) as Status) || 'Baru',
            date: r.date || (r.created_at ? String(r.created_at).slice(0, 10) : '14 Oktober 2026'),
            deadline: r.deadline || '28 Oktober 2026',
            category: r.category || 'Air & Sanitasi',
            description: r.description || 'Masyarakat membutuhkan akses layanan program yang stabil, aman, dan terjangkau sesuai hasil pemetaan lapangan.',
            applicantName: r.applicant_name || r.applicantName || 'Budi Santoso',
            contact: r.contact || 'kontak@mitraprogram.id',
            targetGroup: r.target_group || r.targetGroup || 'Keluarga rentan & lansia',
            originId: r.origin_id || 'BD-2026-012',
            originTitle: r.origin_title || `Assessment ${r.location || 'Lapangan'}`,
            proposalId: r.proposal_id || 'PRO-2026-018',
            proposalTitle: r.proposal_title || r.program_name || r.title || 'Akses Program',
            miproId: r.mipro_id || 'MIP-2026-024',
            monevId: r.monev_id || 'MON-2026-031',
          }))
          setItems(mapped)
        }
      })
      .catch((err) => console.warn('Notice: using fallback requests', err))
  }, [])

  const dynamicKpis = useMemo(() => [
    { label: 'Total request', value: String(items.length).padStart(2, '0'), icon: 'database' as IconName, tone: 'teal', status: ALL },
    { label: 'Baru', value: String(items.filter(i => i.status === 'Baru').length).padStart(2, '0'), icon: 'check' as IconName, tone: 'blue', status: 'Baru' as Status },
    { label: 'Dalam proses', value: String(items.filter(i => i.status === 'Diproses').length).padStart(2, '0'), icon: 'clock' as IconName, tone: 'amber', status: 'Diproses' as Status },
    { label: 'Menunggu persetujuan', value: String(items.filter(i => i.status === 'Menunggu persetujuan').length).padStart(2, '0'), icon: 'users' as IconName, tone: 'purple', status: 'Menunggu persetujuan' as Status },
  ], [items])

  const types = useMemo(() => Array.from(new Set(items.map(r => r.type))), [items])
  const priorities: Priority[] = ['Rendah', 'Sedang', 'Tinggi', 'Kritis']
  const statuses: Status[] = ['Baru', 'Diproses', 'Menunggu persetujuan', 'Selesai']

  const filtered = useMemo(() => items
    .filter(r =>
      `${r.id} ${r.title} ${r.requester} ${r.location} ${r.pic}`.toLowerCase().includes(search.toLowerCase()) &&
      (type === ALL || r.type === type) &&
      (priority === ALL || r.priority === priority) &&
      (status === ALL || r.status === status))
    .sort((a, b) => sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)),
  [items, search, type, priority, status, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const hasFilter = search !== '' || type !== ALL || priority !== ALL || status !== ALL
  const resetFilters = () => { setSearch(''); setType(ALL); setPriority(ALL); setStatus(ALL); setPage(1) }

  const select = (label: string, value: string, options: string[], onChange: (v: string) => void) => (
    <select
      className={`rq-select ${value !== ALL ? 'on' : ''}`}
      aria-label={label}
      value={value}
      onChange={e => { onChange(e.target.value); setPage(1) }}
    >
      <option value={ALL}>{label}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )

  /* ==========================================================
     VIEW 3: DETAIL REQUEST PROGRAM (SESUAI DESAIN — TANPA PDF UNDUH)
     ========================================================== */
  if (view === 'detail' && selectedRequest) {
    const r = selectedRequest
    const refs: { label: string; id: string; sub: string; icon: IconName }[] = [
      { label: 'Request Program', id: r.id, sub: r.title, icon: 'inbox' },
      { label: 'Proposal', id: r.proposalId || 'PRO-2026-018', sub: r.proposalTitle || 'Akses Air Bersih', icon: 'file' },
      { label: 'MIPRO', id: r.miproId || 'MIP-2026-024', sub: 'Dalam pelaksanaan', icon: 'shield' },
      { label: 'Monitoring', id: r.monevId || 'MON-2026-031', sub: 'Perlu tindak lanjut', icon: 'pulse' },
    ]

    return (
      <div className="rq-detail-page">
        <div className="prop-upload-nav">
          <button type="button" className="prop-back-link" onClick={() => switchView('list')}>
            <Icon name="back" size={16} />
            <span>Kembali ke daftar request program</span>
          </button>
        </div>

        {/* Header */}
        <div className="rq-detail-head">
          <div>
            <div className="rq-detail-eyebrow">
              <span className="rq-id">{r.id}</span>
              <span className={`rq-status ${statusTone[r.status]}`}><i />{r.status}</span>
            </div>
            <h1>{r.title}</h1>
            <p>Diajukan {r.date || '14 Oktober 2026'} • {r.type}</p>
          </div>
          <div className="rq-detail-actions">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() =>
                switchView(
                  r.type === 'Request Assessment' ? 'create2' : 'create1',
                  r,
                  true
                )
              }
            >
              <Icon name="edit" size={16} />
              <span>Ubah request</span>
            </button>
          </div>
        </div>

        {/*Grid 2 Kolom Sesuai Desain */}
        <div className="rq-detail-grid">
          <div className="rq-detail-main">
            {/* Card 1: Informasi lengkap request */}
            <section className="rq-detail-card">
              <h2>Informasi lengkap request</h2>
              <div className="rq-info-grid">
                <div>
                  <small>Jenis request</small>
                  <strong>{r.type}</strong>
                </div>
                <div>
                  <small>Prioritas / urgensi</small>
                  <strong>
                    <span className="rq-prio-badge">
                      <i />
                      {r.priority}
                    </span>
                  </strong>
                </div>
                <div>
                  <small>Kategori / tema program</small>
                  <strong>{r.category || 'Air & Sanitasi'}</strong>
                </div>
                <div>
                  <small>Tanggal masuk</small>
                  <strong>{r.date || '14 Oktober 2026'}</strong>
                </div>
                <div>
                  <small>Tenggat tindak lanjut (Deadline)</small>
                  <strong>{r.deadline || '28 Oktober 2026'}</strong>
                </div>
                <div>
                  <small>Nama pengaju / PIC request</small>
                  <strong>{r.pic}</strong>
                </div>
                <div>
                  <small>Estimasi anggaran program</small>
                  <strong>{r.estimatedBudget || 'Rp 85.000.000'}</strong>
                </div>
                <div>
                  <small>Bahan permintaan mitra</small>
                  <strong>
                    {r.bahanPermintaan && r.bahanPermintaan.length > 0
                      ? r.bahanPermintaan.join(', ')
                      : r.type.replace('Request ', '')}
                  </strong>
                </div>
                <div>
                  <small>Tautan dokumen pendukung</small>
                  <strong style={{ wordBreak: 'break-all', color: '#056b66', fontSize: '12px' }}>
                    {r.linkPendukung || 'https://drive.google.com/drive/folders/dokumen-mitra'}
                  </strong>
                </div>
              </div>
              <div className="rq-detail-desc">
                <small>Latar belakang &amp; deskripsi kebutuhan</small>
                <p>
                  {r.description ||
                    'Masyarakat membutuhkan akses air bersih yang stabil, aman, dan terjangkau. Sumber eksisting tidak mencukupi terutama pada musim kemarau.'}
                </p>
              </div>
              <div className="rq-detail-desc">
                <small>Output yang diinginkan / output program</small>
                <p>
                  {r.outputMitra ||
                    `Terlaksananya kegiatan ${r.title} secara tepat sasaran bagi ${r.beneficiary} di ${r.location}.`}
                </p>
              </div>
              {(r.alasanMendesak || r.priority === 'Tinggi' || r.priority === 'Kritis') && (
                <div className="rq-detail-desc">
                  <small>Alasan urgensi mendesak</small>
                  <p>
                    {r.alasanMendesak ||
                      'Kebutuhan masyarakat di lokasi sasaran bersifat mendesak dan memerlukan tindak lanjut segera oleh tim program.'}
                  </p>
                </div>
              )}
            </section>

            {/* Card 2: Pemohon, mitra & sasaran */}
            <section className="rq-detail-card">
              <h2>Pemohon, mitra &amp; sasaran</h2>
              <div className="rq-info-grid">
                <div>
                  <small>Nama pemohon</small>
                  <strong>{r.applicantName || 'Budi Santoso'}</strong>
                </div>
                <div>
                  <small>Mitra / organisasi</small>
                  <strong>{r.requester}</strong>
                </div>
                <div>
                  <small>Kontak</small>
                  <strong>{r.contact || 'budi@tirtabakti.id'}</strong>
                </div>
                <div>
                  <small>Permintaan lokasi program</small>
                  <strong>{r.location}</strong>
                </div>
                <div>
                  <small>Sasaran / target penerima</small>
                  <strong>{r.beneficiary}</strong>
                </div>
                <div>
                  <small>Kelompok penerima</small>
                  <strong>{r.targetGroup || 'Keluarga rentan & lansia'}</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="rq-detail-side">
            {/* Card Kanan 1: Referensi asal */}
            <section className="rq-detail-card">
              <h2>Referensi asal</h2>
              <button
                type="button"
                className="rq-origin-ref"
                onClick={() => notify(`Membuka referensi ${r.originId || 'BD-2026-012'} di Bank Data...`)}
              >
                <span className="rq-ref-icon">
                  <Icon name="database" size={18} />
                </span>
                <span className="rq-ref-body">
                  <small>Bank Data</small>
                  <b>{r.originId || 'BD-2026-012'}</b>
                  <em>{r.originTitle || 'Assessment Cisarua'}</em>
                </span>
                <Icon name="chevronRight" size={15} />
              </button>
            </section>

            {/* Card Kanan 2: Catatan lintas modul */}
            <section className="rq-detail-card">
              <h2>Catatan lintas modul</h2>
              <div className="rq-ref-list">
                {refs.map((refItem) => (
                  <button
                    type="button"
                    key={refItem.id}
                    className="rq-ref-item"
                    onClick={() => notify(`Membuka modul ${refItem.label} (${refItem.id})...`)}
                  >
                    <span className="rq-ref-icon">
                      <Icon name={refItem.icon} size={17} />
                    </span>
                    <span className="rq-ref-body">
                      <small>{refItem.label}</small>
                      <b>{refItem.id}</b>
                      <em>{refItem.sub}</em>
                    </span>
                    <Icon name="chevronRight" size={15} />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    )
  }

  /* ==========================================================
     VIEW 2: FORM PENGAJUAN (FORM 1 & FORM 2) / EDIT REQUEST
     ========================================================== */
  if (view === 'create1' || view === 'create2') {
    const handleFormBack = () => {
      if (isEditing && selectedRequest) {
        switchView('detail', selectedRequest, false)
      } else {
        switchView('list')
      }
    }

    const handleFormSuccess = (savedReq: RequestRow) => {
      if (isEditing && selectedRequest) {
        setItems((prev) => prev.map((it) => (it.id === savedReq.id ? savedReq : it)))
        setSelectedRequest(savedReq)
        switchView('detail', savedReq, false)
      } else {
        setItems((prev) => [savedReq, ...prev])
        switchView('list')
      }
    }

    return (
      <div className="rq-form-container">
        {/* Tab Switcher antara Form 1 dan Form 2 */}
        <div className="rq-form-switcher-bar">
          <span className="rq-switcher-label">PILIH TIPE FORMULIR:</span>
          <div className="rq-form-tabs">
            <button
              type="button"
              className={`rq-form-tab-btn ${view === 'create1' ? 'active' : ''}`}
              onClick={() => switchView('create1', selectedRequest || undefined, isEditing)}
            >
              <span>Form 1 • Permohonan Mitra / Komunitas</span>
            </button>
            <button
              type="button"
              className={`rq-form-tab-btn ${view === 'create2' ? 'active' : ''}`}
              onClick={() => switchView('create2', selectedRequest || undefined, isEditing)}
            >
              <span>Form 2 • Assessment Program Lapangan</span>
            </button>
          </div>
        </div>

        {view === 'create1' ? (
          <RequestProgramForm
            initialData={isEditing ? selectedRequest : null}
            onBack={handleFormBack}
            onSubmitSuccess={handleFormSuccess}
            notify={notify}
          />
        ) : (
          <RequestProgramForm2
            initialData={isEditing ? selectedRequest : null}
            onBack={handleFormBack}
            onSubmitSuccess={handleFormSuccess}
            notify={notify}
          />
        )}
      </div>
    )
  }

  return (
    <div className="rq-page">
      {/* Heading */}
      <div className="rq-heading">
        <div>
          <h1>Request Program</h1>
          <p>Pintu masuk seluruh kebutuhan program, mitra, dan permohonan masyarakat.</p>
        </div>
        <div className="rq-actions">
          <button className="db-btn db-btn-outline" onClick={() => notify('Data request berhasil disiapkan untuk diunduh.')}>
            <Icon name="download" size={16} />
            <span>Ekspor</span>
          </button>
          
          {/* Dropdown Ajukan Request */}
          <div className="db-dropdown">
            <button
              className="db-btn db-btn-primary"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Icon name="plus" size={17} />
              <span>Ajukan request</span>
              <Icon name="arrowDown" size={13} />
            </button>
            {dropdownOpen && (
              <div className="db-menu right rq-ajukan-menu">
                <button
                  type="button"
                  onClick={() => {
                    switchView('create1')
                    setDropdownOpen(false)
                  }}
                >
                  <div>
                    <strong>Form 1: Permintaan Mitra</strong>
                    <small>Kemitraan, bahan proposal, RAB, pitchdeck</small>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchView('create2')
                    setDropdownOpen(false)
                  }}
                >
                  <div>
                    <strong>Form 2: Assessment Program</strong>
                    <small>Lokasi maps, anggaran, target penerima &amp; output</small>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="rq-kpis">
        {dynamicKpis.map(k => (
          <button
            key={k.label}
            className={`rq-kpi ${status === k.status && k.status !== ALL ? 'active' : ''}`}
            onClick={() => { setStatus(k.status); setPage(1) }}
          >
            <span className={`rq-kpi-icon ${k.tone}`}><Icon name={k.icon} size={18} /></span>
            <span className="rq-kpi-body">
              <small>{k.label}</small>
              <strong>{k.value}</strong>
            </span>
            <span className="rq-kpi-chevron"><Icon name="chevronRight" size={16} /></span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <section className="rq-card">
        <div className="rq-toolbar">
          <label className="rq-search">
            <Icon name="search" size={17} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Cari ID, program, lokasi, atau PIC..."
            />
            {search && (
              <button aria-label="Hapus pencarian" onClick={() => setSearch('')}><Icon name="close" size={14} /></button>
            )}
          </label>
          <div className="rq-filters">
            {select('Jenis request', type, types, setType)}
            {select('Prioritas', priority, priorities, setPriority)}
            {select('Status', status, statuses, setStatus)}
            <button
              className={`rq-filter-btn ${hasFilter ? 'on' : ''}`}
              onClick={() => hasFilter ? resetFilters() : notify('Gunakan pilihan jenis, prioritas, dan status untuk menyaring data.')}
              title={hasFilter ? 'Reset semua filter' : 'Filter'}
            >
              <Icon name={hasFilter ? 'close' : 'settings'} size={16} />
              <span>{hasFilter ? 'Reset' : 'Filter'}</span>
            </button>
          </div>
        </div>

        <div className="rq-table-wrap">
          <table className="rq-table">
            <thead>
              <tr>
                <th>
                  <button className="rq-sort" onClick={() => setSortAsc(!sortAsc)}>
                    ID / program <Icon name={sortAsc ? 'arrowUp' : 'arrowDown'} size={13} />
                  </button>
                </th>
                <th>Jenis request</th>
                <th>Prioritas</th>
                <th>Pemohon / mitra</th>
                <th>Lokasi</th>
                <th>Penerima</th>
                <th>PIC</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} onClick={() => switchView('detail', r)}>
                  <td>
                    <span className="rq-id">{r.id}</span>
                    <strong>{r.title}</strong>
                  </td>
                  <td>{r.type}</td>
                  <td><span className={`rq-priority ${r.priority.toLowerCase()}`}>{r.priority}</span></td>
                  <td>{r.requester}</td>
                  <td>{r.location}</td>
                  <td>{r.beneficiary}</td>
                  <td><span className="rq-chip"><i />{r.pic}</span></td>
                  <td><span className={`rq-status ${statusTone[r.status]}`}><i />{r.status}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="rq-eye-btn"
                      title="Lihat detail request"
                      aria-label={`Lihat detail ${r.title}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        switchView('detail', r)
                      }}
                    >
                      <Icon name="eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="rq-empty">
              <span><Icon name="search" size={24} /></span>
              <b>Tidak ada data yang sesuai</b>
              <p>Coba ubah kata kunci atau filter yang digunakan.</p>
              <button className="db-btn db-btn-outline" onClick={resetFilters}>Reset filter</button>
            </div>
          )}
        </div>

        <div className="rq-pagination">
          <span>Menampilkan {rows.length} dari {filtered.length} data</span>
          <div>
            <button aria-label="Sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <Icon name="chevronLeft" size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={n === currentPage ? 'current' : ''} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button aria-label="Berikutnya" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              <Icon name="chevronRight" size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
