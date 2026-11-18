'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/common/Icons'

const moduleTitles: Record<string, string> = {
  mipro: 'Memo Internal Project (MIPro)',
  dss: 'Decision Support System (DSS)',
  spk: 'Surat Perintah Kerja (SPK)',
  'laporan-ca': 'Laporan & Cash Advance (CA)',
  'laporan-final': 'Laporan Final Program',
}

export default function GenericModulePage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const title = moduleTitles[slug] || slug.toUpperCase()

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e9ea',
        borderRadius: 14,
        padding: '50px 32px',
        textAlign: 'center',
        maxWidth: 720,
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: '#e6f4f2',
          color: '#0b8a80',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name="layers" size={28} />
      </div>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#172324', marginBottom: 8 }}>
          Modul {title}
        </h1>
        <p style={{ color: '#6f7d7e', fontSize: 13, lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
          Halaman ini sedang dalam tahap integrasi dengan alur program Relawan Nusantara. Anda dapat mengakses data program melalui Dashboard atau Request Program.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Link href="/dashboard" className="db-btn db-btn-primary">
          <Icon name="grid" size={16} />
          <span>Kembali ke Dashboard</span>
        </Link>
        <Link href="/dashboard/request-program" className="db-btn db-btn-outline">
          <Icon name="inbox" size={16} />
          <span>Lihat Request Program</span>
        </Link>
      </div>
    </div>
  )
}

