'use client'

import { useState, useMemo, useEffect, ChangeEvent, useRef } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
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
  const { notify } = useDashboard()

  const [rabList, setRabList] = useState<RabDisbursementItem[]>(FALLBACK_RAB_DATA)
  const [selectedRab, setSelectedRab] = useState<RabDisbursementItem | null>(null)
  const [divisionFilter, setDivisionFilter] = useState<string>('Semua')
  const [statusFilter, setStatusFilter] = useState<'Semua' | DisbursementStatus>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Decision State: 'cairkan' (Ya, proses transfer) or 'tunda' (Tidak / Tunda)
  const [disburseDecision, setDisburseDecision] = useState<'cairkan' | 'tunda'>('tunda')

  // Finance Disbursement Form State
  const [disbursedAmountInput, setDisbursedAmountInput] = useState('')
  const [terminInput, setTerminInput] = useState('Pencairan Penuh (100%)')
  const [sourceBankInput, setSourceBankInput] = useState('Bank Mandiri - Kas Kemitraan (131-00-981273-1)')
  const [recipientBankInput, setRecipientBankInput] = useState('')
  const [transferRefInput, setTransferRefInput] = useState('')
  const [transferDateInput, setTransferDateInput] = useState('19 Nov 2026')
  const [notesInput, setNotesInput] = useState('')
  const [uploadedProofFile, setUploadedProofFile] = useState<{ name: string; size: string; type: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Load DSS (RAB) data from API & reconcile with localStorage
  useEffect(() => {
    let savedStatusMap: Record<
      string,
      {
        status: DisbursementStatus
        termin?: string
        sourceBank?: string
        recipientBank?: string
        ref?: string
        date?: string
        file?: string
        disbursedAmt?: string
        notes?: string
      }
    > = {}

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
              idx % 2 === 0 ? 'Menunggu Pencairan' : 'Dicairkan'

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

  // Open Action Modal
  const handleOpenAction = (item: RabDisbursementItem) => {
    setSelectedRab(item)
    // If already disbursed, default to 'cairkan'
    const isAlreadyDisbursed = item.disbursement_status === 'Dicairkan'
    setDisburseDecision(isAlreadyDisbursed ? 'cairkan' : 'tunda')

    // Prefill form
    setDisbursedAmountInput(item.disbursed_amount || item.estimated_budget)
    setTerminInput(item.termin || 'Pencairan Penuh (100%)')
    setSourceBankInput(item.source_bank || 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)')
    setRecipientBankInput(item.recipient_bank || `BSI 712-889-1002 a.n. Tim Pelaksana ${item.location}`)
    setTransferRefInput(item.transfer_ref || `TRX-OUT/${item.id.replace('RAB-', '')}/2026`)
    setTransferDateInput(item.transfer_date || '19 Nov 2026')
    setNotesInput(item.disbursement_notes || '')

    if (item.transfer_proof_file) {
      setUploadedProofFile({
        name: item.transfer_proof_file,
        size: '1.25 MB',
        type: 'PDF',
      })
    } else {
      setUploadedProofFile(null)
    }
  }

  // Handle File Upload Change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
      const isPdf = file.name.toLowerCase().endsWith('.pdf')
      setUploadedProofFile({
        name: file.name,
        size: `${sizeMb} MB`,
        type: isPdf ? 'PDF' : 'IMAGE',
      })
    }
  }

  // Save Disbursement Decision
  const handleSaveDecision = (overrideStatus?: DisbursementStatus) => {
    if (!selectedRab) return

    setIsSubmitting(true)
    const isDisbursing = overrideStatus ? overrideStatus === 'Dicairkan' : disburseDecision === 'cairkan'
    const newStatus: DisbursementStatus = overrideStatus || (isDisbursing ? 'Dicairkan' : 'Menunggu Pencairan')

    const updatedItem: RabDisbursementItem = {
      ...selectedRab,
      disbursement_status: newStatus,
      termin: terminInput || selectedRab.termin,
      source_bank: sourceBankInput || selectedRab.source_bank,
      recipient_bank: recipientBankInput || selectedRab.recipient_bank,
      transfer_ref: transferRefInput || selectedRab.transfer_ref,
      transfer_date: transferDateInput || selectedRab.transfer_date,
      transfer_proof_file: isDisbursing
        ? uploadedProofFile?.name || selectedRab.transfer_proof_file || 'BUKTI_TRANSFER_BANK.pdf'
        : '',
      disbursed_amount: isDisbursing ? disbursedAmountInput || selectedRab.estimated_budget : '',
      disbursement_notes: isDisbursing
        ? notesInput || `Pencairan dana ${terminInput} telah ditransfer via ${sourceBankInput}.`
        : notesInput || 'Belum dicairkan. Menunggu konfirmasi verifikasi atau penyesuaian jadwal transfer.',
    }

    // Persist directly to backend database
    api.updateDssDisbursement(selectedRab.id, {
      disbursement_status: newStatus,
      termin: updatedItem.termin,
      source_bank: updatedItem.source_bank,
      recipient_bank: updatedItem.recipient_bank,
      transfer_ref: updatedItem.transfer_ref,
      transfer_date: updatedItem.transfer_date,
      transfer_proof_file: updatedItem.transfer_proof_file,
      disbursed_amount: updatedItem.disbursed_amount,
      disbursement_notes: updatedItem.disbursement_notes,
    }).catch(() => {
      // Graceful offline fallback
    })

    setTimeout(() => {
      setRabList((prev) =>
        prev.map((item) => (item.id === selectedRab.id ? updatedItem : item))
      )
      setSelectedRab(null)

      // Persist in localStorage
      try {
        const stored = localStorage.getItem('finance_rab_disbursement_status')
        const map = stored ? JSON.parse(stored) : {}
        map[selectedRab.id] = {
          status: newStatus,
          termin: updatedItem.termin,
          sourceBank: updatedItem.source_bank,
          recipientBank: updatedItem.recipient_bank,
          ref: updatedItem.transfer_ref,
          date: updatedItem.transfer_date,
          file: updatedItem.transfer_proof_file,
          disbursedAmt: updatedItem.disbursed_amount,
          notes: updatedItem.disbursement_notes,
        }
        localStorage.setItem('finance_rab_disbursement_status', JSON.stringify(map))
      } catch {
        // ignore
      }

      setIsSubmitting(false)
      if (newStatus === 'Dicairkan') {
        notify(`Sukses! Pencairan dana ${selectedRab.id} (${updatedItem.disbursed_amount}) berhasil dicatat & dibukukan!`)
      } else if (newStatus === 'Perlu Konfirmasi') {
        notify(`Pencairan untuk ${selectedRab.id} ditandai sebagai: Perlu Konfirmasi.`)
      } else {
        notify(`Status ${selectedRab.id} disimpan sebagai: Belum Dicairkan.`)
      }
    }, 400)
  }

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
              Daftar Rencana Anggaran Biaya (RAB / DSS) yang telah disahkan. Klik tombol <strong>Aksi</strong> untuk memeriksa rincian anggaran program, menentukan status pencairan, dan mengunggah berkas bukti transfer dana keluar.
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
                        <strong style={{ color: '#078780', fontSize: '12.5px', display: 'block' }}>
                          {item.id}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Ref: {item.program_id}
                        </span>
                      </td>

                      {/* Judul RAB & File Info */}
                      <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                        <span style={{ fontWeight: 600, color: '#172324', display: 'block', fontSize: '13px' }}>
                          {item.title}
                        </span>
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

                      {/* Aksi Button */}
                      <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenAction(item)
                          }}
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
                            boxShadow: '0 1px 2px rgba(7, 135, 128, 0.2)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Icon name="fileText" size={13} />
                          <span>Aksi</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================================
          MODAL DETAIL AKSI: FORM RAB/DSS + EKSEKUSI PENCAIRAN
          ========================================================== */}
      {selectedRab && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSelectedRab(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '1020px',
              maxHeight: '92vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #edf1f1',
                background: '#fafcfc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#e6f7f2',
                      color: '#078780',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {selectedRab.id}
                  </span>
                  <span style={{ fontSize: '13px', color: '#697879' }}>
                    • Pengesahan RAB: {selectedRab.date}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  Pemeriksaan &amp; Eksekusi Transfer Pencairan Anggaran (RAB)
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRab(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '22px',
                  color: '#889899',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Tutup dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: 2-Column Grid */}
            <div
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '1.15fr 1.1fr',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* ========================================================
                  KOLOM KIRI: ISI FORM / DOKUMEN DSS (RAB)
                  ======================================================== */}
              <div
                style={{
                  background: '#f8fafa',
                  borderRadius: '10px',
                  border: '1px solid #e3eaea',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #edf1f1', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '16px' }}>📋</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#172324' }}>
                    Data Rencana Anggaran Biaya (DSS / RAB)
                  </span>
                </div>

                {/* Banner Highlight Nominal RAB */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #078780',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#697879', fontWeight: 600, display: 'block' }}>
                      NOMINAL ANGGARAN RAB / DSS:
                    </span>
                    <strong style={{ fontSize: '20px', color: '#078780', fontWeight: 700 }}>
                      {selectedRab.estimated_budget}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: '#edf6f5',
                        color: '#078780',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-block',
                      }}
                    >
                      {selectedRab.division}
                    </span>
                    <span style={{ fontSize: '11px', color: '#697879', display: 'block', marginTop: '3px' }}>
                      Kategori: {selectedRab.category}
                    </span>
                  </div>
                </div>

                {/* Detail Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                      Judul Program &amp; Kegiatan:
                    </span>
                    <strong style={{ color: '#172324' }}>{selectedRab.title}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        ID Program Induk:
                      </span>
                      <span style={{ color: '#334445', fontWeight: 600 }}>{selectedRab.program_id}</span>
                    </div>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Target Penerima Manfaat:
                      </span>
                      <span style={{ color: '#334445', fontWeight: 600 }}>{selectedRab.beneficiaries}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                      Wilayah &amp; Lokasi Pelaksanaan:
                    </span>
                    <span style={{ color: '#334445' }}>
                      📍 {selectedRab.location}, {selectedRab.province}
                    </span>
                  </div>

                  {/* Dokumen Lampiran RAB */}
                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                      Berkas Rincian RAB yang Disahkan:
                    </span>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#078780' }}>
                          <Icon name="fileText" size={16} />
                        </span>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#1e293b', display: 'block' }}>
                            {selectedRab.file_name || `${selectedRab.id}_RAB_RESMI.xlsx`}
                          </strong>
                          <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                            {selectedRab.file_type} • {selectedRab.file_size}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#078780',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Unduh
                      </span>
                    </div>
                  </div>

                  {selectedRab.evaluation_notes && (
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Catatan Telaah &amp; Rekomendasi Komite DSS:
                      </span>
                      <p style={{ margin: '3px 0 0', color: '#445556', lineHeight: 1.45, fontSize: '12px', background: '#fff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #edf2f2' }}>
                        {selectedRab.evaluation_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================
                  KOLOM KANAN: KEPUTUSAN PENCAIRAN & FORM TRANSFER UANG
                  ======================================================== */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Decision Selector: Cairkan atau Tunda */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #dfe6e7',
                    borderRadius: '10px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <label
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#172324',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Keputusan Eksekusi Pencairan Dana:
                  </label>
                  <p style={{ fontSize: '11.5px', color: '#697879', margin: '0 0 12px 0' }}>
                    Tentukan apakah dana untuk pelaksanaan RAB ini siap dicairkan dan ditransfer oleh Divisi Keuangan.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setDisburseDecision('cairkan')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: disburseDecision === 'cairkan' ? '2px solid #078780' : '1px solid #cbd5e1',
                        background: disburseDecision === 'cairkan' ? '#e6f7f2' : '#ffffff',
                        color: disburseDecision === 'cairkan' ? '#057a6e' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon name="check" size={15} />
                      <span>Cairkan Anggaran</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDisburseDecision('tunda')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: disburseDecision === 'tunda' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                        background: disburseDecision === 'tunda' ? '#fef2f2' : '#ffffff',
                        color: disburseDecision === 'tunda' ? '#b91c1c' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon name="close" size={13} />
                      <span>Tunda / Belum Dicairkan</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================
                    KONDISIONAL: JIKA "TUNDA / BELUM DICAIRKAN", FORM KEUANGAN
                    TIDAK DITAMPILKAN SAMA SEKALI
                    ======================================================== */}
                {disburseDecision === 'tunda' ? (
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>ℹ️</span>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#92400e', display: 'block' }}>
                          Keputusan: Tunda / Belum Dicairkan
                        </strong>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#78350f', lineHeight: 1.45 }}>
                          Formulir unggah bukti sudah transfer uang <strong>tidak ditampilkan</strong> karena Anda memilih opsi <em>Tunda / Belum Dicairkan</em>.
                        </p>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '11.5px', color: '#92400e' }}>
                      Pilih tombol <strong>"Cairkan Anggaran"</strong> di atas jika uang telah siap ditransfer dan Anda hendak mengunggah slip / bukti transfer bank.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSaveDecision('Menunggu Pencairan')}
                        style={{
                          flex: 1,
                          padding: '9px 14px',
                          borderRadius: '7px',
                          border: 'none',
                          background: '#d97706',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Status Belum Dicairkan'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRab(null)}
                        style={{
                          padding: '9px 14px',
                          borderRadius: '7px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================
                      KONDISIONAL: JIKA "CAIRKAN ANGGARAN", TAMPILKAN FORM
                      LENGKAP UNTUK BAGIAN KEUANGAN (UNGGAH BUKTI SUDAH TRANSFER,
                      NOMINAL, BANK ASAL, BANK TUJUAN, REF, DLL)
                      ======================================================== */
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #078780',
                      borderRadius: '10px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: '0 4px 12px rgba(7, 135, 128, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #edf1f1', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '16px' }}>💸</span>
                      <strong style={{ fontSize: '13.5px', color: '#078780' }}>
                        Form Keuangan: Unggah Bukti Transfer &amp; Eksekusi Pencairan
                      </strong>
                    </div>

                    {/* 1. Nominal yang Ditransfer / Dicairkan */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Nominal yang Ditransfer / Dicairkan (Rp):
                      </label>
                      <input
                        type="text"
                        value={disbursedAmountInput}
                        onChange={(e) => setDisbursedAmountInput(e.target.value)}
                        placeholder="Contoh: Rp 82.500.000"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #078780',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#078780',
                          outline: 'none',
                          background: '#f9fdfc',
                        }}
                      />
                      <small style={{ fontSize: '11px', color: '#697879', display: 'block', marginTop: '2px' }}>
                        Pagu pagu total pengajuan RAB: {selectedRab.estimated_budget}
                      </small>
                    </div>

                    {/* 2. Pilihan Termin Pencairan */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Tahap / Termin Pencairan:
                      </label>
                      <select
                        value={terminInput}
                        onChange={(e) => setTerminInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12.5px',
                          outline: 'none',
                          background: '#fff',
                        }}
                      >
                        <option value="Pencairan Penuh (100%)">Pencairan Penuh (100%)</option>
                        <option value="Termin 1 (Uang Muka 50%)">Termin 1 (Uang Muka 50%)</option>
                        <option value="Termin 2 (Pelunasan 50%)">Termin 2 (Pelunasan 50%)</option>
                        <option value="Termin 1 (Uang Muka 30%)">Termin 1 (Uang Muka 30%)</option>
                        <option value="Termin 2 (Termin Lanjutan 40%)">Termin 2 (Termin Lanjutan 40%)</option>
                        <option value="Termin 3 (Pelunasan 30%)">Termin 3 (Pelunasan 30%)</option>
                      </select>
                    </div>

                    {/* 3. Rekening Sumber Kas Keluar Yayasan */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Rekening Asal Sumber Dana Keluar (Kas Yayasan):
                      </label>
                      <select
                        value={sourceBankInput}
                        onChange={(e) => setSourceBankInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12.5px',
                          outline: 'none',
                          background: '#fff',
                        }}
                      >
                        <option value="Bank Mandiri - Kas Kemitraan (131-00-981273-1)">
                          Bank Mandiri - Kas Kemitraan (131-00-981273-1)
                        </option>
                        <option value="BSI - Rekening Campaign (709-112-4456)">
                          BSI - Rekening Campaign (709-112-4456)
                        </option>
                        <option value="BCA - Penyaluran Zakat & Infaq (283-889-1002)">
                          BCA - Penyaluran Zakat &amp; Infaq (283-889-1002)
                        </option>
                        <option value="BSI - Kas Kedaruratan & Tanggap Darurat (711-200-3344)">
                          BSI - Kas Kedaruratan &amp; Tanggap Darurat (711-200-3344)
                        </option>
                      </select>
                    </div>

                    {/* 4. Rekening Penerima / PIC Lapangan */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Rekening Tujuan / Penanggung Jawab Lapangan:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: BSI 712-889-1002 a.n. Tim Pelaksana Lapangan"
                        value={recipientBankInput}
                        onChange={(e) => setRecipientBankInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* 5. FORM UNGGAH BUKTI SUDAH TRANSFER UANG */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Unggah Bukti Sudah Transfer Uang (Slip Transfer / Mutasi Keluar / Struk Bank):
                      </label>

                      {/* Dropzone Area */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: '2px dashed #a5d3ce',
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: '#f6fbfa',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '24px', color: '#078780' }}>
                          <Icon name="upload" size={22} />
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#172324' }}>
                          {uploadedProofFile ? 'Klik untuk mengganti berkas bukti transfer' : 'Klik untuk memilih bukti transfer uang pencairan'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#7b8c8d' }}>
                          Mendukung berkas PDF, JPG, atau PNG (maks. 10 MB)
                        </span>
                      </div>

                      {/* Chip Bukti Terunggah */}
                      {uploadedProofFile && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: '#e6f7f2',
                            border: '1px solid #bcece4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#078780' }}>
                              <Icon name="checkCircle" size={16} />
                            </span>
                            <div>
                              <strong style={{ fontSize: '12px', color: '#057a6e', display: 'block' }}>
                                {uploadedProofFile.name}
                              </strong>
                              <span style={{ fontSize: '10.5px', color: '#557d76' }}>
                                {uploadedProofFile.type} • {uploadedProofFile.size}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadedProofFile(null)
                            }}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: '#dc2626',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: '2px 6px',
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 6. No. Referensi Transfer & Tanggal */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          No. Referensi / Kliring Bank:
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: TRX-OUT/202611/0892"
                          value={transferRefInput}
                          onChange={(e) => setTransferRefInput(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Tanggal Transfer:
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 19 Nov 2026"
                          value={transferDateInput}
                          onChange={(e) => setTransferDateInput(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* 7. Catatan Pencairan Keuangan */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Catatan Pencairan Kasir / Keuangan:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Dana termin 1 telah ditransfer via Bank Mandiri untuk biaya operasional awal."
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #edf1f1' }}>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSaveDecision('Dicairkan')}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '7px',
                          border: 'none',
                          background: '#078780',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(7, 135, 128, 0.25)',
                        }}
                      >
                        <Icon name="check" size={14} />
                        <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Bukukan Pencairan Dana'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSaveDecision('Perlu Konfirmasi')}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '7px',
                          border: '1px solid #f59e0b',
                          background: '#fffbeb',
                          color: '#b45309',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Perlu Konfirmasi
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRab(null)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '7px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
