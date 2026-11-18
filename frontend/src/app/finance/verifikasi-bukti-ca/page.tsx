'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'

interface CaItem {
  id: string
  ca_number: string
  program_name: string
  coordinator: string
  location: string
  date: string
  disbursed_amount: number
  realized_amount: number
  status: 'Perlu Verifikasi' | 'Sesuai (Lengkap)' | 'Terdapat Selisih'
  receipts_count: number
  notes: string
  breakdown: { item: string; amount: number; receipt: string }[]
}

const initialCaList: CaItem[] = [
  {
    id: 'CA-01',
    ca_number: 'CA/RN/2026/11/001',
    program_name: 'Penyaluran Paket Pangan Dhuafa',
    coordinator: 'Ahmad Fauzi (Tim Lapangan)',
    location: 'Kab. Bandung, Jawa Barat',
    date: '10 Nov 2026',
    disbursed_amount: 15000000,
    realized_amount: 14850000,
    status: 'Perlu Verifikasi',
    receipts_count: 8,
    notes: 'Kuitansi belanja sembako dan nota BBM terkumpul lengkap.',
    breakdown: [
      { item: 'Beras & Bahan Pokok (Grosir Berkah)', amount: 11500000, receipt: 'INV-GRS-889.pdf' },
      { item: 'Sewa Mobil Pick-up Distribusi 2 Hari', amount: 1800000, receipt: 'KW-TRANS-04.pdf' },
      { item: 'BBM & Operasional Pengantaran', amount: 950000, receipt: 'STR-SPBU-01.jpg' },
      { item: 'Konsumsi Relawan 12 Orang', amount: 600000, receipt: 'NOTA-WARUNG-12.jpg' },
    ],
  },
  {
    id: 'CA-02',
    ca_number: 'CA/RN/2026/11/002',
    program_name: 'Renovasi Jembatan Perintis Desa',
    coordinator: 'Budi Santoso (Logistik)',
    location: 'Sukabumi, Jawa Barat',
    date: '08 Nov 2026',
    disbursed_amount: 32000000,
    realized_amount: 32000000,
    status: 'Sesuai (Lengkap)',
    receipts_count: 14,
    notes: 'Seluruh belanja semen, besi cor, dan upah tukang telah tervalidasi.',
    breakdown: [
      { item: 'Bahan Bangunan & Semen 150 Sak', amount: 20000000, receipt: 'FAKTUR-TB-JAYA.pdf' },
      { item: 'Kawat Seling & Baut Baja', amount: 6500000, receipt: 'FAKTUR-BAJA-99.pdf' },
      { item: 'Upah Tukang Lokal Termin 1', amount: 5500000, receipt: 'TANDA-TERIMA-TUKANG.pdf' },
    ],
  },
  {
    id: 'CA-03',
    ca_number: 'CA/RN/2026/11/003',
    program_name: 'Pemeriksaan Kesehatan Lansia & Balita',
    coordinator: 'Dewi Lestari (Medis)',
    location: 'Cianjur, Jawa Barat',
    date: '05 Nov 2026',
    disbursed_amount: 8500000,
    realized_amount: 8750000,
    status: 'Terdapat Selisih',
    receipts_count: 6,
    notes: 'Kelebihan belanja obat darurat sebesar Rp 250.000, butuh persetujuan reimbursement.',
    breakdown: [
      { item: 'Pengadaan Paket Vitamin & Masker', amount: 4800000, receipt: 'NOTA-APOTEK-01.pdf' },
      { item: 'Honor Dokter & Tenaga Medis Relawan', amount: 2500000, receipt: 'KW-HONOR-MEDIS.pdf' },
      { item: 'Obat-obatan Darurat Tambahan', amount: 1450000, receipt: 'NOTA-APOTEK-02.jpg' },
    ],
  },
]

export default function VerifikasiBuktiCaPage() {
  const { notify } = useDashboard()

  const [caList, setCaList] = useState<CaItem[]>(initialCaList)
  const [selectedCa, setSelectedCa] = useState<CaItem | null>(null)
  const [activeTab, setActiveTab] = useState<'Semua' | 'Perlu Verifikasi' | 'Sesuai (Lengkap)' | 'Terdapat Selisih'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [auditNotes, setAuditNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  const filteredCa = useMemo(() => {
    return caList.filter((item) => {
      if (activeTab !== 'Semua' && item.status !== activeTab) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = item.program_name.toLowerCase().includes(q)
        const matchNumber = item.ca_number.toLowerCase().includes(q)
        const matchCoord = item.coordinator.toLowerCase().includes(q)
        if (!matchTitle && !matchNumber && !matchCoord) return false
      }
      return true
    })
  }, [caList, activeTab, searchQuery])

  const handleApproveCa = (item: CaItem) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setCaList((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? { ...c, status: 'Sesuai (Lengkap)', notes: auditNotes || 'Bukti CA telah divalidasi dan ditutup oleh Keuangan.' }
            : c
        )
      )
      notify(`Verifikasi bukti Cash Advance ${item.ca_number} berhasil disetujui & ditutup!`)
      setSelectedCa(null)
      setAuditNotes('')
      setIsSubmitting(false)
    }, 400)
  }

  const handleRejectCa = (item: CaItem) => {
    if (!auditNotes.trim()) {
      notify('Catatan perbaikan bukti kuitansi / selisih CA wajib diisi!')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setCaList((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? { ...c, status: 'Terdapat Selisih', notes: auditNotes }
            : c
        )
      )
      notify(`Catatan koreksi CA ${item.ca_number} dikirimkan ke koordinator lapangan.`)
      setSelectedCa(null)
      setAuditNotes('')
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Link href="/finance" style={{ fontSize: '13px', color: '#078780', textDecoration: 'none', fontWeight: 600 }}>
            ← Kembali ke Dasbor Keuangan
          </Link>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#172324', margin: 0 }}>
          Verifikasi Bukti CA (Cash Advance)
        </h1>
        <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
          Audit dan rekonsiliasi berkas kuitansi, faktur belanja, serta selisih pengeluaran kas di muka lapangan.
        </p>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Semua', 'Perlu Verifikasi', 'Sesuai (Lengkap)', 'Terdapat Selisih'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: activeTab === tab ? '1px solid #078780' : '1px solid #dfe6e7',
                background: activeTab === tab ? '#078780' : '#ffffff',
                color: activeTab === tab ? '#ffffff' : '#556667',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Cari nomor CA, nama program, atau koordinator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #dfe6e7',
            fontSize: '12.5px',
            minWidth: '280px',
            outline: 'none',
          }}
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedCa ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table List */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #dfe6e7', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f4f4', background: '#fafcfc', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#172324' }}>
              Daftar Pertanggungjawaban CA Lapangan ({filteredCa.length})
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>
              Audit Kuitansi &amp; Nota
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#607274', fontWeight: 600 }}>
                <th style={{ padding: '10px 14px' }}>No. CA</th>
                <th style={{ padding: '10px 14px' }}>Program &amp; Penanggung Jawab</th>
                <th style={{ padding: '10px 14px' }}>Plafon CA</th>
                <th style={{ padding: '10px 14px' }}>Realisasi Bukti</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCa.map((item) => {
                const isSelected = selectedCa?.id === item.id
                const diff = item.disbursed_amount - item.realized_amount
                const isComplete = item.status === 'Sesuai (Lengkap)'
                const isWarning = item.status === 'Terdapat Selisih'

                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedCa(item)
                      setAuditNotes(item.notes)
                    }}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f4f4',
                      background: isSelected ? '#f0f9f8' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#078780' }}>
                      {item.ca_number}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#172324' }}>{item.program_name}</div>
                      <div style={{ fontSize: '11.5px', color: '#697879' }}>
                        {item.coordinator} • {item.location}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#172324' }}>
                      {formatRp(item.disbursed_amount)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#172324' }}>{formatRp(item.realized_amount)}</div>
                      <div style={{ fontSize: '11px', color: diff > 0 ? '#057a6e' : diff < 0 ? '#dc2626' : '#697879' }}>
                        {diff > 0 ? `Sisa: +${formatRp(diff)}` : diff < 0 ? `Kurang: ${formatRp(diff)}` : 'Sesuai 100%'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isComplete ? '#e6f7f2' : isWarning ? '#feeef0' : '#fef7e6',
                          color: isComplete ? '#057a6e' : isWarning ? '#dc2626' : '#b45309',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCa(item)
                          setAuditNotes(item.notes)
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: '1px solid #078780',
                          background: isSelected ? '#078780' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#078780',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isSelected ? 'Memeriksa' : 'Audit'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Audit Detail Panel */}
        {selectedCa && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dfe6e7',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#078780', letterSpacing: '0.04em' }}>
                  AUDIT BUKTI TRANSAKSI • {selectedCa.ca_number}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  {selectedCa.program_name}
                </h2>
                <p style={{ fontSize: '12px', color: '#697879', margin: '2px 0 0' }}>
                  Koordinator: <strong>{selectedCa.coordinator}</strong> • Tanggal: {selectedCa.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCa(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '18px',
                  color: '#889899',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Rekonsiliasi Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                background: '#f8fafa',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8e8',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#697879', display: 'block' }}>Plafon Dana CA</span>
                <strong style={{ fontSize: '14px', color: '#172324' }}>{formatRp(selectedCa.disbursed_amount)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#697879', display: 'block' }}>Realisasi Bukti</span>
                <strong style={{ fontSize: '14px', color: '#078780' }}>{formatRp(selectedCa.realized_amount)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#697879', display: 'block' }}>Sisa / Selisih</span>
                <strong
                  style={{
                    fontSize: '14px',
                    color: selectedCa.disbursed_amount - selectedCa.realized_amount >= 0 ? '#057a6e' : '#dc2626',
                  }}
                >
                  {formatRp(selectedCa.disbursed_amount - selectedCa.realized_amount)}
                </strong>
              </div>
            </div>

            {/* Daftar Kuitansi / Breakdown */}
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#172324', display: 'block', marginBottom: '8px' }}>
                Rincian Pos Belanja &amp; Lampiran Kuitansi ({selectedCa.breakdown.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCa.breakdown.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #edf2f2',
                      background: '#ffffff',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#273839' }}>{row.item}</div>
                      <span style={{ fontSize: '11px', color: '#078780' }}>📎 {row.receipt}</span>
                    </div>
                    <strong style={{ color: '#172324' }}>{formatRp(row.amount)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Audit */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Catatan Review / Instruksi Rekonsiliasi:
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan catatan kelengkapan kuitansi, pengembalian sisa dana, atau instruksi perbaikan..."
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  padding: '8px 12px',
                  fontSize: '12.5px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleRejectCa(selectedCa)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ef4444',
                  background: '#ffffff',
                  color: '#dc2626',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Minta Perbaikan Kuitansi
              </button>
              <button
                type="button"
                onClick={() => handleApproveCa(selectedCa)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#078780',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Menyimpan...' : 'Sahkan & Tutup CA'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

