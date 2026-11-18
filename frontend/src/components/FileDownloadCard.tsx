'use client'

import { getFullUploadUrl } from '@/lib/api'

interface FileDownloadCardProps {
  title: string
  docNumber: string
  category?: string
  date?: string
  location?: string
  amount?: string
  fileName?: string | null
  fileUrl?: string | null
  fileType?: string | null
  fileSize?: string | null
  notes?: string | null
  isRab?: boolean
}

export default function FileDownloadCard({
  title,
  docNumber,
  category,
  date,
  location,
  amount,
  fileName,
  fileUrl,
  fileType,
  fileSize,
  notes,
  isRab = false,
}: FileDownloadCardProps) {
  const cleanExt = (fileType || (fileName ? fileName.split('.').pop() : 'PDF') || 'PDF').toUpperCase()
  const cleanName = fileName || (fileUrl ? fileUrl.split('/').pop()?.split('?')[0] : `${title.replace(/\s+/g, '_')}.${cleanExt.toLowerCase()}`)
  const cleanSize = fileSize || '2.4 MB'
  const downloadUrl = fileUrl ? getFullUploadUrl(fileUrl, true) : ''
  const viewUrl = fileUrl ? getFullUploadUrl(fileUrl, false) : ''

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dfe6e7',
        borderRadius: '12px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 1px 4px rgba(15, 40, 40, 0.04)',
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #edf2f2', paddingBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#078780', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#eef6f5', padding: '3px 8px', borderRadius: '4px', marginBottom: '6px' }}>
            {isRab ? 'Berkas Rencana Anggaran Biaya (RAB)' : 'Berkas Pengajuan Proposal'}
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#172324', margin: '4px 0 2px' }}>{title}</h2>
          <span style={{ fontSize: '12.5px', color: '#79898a' }}>{docNumber} • {category || 'Divisi Program'}</span>
        </div>

        {date && (
          <span style={{ fontSize: '12px', color: '#79898a', background: '#f5f8f8', padding: '4px 10px', borderRadius: '6px' }}>
            Tanggal: <strong>{date}</strong>
          </span>
        )}
      </div>

      {/* Main File Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px',
          background: '#f8fafb',
          border: '1.5px solid #dbe6e5',
          borderRadius: '10px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              background: '#078780',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            {cleanExt.slice(0, 4)}
          </div>

          <div style={{ minWidth: 0 }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#172324', wordBreak: 'break-all' }}>
              {cleanName}
            </strong>
            <span style={{ fontSize: '12px', color: '#687879' }}>
              Format {cleanExt} • {cleanSize} • {fileUrl ? 'Tersimpan di server' : 'Belum diunggah'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {fileUrl ? (
            <>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  border: '1px solid #c9d8d7',
                  background: '#ffffff',
                  color: '#344546',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                }}
              >
                Buka di Tab Baru ↗
              </a>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#078780',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(7,135,128,0.25)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduh File</span>
              </a>
            </>
          ) : (
            <span style={{ fontSize: '12.5px', color: '#b45309', background: '#fef3c7', padding: '6px 12px', borderRadius: '6px', fontWeight: 500 }}>
              File fisik belum dilampirkan pengaju
            </span>
          )}
        </div>
      </div>

      {/* Metadata Detail Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          background: '#fafcfc',
          padding: '14px 16px',
          borderRadius: '8px',
          border: '1px solid #edf1f1',
          fontSize: '12.5px',
        }}
      >
        <div>
          <span style={{ color: '#79898a', display: 'block', fontSize: '11px' }}>Wilayah Sasaran</span>
          <strong style={{ color: '#172324' }}>{location || 'Kab. Bandung, Jawa Barat'}</strong>
        </div>

        {amount && (
          <div>
            <span style={{ color: '#79898a', display: 'block', fontSize: '11px' }}>Estimasi Anggaran</span>
            <strong style={{ color: '#078780', fontSize: '13.5px' }}>{amount}</strong>
          </div>
        )}

        <div>
          <span style={{ color: '#79898a', display: 'block', fontSize: '11px' }}>Status Berkas</span>
          <strong style={{ color: fileUrl ? '#1f8448' : '#b45309' }}>
            {fileUrl ? 'Siap Diunduh' : 'Menunggu Lampiran'}
          </strong>
        </div>
      </div>

      {notes && (
        <div style={{ background: '#fbfcfc', border: '1px solid #eef2f2', borderRadius: '8px', padding: '12px 14px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334445', display: 'block', marginBottom: '4px' }}>
            Catatan / Keterangan Pengajuan:
          </span>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#556667', lineHeight: 1.5 }}>{notes}</p>
        </div>
      )}
    </div>
  )
}

