'use client'

import { useEffect, useMemo, useState } from 'react'
import { AssessmentCategory } from '@/components/AssessmentOverview'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

export interface AssessmentRecord {
  id: string
  type: string
  title: string
  pm_name: string
  category: string
  location: string
  province: string
  status: string
  status_note?: string
  created_by?: string
  created_at?: string
  data?: Record<string, any>
  category_record?: Record<string, any> | null
}

interface AssessmentCategoryListProps {
  category: AssessmentCategory
  onBackToOverview: () => void
  onCreateNew: () => void
  notify: (msg: string) => void
}

function formatDateId(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr).slice(0, 16)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return String(dateStr)
  }
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function AssessmentCategoryList({
  category,
  onBackToOverview,
  onCreateNew,
  notify,
}: AssessmentCategoryListProps) {
  const [items, setItems] = useState<AssessmentRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('Semua')
  const [selectedDetail, setSelectedDetail] = useState<AssessmentRecord | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false)

  const loadCategoryAssessments = async () => {
    setIsLoading(true)
    try {
      const res = await api.getAssessments({ type: category.id })
      if (res && Array.isArray(res.assessments)) {
        setItems(res.assessments)
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategoryAssessments()
  }, [category.id])

  const counts = useMemo(() => {
    const total = items.length
    const diajukan = items.filter(
      (i) =>
        (i.status || '').toLowerCase().includes('diajukan') ||
        (i.status || '').toLowerCase().includes('tinjau')
    ).length
    const disetujui = items.filter(
      (i) =>
        (i.status || '').toLowerCase().includes('setuju') ||
        (i.status || '').toLowerCase().includes('selesai')
    ).length
    const revisi = items.filter(
      (i) =>
        (i.status || '').toLowerCase().includes('revisi') ||
        (i.status || '').toLowerCase().includes('draf')
    ).length
    return { total, diajukan, disetujui, revisi }
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== 'Semua') {
        const s = (item.status || '').toLowerCase()
        if (statusFilter === 'Diajukan' && !s.includes('diajukan') && !s.includes('tinjau')) {
          return false
        }
        if (statusFilter === 'Disetujui' && !s.includes('setuju') && !s.includes('selesai')) {
          return false
        }
        if (statusFilter === 'Perlu revisi' && !s.includes('revisi') && !s.includes('draf')) {
          return false
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const haystack = `${item.id} ${item.title} ${item.pm_name} ${item.location} ${item.province} ${item.created_by || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [items, statusFilter, searchQuery])

  const handleOpenDetail = async (item: AssessmentRecord) => {
    setSelectedDetail(item)
    setIsLoadingDetail(true)
    try {
      const res = await api.getAssessmentDetail(item.id)
      if (res?.assessment) {
        setSelectedDetail(res.assessment)
      }
    } catch {
      // Keep summary record if detail endpoint fails
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleDelete = async (item: AssessmentRecord, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.deleteAssessment(item.id)
      setItems((prev) => prev.filter((x) => x.id !== item.id))
      if (selectedDetail?.id === item.id) {
        setSelectedDetail(null)
      }
      notify(`Data assessment ${item.id} berhasil dihapus dari database.`)
    } catch {
      notify(`Gagal menghapus data assessment ${item.id}.`)
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s.includes('setuju') || s.includes('selesai')) {
      return 'bg-[#e6f6ee] text-[#17794b] border-[#b9e6cf]'
    }
    if (s.includes('revisi') || s.includes('draf')) {
      return 'bg-[#fff4e5] text-[#b96807] border-[#f8d7a8]'
    }
    return 'bg-[#eaf6f4] text-[#0b8a80] border-[#c6e7e1]'
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
      {/* Top Back Navigation */}
      <div>
        <button
          type="button"
          onClick={onBackToOverview}
          className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-teal hover:underline"
        >
          <Icon name="back" size={16} />
          <span>Kembali ke pilihan kategori assessment</span>
        </button>
      </div>

      {/* Heading & Action Button */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-app-border bg-white p-5 shadow-sm">
        <div>
          <span className="mb-1.5 inline-block rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
            Kategori: {category.tag}
          </span>
          <h1 className="text-[24px] font-bold tracking-tight text-app-text">
            Daftar {category.title}
          </h1>
          <p className="mt-1 text-sm text-app-muted">
            {category.desc} Pantau data assessment yang telah tersimpan di database atau buat pengajuan baru.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="db-btn db-btn-primary shrink-0"
        >
          <Icon name="plus" size={16} />
          <span>Buat {category.title}</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatusFilter('Semua')}
          className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
            statusFilter === 'Semua'
              ? 'border-teal bg-[#f2fbf9] shadow-sm'
              : 'border-app-border bg-white hover:border-[#b7ded8]'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-app-muted">Total {category.title}</div>
            <div className="mt-1 text-2xl font-bold text-app-text">{counts.total}</div>
            <div className="mt-0.5 text-[11.5px] text-teal">Data tersimpan di database</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-soft text-teal">
            <Icon name="clipboard" size={18} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Diajukan')}
          className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
            statusFilter === 'Diajukan'
              ? 'border-teal bg-[#f2fbf9] shadow-sm'
              : 'border-app-border bg-white hover:border-[#b7ded8]'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-app-muted">Diajukan / Ditinjau</div>
            <div className="mt-1 text-2xl font-bold text-app-text">{counts.diajukan}</div>
            <div className="mt-0.5 text-[11.5px] text-app-muted">Menunggu tindak lanjut</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef6ff] text-[#2563eb]">
            <Icon name="clock" size={18} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Disetujui')}
          className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
            statusFilter === 'Disetujui'
              ? 'border-teal bg-[#f2fbf9] shadow-sm'
              : 'border-app-border bg-white hover:border-[#b7ded8]'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-app-muted">Disetujui / Selesai</div>
            <div className="mt-1 text-2xl font-bold text-app-text">{counts.disetujui}</div>
            <div className="mt-0.5 text-[11.5px] text-[#17794b]">Layak ditindaklanjuti</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e6f6ee] text-[#17794b]">
            <Icon name="checkCircle" size={18} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Perlu revisi')}
          className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
            statusFilter === 'Perlu revisi'
              ? 'border-teal bg-[#f2fbf9] shadow-sm'
              : 'border-app-border bg-white hover:border-[#b7ded8]'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-app-muted">Perlu Revisi / Draf</div>
            <div className="mt-1 text-2xl font-bold text-app-text">{counts.revisi}</div>
            <div className="mt-0.5 text-[11.5px] text-[#b96807]">Perlu kelengkapan data</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fff4e5] text-[#b96807]">
            <Icon name="fileEdit" size={18} />
          </span>
        </button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-app-border bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-border p-4">
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-app-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari ID, judul ${category.title.toLowerCase()}, lokasi, atau PIC...`}
              className="w-full rounded-lg border border-app-border bg-[#f9fbfb] py-2 pl-9 pr-8 text-[13px] text-app-text outline-none transition focus:border-teal focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-2.5 flex items-center text-app-muted hover:text-app-text"
                aria-label="Hapus pencarian"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(['Semua', 'Diajukan', 'Disetujui', 'Perlu revisi'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === tab
                    ? 'bg-teal text-white'
                    : 'bg-[#f3f7f7] text-app-muted hover:bg-[#e5efef] hover:text-app-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-app-border bg-[#f7fafa] text-[11.5px] font-bold uppercase tracking-wider text-[#627375]">
                <th className="px-4 py-3.5">ID &amp; Judul Assessment</th>
                <th className="px-4 py-3.5">Penerima Manfaat / PIC</th>
                <th className="px-4 py-3.5">Lokasi</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef3f3]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-app-muted">
                    Memuat daftar {category.title} dari database...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2.5">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-soft text-teal">
                        <Icon name="clipboard" size={20} />
                      </span>
                      <strong className="text-[14.5px] font-semibold text-app-text">
                        Belum ada data {category.title}
                      </strong>
                      <p className="text-xs leading-relaxed text-app-muted">
                        Daftar {category.title.toLowerCase()} di database masih kosong. Silakan klik tombol di bawah untuk mengisi formulir assessment baru.
                      </p>
                      <button
                        type="button"
                        onClick={onCreateNew}
                        className="db-btn db-btn-primary mt-1"
                      >
                        <Icon name="plus" size={15} />
                        <span>Buat {category.title} Baru</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="cursor-pointer transition hover:bg-[#f6fbfa]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-teal">{item.id}</div>
                      <div className="font-semibold text-app-text">{item.title}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-app-text">{item.pm_name || '-'}</div>
                      <div className="text-[11.5px] text-app-muted">
                        Oleh: {item.created_by || 'Tim Program'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-app-text">{item.location || '-'}</div>
                      <div className="text-[11.5px] text-app-muted">{item.province || 'Jawa Barat'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-app-muted">
                      {formatDateId(item.created_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold ${getStatusBadgeStyle(
                          item.status
                        )}`}
                      >
                        {item.status || 'Diajukan'}
                      </span>
                      {item.status_note && (
                        <div className="mt-1 max-w-[200px] truncate text-[11px] text-app-muted">
                          {item.status_note}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDetail(item)
                          }}
                          className="rounded-lg border border-app-border bg-white px-3 py-1.5 text-xs font-semibold text-teal transition hover:border-teal hover:bg-teal-soft"
                        >
                          Lihat detail
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item, e)}
                          title="Hapus assessment"
                          className="rounded-lg border border-app-border bg-white p-1.5 text-[#c0392b] transition hover:border-[#f5b7b1] hover:bg-[#fdedec]"
                        >
                          <Icon name="close" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Info */}
        <div className="flex items-center justify-between border-t border-app-border bg-[#fbfdfd] px-4 py-3 text-xs text-app-muted">
          <span>
            Menampilkan <strong>{filteredItems.length}</strong> dari <strong>{items.length}</strong> data {category.title}
          </span>
          <span>Tabel database: <code>assessment_{category.id}</code></span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-app-border bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-app-border p-5">
              <div>
                <span className="text-xs font-bold text-teal">{selectedDetail.id}</span>
                <h2 className="mt-0.5 text-lg font-bold text-app-text">{selectedDetail.title}</h2>
                <p className="mt-0.5 text-xs text-app-muted">
                  Lokasi: {selectedDetail.location}, {selectedDetail.province} • Penerima Manfaat / PIC: {selectedDetail.pm_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="rounded-lg p-1.5 text-app-muted hover:bg-gray-100 hover:text-app-text"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {isLoadingDetail ? (
                <div className="py-8 text-center text-sm text-app-muted">
                  Memuat rincian data survei lapangan...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(selectedDetail.category_record || selectedDetail.data || {})
                    .filter(([k, v]) => k !== 'id' && v !== null && v !== '' && typeof v !== 'object')
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-[#eef3f3] bg-[#f9fbfb] p-3"
                      >
                        <div className="text-[11px] font-medium text-app-muted">
                          {formatFieldLabel(key)}
                        </div>
                        <div className="mt-0.5 text-[13px] font-semibold text-app-text break-words">
                          {String(value)}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-app-border bg-[#f9fbfb] px-5 py-3.5">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="db-btn db-btn-outline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

