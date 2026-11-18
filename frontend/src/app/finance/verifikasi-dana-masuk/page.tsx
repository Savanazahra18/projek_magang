'use client'

import { useState, useMemo, useEffect, ChangeEvent, useRef } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import { Icon } from '@/components/common/Icons'

export type FundStatus = 'Menunggu Verifikasi' | 'Terverifikasi' | 'Perlu Konfirmasi'

export interface MiproInflowItem {
  id: string
  type: string
  subtype: 'Kemitraan' | 'Aspirasi' | 'Campaign' | string
  type_label: string
  title: string
  partner_name?: string
  campaign_id?: string
  category: string
  location: string
  province: string
  period: string
  disbursement_amount: string
  beneficiaries?: string
  description?: string
  desired_output?: string
  updated_date: string
  // Fund verification metadata
  fund_status: FundStatus
  target_bank: string
  receipt_ref: string
  receipt_file?: string
  verified_amount?: string
  verification_notes?: string
}

const FALLBACK_MIPROS: MiproInflowItem[] = [
  {
    id: 'MIPRO-2026-001',
    type: 'MIPro 1',
    subtype: 'Kemitraan',
    type_label: 'Program dengan mitra',
    title: 'Air Bersih Desa Sukamaju',
    partner_name: 'PT Tirta Mandiri Sejahtera',
    category: 'Infrastruktur',
    location: 'Desa Sukamaju, Kec. Cimaung, Kab. Bandung',
    province: 'Jawa Barat',
    period: 'Januari – Maret 2027',
    disbursement_amount: 'Rp 82.500.000',
    beneficiaries: '1.200 Warga',
    desired_output: 'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
    description: 'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
    updated_date: '28 Okt 2026',
    fund_status: 'Menunggu Verifikasi',
    target_bank: 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)',
    receipt_ref: 'TRX-MND/202610/0192',
    receipt_file: '',
    verification_notes: 'Menunggu mutasi koran transfer termin 1 dari PT Tirta Mandiri Sejahtera.',
  },
  {
    id: 'MIPRO-2026-002',
    type: 'MIPro 2',
    subtype: 'Aspirasi',
    type_label: 'Program tanpa mitra',
    title: 'Paket Belajar Nusantara Pelosok',
    partner_name: 'Donatur Perorangan & Kas Zakat Yayasan',
    category: 'Pendidikan',
    location: 'Kampung Babakan, Desa Sukamulya, Kab. Cianjur',
    province: 'Jawa Barat',
    period: 'Februari – April 2027',
    disbursement_amount: 'Rp 45.000.000',
    beneficiaries: '350 Siswa',
    desired_output: 'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
    description: 'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
    updated_date: '27 Okt 2026',
    fund_status: 'Terverifikasi',
    target_bank: 'BCA - Penyaluran Zakat & Infaq (283-889-1002)',
    receipt_ref: 'KAS-ZKT/202610/0045',
    receipt_file: 'NOTA_KREDIT_BCA_ZAKAT.pdf',
    verified_amount: 'Rp 45.000.000',
    verification_notes: 'Alokasi dana kas infaq/zakat telah disetujui & dibukukan ke pos anggaran program.',
  },
  {
    id: 'MIPRO-2026-003',
    type: 'MIPro 3',
    subtype: 'Campaign',
    type_label: 'Campaign • ID 1025',
    title: 'Donasi Publik untuk Pendidikan',
    partner_name: 'Platform Crowdfunding Kitabisa',
    campaign_id: '1025',
    category: 'Sosial',
    location: 'Nasional',
    province: 'Indonesia',
    period: 'Januari – Februari 2027',
    disbursement_amount: 'Rp 95.000.000',
    beneficiaries: '500 Siswa',
    desired_output: 'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa.',
    description: 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
    updated_date: '26 Okt 2026',
    fund_status: 'Terverifikasi',
    target_bank: 'BSI - Rekening Campaign (709-112-4456)',
    receipt_ref: 'STL-KTB/202610/0882',
    receipt_file: 'SETTLEMENT_KITABISA_BATCH1.pdf',
    verified_amount: 'Rp 95.000.000',
    verification_notes: 'Pencairan hasil galang dana batch 1 platform Kitabisa telah masuk rekening BSI.',
  },
  {
    id: 'MIPRO-2026-004',
    type: 'MIPro 1',
    subtype: 'Kemitraan',
    type_label: 'Program dengan mitra',
    title: 'Digitalisasi Sekolah Pelosok & Lab Komputer',
    partner_name: 'PT Telkom Indonesia (CSR)',
    category: 'Pendidikan',
    location: 'Kec. Cikajang, Kab. Garut',
    province: 'Jawa Barat',
    period: 'Desember 2026 – Februari 2027',
    disbursement_amount: 'Rp 85.000.000',
    beneficiaries: '450 Siswa',
    desired_output: 'Pengadaan 20 unit komputer desktop, instalasi router satelit internet, dan pelatihan literasi digital guru.',
    description: 'Pengadaan 20 unit komputer desktop, instalasi router satelit internet, dan pelatihan literasi digital guru.',
    updated_date: '12 Nov 2026',
    fund_status: 'Menunggu Verifikasi',
    target_bank: 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)',
    receipt_ref: 'TRX-TLK/202611/0311',
    receipt_file: '',
    verification_notes: 'Dokumen MoU kemitraan telah selesai, menunggu konfirmasi kliring dana masuk.',
  },
]

export default function VerifikasiDanaMasukPage() {
  const { notify } = useDashboard()

  const [mipros, setMipros] = useState<MiproInflowItem[]>(FALLBACK_MIPROS)
  const [selectedMipro, setSelectedMipro] = useState<MiproInflowItem | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('Semua')
  const [statusFilter, setStatusFilter] = useState<'Semua' | FundStatus>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Decision state: 'verifikasi' (Ya) or 'tidak' (Tidak)
  const [verifyDecision, setVerifyDecision] = useState<'verifikasi' | 'tidak'>('tidak')

  // Finance Form State
  const [proofAmountInput, setProofAmountInput] = useState('')
  const [targetBankInput, setTargetBankInput] = useState('')
  const [receiptRefInput, setReceiptRefInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [uploadedProofFile, setUploadedProofFile] = useState<{ name: string; size: string; type: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Load MIPros from API
  useEffect(() => {
    let savedStatusMap: Record<
      string,
      { status: FundStatus; bank?: string; ref?: string; file?: string; verifiedAmt?: string; notes?: string }
    > = {}
    try {
      const stored = localStorage.getItem('finance_mipro_fund_status')
      if (stored) {
        savedStatusMap = JSON.parse(stored)
      }
    } catch {
      // ignore
    }

    api.getMiproList()
      .then((res) => {
        const list = res?.mipros || res?.data
        if (Array.isArray(list) && list.length > 0) {
          const mapped: MiproInflowItem[] = list.map((item: any, idx: number) => {
            const saved = savedStatusMap[item.id]
            const defaultBank =
              item.subtype === 'Kemitraan'
                ? 'Bank Mandiri - Kas Kemitraan (131-00-981273-1)'
                : item.subtype === 'Campaign'
                ? 'BSI - Rekening Campaign (709-112-4456)'
                : 'BCA - Penyaluran Zakat & Infaq (283-889-1002)'

            const defaultPartner =
              item.partner_name ||
              (item.subtype === 'Campaign'
                ? 'Platform Crowdfunding Publik'
                : item.subtype === 'Aspirasi'
                ? 'Kas Zakat & Infaq Donatur'
                : 'Mitra Kerjasama CSR')

            const defaultStatus: FundStatus = idx % 2 === 0 ? 'Menunggu Verifikasi' : 'Terverifikasi'

            return {
              id: item.id,
              type: item.type || 'MIPro 1',
              subtype: item.subtype || 'Kemitraan',
              type_label: item.type_label || (item.subtype === 'Kemitraan' ? 'Program dengan mitra' : 'Program tanpa mitra'),
              title: item.title,
              partner_name: defaultPartner,
              campaign_id: item.campaign_id,
              category: item.category || 'Umum',
              location: item.location || 'Kab. Bandung',
              province: item.province || 'Jawa Barat',
              period: item.period || '2027',
              disbursement_amount: item.disbursement_amount || 'Rp 50.000.000',
              beneficiaries: item.beneficiaries || '100 Jiwa',
              desired_output: item.desired_output || item.description,
              description: item.description,
              updated_date: item.updated_date || '2026',
              fund_status: saved ? saved.status : defaultStatus,
              target_bank: saved?.bank || defaultBank,
              receipt_ref: saved?.ref || `TRX-${item.id.replace('MIPRO-', '')}/2026`,
              receipt_file: saved?.file || (defaultStatus === 'Terverifikasi' ? 'BUKTI_TRANSFER_SETORAN.pdf' : ''),
              verified_amount: saved?.verifiedAmt || item.disbursement_amount,
              verification_notes: saved?.notes || '',
            }
          })
          setMipros(mapped)
        } else {
          setMipros((prev) =>
            prev.map((item) => {
              const saved = savedStatusMap[item.id]
              return saved
                ? {
                    ...item,
                    fund_status: saved.status,
                    target_bank: saved.bank || item.target_bank,
                    receipt_ref: saved.ref || item.receipt_ref,
                    receipt_file: saved.file || item.receipt_file,
                    verified_amount: saved.verifiedAmt || item.disbursement_amount,
                    verification_notes: saved.notes || item.verification_notes,
                  }
                : item
            })
          )
        }
      })
      .catch(() => {
        setMipros((prev) =>
          prev.map((item) => {
            const saved = savedStatusMap[item.id]
            return saved
              ? {
                  ...item,
                  fund_status: saved.status,
                  target_bank: saved.bank || item.target_bank,
                  receipt_ref: saved.ref || item.receipt_ref,
                  receipt_file: saved.file || item.receipt_file,
                  verified_amount: saved.verifiedAmt || item.disbursement_amount,
                  verification_notes: saved.notes || item.verification_notes,
                }
              : item
          })
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Helper to parse currency nominal
  const parseNominal = (str: string) => {
    const digits = String(str || '').replace(/\D/g, '')
    return digits ? parseInt(digits, 10) : 0
  }

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  // Metrics summary
  const metrics = useMemo(() => {
    let totalAmt = 0
    let verifiedAmt = 0
    let pendingAmt = 0
    let pendingCount = 0
    let verifiedCount = 0

    mipros.forEach((m) => {
      const val = parseNominal(m.disbursement_amount)
      totalAmt += val
      if (m.fund_status === 'Terverifikasi') {
        verifiedAmt += val
        verifiedCount += 1
      } else {
        pendingAmt += val
        pendingCount += 1
      }
    })

    return {
      totalCount: mipros.length,
      totalFormatted: formatRp(totalAmt),
      verifiedFormatted: formatRp(verifiedAmt),
      verifiedCount,
      pendingFormatted: formatRp(pendingAmt),
      pendingCount,
    }
  }, [mipros])

  // Filtered List
  const filteredMipros = useMemo(() => {
    return mipros.filter((m) => {
      if (typeFilter !== 'Semua') {
        if (!m.type.includes(typeFilter) && !m.subtype.includes(typeFilter)) {
          return false
        }
      }
      if (statusFilter !== 'Semua' && m.fund_status !== statusFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = m.id.toLowerCase().includes(q)
        const matchTitle = m.title.toLowerCase().includes(q)
        const matchPartner = (m.partner_name || '').toLowerCase().includes(q)
        const matchLoc = m.location.toLowerCase().includes(q)
        if (!matchId && !matchTitle && !matchPartner && !matchLoc) {
          return false
        }
      }
      return true
    })
  }, [mipros, typeFilter, statusFilter, searchQuery])

  // Select item for action & open inspection modal
  const handleOpenAction = (item: MiproInflowItem) => {
    setSelectedMipro(item)
    // Set decision based on current status
    const isCurrentlyVerified = item.fund_status === 'Terverifikasi'
    setVerifyDecision(isCurrentlyVerified ? 'verifikasi' : 'tidak')

    setProofAmountInput(item.verified_amount || item.disbursement_amount)
    setTargetBankInput(item.target_bank)
    setReceiptRefInput(item.receipt_ref)
    setNotesInput(item.verification_notes || '')
    if (item.receipt_file) {
      setUploadedProofFile({
        name: item.receipt_file,
        size: '1.8 MB',
        type: item.receipt_file.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMAGE',
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

  // Save Verification Decision
  const handleSaveDecision = () => {
    if (!selectedMipro) return

    setIsSubmitting(true)
    const isVerifying = verifyDecision === 'verifikasi'
    const newStatus: FundStatus = isVerifying ? 'Terverifikasi' : 'Menunggu Verifikasi'

    const updatedItem: MiproInflowItem = {
      ...selectedMipro,
      fund_status: newStatus,
      target_bank: isVerifying ? targetBankInput || selectedMipro.target_bank : selectedMipro.target_bank,
      receipt_ref: isVerifying ? receiptRefInput || selectedMipro.receipt_ref : selectedMipro.receipt_ref,
      receipt_file: isVerifying ? uploadedProofFile?.name || selectedMipro.receipt_file || 'BUKTI_DANA_MASUK.pdf' : '',
      verified_amount: isVerifying ? proofAmountInput || selectedMipro.disbursement_amount : '',
      verification_notes: isVerifying
        ? notesInput || 'Dana masuk telah diverifikasi dan dicocokkan dengan rekening koran yayasan.'
        : notesInput || 'Belum diverifikasi. Menunggu konfirmasi mutasi bank atau koordinasi tim.',
    }

    setTimeout(() => {
      setMipros((prev) =>
        prev.map((item) => (item.id === selectedMipro.id ? updatedItem : item))
      )
      setSelectedMipro(null)

      // Persist in localStorage
      try {
        const stored = localStorage.getItem('finance_mipro_fund_status')
        const map = stored ? JSON.parse(stored) : {}
        map[selectedMipro.id] = {
          status: newStatus,
          bank: updatedItem.target_bank,
          ref: updatedItem.receipt_ref,
          file: updatedItem.receipt_file,
          verifiedAmt: updatedItem.verified_amount,
          notes: updatedItem.verification_notes,
        }
        localStorage.setItem('finance_mipro_fund_status', JSON.stringify(map))
      } catch {
        // ignore
      }

      setIsSubmitting(false)
      if (isVerifying) {
        notify(`Sukses! Dana Masuk untuk ${selectedMipro.id} (${updatedItem.verified_amount}) berhasil diverifikasi & dibukukan!`)
      } else {
        notify(`Status ${selectedMipro.id} disimpan sebagai: Belum Diverifikasi.`)
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
                Verifikasi Dana Masuk (MIPro Program)
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
              Daftar Memo Internal Project (MIPro) resmi dari Divisi Program. Klik tombol <strong>Aksi</strong> untuk memeriksa isi form MIPro, memilih status verifikasi, dan mengunggah bukti dana masuk kas keuangan.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/finance/pencairan-anggaran"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #078780',
                color: '#078780',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Lanjut ke Pencairan Anggaran →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #dfe6e7' }}>
          <span style={{ fontSize: '12px', color: '#697879', fontWeight: 600 }}>Total MIPro Program</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#172324', marginTop: '6px' }}>
            {metrics.totalCount} Dokumen
          </div>
          <span style={{ fontSize: '11px', color: '#078780', marginTop: '4px', display: 'block' }}>
            Diterbitkan Divisi Program
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #dfe6e7' }}>
          <span style={{ fontSize: '12px', color: '#697879', fontWeight: 600 }}>Total Nominal Anggaran</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#172324', marginTop: '6px' }}>
            {metrics.totalFormatted}
          </div>
          <span style={{ fontSize: '11px', color: '#697879', marginTop: '4px', display: 'block' }}>
            Akumulasi dana seluruh MIPro
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #dfe6e7' }}>
          <span style={{ fontSize: '12px', color: '#697879', fontWeight: 600 }}>Dana Masuk Terverifikasi</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#057a6e', marginTop: '6px' }}>
            {metrics.verifiedFormatted}
          </div>
          <span style={{ fontSize: '11px', color: '#057a6e', marginTop: '4px', display: 'block' }}>
            {metrics.verifiedCount} MIPro siap dicairkan
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #dfe6e7' }}>
          <span style={{ fontSize: '12px', color: '#697879', fontWeight: 600 }}>Menunggu Verifikasi</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#d97706', marginTop: '6px' }}>
            {metrics.pendingFormatted}
          </div>
          <span style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', display: 'block' }}>
            {metrics.pendingCount} MIPro belum diverifikasi
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Filter Tipe MIPro */}
          <div style={{ display: 'flex', background: '#eef2f2', padding: '3px', borderRadius: '8px' }}>
            {['Semua', 'MIPro 1', 'MIPro 2', 'MIPro 3'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: typeFilter === t ? '#ffffff' : 'transparent',
                  color: typeFilter === t ? '#172324' : '#697879',
                  fontSize: '12px',
                  fontWeight: typeFilter === t ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: typeFilter === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {t === 'Semua' ? 'Semua Tipe' : t}
              </button>
            ))}
          </div>

          {/* Filter Status Verifikasi */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['Semua', 'Menunggu Verifikasi', 'Terverifikasi', 'Perlu Konfirmasi'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: statusFilter === st ? '1px solid #078780' : '1px solid #dfe6e7',
                  background: statusFilter === st ? '#078780' : '#ffffff',
                  color: statusFilter === st ? '#ffffff' : '#556667',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Cari nomor MIPro, program, atau mitra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #dfe6e7',
              fontSize: '12.5px',
              minWidth: '290px',
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8c9c9d' }}>
            <Icon name="search" size={15} />
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #dfe6e7', overflow: 'hidden' }}>
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #f0f4f4',
            background: '#fafcfc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#172324' }}>
              Daftar Dokumen MIPro dari Divisi Program ({filteredMipros.length})
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#697879' }}>
              Pilih tombol <strong>Aksi</strong> pada baris program untuk memeriksa rincian form MIPro &amp; memproses verifikasi dana masuk.
            </p>
          </div>
          {isLoading && (
            <span style={{ fontSize: '12px', color: '#078780', fontStyle: 'italic' }}>
              Memuat data MIPro...
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#607274', fontWeight: 600 }}>
                <th style={{ padding: '12px 14px' }}>NO. MIPRO &amp; TGL TERBIT</th>
                <th style={{ padding: '12px 14px' }}>NAMA PROGRAM &amp; TIPE</th>
                <th style={{ padding: '12px 14px' }}>SUMBER DANA / MITRA</th>
                <th style={{ padding: '12px 14px' }}>NOMINAL ANGGARAN</th>
                <th style={{ padding: '12px 14px' }}>STATUS DANA MASUK</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredMipros.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#889899' }}>
                    Tidak ada dokumen MIPro yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMipros.map((item) => {
                  const isVerified = item.fund_status === 'Terverifikasi'
                  const isPending = item.fund_status === 'Menunggu Verifikasi'

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenAction(item)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f4f4',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f7fbfa')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* No & Tanggal */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#eef6f5',
                            color: '#078780',
                            fontSize: '11.5px',
                            fontWeight: 700,
                          }}
                        >
                          {item.id}
                        </span>
                        <div style={{ fontSize: '11px', color: '#889899', marginTop: '3px' }}>
                          {item.updated_date}
                        </div>
                      </td>

                      {/* Nama Program & Tipe */}
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#172324', display: 'block', fontSize: '13.5px' }}>
                          {item.title}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: '#edf1f2',
                              color: '#4d6163',
                              fontWeight: 600,
                            }}
                          >
                            {item.type} ({item.subtype})
                          </span>
                          <span style={{ fontSize: '11px', color: '#889899' }}>• Divisi {item.category}</span>
                        </div>
                      </td>

                      {/* Sumber Dana */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#172324', fontSize: '12.5px' }}>
                          {item.partner_name || 'Donatur Publik / Mandiri'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#697879', marginTop: '2px' }}>
                          {item.location}
                        </div>
                      </td>

                      {/* Nominal Dana */}
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#078780', fontSize: '14px' }}>
                          {item.disbursement_amount}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#889899' }}>Periode: {item.period}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: isVerified ? '#e6f7f2' : isPending ? '#fef7e6' : '#feeef0',
                            color: isVerified ? '#057a6e' : isPending ? '#b45309' : '#dc2626',
                            fontSize: '11.5px',
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isVerified ? '#057a6e' : isPending ? '#b45309' : '#dc2626',
                            }}
                          />
                          <span>{item.fund_status}</span>
                        </span>
                      </td>

                      {/* Aksi Button */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
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
          MODAL DETAIL AKSI: FORM MIPRO + VERIFIKASI KEUANGAN
          ========================================================== */}
      {selectedMipro && (
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
          onClick={() => setSelectedMipro(null)}
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
                    {selectedMipro.id}
                  </span>
                  <span style={{ fontSize: '13px', color: '#697879' }}>
                    • Terbit: {selectedMipro.updated_date}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  Pemeriksaan &amp; Aksi Verifikasi Dana Masuk MIPro
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMipro(null)}
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
                  KOLOM KIRI: ISI FORM MIPRO DARI DIVISI PROGRAM
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
                    Data Form MIPro (Diterbitkan Divisi Program)
                  </span>
                </div>

                {/* Banner Highlight Nominal MIPro */}
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
                      NOMINAL ANGGARAN MIPRO:
                    </span>
                    <strong style={{ fontSize: '20px', color: '#078780', fontWeight: 700 }}>
                      {selectedMipro.disbursement_amount}
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
                      }}
                    >
                      {selectedMipro.type}
                    </span>
                    <div style={{ fontSize: '11px', color: '#889899', marginTop: '2px' }}>
                      {selectedMipro.subtype}
                    </div>
                  </div>
                </div>

                {/* List Rincian Form MIPro */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                      Nama Program / Kegiatan:
                    </span>
                    <strong style={{ color: '#172324', fontSize: '13px' }}>
                      {selectedMipro.title}
                    </strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Tipe &amp; Subtipe:
                      </span>
                      <strong style={{ color: '#172324' }}>
                        {selectedMipro.type} ({selectedMipro.subtype})
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Kategori Program:
                      </span>
                      <strong style={{ color: '#172324' }}>
                        Divisi {selectedMipro.category}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                      Sumber Dana / Mitra Donatur:
                    </span>
                    <strong style={{ color: '#057a6e' }}>
                      {selectedMipro.partner_name || 'Donatur Publik / Mandiri'}
                    </strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Wilayah Sasaran:
                      </span>
                      <strong style={{ color: '#172324' }}>
                        {selectedMipro.location}, {selectedMipro.province}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Periode Pelaksanaan:
                      </span>
                      <strong style={{ color: '#172324' }}>
                        {selectedMipro.period}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                      Target Penerima Manfaat:
                    </span>
                    <strong style={{ color: '#172324' }}>
                      {selectedMipro.beneficiaries || 'Masyarakat Sasaran'}
                    </strong>
                  </div>

                  {selectedMipro.desired_output && (
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Output Program yang Diinginkan:
                      </span>
                      <p style={{ margin: '3px 0 0', color: '#334445', lineHeight: 1.4, fontSize: '12px' }}>
                        {selectedMipro.desired_output}
                      </p>
                    </div>
                  )}

                  {selectedMipro.description && (
                    <div>
                      <span style={{ color: '#697879', fontSize: '11px', display: 'block' }}>
                        Keterangan &amp; Uraian Rencana:
                      </span>
                      <p style={{ margin: '3px 0 0', color: '#445556', lineHeight: 1.4, fontSize: '12px' }}>
                        {selectedMipro.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================
                  KOLOM KANAN: KEPUTUSAN VERIFIKASI & FORM KEUANGAN
                  ======================================================== */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Decision Selector: Verifikasi atau Tidak */}
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
                    Keputusan Verifikasi Dana Masuk:
                  </label>
                  <p style={{ fontSize: '11.5px', color: '#697879', margin: '0 0 12px 0' }}>
                    Tentukan apakah dana masuk untuk MIPro ini telah diterima dan siap diverifikasi oleh Divisi Keuangan.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setVerifyDecision('verifikasi')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: verifyDecision === 'verifikasi' ? '2px solid #078780' : '1px solid #cbd5e1',
                        background: verifyDecision === 'verifikasi' ? '#e6f7f2' : '#ffffff',
                        color: verifyDecision === 'verifikasi' ? '#057a6e' : '#475569',
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
                      <span>Verifikasi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVerifyDecision('tidak')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: verifyDecision === 'tidak' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                        background: verifyDecision === 'tidak' ? '#fef2f2' : '#ffffff',
                        color: verifyDecision === 'tidak' ? '#b91c1c' : '#475569',
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
                      <span>Tidak Verifikasi</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================
                    KONDISIONAL: JIKA "TIDAK VERIFIKASI", FORM KEUANGAN
                    TIDAK DITAMPILKAN SAMA SEKALI
                    ======================================================== */}
                {verifyDecision === 'tidak' ? (
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
                          Keputusan: Tidak Diverifikasi / Belum Diverifikasi
                        </strong>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#78350f', lineHeight: 1.45 }}>
                          Formulir bukti dana masuk untuk bagian keuangan <strong>tidak ditampilkan</strong> karena Anda memilih opsi <em>Tidak Verifikasi</em>.
                        </p>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '11.5px', color: '#92400e' }}>
                      Pilih tombol <strong>"Verifikasi"</strong> di atas jika mutasi rekening koran atau bukti transfer dari donatur telah diterima oleh pihak Keuangan.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSaveDecision}
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
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Status Belum Diverifikasi'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMipro(null)}
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
                      KONDISIONAL: JIKA "VERIFIKASI", TAMPILKAN FORM
                      LENGKAP UNTUK BAGIAN KEUANGAN (UPLOAD BUKTI, NOMINAL, DLL)
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
                      <span style={{ fontSize: '16px' }}>💰</span>
                      <strong style={{ fontSize: '13.5px', color: '#078780' }}>
                        Form Keuangan: Bukti Penerimaan Dana Masuk
                      </strong>
                    </div>

                    {/* 1. Nominal Dana Masuk */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Nominal Dana yang Masuk (Dicocokkan dengan Rekening):
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={proofAmountInput}
                          onChange={(e) => setProofAmountInput(e.target.value)}
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
                      </div>
                      <small style={{ fontSize: '11px', color: '#697879', display: 'block', marginTop: '2px' }}>
                        Nominal default sesuai pengajuan MIPro ({selectedMipro.disbursement_amount}).
                      </small>
                    </div>

                    {/* 2. Form Mengunggah Bukti Dana Masuk */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Unggah Bukti Dana Masuk (Transfer / Struk Bank / Nota Kredit):
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
                          {uploadedProofFile ? 'Klik untuk mengganti bukti berkas' : 'Klik untuk memilih bukti transfer / mutasi bank'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#7b8c8d' }}>
                          Mendukung berkas PDF, JPG, atau PNG (maks. 10 MB)
                        </span>
                      </div>

                      {/* Chip Bukti File yang Diunggah */}
                      {uploadedProofFile && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '10px 12px',
                            background: '#eef8f6',
                            border: '1px solid #b7e3dd',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px', color: '#078780' }}>
                              <Icon name={uploadedProofFile.type === 'PDF' ? 'pdf' : 'file'} size={18} />
                            </span>
                            <div>
                              <strong style={{ fontSize: '12px', color: '#172324', display: 'block' }}>
                                {uploadedProofFile.name}
                              </strong>
                              <span style={{ fontSize: '11px', color: '#697879' }}>
                                Ukuran: {uploadedProofFile.size} • Siap diverifikasi
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
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Rekening Bank Tujuan */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Rekening Bank Tujuan Yayasan:
                      </label>
                      <select
                        value={targetBankInput}
                        onChange={(e) => setTargetBankInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
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
                        <option value="BSI - Kas Kedaruratan (711-200-3344)">
                          BSI - Kas Kedaruratan (711-200-3344)
                        </option>
                      </select>
                    </div>

                    {/* 4. No. Referensi Transfer */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        No. Referensi / Kliring Bank:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: TRX-IN/202611/089 atau No. Batch Kliring"
                        value={receiptRefInput}
                        onChange={(e) => setReceiptRefInput(e.target.value)}
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

                    {/* 5. Catatan Rekonsiliasi Kasir */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Catatan Rekonsiliasi Kasir / Staf Keuangan:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Catatan verifikasi mutasi rekening koran bank..."
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
                        }}
                      />
                    </div>

                    {/* Action Buttons Submit */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleSaveDecision}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '7px',
                          border: 'none',
                          background: '#078780',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(7, 135, 128, 0.25)',
                        }}
                      >
                        <Icon name="check" size={14} />
                        <span>{isSubmitting ? 'Memproses...' : 'Verifikasi & Bukukan Dana Masuk'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMipro(null)}
                        style={{
                          padding: '10px 14px',
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
