'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api, getFullUploadUrl } from '@/lib/api'
import FileDownloadCard from '@/components/FileDownloadCard'

interface ApprovalSpkItem {
  id: string
  spk_number?: string
  title: string
  partner: string
  partner_role?: string
  contact?: string
  location: string
  nominal: string
  period: string
  status: string
  status_note?: string
  file_type?: string
  file_size?: string
  file_name?: string
  file_url?: string
  scope_of_work?: string
  target_output?: string
  payment_terms?: string
}

export default function ApprovalSpkPage() {
  const { notify } = useDashboard()

  const [spks, setSpks] = useState<ApprovalSpkItem[]>([])
  const [selectedSpk, setSelectedSpk] = useState<ApprovalSpkItem | null>(null)
  const [reviewerNotes, setReviewerNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const loadSpks = () => {
    api
      .getSpkList()
      .then((res) => {
        const list = res?.spks || res?.data
        if (Array.isArray(list)) {
          const mapped: ApprovalSpkItem[] = list.map((s: any) => ({
            id: s.id || s.spk_number,
            spk_number: s.spk_number || s.id,
            title: s.program_name || 'Dokumen SPK',
            partner: s.second_party || 'Mitra Pelaksana',
            partner_role: s.second_party_role || 'Mitra Pelaksana Lapangan',
            contact: s.contact_number || '-',
            location: `${s.location || 'Jawa Barat'}${s.province ? `, ${s.province}` : ''}`,
            nominal: s.budget_formatted || s.budget_amount || 'Rp 0',
            period: `${s.start_date || '-'} – ${s.end_date || '-'}`,
            status: s.status || 'Dalam pelaksanaan',
            status_note: s.status_note || '',
            file_type: s.file_type || 'PDF',
            file_size: s.file_size || '2.5 MB',
            file_name: s.file_name || undefined,
            file_url: s.file_url || undefined,
            scope_of_work: s.scope_of_work || '',
            target_output: s.target_output || '',
            payment_terms: s.payment_terms || '',
          }))
          setSpks(mapped)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadSpks()
  }, [])

  const handleApprove = async () => {
    if (!selectedSpk) return
    setIsSubmitting(true)
    try {
      await api.updateSpkStatus(selectedSpk.id, 'Selesai', reviewerNotes || 'SPK divalidasi dan disahkan Direktur Utama')
      notify(`SPK ${selectedSpk.spk_number || selectedSpk.id} berhasil disahkan!`)
      setSelectedSpk(null)
      loadSpks()
    } catch {
      notify('Gagal memperbarui status SPK.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dir-page">
      <div className="dir-header">
        <div className="dir-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/director" style={{ fontSize: '13px', color: '#078780', textDecoration: 'none', fontWeight: 600 }}>
              ← Kembali ke Dasbor Direktur
            </Link>
          </div>
          <h1 style={{ marginTop: '8px' }}>Approval SPK (Surat Perintah Kerja)</h1>
          <p>Tinjau dokumen berkas penugasan mitra kerja sama lapangan sebelum pengesahan.</p>
        </div>
      </div>

      <div className="dir-table-container">
        <div className="dir-table-header-row">
          <div className="dir-table-header-left">
            <h2>Dokumen SPK Terdaftar ({spks.length})</h2>
            <p>Draf dan dokumen SPK dari Divisi Program yang tersimpan di sistem.</p>
          </div>
        </div>

        <div className="dir-table-responsive">
          <table className="dir-table">
            <thead>
              <tr>
                <th>DOKUMEN SPK</th>
                <th>MITRA PELAKSANA</th>
                <th>WILAYAH</th>
                <th>NILAI ANGGARAN</th>
                <th>PERIODE</th>
                <th>BERKAS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>KEPUTUSAN</th>
              </tr>
            </thead>
            <tbody>
              {spks.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#79898a' }}>
                    Tidak ada dokumen SPK yang terdaftar di database.
                  </td>
                </tr>
              ) : (
                spks.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedSpk(item)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="dir-doc-cell">
                        <strong className="dir-doc-title">{item.title}</strong>
                        <span className="dir-doc-id">{item.spk_number || item.id}</span>
                      </div>
                    </td>
                    <td><span className="dir-type-cell">{item.partner}</span></td>
                    <td><span className="dir-unit-cell">{item.location}</span></td>
                    <td><strong className="dir-nominal-cell" style={{ color: '#078780' }}>{item.nominal}</strong></td>
                    <td><span style={{ fontSize: '12px', color: '#556667' }}>{item.period}</span></td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: item.file_url ? '#078780' : '#889999', fontWeight: 600 }}>
                        {item.file_name || (item.file_url ? 'Berkas Tersedia' : 'Metadata')}
                      </span>
                    </td>
                    <td>
                      <span className={`dir-status-cell ${item.status === 'Selesai' ? 'approved' : 'waiting'}`}>
                        <span className="dir-status-dot" style={{ background: item.status === 'Selesai' ? '#1f8448' : '#078780' }} />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="dir-btn-approve"
                        style={{ height: '32px', fontSize: '11.5px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSpk(item)
                        }}
                      >
                        Tinjau &amp; TTD
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Review Modal with Real Document Preview */}
      {selectedSpk && (
        <div className="dir-modal-overlay" onClick={() => setSelectedSpk(null)}>
          <div
            className="dir-modal-card"
            style={{ maxWidth: '960px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dir-modal-top">
              <div>
                <span className="dir-pill-count">{selectedSpk.spk_number || selectedSpk.id}</span>
                <h2 className="dir-modal-title" style={{ marginTop: '6px' }}>
                  {selectedSpk.title}
                </h2>
                <p className="dir-modal-sub">
                  Mitra: {selectedSpk.partner} • Nilai: {selectedSpk.nominal}
                </p>
              </div>
              <button
                type="button"
                className="dir-action-icon-btn"
                onClick={() => setSelectedSpk(null)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              <FileDownloadCard
                title={selectedSpk.title}
                docNumber={selectedSpk.spk_number || selectedSpk.id}
                category={`SPK • ${selectedSpk.partner}`}
                date={selectedSpk.period}
                location={selectedSpk.location}
                amount={selectedSpk.nominal}
                fileName={selectedSpk.file_name}
                fileUrl={selectedSpk.file_url}
                fileType={selectedSpk.file_type}
                fileSize={selectedSpk.file_size}
                notes={selectedSpk.scope_of_work || selectedSpk.target_output}
                isRab={false}
              />
            </div>

            <div className="dir-modal-actions" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="dir-btn-close"
                onClick={() => setSelectedSpk(null)}
              >
                Tutup
              </button>
              {selectedSpk.file_url && (
                <a
                  href={getFullUploadUrl(selectedSpk.file_url, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dir-btn-revise"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  Unduh Berkas
                </a>
              )}
              {selectedSpk.status !== 'Selesai' && (
                <button
                  type="button"
                  className="dir-btn-approve"
                  disabled={isSubmitting}
                  onClick={handleApprove}
                >
                  {isSubmitting ? 'Memproses...' : 'Sahkan & Tanda Tangani SPK'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
