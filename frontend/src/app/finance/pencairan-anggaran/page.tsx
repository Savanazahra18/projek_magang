'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Icon } from '@/components/common/Icons'

export type DisbursementStatus = 'Menunggu Pencairan' | 'Dicairkan' | 'Perlu Konfirmasi'

export interface RabDisbursementItem {
  id: string
  program_id: string
  title: string
  category: string
  division: string
  location: string
  province: string
  estimated_budget: string
  beneficiaries: string
  date: string
  file_type: string
  file_size: string
  file_name?: string
  file_url?: string
  evaluation_notes?: string
  // Disbursement metadata
  disbursement_status: DisbursementStatus
  termin: string
  source_bank: string
  recipient_bank: string
  transfer_ref: string
  transfer_date: string
  transfer_proof_file?: string
  disbursed_amount?: string
  disbursement_notes?: string
}

const FALLBACK_RAB_DATA: RabDisbursementItem[] = [
  {
    id: 'RAB-2026-039',
    program_id: 'PR-2026-039',
    title: 'RAB Distribusi Air Bersih Musim Kemarau',
    category: 'Infrastruktur',
    division: 'Divisi Sosial',
    location: 'Lombok Timur',
    province: 'Nusa Tenggara Barat',
    estimated_budget: 'Rp 82.500.000',
    beneficiaries: '1.200 Jiwa',
    date: '28 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '4.1 MB',
    file_name: 'RAB_AIR_BERSIH_LOMBOK_TIMUR.xlsx',
    evaluation_notes: 'Telah disetujui komite pagu darurat air bersih. Alokasi armada tangki air dan pipa distribusi siap dieksekusi transfer pencairannya.',
    disbursement_status: 'Menunggu Pencairan',
    termin: 'Termin 1 (Uang Muka 50%)',
    source_bank: 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)',
    recipient_bank: 'BSI - 712-889-1002 a.n. Relawan Nusantara Tim Pelaksana Lombok',
    transfer_ref: 'TRX-OUT/202610/0892',
    transfer_date: '28 Okt 2026',
    transfer_proof_file: '',
    disbursed_amount: 'Rp 41.250.000',
    disbursement_notes: 'Menunggu proses transfer termin 1 ke penanggung jawab lapangan untuk sewa armada tangki.',
  },
  {
    id: 'RAB-2026-031',
    program_id: 'PR-2026-031',
    title: 'RAB Posko Logistik Bencana Banjir',
    category: 'Kemanusiaan',
    division: 'Divisi Tanggap Darurat',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 120.000.000',
    beneficiaries: '2.500 Jiwa',
    date: '25 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '5.2 MB',
    file_name: 'RAB_LOGISTIK_BANJIR_BANDUNG.xlsx',
    evaluation_notes: 'Pagu tanggap bencana banjir disahkan komite kebencanaan. Pencairan dana bersifat prioritas utama.',
    disbursement_status: 'Dicairkan',
    termin: 'Pencairan Penuh (100%)',
    source_bank: 'BSI - Kas Kedaruratan & Tanggap Darurat (711-200-3344)',
    recipient_bank: 'Bank Mandiri - 131-00-449102-3 a.n. Tim Tanggap Darurat Relawan Jabar',
    transfer_ref: 'TRX-OUT/202610/0312',
    transfer_date: '26 Okt 2026',
    transfer_proof_file: 'BUKTI_TRANSFER_BANJIR_BANDUNG.pdf',
    disbursed_amount: 'Rp 120.000.000',
    disbursement_notes: 'Pencairan dana penuh telah ditransfer langsung untuk belanja logistik dapur umum dan perahu karet.',
  },
  {
    id: 'RAB-2026-042',
    program_id: 'PR-2026-042',
    title: 'RAB Pelatihan Relawan Siaga Bencana',
    category: 'Pendidikan & Pelatihan',
    division: 'Divisi Kesiapsiagaan',
    location: 'Kab. Bandung',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 45.200.000',
    beneficiaries: '120 Relawan',
    date: '29 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.4 MB',
    file_name: 'RAB_PELATIHAN_SIAGA_BENCANA.xlsx',
    evaluation_notes: 'Revisi pagu konsumsi dan transportasi disetujui. Siap proses pencairan uang muka kegiatan.',
    disbursement_status: 'Menunggu Pencairan',
    termin: 'Termin 1 (Uang Muka 50%)',
    source_bank: 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)',
    recipient_bank: 'BCA - 283-991-8821 a.n. Panitia Diklat Relawan Nusantara',
    transfer_ref: 'TRX-OUT/202610/0944',
    transfer_date: '29 Okt 2026',
    transfer_proof_file: '',
    disbursed_amount: 'Rp 22.600.000',
    disbursement_notes: 'Menunggu upload bukti transfer uang muka pelatihan.',
  },
  {
    id: 'RAB-2026-035',
    program_id: 'PR-2026-035',
    title: 'RAB Modal Usaha UMKM Perempuan Berdaya',
    category: 'Ekonomi',
    division: 'Divisi Ekonomi',
    location: 'Kab. Bogor',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 65.000.000',
    beneficiaries: '45 Kelompok Usaha',
    date: '27 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '2.8 MB',
    file_name: 'RAB_MODAL_UMKM_BOGOR.xlsx',
    evaluation_notes: 'Verifikasi modal alat produksi dan pelatihan usaha telah disahkan.',
    disbursement_status: 'Dicairkan',
    termin: 'Termin 1 (Uang Muka 50%)',
    source_bank: 'BCA - Penyaluran Zakat & Infaq (283-889-1002)',
    recipient_bank: 'BSI - 709-332-1190 a.n. Koperasi Wanita Bina Usaha Mandiri',
    transfer_ref: 'TRX-OUT/202610/0671',
    transfer_date: '28 Okt 2026',
    transfer_proof_file: 'SLIP_TRANSFER_UMKM_TERMIN1.pdf',
    disbursed_amount: 'Rp 32.500.000',
    disbursement_notes: 'Dana tahap 1 pengadaan alat produksi telah ditransfer ke rekening kelompok.',
  },
  {
    id: 'RAB-2026-028',
    program_id: 'PR-2026-028',
    title: 'RAB Renovasi Sarana Sekolah Pelosok',
    category: 'Pendidikan',
    division: 'Divisi Pendidikan',
    location: 'Kab. Cianjur',
    province: 'Jawa Barat',
    estimated_budget: 'Rp 95.000.000',
    beneficiaries: '350 Siswa',
    date: '23 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.9 MB',
    file_name: 'RAB_RENOVASI_SEKOLAH_CIANJUR.xlsx',
    evaluation_notes: 'Pagu perbaikan 3 ruang kelas dan fasilitas MCK sekolah disahkan.',
    disbursement_status: 'Dicairkan',
    termin: 'Pencairan Penuh (100%)',
    source_bank: 'BSI - Rekening Campaign (709-112-4456)',
    recipient_bank: 'Bank Mandiri - 131-00-881299-0 a.n. Komite Pembangunan MI Al-Ikhlas',
    transfer_ref: 'TRX-OUT/202610/0228',
    transfer_date: '24 Okt 2026',
    transfer_proof_file: 'BUKTI_TRANSFER_RENOV_CIANJUR.pdf',
    disbursed_amount: 'Rp 95.000.000',
    disbursement_notes: 'Transfer 100% lunas untuk pembelanjaan material semen, atap, dan kusen.',
  },
  {
    id: 'RAB-2026-024',
    program_id: 'PR-2026-024',
    title: 'RAB Bibit & Penghijauan Lahan Kritis',
    category: 'Lingkungan',
    division: 'Divisi Lingkungan',
    location: 'Gunungkidul',
    province: 'DI Yogyakarta',
    estimated_budget: 'Rp 52.800.000',
    beneficiaries: '10.000 Bibit Pohon',
    date: '21 Okt 2026',
    file_type: 'Excel/PDF',
    file_size: '3.1 MB',
    file_name: 'RAB_PENGHIJAUAN_GUNUNGKIDUL.xlsx',
    evaluation_notes: 'Pengadaan bibit tanaman buah dan pohon penyerap air tanah selesai ditelaah.',
    disbursement_status: 'Menunggu Pencairan',
    termin: 'Termin 1 (Uang Muka 50%)',
    source_bank: 'BSI - Rekening Campaign (709-112-4456)',
    recipient_bank: 'BCA - 283-112-9988 a.n. Kelompok Tani Hutan Wana Lestari',
    transfer_ref: 'TRX-OUT/202610/0551',
    transfer_date: '21 Okt 2026',
    transfer_proof_file: '',
    disbursed_amount: 'Rp 26.400.000',
    disbursement_notes: 'Menunggu proses kliring transfer uang muka bibit.',
  },
]

export default function PencairanAnggaranPage() {
  const router = useRouter()

  const [rabList, setRabList] = useState<RabDisbursementItem[]>(FALLBACK_RAB_DATA)
  const [divisionFilter, setDivisionFilter] = useState<string>('Semua')
  const [statusFilter, setStatusFilter] = useState<'Semua' | DisbursementStatus>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load DSS (RAB) data from API & reconcile with localStorage
  useEffect(() => {
    let savedStatusMap: Record<string, any> = {}

    try {
      const stored = localStorage.getItem('finance_rab_disbursement_status')
      if (stored) {
        savedStatusMap = JSON.parse(stored)
      }
    } catch {
      // ignore
    }

    api
      .getDssEvaluations()
      .then((res) => {
        const list = res?.items || res?.data || res
        if (Array.isArray(list) && list.length > 0) {
          const mapped: RabDisbursementItem[] = list.map((item: any, idx: number) => {
            const saved = savedStatusMap[item.id]
            const defaultStatus: DisbursementStatus =
              item.disbursement_status || (saved ? saved.status : idx % 2 === 0 ? 'Menunggu Pencairan' : 'Dicairkan')

            const defaultSourceBank =
              item.division?.includes('Tanggap Darurat') || item.category?.includes('Kemanusiaan')
                ? 'BSI - Kas Kedaruratan & Tanggap Darurat (711-200-3344)'
                : item.division?.includes('Sosial') || item.category?.includes('Infrastruktur')
                ? 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)'
                : 'BCA - Penyaluran Zakat & Infaq (283-889-1002)'

            return {
              id: item.id,
              program_id: item.program_id || `PR-${item.id.replace('RAB-', '')}`,
              title: item.title,
              category: item.category || 'Program Binaan',
              division: item.division || 'Divisi Program',
              location: item.location || 'Kab. Bandung',
              province: item.province || 'Jawa Barat',
              estimated_budget: item.estimated_budget || 'Rp 50.000.000',
              beneficiaries: item.beneficiaries || '500 Penerima',
              date: item.date || '2026',
              file_type: item.file_type || 'Excel/PDF',
              file_size: item.file_size || '3.5 MB',
              file_name: item.file_name || `${item.id}_ANGGARAN_PROGRAM.xlsx`,
              file_url: item.file_url,
              evaluation_notes: item.evaluation_notes || 'Telah diverifikasi sesuai standar baku DSS.',
              disbursement_status: item.disbursement_status || (saved ? saved.status : defaultStatus),
              termin: item.termin || saved?.termin || 'Pencairan Penuh (100%)',
              source_bank: item.source_bank || saved?.sourceBank || defaultSourceBank,
              recipient_bank: item.recipient_bank || saved?.recipientBank || `BSI 712-889-1002 a.n. Tim Pelaksana ${item.location || 'Lapangan'}`,
              transfer_ref: item.transfer_ref || saved?.ref || `TRX-OUT/${item.id.replace('RAB-', '')}/2026`,
              transfer_date: item.transfer_date || saved?.date || item.date || '19 Nov 2026',
              transfer_proof_file: item.transfer_proof_file || saved?.file || (defaultStatus === 'Dicairkan' ? 'BUKTI_TRANSFER_BANK.pdf' : ''),
              disbursed_amount: item.disbursed_amount || saved?.disbursedAmt || item.estimated_budget || 'Rp 50.000.000',
              disbursement_notes: item.disbursement_notes || saved?.notes || '',
            }
          })
          setRabList(mapped)
        } else {
          setRabList((prev) =>
            prev.map((item) => {
              const saved = savedStatusMap[item.id]
              return saved
                ? {
                    ...item,
                    disbursement_status: saved.status,
                    termin: saved.termin || item.termin,
                    source_bank: saved.sourceBank || item.source_bank,
                    recipient_bank: saved.recipientBank || item.recipient_bank,
                    transfer_ref: saved.ref || item.transfer_ref,
                    transfer_date: saved.date || item.transfer_date,
                    transfer_proof_file: saved.file || item.transfer_proof_file,
                    disbursed_amount: saved.disbursedAmt || item.estimated_budget,
                    disbursement_notes: saved.notes || item.disbursement_notes,
                  }
                : item
            })
          )
        }
      })
      .catch(() => {
        setRabList((prev) =>
          prev.map((item) => {
            const saved = savedStatusMap[item.id]
            return saved
              ? {
                  ...item,
                  disbursement_status: saved.status,
                  termin: saved.termin || item.termin,
                  source_bank: saved.sourceBank || item.source_bank,
                  recipient_bank: saved.recipientBank || item.recipient_bank,
                  transfer_ref: saved.ref || item.transfer_ref,
                  transfer_date: saved.date || item.transfer_date,
                  transfer_proof_file: saved.file || item.transfer_proof_file,
                  disbursed_amount: saved.disbursedAmt || item.estimated_budget,
                  disbursement_notes: saved.notes || item.disbursement_notes,
                }
              : item
          })
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const totalCount = rabList.length
    const pendingCount = rabList.filter((r) => r.disbursement_status === 'Menunggu Pencairan').length
    const disbursedCount = rabList.filter((r) => r.disbursement_status === 'Dicairkan').length
    const needConfirmCount = rabList.filter((r) => r.disbursement_status === 'Perlu Konfirmasi').length

    // Total Nominal yang Sudah Dicairkan
    const parseNominal = (str: string) => {
      const num = str.replace(/[^0-9]/g, '')
      return num ? parseInt(num, 10) : 0
    }

    const totalDisbursedRupiah = rabList
      .filter((r) => r.disbursement_status === 'Dicairkan')
      .reduce((sum, item) => sum + parseNominal(item.disbursed_amount || item.estimated_budget), 0)

    const formatRupiah = (val: number) => {
      if (val >= 1_000_000_000) {
        return `Rp ${(val / 1_000_000_000).toFixed(1).replace('.', ',')} Miliar`
      }
      if (val >= 1_000_000) {
        return `Rp ${(val / 1_000_000).toFixed(1).replace('.', ',')} Juta`
      }
      return `Rp ${val.toLocaleString('id-ID')}`
    }

    return {
      totalCount,
      pendingCount,
      disbursedCount,
      needConfirmCount,
      totalDisbursedRupiahFormatted: formatRupiah(totalDisbursedRupiah),
    }
  }, [rabList])

  // Divisions for Filter
  const divisionOptions = useMemo(() => {
    const divs = Array.from(new Set(rabList.map((r) => r.division)))
    return ['Semua', ...divs]
  }, [rabList])

  // Filtered List
  const filteredRabs = useMemo(() => {
    return rabList.filter((item) => {
      // Filter division
      if (divisionFilter !== 'Semua' && item.division !== divisionFilter) {
        return false
      }
      // Filter status
      if (statusFilter !== 'Semua' && item.disbursement_status !== statusFilter) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = item.id.toLowerCase().includes(q)
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchLoc = item.location.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
        const matchDivision = item.division.toLowerCase().includes(q)
        const matchProgram = item.program_id.toLowerCase().includes(q)
        if (!matchId && !matchTitle && !matchLoc && !matchDivision && !matchProgram) {
          return false
        }
      }
      return true
    })
  }, [rabList, divisionFilter, statusFilter, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Link
            href="/finance"
            style={{
              fontSize: '13px',
              color: '#078780',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icon name="back" size={14} />
            <span>Kembali ke Dasbor Keuangan</span>
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#172324', margin: 0 }}>
                Pencairan Anggaran (RAB / DSS)
              </h1>
              <span
                style={{
                  background: '#e6f7f2',
                  color: '#057a6e',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                Divisi Keuangan
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#697879', margin: '6px 0 0' }}>
              Daftar Rencana Anggaran Biaya (RAB / DSS) yang telah disahkan. Klik tombol <strong>Aksi</strong> untuk membuka <strong>halaman detail resmi</strong>, mengunduh berkas RAB, menentukan status pencairan, dan mengunggah berkas bukti transfer dana keluar.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
        }}
      >
        {/* KPI 1 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e3eaea',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#697879', display: 'block' }}>
            Total Pengajuan RAB / DSS
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#172324' }}>
              {kpiStats.totalCount}
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>Dokumen</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e3eaea',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#b45309', display: 'block' }}>
            Menunggu Pencairan
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#d97706' }}>
              {kpiStats.pendingCount}
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>Perlu Ditransfer</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e3eaea',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#057a6e', display: 'block' }}>
            Anggaran Telah Dicairkan
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#078780' }}>
              {kpiStats.disbursedCount}
            </span>
            <span style={{ fontSize: '12px', color: '#057a6e', fontWeight: 600 }}>Selesai Transfer</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e3eaea',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#078780', display: 'block' }}>
            Total Realisasi Pencairan
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#078780' }}>
              {kpiStats.totalDisbursedRupiahFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e3eaea',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {/* Left: Division & Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Division Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#697879', fontWeight: 600 }}>Divisi:</span>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {divisionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginLeft: '6px' }}>
            {(['Semua', 'Menunggu Pencairan', 'Dicairkan', 'Perlu Konfirmasi'] as const).map((st) => {
              const active = statusFilter === st
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: active ? '1px solid #078780' : '1px solid #e2e8f0',
                    background: active ? '#e6f7f2' : '#ffffff',
                    color: active ? '#057a6e' : '#475569',
                    fontSize: '12px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {st}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Search Box */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Cari ID RAB, judul program, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              outline: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          >
            <Icon name="search" size={14} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e3eaea',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafa', borderBottom: '1px solid #e3eaea' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569', width: '130px' }}>
                  ID Dokumen
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>
                  Judul RAB &amp; Program
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600, color: '#475569' }}>
                  Divisi / Kategori
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600, color: '#475569' }}>
                  Lokasi Pelaksanaan
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>
                  Pagu Anggaran
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>
                  Status Pencairan
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 600, color: '#475569', textAlign: 'center' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#697879' }}>
                    Memuat data RAB / DSS...
                  </td>
                </tr>
              ) : filteredRabs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#697879' }}>
                    Tidak ada dokumen RAB yang sesuai dengan kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                filteredRabs.map((item, idx) => {
                  const isDisbursed = item.disbursement_status === 'Dicairkan'
                  const isPending = item.disbursement_status === 'Menunggu Pencairan'

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #edf2f2',
                        background: idx % 2 === 1 ? '#fafcfc' : '#ffffff',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* ID RAB & Program */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Link
                          href={`/finance/pencairan-anggaran/${encodeURIComponent(item.id)}`}
                          style={{ color: '#078780', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', display: 'block' }}
                        >
                          {item.id}
                        </Link>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Ref: {item.program_id}
                        </span>
                      </td>

                      {/* Judul RAB & File Info */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <Link
                          href={`/finance/pencairan-anggaran/${encodeURIComponent(item.id)}`}
                          style={{ fontWeight: 600, color: '#172324', textDecoration: 'none', display: 'block', fontSize: '13px' }}
                        >
                          {item.title}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '11px', color: '#697879' }}>
                            📅 {item.date}
                          </span>
                          <span style={{ fontSize: '11px', color: '#057a6e', background: '#edf6f5', padding: '1px 6px', borderRadius: '4px' }}>
                            📄 {item.file_type} ({item.file_size})
                          </span>
                        </div>
                      </td>

                      {/* Divisi & Kategori */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <span style={{ color: '#1e293b', fontWeight: 600, display: 'block', fontSize: '12.5px' }}>
                          {item.division}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {item.category}
                        </span>
                      </td>

                      {/* Lokasi */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <span style={{ color: '#334155', display: 'block', fontSize: '12.5px' }}>
                          📍 {item.location}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {item.province}
                        </span>
                      </td>

                      {/* Pagu Anggaran */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <strong style={{ color: '#078780', fontSize: '13.5px', display: 'block' }}>
                          {item.estimated_budget}
                        </strong>
                        {isDisbursed && item.disbursed_amount && (
                          <span style={{ fontSize: '11px', color: '#057a6e' }}>
                            Cair: {item.disbursed_amount}
                          </span>
                        )}
                      </td>

                      {/* Status Pencairan Badge */}
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            background: isDisbursed ? '#e6f7f2' : isPending ? '#fef3c7' : '#fee2e2',
                            color: isDisbursed ? '#057a6e' : isPending ? '#b45309' : '#dc2626',
                            border: `1px solid ${isDisbursed ? '#a7f3d0' : isPending ? '#fde68a' : '#fecaca'}`,
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isDisbursed ? '#057a6e' : isPending ? '#b45309' : '#dc2626',
                            }}
                          />
                          <span>{item.disbursement_status}</span>
                        </span>
                      </td>

                      {/* Aksi Button: Navigates to dedicated detail page */}
                      <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <Link
                          href={`/finance/pencairan-anggaran/${encodeURIComponent(item.id)}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #078780',
                            background: '#078780',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            boxShadow: '0 1px 2px rgba(7, 135, 128, 0.2)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Icon name="fileText" size={13} />
                          <span>Aksi</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
