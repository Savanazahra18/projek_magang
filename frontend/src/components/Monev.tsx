'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'

type IconName =
  | 'plus'
  | 'database'
  | 'check'
  | 'clock'
  | 'users'
  | 'chevronRight'
  | 'chevronLeft'
  | 'search'
  | 'settings'
  | 'arrowUp'
  | 'arrowDown'
  | 'close'
  | 'back'
  | 'download'
  | 'paperclip'
  | 'file'
  | 'eye'

const paths: Record<IconName, ReactNode> = {
  plus: <path d="M12 5v14M5 12h14" />,
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-4 2.5-6.5 6-6.5s6 2.5 6 6.5" />
      <path d="M16 5a3 3 0 010 6M18 14c2 .6 3 2.7 3 6" />
    </>
  ),
  chevronRight: <path d="M9 18l6-6-6-6" />,
  chevronLeft: <path d="M15 18l-6-6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2h-4V21a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 00.3-1.9A1.7 1.7 0 003 14H2.8v-4H3a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 001.9.3A1.7 1.7 0 0010 3V2.8h4V3a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.2v4H21a1.7 1.7 0 00-1.6 1z" />
    </>
  ),
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  paperclip: (
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

type MonevStatus = 'Sesuai rencana' | 'Perlu tindak lanjut' | 'Terjadwal'

interface PlanIndicator {
  component: string
  plan: string
  actual: number
  note: string
}

interface CorrectiveIssue {
  id: string
  title: string
  description: string
  owner: string
  deadline: string
  status: 'Perlu Tindak Lanjut' | 'Dalam Proses' | 'Selesai'
}

interface SupportingDoc {
  name: string
  size: string
  date: string
  kind: 'zip' | 'pdf'
}

export interface MonevItem {
  id: string
  title: string
  miproId: string
  assessmentId: string
  requestId: string
  location: string
  visitDate: string
  visitDateFull: string
  nextVisit: string
  nextVisitIso: string
  officer: string
  progress: number
  status: MonevStatus
  notes: string
  indicators: PlanIndicator[]
  issues: CorrectiveIssue[]
  docs: SupportingDoc[]
}

const initialMonevList: MonevItem[] = [
  {
    id: 'MON-2026-028',
    title: 'UMKM Tangguh Sembalun',
    miproId: 'MIP-2026-017',
    assessmentId: 'BD-2026-009',
    requestId: 'REQ-2026-038',
    location: 'Lombok Timur',
    visitDate: '15 Okt 2026',
    visitDateFull: '15 Oktober 2026',
    nextVisit: '05 Nov 2026',
    nextVisitIso: '2026-11-05',
    officer: 'Fajar Malik',
    progress: 82,
    status: 'Sesuai rencana',
    notes:
      'Distribusi peralatan usaha dan sesi pendampingan manajemen keuangan berjalan lancar. Kelompok usaha mulai menyusun pembukuan harian secara mandiri.',
    indicators: [
      { component: 'Penyaluran peralatan produksi', plan: '100%', actual: 90, note: 'Unit utama telah diterima' },
      { component: 'Pelatihan manajemen usaha', plan: '4 sesi', actual: 80, note: '3 dari 4 sesi terlaksana' },
      { component: 'Pendampingan kelompok UMKM', plan: '85 pelaku', actual: 76, note: 'Berjalan sesuai jadwal' },
    ],
    issues: [
      {
        id: 'ISS-01',
        title: 'Penyesuaian jadwal pendampingan sesi akhir',
        description: 'Menyesuaikan waktu panen raya warga di Sembalun.',
        owner: 'Aulia Rahman',
        deadline: '02 Nov 2026',
        status: 'Dalam Proses',
      },
    ],
    docs: [
      { name: 'Foto pendampingan Sembalun.zip', size: '9,8 MB', date: '15 Okt 2026', kind: 'zip' },
      { name: 'Daftar hadir pelatihan UMKM.pdf', size: '1,4 MB', date: '15 Okt 2026', kind: 'pdf' },
    ],
  },
  {
    id: 'MON-2026-031',
    title: 'Program Air Bersih Cisarua',
    miproId: 'MIP-2026-024',
    assessmentId: 'BD-2026-012',
    requestId: 'REQ-2026-041',
    location: 'Bogor',
    visitDate: '20 Okt 2026',
    visitDateFull: '20 Oktober 2026',
    nextVisit: '03 Nov 2026',
    nextVisitIso: '2026-11-03',
    officer: 'Ayu Larasati',
    progress: 68,
    status: 'Perlu tindak lanjut',
    notes:
      'Konstruksi berjalan baik. Terdapat potensi keterlambatan pengiriman sambungan pipa untuk titik distribusi 5 dan 6. Kelompok pengelola perlu tambahan sesi praktik.',
    indicators: [
      { component: 'Konstruksi reservoir', plan: '100%', actual: 68, note: 'Struktur utama selesai' },
      { component: 'Pemasangan jaringan pipa', plan: '3.200 m', actual: 64, note: 'Berjalan sesuai jadwal' },
      { component: 'Titik distribusi', plan: '6 titik', actual: 75, note: 'Berjalan sesuai jadwal' },
    ],
    issues: [
      {
        id: 'ISS-02',
        title: 'Keterlambatan sambungan pipa distribusi',
        description: 'Koordinasi pengiriman bertahap dengan pemasok alternatif.',
        owner: 'Dimas Arga',
        deadline: '30 Okt 2026',
        status: 'Perlu Tindak Lanjut',
      },
    ],
    docs: [
      { name: 'Foto lokasi.zip', size: '12,4 MB', date: '18 Okt 2026', kind: 'zip' },
      { name: 'Hasil uji kualitas air.pdf', size: '1,8 MB', date: '19 Okt 2026', kind: 'pdf' },
      { name: 'Peta jalur distribusi.pdf', size: '1,8 MB', date: '19 Okt 2026', kind: 'pdf' },
    ],
  },
  {
    id: 'MON-2026-034',
    title: 'Klinik Bergerak Lombok',
    miproId: 'MIP-2026-021',
    assessmentId: 'BD-2026-022',
    requestId: 'REQ-2026-071',
    location: 'Lombok Utara',
    visitDate: '22 Okt 2026',
    visitDateFull: '22 Oktober 2026',
    nextVisit: '12 Nov 2026',
    nextVisitIso: '2026-11-12',
    officer: 'Nadia Sari',
    progress: 54,
    status: 'Terjadwal',
    notes:
      'Layanan kesehatan keliling tahap pertama telah menjangkau 2 desa sasaran. Kunjungan berikutnya dijadwalkan untuk pemeriksaan lanjutan lansia dan balita.',
    indicators: [
      { component: 'Layanan pemeriksaan keliling', plan: '4 desa', actual: 50, note: '2 desa telah dikunjungi' },
      { component: 'Distribusi paket obat & vitamin', plan: '540 paket', actual: 58, note: 'Berjalan sesuai jadwal' },
      { component: 'Penyuluhan gizi masyarakat', plan: '4 sesi', actual: 54, note: 'Antusiasme warga tinggi' },
    ],
    issues: [
      {
        id: 'ISS-03',
        title: 'Penambahan stok vitamin anak & lansia',
        description: 'Koordinasi bersama puskesmas setempat sebelum kunjungan tahap kedua.',
        owner: 'Nadia Sari',
        deadline: '08 Nov 2026',
        status: 'Dalam Proses',
      },
    ],
    docs: [
      { name: 'Dokumentasi layanan klinik.zip', size: '11,2 MB', date: '22 Okt 2026', kind: 'zip' },
      { name: 'Rekap pemeriksaan warga.pdf', size: '2,1 MB', date: '22 Okt 2026', kind: 'pdf' },
    ],
  },
]

const ALL = 'Semua'

const statusTone: Record<MonevStatus, string> = {
  'Sesuai rencana': 'green',
  'Perlu tindak lanjut': 'red',
  Terjadwal: 'gray',
}

export default function Monev() {
  const router = useRouter()
  const { notify, setSubCrumbs } = useDashboard()

  const [items, setItems] = useState<MonevItem[]>([])
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedId, setSelectedId] = useState<string>('')

  const loadMonevs = async () => {
    try {
      const res = await api.getMonevList()
      const list = res?.monevs || res?.data
      if (Array.isArray(list)) {
        const mapped: MonevItem[] = list.map((m: any) => ({
          id: m.id,
          title: m.title || 'Program Lapangan',
          miproId: m.miproId || m.mipro_id || '-',
          assessmentId: m.assessmentId || m.assessment_id || '-',
          requestId: m.requestId || m.request_id || '-',
          location: m.location || 'Jawa Barat',
          visitDate: m.visitDate || m.visit_date || '-',
          visitDateFull: m.visitDateFull || m.visit_date_full || m.visitDate || '-',
          nextVisit: m.nextVisit || m.next_visit || '-',
          nextVisitIso: m.nextVisitIso || m.next_visit_iso || '',
          officer: m.officer || 'Tim Program',
          progress: Number(m.progress ?? 0),
          status: (m.status as MonevStatus) || 'Sesuai rencana',
          notes: m.notes || '',
          indicators: Array.isArray(m.indicators)
            ? m.indicators.map((ind: any) => ({
                component: ind.component || ind.name || 'Indikator kegiatan',
                plan: ind.plan || ind.target || '100%',
                actual: Number(ind.actual ?? 0),
                note: ind.note || '',
              }))
            : [],
          issues: Array.isArray(m.issues) ? m.issues : [],
          docs: Array.isArray(m.docs) ? m.docs : [],
        }))
        setItems(mapped)
      }
    } catch (err) {
      console.warn('Gagal memuat data Monev dari API:', err)
    }
  }

  useEffect(() => {
    loadMonevs()
  }, [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL)
  const [periodFilter, setPeriodFilter] = useState(ALL)
  const [officerFilter, setOfficerFilter] = useState(ALL)
  const [sortAsc, setSortAsc] = useState(true)

  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedId) || items[0] || initialMonevList[0],
    [items, selectedId]
  )

  const openDetail = (item: MonevItem) => {
    setSelectedId(item.id)
    setView('detail')
    setSubCrumbs([item.id])
  }

  const backToList = () => {
    setView('list')
    setSubCrumbs([])
  }

  // Update helpers for detail view
  const updateSelected = (updater: (curr: MonevItem) => MonevItem) => {
    setItems((prev) =>
      prev.map((it) => (it.id === selectedItem.id ? updater(it) : it))
    )
  }

  const handleSaveDetail = async () => {
    const avg = Math.round(
      selectedItem.indicators.reduce((sum, ind) => sum + Number(ind.actual || 0), 0) /
        Math.max(1, selectedItem.indicators.length)
    )
    const hasOpenIssue = selectedItem.issues.some(
      (iss) => iss.status === 'Perlu Tindak Lanjut'
    )
    const nextStatus: MonevStatus = hasOpenIssue ? 'Perlu tindak lanjut' : 'Sesuai rencana'

    const updatedPayload: MonevItem = {
      ...selectedItem,
      progress: avg,
      status: nextStatus,
    }

    updateSelected(() => updatedPayload)

    try {
      await api.updateMonev(selectedItem.id, updatedPayload)
      notify('Perubahan monitoring tersimpan ke database dan progres MIPRO diperbarui.')
    } catch {
      notify('Perubahan monitoring tersimpan secara lokal.')
    }
  }

  const handleCreateMonev = async () => {
    try {
      const res = await api.createMonev({
        title: 'Monitoring Pelaksanaan Program Lapangan',
        miproId: 'MIPRO-2026-001',
        assessmentId: 'ASM-2026-001',
        requestId: 'REQ-2026-001',
        location: 'Kab. Bandung',
        visitDate: '29 Okt 2026',
        visitDateFull: '29 Oktober 2026',
        nextVisit: '12 Nov 2026',
        nextVisitIso: '2026-11-12',
        officer: 'Tim Program',
        progress: 50,
        status: 'Sesuai rencana',
        notes: 'Catatan hasil kunjungan monitoring lapangan.',
        indicators: [
          {
            component: 'Realisasi kegiatan utama lapangan',
            plan: '100%',
            actual: 50,
            note: 'Berjalan sesuai jadwal',
          },
        ],
        issues: [],
        docs: [],
      })
      const created = res?.monev
      if (created) {
        const newItem: MonevItem = {
          id: created.id,
          title: created.title,
          miproId: created.miproId || '-',
          assessmentId: created.assessmentId || '-',
          requestId: created.requestId || '-',
          location: created.location,
          visitDate: created.visitDate,
          visitDateFull: created.visitDateFull,
          nextVisit: created.nextVisit,
          nextVisitIso: created.nextVisitIso,
          officer: created.officer,
          progress: Number(created.progress ?? 50),
          status: (created.status as MonevStatus) || 'Sesuai rencana',
          notes: created.notes || '',
          indicators: Array.isArray(created.indicators) ? created.indicators : [],
          issues: Array.isArray(created.issues) ? created.issues : [],
          docs: Array.isArray(created.docs) ? created.docs : [],
        }
        setItems((prev) => [newItem, ...prev])
        openDetail(newItem)
        notify(`Lembar monitoring ${newItem.id} berhasil dibuat di database.`)
      }
    } catch {
      if (items[0]) {
        openDetail(items[0])
      }
      notify('Lembar monitoring lapangan dibuka.')
    }
  }

  const filtered = useMemo(() => {
    return items
      .filter((r) => {
        const matchSearch = `${r.id} ${r.title} ${r.miproId} ${r.location} ${r.officer}`
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchStatus = statusFilter === ALL || r.status === statusFilter
        const matchOfficer = officerFilter === ALL || r.officer === officerFilter
        const matchPeriod =
          periodFilter === ALL ||
          (periodFilter === 'Oktober 2026' && r.visitDate.includes('Okt')) ||
          (periodFilter === 'November 2026' && r.nextVisit.includes('Nov'))
        return matchSearch && matchStatus && matchOfficer && matchPeriod
      })
      .sort((a, b) => (sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)))
  }, [items, search, statusFilter, officerFilter, periodFilter, sortAsc])

  const hasFilter =
    search !== '' || statusFilter !== ALL || periodFilter !== ALL || officerFilter !== ALL

  const resetFilters = () => {
    setSearch('')
    setStatusFilter(ALL)
    setPeriodFilter(ALL)
    setOfficerFilter(ALL)
  }

  /* ==========================================================
     VIEW 2: DETAIL — LEMBAR MONITORING LAPANGAN
     ========================================================== */
  if (view === 'detail' && selectedItem) {
    const primaryIssueStatus =
      selectedItem.issues[0]?.status ||
      (selectedItem.status === 'Perlu tindak lanjut'
        ? 'Perlu Tindak Lanjut'
        : 'Sesuai Rencana')

    const badgeTone =
      primaryIssueStatus === 'Perlu Tindak Lanjut'
        ? 'red'
        : primaryIssueStatus === 'Dalam Proses'
        ? 'blue'
        : 'green'

    return (
      <div className="mon-detail-page">
        <div>
          <button type="button" className="mon-back-link" onClick={backToList}>
            <Icon name="back" size={16} />
            <span>Kembali ke Monitoring &amp; Evaluasi</span>
          </button>
        </div>

        {/* Detail Header */}
        <div className="mon-detail-head">
          <div>
            <div className="mon-detail-eyebrow">
              <span>{selectedItem.id}</span>
              <span className={`mon-status ${badgeTone}`}>
                <i />
                {primaryIssueStatus}
              </span>
            </div>
            <h1>Lembar Monitoring Lapangan</h1>
            <p>
              {selectedItem.title} • Kunjungan {selectedItem.visitDateFull}
            </p>
          </div>

          <button
            type="button"
            className="db-btn db-btn-primary"
            onClick={handleSaveDetail}
          >
            <Icon name="check" size={16} />
            <span>Simpan perubahan</span>
          </button>
        </div>

        {/* 5-Column Summary Card */}
        <div className="mon-summary-card">
          <div>
            <small>MIPRO</small>
            <button
              type="button"
              className="mon-summary-link"
              onClick={() => router.push('/dashboard/mipro')}
            >
              {selectedItem.miproId}
            </button>
          </div>
          <div>
            <small>Assessment</small>
            <button
              type="button"
              className="mon-summary-link"
              onClick={() => router.push('/dashboard/assessment')}
            >
              {selectedItem.assessmentId}
            </button>
          </div>
          <div>
            <small>Request</small>
            <button
              type="button"
              className="mon-summary-link"
              onClick={() => router.push('/dashboard/request-program')}
            >
              {selectedItem.requestId}
            </button>
          </div>
          <div>
            <small>Petugas lapangan</small>
            <strong>{selectedItem.officer}</strong>
          </div>
          <div>
            <small>Kunjungan berikutnya</small>
            <input
              type="date"
              className="mon-inline-date"
              value={selectedItem.nextVisitIso}
              onChange={(e) =>
                updateSelected((curr) => ({
                  ...curr,
                  nextVisitIso: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Rencana dibanding realisasi */}
        <section className="mon-section-card">
          <div className="mon-section-head">
            <h2>Rencana dibanding realisasi</h2>
          </div>
          <div className="mon-table-wrap">
            <table className="mon-plan-table">
              <thead>
                <tr>
                  <th>Indikator / komponen</th>
                  <th>Rencana</th>
                  <th>Realisasi aktual</th>
                  <th>Capaian</th>
                  <th>Catatan lapangan</th>
                </tr>
              </thead>
              <tbody>
                {selectedItem.indicators.map((ind, idx) => (
                  <tr key={ind.component}>
                    <td>
                      <strong>{ind.component}</strong>
                    </td>
                    <td>{ind.plan}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="mon-num-input"
                        value={ind.actual}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, Number(e.target.value)))
                          updateSelected((curr) => {
                            const nextInd = [...curr.indicators]
                            nextInd[idx] = { ...nextInd[idx], actual: val }
                            return { ...curr, indicators: nextInd }
                          })
                        }}
                      />
                    </td>
                    <td>
                      <div className="mon-cell-progress">
                        <span>
                          <i style={{ width: `${ind.actual}%` }} />
                        </span>
                        <b>{ind.actual}%</b>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="mon-note-input"
                        value={ind.note}
                        onChange={(e) => {
                          const val = e.target.value
                          updateSelected((curr) => {
                            const nextInd = [...curr.indicators]
                            nextInd[idx] = { ...nextInd[idx], note: val }
                            return { ...curr, indicators: nextInd }
                          })
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2-Column Detail Grid */}
        <div className="mon-detail-grid">
          <div className="mon-detail-main">
            {/* Temuan & catatan petugas */}
            <section className="mon-section-card">
              <div className="mon-section-head">
                <h2>Temuan &amp; catatan petugas</h2>
              </div>
              <div className="mon-textarea-wrap">
                <textarea
                  rows={4}
                  className="mon-textarea"
                  value={selectedItem.notes}
                  onChange={(e) =>
                    updateSelected((curr) => ({ ...curr, notes: e.target.value }))
                  }
                />
              </div>
            </section>

            {/* Lembar isu, risiko & tindakan korektif */}
            <section className="mon-section-card">
              <div className="mon-section-head">
                <h2>Lembar isu, risiko &amp; tindakan korektif</h2>
                <button
                  type="button"
                  className="db-btn db-btn-outline"
                  onClick={() => {
                    updateSelected((curr) => ({
                      ...curr,
                      issues: [
                        ...curr.issues,
                        {
                          id: `ISS-${Date.now()}`,
                          title: 'Tambahan sesi praktik operasional kelompok pengelola',
                          description: 'Penjadwalan ulang simulasi perawatan jaringan bersama teknisi lapangan.',
                          owner: curr.officer,
                          deadline: '05 Nov 2026',
                          status: 'Perlu Tindak Lanjut',
                        },
                      ],
                    }))
                    notify('Baris tindakan korektif ditambahkan.')
                  }}
                >
                  <Icon name="plus" size={15} />
                  <span>Tambah temuan</span>
                </button>
              </div>

              {selectedItem.issues.map((issue, idx) => {
                const issTone =
                  issue.status === 'Perlu Tindak Lanjut'
                    ? 'red'
                    : issue.status === 'Dalam Proses'
                    ? 'blue'
                    : 'green'

                return (
                  <div className="mon-issue-row" key={issue.id}>
                    <div className="mon-issue-main">
                      <div className="mon-issue-title-line">
                        <span className={`mon-status ${issTone}`}>
                          <i />
                          {issue.status}
                        </span>
                        <b>{issue.title}</b>
                      </div>
                      <p>{issue.description}</p>
                    </div>
                    <div className="mon-issue-meta">
                      <small>Pemilik</small>
                      <b>{issue.owner}</b>
                    </div>
                    <div className="mon-issue-meta">
                      <small>Tenggat</small>
                      <b>{issue.deadline}</b>
                    </div>
                    <select
                      className="mon-issue-select"
                      value={issue.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as CorrectiveIssue['status']
                        updateSelected((curr) => {
                          const nextIssues = [...curr.issues]
                          nextIssues[idx] = { ...nextIssues[idx], status: newStatus }
                          return { ...curr, issues: nextIssues }
                        })
                      }}
                    >
                      <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
                      <option value="Dalam Proses">Dalam Proses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                )
              })}
            </section>
          </div>

          <aside className="mon-detail-side">
            {/* Bukti foto lapangan */}
            <section className="mon-section-card">
              <div className="mon-section-head">
                <h2>Bukti foto lapangan</h2>
                <button
                  type="button"
                  className="mon-text-add"
                  onClick={() => notify('Simulasi unggah foto lapangan dibuka.')}
                >
                  <Icon name="plus" size={14} />
                  <span>Tambah</span>
                </button>
              </div>
              <div className="mon-photo-grid">
                <img
                  src="https://images.unsplash.com/photo-1700906310080-65a7d9718929?auto=format&fit=crop&w=500&q=80"
                  alt="Kegiatan lapangan masyarakat di Indonesia"
                />
                <img
                  src="https://images.unsplash.com/photo-1670631167436-a847c4f48a7c?auto=format&fit=crop&w=500&q=80"
                  alt="Kegiatan komunitas di area pedesaan"
                />
              </div>
              <small className="mon-photo-credit">Foto ilustratif dari Unsplash</small>
            </section>

            {/* Dokumen pendukung */}
            <section className="mon-section-card">
              <div className="mon-section-head">
                <h2>Dokumen pendukung</h2>
                <button
                  type="button"
                  className="mon-text-add"
                  onClick={() => {
                    updateSelected((curr) => ({
                      ...curr,
                      docs: [
                        ...curr.docs,
                        {
                          name: 'Berita_acara_kunjungan.pdf',
                          size: '1,5 MB',
                          date: '20 Okt 2026',
                          kind: 'pdf',
                        },
                      ],
                    }))
                    notify('Dokumen pendukung berhasil ditambahkan.')
                  }}
                >
                  <Icon name="plus" size={14} />
                  <span>Tambah</span>
                </button>
              </div>
              <div className="mon-doc-list">
                {selectedItem.docs.map((doc, idx) => (
                  <div className="mon-doc-row" key={`${doc.name}-${idx}`}>
                    <span className="mon-doc-icon">
                      <Icon name={doc.kind === 'zip' ? 'paperclip' : 'file'} size={16} />
                    </span>
                    <div className="mon-doc-body">
                      <b>{doc.name}</b>
                      <small>
                        {doc.size} · {doc.date}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="mon-doc-btn"
                      title="Unduh dokumen"
                      onClick={() => notify(`${doc.name} berhasil diunduh.`)}
                    >
                      <Icon name="download" size={16} />
                    </button>
                    <button
                      type="button"
                      className="mon-doc-btn"
                      title="Hapus dokumen"
                      onClick={() =>
                        updateSelected((curr) => ({
                          ...curr,
                          docs: curr.docs.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    )
  }

  /* ==========================================================
     VIEW 1: LIST MONITORING & EVALUASI
     ========================================================== */
  const kpis = [
    {
      label: 'Program berjalan',
      value: String(items.length).padStart(2, '0'),
      icon: 'database' as IconName,
      tone: 'teal',
      filterVal: ALL,
    },
    {
      label: 'Catatan monitoring',
      value: String(items.filter((i) => i.status === 'Sesuai rencana').length).padStart(2, '0'),
      icon: 'check' as IconName,
      tone: 'blue',
      filterVal: 'Sesuai rencana',
    },
    {
      label: 'Kunjungan berikutnya',
      value: String(items.filter((i) => i.status === 'Terjadwal').length).padStart(2, '0'),
      icon: 'clock' as IconName,
      tone: 'amber',
      filterVal: 'Terjadwal',
    },
    {
      label: 'Perlu tindak lanjut',
      value: String(items.filter((i) => i.status === 'Perlu tindak lanjut').length).padStart(2, '0'),
      icon: 'users' as IconName,
      tone: 'purple',
      filterVal: 'Perlu tindak lanjut',
    },
  ]

  return (
    <div className="mon-page">
      {/* Heading */}
      <div className="mon-heading">
        <div>
          <h1>Monitoring dan Evaluasi</h1>
          <p>Lembar kunjungan lapangan untuk program dengan MIPRO yang telah disetujui.</p>
        </div>
        <button
          type="button"
          className="db-btn db-btn-primary"
          onClick={handleCreateMonev}
        >
          <Icon name="plus" size={16} />
          <span>Catat monitoring</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="mon-kpis">
        {kpis.map((k) => (
          <button
            type="button"
            key={k.label}
            className={`mon-kpi ${
              statusFilter === k.filterVal && k.filterVal !== ALL ? 'active' : ''
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === k.filterVal ? ALL : k.filterVal)
            }
          >
            <span className={`mon-kpi-icon ${k.tone}`}>
              <Icon name={k.icon} size={18} />
            </span>
            <span className="mon-kpi-body">
              <small>{k.label}</small>
              <strong>{k.value}</strong>
            </span>
            <span className="mon-kpi-chevron">
              <Icon name="chevronRight" size={16} />
            </span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <section className="mon-card">
        <div className="mon-toolbar">
          <label className="mon-search">
            <Icon name="search" size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID, program, lokasi, atau PIC..."
            />
            {search && (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setSearch('')}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </label>

          <div className="mon-filters">
            <select
              className={`mon-select ${statusFilter !== ALL ? 'on' : ''}`}
              aria-label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value={ALL}>Status</option>
              <option value="Sesuai rencana">Sesuai rencana</option>
              <option value="Perlu tindak lanjut">Perlu tindak lanjut</option>
              <option value="Terjadwal">Terjadwal</option>
            </select>

            <select
              className={`mon-select ${periodFilter !== ALL ? 'on' : ''}`}
              aria-label="Periode kunjungan"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
            >
              <option value={ALL}>Periode kunjungan</option>
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="November 2026">November 2026</option>
            </select>

            <select
              className={`mon-select ${officerFilter !== ALL ? 'on' : ''}`}
              aria-label="Petugas"
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
            >
              <option value={ALL}>Petugas</option>
              <option value="Fajar Malik">Fajar Malik</option>
              <option value="Ayu Larasati">Ayu Larasati</option>
              <option value="Nadia Sari">Nadia Sari</option>
            </select>

            <button
              type="button"
              className={`mon-filter-btn ${hasFilter ? 'on' : ''}`}
              onClick={() =>
                hasFilter
                  ? resetFilters()
                  : notify('Gunakan filter Status, Periode kunjungan, atau Petugas.')
              }
            >
              <Icon name={hasFilter ? 'close' : 'settings'} size={15} />
              <span>{hasFilter ? 'Reset' : 'Filter'}</span>
            </button>
          </div>
        </div>

        <div className="mon-table-wrap">
          <table className="mon-table">
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className="mon-sort"
                    onClick={() => setSortAsc(!sortAsc)}
                  >
                    Monitoring / program{' '}
                    <Icon name={sortAsc ? 'arrowUp' : 'arrowDown'} size={13} />
                  </button>
                </th>
                <th>MIPRO disetujui</th>
                <th>Lokasi</th>
                <th>Kunjungan</th>
                <th>Berikutnya</th>
                <th>PIC / petugas</th>
                <th>Progres</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} onClick={() => openDetail(row)}>
                  <td>
                    <span className="mon-id">{row.id}</span>
                    <strong>{row.title}</strong>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="mon-link"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push('/dashboard/mipro')
                      }}
                    >
                      {row.miproId}
                    </button>
                  </td>
                  <td>{row.location}</td>
                  <td>{row.visitDate}</td>
                  <td>{row.nextVisit}</td>
                  <td>{row.officer}</td>
                  <td>
                    <span className="mon-prog-badge">
                      <i />
                      {row.progress}%
                    </span>
                  </td>
                  <td>
                    <span className={`mon-status ${statusTone[row.status]}`}>
                      <i />
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="mon-eye-btn"
                      title="Lihat lembar monitoring"
                      aria-label={`Lihat lembar monitoring ${row.title}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        openDetail(row)
                      }}
                    >
                      <Icon name="eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                    Tidak ada data monitoring & evaluasi yang tersedia di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mon-pagination">
          <span>
            Menampilkan <b>{filtered.length}</b> dari {items.length} data
          </span>
          <div>
            <button type="button" disabled aria-label="Sebelumnya">
              <Icon name="chevronLeft" size={14} />
            </button>
            <button type="button" className="current">
              1
            </button>
            <button
              type="button"
              onClick={() => notify('Menampilkan halaman 1.')}
            >
              2
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => notify('Menampilkan seluruh data aktif.')}
            >
              <Icon name="chevronRight" size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

