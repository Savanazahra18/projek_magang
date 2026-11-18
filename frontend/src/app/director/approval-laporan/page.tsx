'use client'

export default function ApprovalLaporanPage() {
  return (
    <div className="dir-page">
      <div className="dir-header">
        <div className="dir-header-title">
          <h1>Approval Laporan</h1>
          <p>Tinjau laporan program dan laporan keuangan dari Divisi Program sebelum memberikan persetujuan.</p>
        </div>
      </div>

      <div className="dir-table-container">
        <div className="dir-table-header-row">
          <div className="dir-table-header-left">
            <h2>Daftar laporan</h2>
            <p>Laporan yang diajukan Divisi Program akan tampil di sini.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#79898a', fontSize: '13px' }}>
          Belum ada laporan yang menunggu persetujuan.
        </div>
      </div>
    </div>
  )
}

