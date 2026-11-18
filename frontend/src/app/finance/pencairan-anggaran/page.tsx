'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api, getFullUploadUrl } from '@/lib/api'

export default function PencairanAnggaranPage() {
  const { notify } = useDashboard()

  const [spks, setSpks] = useState<any[]>([])
  const [selectedSpk, setSelectedSpk] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<'Semua' | 'Perlu Pencairan' | 'Selesai'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State for disbursement transaction
  const [transferBank, setTransferBank] = useState('BSI (Bank Syariah Indonesia)')
  const [refNumber, setRefNumber] = useState('')
  const [terminChoice, setTerminChoice] = useState('Termin 1 (Uang Muka 50%)')
  const [transferNotes, setTransferNotes] = useState('')

  const loadData = () => {
    api
      .getSpkList()
      .then((res) => {
        const list = res?.spks || res?.data
        if (Array.isArray(list)) {
          setSpks(list)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredSpks = useMemo(() => {
    return spks.filter((s) => {
      const isDone = (s.status || '').toLowerCase().includes('selesai')
      if (activeTab === 'Perlu Pencairan' && isDone) return false
      if (activeTab === 'Selesai' && !isDone) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (s.program_name || '').toLowerCase().includes(q)
        const matchNumber = (s.spk_number || s.id || '').toLowerCase().includes(q)
        const matchPartner = (s.second_party || '').toLowerCase().includes(q)
        if (!matchTitle && !matchNumber && !matchPartner) return false
      }
      return true
    })
  }, [spks, activeTab, searchQuery])

  const handleDisburse = async () => {
    if (!selectedSpk) return
    setIsSubmitting(true)
    try {
      const note = `Pencairan dana ${terminChoice} berhasil via ${transferBank}. Ref: ${refNumber || '-'}. Catatan: ${transferNotes || 'Dana telah ditransfer ke penanggung jawab lapangan.'}`
      await api.updateSpkStatus(
        selectedSpk.id,
        'Selesai',
        note
      )
      notify(`Pencairan dana untuk ${selectedSpk.spk_number || selectedSpk.id} berhasil diproses dan dicatat!`)
      setSelectedSpk(null)
      setRefNumber('')
      setTransferNotes('')
      loadData()
    } catch {
      notify('Gagal memproses pencairan dana.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Link href="/finance" style={{ fontSize: '13px', color: '#078780', textDecoration: 'none', fontWeight: 600 }}>
              ← Kembali ke Dasbor Keuangan
            </Link>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#172324', margin: 0 }}>
            Pencairan Anggaran
          </h1>
          <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
            Pantau dan proses eksekusi transfer pencairan dana program berdasarkan Surat Perintah Kerja (SPK) yang telah disahkan.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Semua', 'Perlu Pencairan', 'Selesai'] as const).map((tab) => (
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
          placeholder="Cari nomor SPK, nama kegiatan, atau mitra..."
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
      <div style={{ display: 'grid', gridTemplateColumns: selectedSpk ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table List */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #dfe6e7', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f4f4', background: '#fafcfc', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#172324' }}>
              Daftar Komitmen Anggaran SPK ({filteredSpks.length})
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>
              Data Real Database
            </span>
          </div>

          {filteredSpks.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#889899' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Tidak ada dokumen SPK yang memerlukan aksi.</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#a0aeb0' }}>
                SPK baru dari pengajuan program akan otomatis tercatat di sini.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#607274', fontWeight: 600 }}>
                  <th style={{ padding: '10px 14px' }}>No. SPK</th>
                  <th style={{ padding: '10px 14px' }}>Program &amp; Pihak Kedua</th>
                  <th style={{ padding: '10px 14px' }}>Komitmen Anggaran</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpks.map((item) => {
                  const isSelected = selectedSpk?.id === item.id
                  const isFinished = (item.status || '').toLowerCase().includes('selesai')
                  const budgetFormatted = item.budget_amount || item.budget_formatted || item.budget || 'Rp 0'

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedSpk(item)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f4f4',
                        background: isSelected ? '#f0f9f8' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#078780' }}>
                        {item.spk_number || item.id}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#172324' }}>
                          {item.program_name || item.title || 'Kegiatan Lapangan'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#697879' }}>
                          Pihak Kedua: {item.second_party || 'Koordinator Program'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#172324' }}>
                        {budgetFormatted}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: isFinished ? '#e6f7f2' : '#fef7e6',
                            color: isFinished ? '#057a6e' : '#b45309',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {isFinished ? 'Dana Dicairkan' : 'Perlu Pencairan'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSpk(item)
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
                          {isSelected ? 'Memproses' : 'Proses'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Action Panel */}
        {selectedSpk && (
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
                  FORM PENCAIRAN ANGGARAN • {selectedSpk.spk_number || selectedSpk.id}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  {selectedSpk.program_name || 'Program Relawan Nusantara'}
                </h2>
                <p style={{ fontSize: '12px', color: '#697879', margin: '2px 0 0' }}>
                  Penerima: <strong>{selectedSpk.second_party || 'Koordinator Program'}</strong> • Total Komitmen: <strong>{selectedSpk.budget_amount || selectedSpk.budget_formatted || selectedSpk.budget}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSpk(null)}
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

            {/* Document Link */}
            {selectedSpk.file_url && (
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#f8fafa', border: '1px solid #e1e9e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#445657' }}>
                  Dokumen SPK Terkait: <strong>{selectedSpk.file_name || 'Berkas SPK.pdf'}</strong>
                </span>
                <a
                  href={getFullUploadUrl(selectedSpk.file_url) + '?download=1'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#078780',
                    textDecoration: 'none',
                  }}
                >
                  Unduh SPK ↗
                </a>
              </div>
            )}

            {/* Input Termin & Rekening */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Tahapan Termin Pencairan:
                </label>
                <select
                  value={terminChoice}
                  onChange={(e) => setTerminChoice(e.target.value)}
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
                  <option>Termin 1 (Uang Muka 50%)</option>
                  <option>Termin 2 (Operasional Lapangan 30%)</option>
                  <option>Termin 3 (Pelunasan Akhir 20%)</option>
                  <option>Pencairan Penuh 100% Sekaligus</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Bank Sumber Dana Keluar:
                </label>
                <select
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
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
                  <option>BSI (Bank Syariah Indonesia) - Operasional</option>
                  <option>BCA - Penyaluran Program</option>
                  <option>Bank Mandiri - Kas Program Kemitraan</option>
                  <option>BRI - Bantuan Tanggap Bencana</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nomor Referensi Bank / No. Bukti Transfer:
              </label>
              <input
                type="text"
                placeholder="Contoh: TRF-20261112-88912 atau No. Ref Teller"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  fontSize: '12.5px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Catatan Transaksi &amp; Instruksi Kasir:
              </label>
              <textarea
                rows={2}
                placeholder="Informasi rekening tujuan, nama bank penerima, atau instruksi pelaporan kwitansi..."
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setSelectedSpk(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  background: '#ffffff',
                  color: '#697879',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDisburse}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#078780',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? 'Memproses Transfer...' : 'Konfirmasi & Cairkan Dana'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

