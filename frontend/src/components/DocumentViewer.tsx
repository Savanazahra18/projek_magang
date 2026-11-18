'use client'

import { useEffect, useState } from 'react'
import { api, getFullUploadUrl } from '@/lib/api'

export interface PreviewData {
  filename?: string
  extension?: string
  size?: string
  previewType?: 'pdf' | 'docx' | 'xlsx' | 'image' | 'text' | 'download_only'
  url?: string
  blocks?: Array<{ type: 'heading' | 'paragraph' | 'table'; text?: string; rows?: string[][] }>
  sheets?: Array<{ name: string; rows: string[][] }>
  lines?: string[]
}

interface DocumentViewerProps {
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
  fileSize?: string | null
  fallbackTitle?: string
  fallbackCategory?: string
  fallbackDate?: string
  fallbackLocation?: string
  fallbackAmount?: string
  fallbackNotes?: string
  isRab?: boolean
}

export default function DocumentViewer({
  fileUrl,
  fileName,
  fileType,
  fileSize,
  fallbackTitle,
  fallbackCategory,
  fallbackDate,
  fallbackLocation,
  fallbackAmount,
  fallbackNotes,
  isRab = false,
}: DocumentViewerProps) {
  const [data, setData] = useState<PreviewData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeSheetIdx, setActiveSheetIdx] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(100)

  useEffect(() => {
    let ignore = false
    if (!fileUrl) {
      setData(null)
      return
    }

    setIsLoading(true)
    api
      .getUploadPreview(fileUrl)
      .then((res) => {
        if (!ignore) {
          setData(res)
          setActiveSheetIdx(0)
        }
      })
      .catch(() => {
        if (!ignore) {
          setData({
            previewType: 'download_only',
            url: fileUrl,
            filename: fileName || fileUrl.split('/').pop(),
            extension: fileType || 'FILE',
            size: fileSize || '',
          })
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [fileUrl, fileName, fileType, fileSize])

  const displayName: string =
    data?.filename || fileName || (fileUrl ? fileUrl.split('/').pop()?.split('?')[0] || 'dokumen.pdf' : `${fallbackTitle || 'dokumen'}.pdf`)
  const displayExt = (data?.extension || fileType || displayName.split('.').pop() || 'PDF').toUpperCase()
  const displaySize = data?.size || fileSize || ''
  const directFileUrl = fileUrl ? getFullUploadUrl(fileUrl, false) : ''
  const downloadUrl = fileUrl ? getFullUploadUrl(fileUrl, true) : ''

  // Fallback view when no real physical file is uploaded yet
  if (!fileUrl) {
    return (
      <div className="doc-viewer-container">
        <div className="doc-viewer-topbar">
          <div className="doc-viewer-meta">
            <strong>Pratinjau Dokumen (Belum Ada Berkas Fisik)</strong>
            <small>Menampilkan metadata pengajuan dari sistem</small>
          </div>
        </div>

        <div className="doc-viewer-body fallback-paper">
          <div className="app-dss-paper">
            <div className="app-dss-paper-brand">
              <span className="app-dss-brand-name">RELAWAN NUSANTARA</span>
              <span className="app-dss-brand-badge" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                Pratinjau Metadata
              </span>
            </div>

            <div className="app-dss-paper-rule" />

            <div>
              <span className="app-dss-paper-category">
                {isRab ? 'RENCANA ANGGARAN BIAYA' : `PROPOSAL PROGRAM • ${(fallbackCategory || 'UMUM').toUpperCase()}`}
              </span>
              <h2 className="app-dss-paper-heading">{fallbackTitle}</h2>
              <span className="app-dss-paper-date">{fallbackDate || '12 Nov 2026'}</span>
            </div>

            <div className="app-dss-paper-infobox">
              <div className="app-dss-infobox-item">
                <span className="lbl">Divisi Pengaju</span>
                <strong className="val">{fallbackCategory || 'Divisi Program'}</strong>
              </div>
              <div className="app-dss-infobox-item">
                <span className="lbl">Lokasi Program</span>
                <strong className="val">{fallbackLocation || 'Kab. Bandung, Jawa Barat'}</strong>
              </div>
              {fallbackAmount && (
                <div className="app-dss-infobox-item">
                  <span className="lbl">Total Anggaran</span>
                  <strong className="val" style={{ color: '#078780' }}>{fallbackAmount}</strong>
                </div>
              )}
            </div>

            {fallbackNotes && (
              <div className="app-dss-paper-catatan" style={{ marginTop: 16 }}>
                <strong>Catatan / Ringkasan Pengajuan:</strong>
                <span>{fallbackNotes}</span>
              </div>
            )}

            <div className="doc-viewer-notice-empty">
              ℹ️ Pengaju belum melampirkan berkas fisik (.pdf / .docx / .xlsx). Dokumen di atas disusun dari metadata form.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="doc-viewer-container">
      {/* Top Header with File Meta and Download Action */}
      <div className="doc-viewer-topbar">
        <div className="doc-viewer-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="doc-viewer-badge-ext">{displayExt}</span>
            <strong className="doc-viewer-filename" title={displayName}>
              {displayName}
            </strong>
          </div>
          <small>
            {displaySize ? `${displaySize} • ` : ''}Tersimpan di server backend (PostgreSQL / uploads)
          </small>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-dss-unduh-btn"
            style={{ textDecoration: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Unduh Berkas</span>
          </a>
        </div>
      </div>

      {/* Control bar for Zoom and Sheets */}
      <div className="doc-viewer-controls">
        <div className="doc-viewer-ctrl-group">
          {data?.previewType === 'xlsx' && data.sheets && data.sheets.length > 1 && (
            <div className="doc-viewer-tabs">
              {data.sheets.map((sheet, sIdx) => (
                <button
                  key={sheet.name + sIdx}
                  type="button"
                  className={`doc-viewer-tab-btn ${activeSheetIdx === sIdx ? 'active' : ''}`}
                  onClick={() => setActiveSheetIdx(sIdx)}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          )}
          {(!data?.sheets || data.sheets.length <= 1) && (
            <span style={{ fontSize: '12px', color: '#556667', fontWeight: 600 }}>
              Pratinjau Isi Dokumen Pengaju
            </span>
          )}
        </div>

        <div className="doc-viewer-ctrl-group">
          <button
            type="button"
            className="app-dss-ctrl-btn"
            onClick={() => setZoom((z) => Math.max(70, z - 10))}
            title="Perkecil zoom"
          >
            -
          </button>
          <span style={{ fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
          <button
            type="button"
            className="app-dss-ctrl-btn"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            title="Perbesar zoom"
          >
            +
          </button>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
          <a
            href={directFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-dss-ctrl-btn"
            title="Buka berkas di tab baru"
            style={{ textDecoration: 'none' }}
          >
            ⛶
          </a>
        </div>
      </div>

      {/* Content Rendering Body */}
      <div className="doc-viewer-body">
        {isLoading ? (
          <div className="doc-viewer-loading">
            <div className="doc-viewer-spinner" />
            <span>Membaca isi berkas yang diunggah...</span>
          </div>
        ) : data?.previewType === 'pdf' ? (
          <div className="doc-viewer-pdf-frame">
            <iframe
              src={`${directFileUrl}#toolbar=0`}
              title={displayName}
              style={{ width: '100%', height: '640px', border: 0 }}
            />
          </div>
        ) : data?.previewType === 'image' ? (
          <div className="doc-viewer-image-wrap" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <img src={directFileUrl} alt={displayName} style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          </div>
        ) : data?.previewType === 'docx' && data.blocks && data.blocks.length > 0 ? (
          <div className="doc-viewer-paper" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <div className="doc-viewer-docx-content">
              {data.blocks.map((block, bIdx) => {
                if (block.type === 'heading') {
                  return (
                    <h3 key={bIdx} className="doc-viewer-docx-heading">
                      {block.text}
                    </h3>
                  )
                }
                if (block.type === 'table' && block.rows) {
                  return (
                    <div key={bIdx} className="doc-viewer-table-responsive">
                      <table className="doc-viewer-docx-table">
                        <tbody>
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx === 0 ? 'head-row' : ''}>
                              {row.map((cell, cIdx) =>
                                rIdx === 0 ? (
                                  <th key={cIdx}>{cell}</th>
                                ) : (
                                  <td key={cIdx}>{cell}</td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                return (
                  <p key={bIdx} className="doc-viewer-docx-paragraph">
                    {block.text}
                  </p>
                )
              })}
            </div>
          </div>
        ) : data?.previewType === 'xlsx' && data.sheets && data.sheets.length > 0 ? (
          <div className="doc-viewer-paper" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <div className="doc-viewer-table-responsive">
              <table className="doc-viewer-xlsx-table">
                <tbody>
                  {(data.sheets[activeSheetIdx]?.rows || []).map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx === 0 ? 'head-row' : ''}>
                      <td className="row-num">{rIdx + 1}</td>
                      {row.map((cell, cIdx) =>
                        rIdx === 0 ? (
                          <th key={cIdx}>{cell || '—'}</th>
                        ) : (
                          <td key={cIdx}>{cell || '—'}</td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : data?.previewType === 'text' && data.lines ? (
          <div className="doc-viewer-paper" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <pre className="doc-viewer-text-content">
              {data.lines.join('\n')}
            </pre>
          </div>
        ) : (
          <div className="doc-viewer-fallback-download">
            <div className="doc-viewer-fallback-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#078780" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h4 style={{ margin: '12px 0 4px', fontSize: 16, color: '#172324' }}>{displayName}</h4>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#687879' }}>
              Format {displayExt} ({displaySize || 'Berkas Asli'}) berhasil diunggah oleh pengaju.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="app-dss-btn-approve"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', textDecoration: 'none' }}
            >
              Unduh Berkas Lengkap
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="doc-viewer-footer">
        <span>Berkas asli dari pengaju • {displayName}</span>
        <span>{displayExt}</span>
      </div>
    </div>
  )
}

