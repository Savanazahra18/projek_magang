'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import FileDownloadCard from '@/components/FileDownloadCard'

export default function ReviewApprovalRabPage() {
  const { notify } = useDashboard()

  const [rabs, setRabs] = useState<any[]>([])
  const [selectedRab, setSelectedRab] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<'Semua' | 'Dalam telaah' | 'Perlu revisi' | 'Disetujui'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = () => {
    api
      .getDssEvaluations()
      .then((res) => {
        if (Array.isArray(res?.evaluations)) {
          setRabs(res.evaluations)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredRabs = useMemo(() => {
    return rabs.filter((r) => {
      if (activeTab === 'Dalam telaah' && !r.status?.toLowerCase().includes('telaah')) return false
      if (activeTab === 'Perlu revisi' && !r.status?.toLowerCase().includes('revisi')) return false
      if (activeTab === 'Disetujui' && !r.status?.toLowerCase().includes('setuju')) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (r.title || '').toLowerCase().includes(q)
        const matchId = (r.id || '').toLowerCase().includes(q)
        const matchLoc = (r.location || '').toLowerCase().includes(q)
        if (!matchTitle && !matchId && !matchLoc) return false
      }
      return true
    })
  }, [rabs, activeTab, searchQuery])

  const handleApprove = async () => {
    if (!selectedRab) return
    setIsSubmitting(true)
    try {
      await api.updateDssStatus(
        selectedRab.id,
        'Disetujui',
        notesInput || 'Anggaran telah divalidasi dan disetujui oleh Divisi Keuangan.'
      )
      notify(`RAB ${selectedRab.id} (${selectedRab.title}) berhasil disetujui oleh Divisi Keuangan!`)
      setSelectedRab(null)
      loadData()
    } catch {
      notify('Gagal memperbarui status verifikasi RAB.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevise = async () => {
    if (!selectedRab) return
    if (!notesInput.trim()) {
      notify('Catatan revisi anggaran wajib diisi!')
      return
    }
    setIsSubmitting(true)
    try {
      await api.updateDssStatus(selectedRab.id, 'Perlu revisi', notesInput)
      notify(`RAB ${selectedRab.id} dikembalikan ke Divisi Program dengan catatan perbaikan anggaran.`)
      setSelectedRab(null)
      loadData()
    } catch {
      notify('Gagal mengembalikan berkas RAB.')
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
            Review &amp; Approval RAB
          </h1>
          <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
            Tinjau rincian biaya, pagu anggaran, kesesuaian unit cost, dan sahkan rencana anggaran biaya program.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Semua', 'Dalam telaah', 'Perlu revisi', 'Disetujui'] as const).map((tab) => (
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
          placeholder="Cari nomor RAB, program, atau lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid #dfe6e7',
            fontSize: '13px',
            width: '280px',
            outline: 'none',
          }}
        />
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRab ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table / List */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #dfe6e7', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f4f4', background: '#fafcfc', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#172324' }}>
              Daftar Usulan RAB Program ({filteredRabs.length})
            </span>
            <span style={{ fontSize: '12px', color: '#697879' }}>
              Sinkronisasi Database
            </span>
          </div>

          {filteredRabs.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#889899' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Tidak ada dokumen RAB yang sesuai filter.</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#a0aeb0' }}>
                Jika data baru dimasukkan oleh tim program, akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#607274', fontWeight: 600 }}>
                  <th style={{ padding: '10px 14px' }}>No. Dokumen</th>
                  <th style={{ padding: '10px 14px' }}>Nama Program</th>
                  <th style={{ padding: '10px 14px' }}>Lokasi</th>
                  <th style={{ padding: '10px 14px' }}>Estimasi Anggaran</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRabs.map((item) => {
                  const isSelected = selectedRab?.id === item.id
                  const status = item.status || 'Dalam telaah'
                  const isApproved = status.toLowerCase().includes('setuju')
                  const isRevision = status.toLowerCase().includes('revisi')

                  const badgeBg = isApproved ? '#e6f7f2' : isRevision ? '#feeef0' : '#fef7e6'
                  const badgeColor = isApproved ? '#057a6e' : isRevision ? '#dc2626' : '#b45309'

                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedRab(item)
                        setNotesInput(item.review_notes || '')
                      }}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f4f4',
                        background: isSelected ? '#f0f9f8' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#078780' }}>
                        {item.id}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 500, color: '#172324' }}>
                        {item.title}
                        {item.file_name && (
                          <div style={{ fontSize: '11px', color: '#889899', marginTop: '2px' }}>
                            📎 {item.file_name}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#556667' }}>
                        {item.location || '-'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#172324' }}>
                        {item.estimated_budget || 'Rp 0'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: badgeBg,
                            color: badgeColor,
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRab(item)
                            setNotesInput(item.review_notes || '')
                          }}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #078780',
                            background: isSelected ? '#078780' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#078780',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected ? 'Meninjau' : 'Tinjau'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selectedRab && (
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
                  REVIEW BERKAS RAB • {selectedRab.id}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 0' }}>
                  {selectedRab.title}
                </h2>
                <p style={{ fontSize: '12px', color: '#697879', margin: '2px 0 0' }}>
                  Lokasi: {selectedRab.location || 'Nasional'} • Nilai Pengajuan: <strong>{selectedRab.estimated_budget}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRab(null)}
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

            {/* Berkas Unduhan Asli */}
            <FileDownloadCard
              title={selectedRab.title}
              docNumber={selectedRab.id}
              category="Rencana Anggaran Biaya (RAB)"
              location={selectedRab.location || 'Wilayah Program'}
              amount={selectedRab.estimated_budget}
              date={selectedRab.date || '12 Nov 2026'}
              fileName={selectedRab.file_name}
              fileUrl={selectedRab.file_url}
              fileType={selectedRab.file_type || 'xlsx'}
              fileSize={selectedRab.file_size || '380 KB'}
              notes={selectedRab.review_notes}
              isRab={true}
            />

            {/* Form Catatan Keuangan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#273839' }}>
                Catatan Evaluasi / Rekomendasi Keuangan:
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan catatan verifikasi komponen anggaran, kepatuhan harga satuan, atau instruksi revisi pos biaya..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #dfe6e7',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleRevise}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #ef4444',
                  background: '#ffffff',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                Kembalikan (Perlu Revisi)
              </button>
              <button
                type="button"
                onClick={handleApprove}
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
                Sahkan &amp; Setujui RAB
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
