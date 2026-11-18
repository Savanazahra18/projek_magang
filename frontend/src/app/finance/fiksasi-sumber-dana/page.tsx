'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'

interface FundingAllocation {
  id: string
  program_code: string
  program_name: string
  category: 'Program Kemitraan' | 'Program Campaign' | 'Program Aspirasi' | 'Program Kedaruratan'
  proposing_division: string
  budget_requested: number
  funding_source: string
  source_account: string
  allocation_code: string
  status: 'Belum Difiksasi' | 'Terkunci (Fixed)' | 'Perlu Penyesuaian'
  notes: string
}

const initialAllocations: FundingAllocation[] = [
  {
    id: 'FKS-01',
    program_code: 'PRG/KMT/2026/001',
    program_name: 'Beasiswa Anak Pelosok Jawa Barat',
    category: 'Program Kemitraan',
    proposing_division: 'Divisi Program - Pendidikan',
    budget_requested: 65000000,
    funding_source: 'Dana Kemitraan CSR — PT Bio Farma',
    source_account: 'Bank Mandiri (131-00-981273-1)',
    allocation_code: 'SRC-CSR-BF-2026-01',
    status: 'Terkunci (Fixed)',
    notes: 'MoU Kemitraan telah ditandatangani dan dana telah ditampung di rekening khusus kemitraan.',
  },
  {
    id: 'FKS-02',
    program_code: 'PRG/CMP/2026/002',
    program_name: 'Penyaluran Paket Pangan Dhuafa Ramadhan',
    category: 'Program Campaign',
    proposing_division: 'Divisi Program - Sosial & Dakwah',
    budget_requested: 45000000,
    funding_source: 'Crowdfunding Publik — Kitabisa & Amalsholeh',
    source_account: 'BSI - Rekening Campaign (709-112-4456)',
    allocation_code: 'SRC-CMP-PANGAN-02',
    status: 'Belum Difiksasi',
    notes: 'Perlu konfirmasi kliring dana batch terakhir dari agregator crowdfunding.',
  },
  {
    id: 'FKS-03',
    program_code: 'PRG/KDR/2026/003',
    program_name: 'Respon Cepat Gempa Cianjur & Logistik Darurat',
    category: 'Program Kedaruratan',
    proposing_division: 'Divisi Program - Kebencanaan',
    budget_requested: 30000000,
    funding_source: 'Pos Kas Siaga Tanggap Darurat Bencana (Internal)',
    source_account: 'BSI - Kas Kedaruratan (711-200-3344)',
    allocation_code: 'SRC-EMG-CIANJUR-01',
    status: 'Terkunci (Fixed)',
    notes: 'Status tanggap darurat, alokasi langsung disetujui dari dana cadangan kebencanaan.',
  },
  {
    id: 'FKS-04',
    program_code: 'PRG/ASP/2026/004',
    program_name: 'Pemberdayaan Tani Organik Komunitas Lereng',
    category: 'Program Aspirasi',
    proposing_division: 'Divisi Program - Ekonomi',
    budget_requested: 25000000,
    funding_source: 'Dana Hibah Aspirasi Tokoh Masyarakat',
    source_account: 'BCA - Penyaluran Zakat & Infaq (283-889-1002)',
    allocation_code: 'SRC-ASP-TANI-03',
    status: 'Perlu Penyesuaian',
    notes: 'Nominal pagu dana aspirasi yang masuk Rp 20.000.000, terdapat selisih Rp 5.000.000 dari usulan.',
  },
]

export default function FiksasiSumberDanaPage() {
  const { notify } = useDashboard()

  const [allocations, setAllocations] = useState<FundingAllocation[]>(initialAllocations)
  const [selectedItem, setSelectedItem] = useState<FundingAllocation | null>(null)
  const [activeTab, setActiveTab] = useState<'Semua' | 'Belum Difiksasi' | 'Terkunci (Fixed)' | 'Perlu Penyesuaian'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Form edit states
  const [fundingSourceChoice, setFundingSourceChoice] = useState('')
  const [accountChoice, setAccountChoice] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  const filteredAllocations = useMemo(() => {
    return allocations.filter((item) => {
      if (activeTab !== 'Semua' && item.status !== activeTab) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = item.program_name.toLowerCase().includes(q)
        const matchCode = item.program_code.toLowerCase().includes(q)
        const matchSource = item.funding_source.toLowerCase().includes(q)
        if (!matchTitle && !matchCode && !matchSource) return false
      }
      return true
    })
  }, [allocations, activeTab, searchQuery])

  const handleSelect = (item: FundingAllocation) => {
    setSelectedItem(item)
    setFundingSourceChoice(item.funding_source)
    setAccountChoice(item.source_account)
    setNotesInput(item.notes)
  }

  const handleFixAllocation = () => {
    if (!selectedItem) return
    setIsSubmitting(true)
    setTimeout(() => {
      setAllocations((prev) =>
        prev.map((a) =>
          a.id === selectedItem.id
            ? {
                ...a,
                status: 'Terkunci (Fixed)',
                funding_source: fundingSourceChoice || a.funding_source,
                source_account: accountChoice || a.source_account,
                notes: notesInput || 'Sumber dana telah divalidasi dan dikunci oleh Divisi Keuangan.',
              }
            : a
        )
      )
      notify(`Sumber dana untuk ${selectedItem.program_code} (${selectedItem.program_name}) berhasil difiksasi & dikunci!`)
      setSelectedItem(null)
      setIsSubmitting(false)
    }, 400)
  }

  const handleNeedAdjustment = () => {
    if (!selectedItem) return
    setIsSubmitting(true)
    setTimeout(() => {
      setAllocations((prev) =>
        prev.map((a) =>
          a.id === selectedItem.id
            ? {
                ...a,
                status: 'Perlu Penyesuaian',
                funding_source: fundingSourceChoice || a.funding_source,
                source_account: accountChoice || a.source_account,
                notes: notesInput || 'Alokasi dana memerlukan penyesuaian anggaran dengan tim program.',
              }
            : a
        )
      )
      notify(`Alokasi dana ${selectedItem.program_code} ditandai Perlu Penyesuaian.`)
      setSelectedItem(null)
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
          Fiksasi Sumber Dana
        </h1>
        <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
          Penetapan dan penguncian sumber pendanaan program (Kemitraan, Campaign Publik, Aspirasi, Kedaruratan) sebelum penyaluran anggaran.
        </p>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Semua', 'Belum Difiksasi', 'Terkunci (Fixed)', 'Perlu Penyesuaian'] as const).map((tab) => (
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
          placeholder="Cari program, kode, atau sumber dana..."
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
      <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #dfe6e7', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f4f4', background: '#fafcfc', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#172324' }}>
              Daftar Alokasi Sumber Dana Program ({filteredAllocations.length})
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>
              Prinsip 1 Program : 1 Sumber Dana
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#607274', fontWeight: 600 }}>
                <th style={{ padding: '10px 14px' }}>Kode Program</th>
                <th style={{ padding: '10px 14px' }}>Nama Program &amp; Kategori</th>
                <th style={{ padding: '10px 14px' }}>Pagu Usulan</th>
                <th style={{ padding: '10px 14px' }}>Sumber Dana Ditetapkan</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((item) => {
                const isSelected = selectedItem?.id === item.id
                const isFixed = item.status === 'Terkunci (Fixed)'
                const isPending = item.status === 'Belum Difiksasi'

                return (
                  <tr
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f4f4',
                      background: isSelected ? '#f0f9f8' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#078780' }}>
                      {item.program_code}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#172324' }}>{item.program_name}</div>
                      <div style={{ fontSize: '11.5px', color: '#697879' }}>
                        {item.category} • {item.proposing_division}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#172324' }}>
                      {formatRp(item.budget_requested)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 500, color: '#273839' }}>{item.funding_source}</div>
                      <div style={{ fontSize: '11px', color: '#889899' }}>{item.source_account}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isFixed ? '#e6f7f2' : isPending ? '#fef7e6' : '#feeef0',
                          color: isFixed ? '#057a6e' : isPending ? '#b45309' : '#dc2626',
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
                          handleSelect(item)
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
                        {isSelected ? 'Memilih' : 'Tetapkan'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Panel Form Fiksasi */}
        {selectedItem && (
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
                  FIKSASI SUMBER DANA • {selectedItem.program_code}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  {selectedItem.program_name}
                </h2>
                <p style={{ fontSize: '12px', color: '#697879', margin: '2px 0 0' }}>
                  Kategori: <strong>{selectedItem.category}</strong> • Pagu: <strong>{formatRp(selectedItem.budget_requested)}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
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

            {/* Pilihan Sumber Dana */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Tetapkan Sumber Pendanaan:
              </label>
              <select
                value={fundingSourceChoice}
                onChange={(e) => setFundingSourceChoice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  fontSize: '12.5px',
                  outline: 'none',
                  background: '#fff',
                }}
              >
                <option value="Dana Kemitraan CSR — PT Bio Farma">Dana Kemitraan CSR — PT Bio Farma</option>
                <option value="Dana Kemitraan CSR — PT Telkom Indonesia">Dana Kemitraan CSR — PT Telkom Indonesia</option>
                <option value="Crowdfunding Publik — Kitabisa & Amalsholeh">Crowdfunding Publik — Kitabisa &amp; Amalsholeh</option>
                <option value="Dana Hibah Aspirasi Tokoh Masyarakat">Dana Hibah Aspirasi Tokoh Masyarakat</option>
                <option value="Pos Kas Siaga Tanggap Darurat Bencana (Internal)">Pos Kas Siaga Tanggap Darurat Bencana (Internal)</option>
                <option value="Kas Operasional Program Relawan Nusantara">Kas Operasional Program Relawan Nusantara</option>
              </select>
            </div>

            {/* Rekening Kas Penampung */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Rekening Kas Penampung / Asal Dana:
              </label>
              <select
                value={accountChoice}
                onChange={(e) => setAccountChoice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  fontSize: '12.5px',
                  outline: 'none',
                  background: '#fff',
                }}
              >
                <option value="Bank Mandiri (131-00-981273-1) - Kas Kemitraan">Bank Mandiri (131-00-981273-1) - Kas Kemitraan</option>
                <option value="BSI - Rekening Campaign (709-112-4456)">BSI - Rekening Campaign (709-112-4456)</option>
                <option value="BSI - Kas Kedaruratan (711-200-3344)">BSI - Kas Kedaruratan (711-200-3344)</option>
                <option value="BCA - Penyaluran Zakat & Infaq (283-889-1002)">BCA - Penyaluran Zakat &amp; Infaq (283-889-1002)</option>
              </select>
            </div>

            {/* Catatan / Keterangan Kontrak */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Catatan Fiksasi &amp; No. Referensi Alokasi:
              </label>
              <textarea
                rows={2}
                placeholder="Nomor kontrak kemitraan, kode batch crowdfunding, atau catatan komitmen..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleNeedAdjustment}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  background: '#ffffff',
                  color: '#b45309',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tandai Perlu Penyesuaian
              </button>
              <button
                type="button"
                onClick={handleFixAllocation}
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
                {isSubmitting ? 'Mengunci...' : 'Kunci & Fiksasi Sumber Dana'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

