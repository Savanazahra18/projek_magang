'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'

export default function FinanceDashboard() {
  const { notify } = useDashboard()

  const [rabs, setRabs] = useState<any[]>([])
  const [spks, setSpks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getDssEvaluations().catch(() => null),
      api.getSpkList().catch(() => null),
    ])
      .then(([dssRes, spkRes]) => {
        if (Array.isArray(dssRes?.evaluations)) {
          setRabs(dssRes.evaluations)
        }
        const sList = spkRes?.spks || spkRes?.data
        if (Array.isArray(sList)) {
          setSpks(sList)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  // KPI Calculations
  const stats = useMemo(() => {
    const parseNominal = (str: string) => {
      const digits = String(str || '').replace(/\D/g, '')
      return digits ? parseInt(digits, 10) : 0
    }

    const totalRABAmount = rabs.reduce((acc, r) => acc + parseNominal(r.estimated_budget), 0)
    const pendingRAB = rabs.filter((r) => (r.status || '').toLowerCase().includes('telaah'))
    const approvedRAB = rabs.filter((r) => (r.status || '').toLowerCase().includes('setuju'))

    const totalSPKAmount = spks.reduce((acc, s) => acc + parseNominal(s.budget_amount || s.budget_formatted || s.budget), 0)
    const activeSPK = spks.filter((s) => s.status === 'Dalam pelaksanaan')

    const formatRp = (num: number) => {
      if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)} M`
      if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)} Jt`
      return `Rp ${num.toLocaleString('id-ID')}`
    }

    return {
      totalRABCount: rabs.length,
      totalRABNominal: formatRp(totalRABAmount),
      pendingRABCount: pendingRAB.length,
      approvedRABCount: approvedRAB.length,
      totalSPKCount: spks.length,
      totalSPKNominal: formatRp(totalSPKAmount),
      activeSPKCount: activeSPK.length,
    }
  }, [rabs, spks])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#172324', margin: 0 }}>
            Dasbor Divisi Keuangan
          </h1>
          <p style={{ fontSize: '13px', color: '#697879', margin: '4px 0 0' }}>
            Kelola verifikasi dana masuk, pencairan anggaran, audit kuitansi CA, fiksasi sumber dana, dan persetujuan RAB.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href="/finance/review-approval-rab"
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '8px',
              background: '#078780',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(7,135,128,0.25)',
            }}
          >
            <span>Review &amp; Approval RAB</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Navigasi 5 Modul Utama Keuangan */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '12px',
        }}
      >
        <Link
          href="/finance/verifikasi-dana-masuk"
          style={{
            background: '#ffffff',
            border: '1px solid #dfe6e7',
            borderRadius: '10px',
            padding: '14px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontSize: '20px' }}>📥</span>
          <strong style={{ fontSize: '13.5px', color: '#172324' }}>Verifikasi Dana Masuk</strong>
          <small style={{ fontSize: '11px', color: '#697879' }}>Mutasi bank, donasi CSR &amp; campaign</small>
        </Link>

        <Link
          href="/finance/pencairan-anggaran"
          style={{
            background: '#ffffff',
            border: '1px solid #dfe6e7',
            borderRadius: '10px',
            padding: '14px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontSize: '20px' }}>💸</span>
          <strong style={{ fontSize: '13.5px', color: '#172324' }}>Pencairan Anggaran</strong>
          <small style={{ fontSize: '11px', color: '#697879' }}>Eksekusi transfer termin SPK</small>
        </Link>

        <Link
          href="/finance/verifikasi-bukti-ca"
          style={{
            background: '#ffffff',
            border: '1px solid #dfe6e7',
            borderRadius: '10px',
            padding: '14px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontSize: '20px' }}>🧾</span>
          <strong style={{ fontSize: '13.5px', color: '#172324' }}>Verifikasi Bukti CA</strong>
          <small style={{ fontSize: '11px', color: '#697879' }}>Audit kuitansi &amp; rekonsiliasi kasbon</small>
        </Link>

        <Link
          href="/finance/fiksasi-sumber-dana"
          style={{
            background: '#ffffff',
            border: '1px solid #dfe6e7',
            borderRadius: '10px',
            padding: '14px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontSize: '20px' }}>🔒</span>
          <strong style={{ fontSize: '13.5px', color: '#172324' }}>Fiksasi Sumber Dana</strong>
          <small style={{ fontSize: '11px', color: '#697879' }}>Penguncian alokasi sumber dana program</small>
        </Link>

        <Link
          href="/finance/review-approval-rab"
          style={{
            background: '#ffffff',
            border: '1px solid #dfe6e7',
            borderRadius: '10px',
            padding: '14px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <span style={{ fontSize: '20px' }}>📊</span>
          <strong style={{ fontSize: '13.5px', color: '#172324' }}>Review &amp; Approval RAB</strong>
          <small style={{ fontSize: '11px', color: '#697879' }}>Evaluasi &amp; pengesahan pos biaya</small>
        </Link>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #dfe6e7', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#687879', fontWeight: 600 }}>Menunggu Review RAB</span>
          <strong style={{ fontSize: '24px', color: '#b45309', fontWeight: 700 }}>{stats.pendingRABCount} Pengajuan</strong>
          <small style={{ fontSize: '11.5px', color: '#889999' }}>RAB menunggu telaah kelayakan pagu</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #dfe6e7', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#687879', fontWeight: 600 }}>Total Alokasi Anggaran</span>
          <strong style={{ fontSize: '24px', color: '#078780', fontWeight: 700 }}>{stats.totalRABNominal}</strong>
          <small style={{ fontSize: '11.5px', color: '#889999' }}>Dari {stats.totalRABCount} berkas RAB tersimpan</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #dfe6e7', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#687879', fontWeight: 600 }}>SPK Siap Dicairkan</span>
          <strong style={{ fontSize: '24px', color: '#172324', fontWeight: 700 }}>{stats.activeSPKCount} Dokumen</strong>
          <small style={{ fontSize: '11.5px', color: '#889999' }}>Total komitmen {stats.totalSPKNominal}</small>
        </div>

        <div style={{ background: '#078780', color: '#ffffff', borderRadius: '12px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#d2f4f2', fontWeight: 600 }}>RAB Telah Disahkan</span>
          <strong style={{ fontSize: '24px', color: '#ffffff', fontWeight: 700 }}>{stats.approvedRABCount} Berkas</strong>
          <small style={{ fontSize: '11.5px', color: '#d2f4f2' }}>Siap proses pencairan dana termin</small>
        </div>
      </div>

      {/* Tables Row: Recent RAB & Recent SPK */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '18px' }}>
        {/* Card 1: Review RAB Terbaru */}
        <div style={{ background: '#ffffff', border: '1px solid #dfe6e7', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#172324', margin: 0 }}>Pengajuan RAB Terbaru</h2>
              <p style={{ fontSize: '12px', color: '#79898a', margin: '3px 0 0' }}>Daftar rencana anggaran biaya masuk dari Divisi Program</p>
            </div>
            <Link href="/finance/review-approval-rab" style={{ fontSize: '12px', color: '#078780', fontWeight: 600, textDecoration: 'none' }}>
              Lihat semua →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rabs.slice(0, 5).map((rab) => (
              <div
                key={rab.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#fbfdfd',
                  border: '1px solid #edf2f2',
                  borderRadius: '8px',
                  gap: '12px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#172324', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rab.title}
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#79898a' }}>
                    {rab.id} • {rab.division || rab.category || 'Divisi Program'}
                  </span>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#078780' }}>
                    {rab.estimated_budget}
                  </strong>
                  <span
                    style={{
                      fontSize: '10.5px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: rab.status?.includes('setuju') ? '#dcfce7' : '#fef3c7',
                      color: rab.status?.includes('setuju') ? '#166534' : '#92400e',
                      fontWeight: 600,
                    }}
                  >
                    {rab.status}
                  </span>
                </div>
              </div>
            ))}

            {rabs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#79898a', fontSize: '13px' }}>
                Belum ada pengajuan RAB di database.
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Penyaluran Dana SPK */}
        <div style={{ background: '#ffffff', border: '1px solid #dfe6e7', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#172324', margin: 0 }}>Komitmen Pencairan Anggaran</h2>
              <p style={{ fontSize: '12px', color: '#79898a', margin: '3px 0 0' }}>Dokumen SPK untuk penyaluran dana ke mitra pelaksana</p>
            </div>
            <Link href="/finance/pencairan-anggaran" style={{ fontSize: '12px', color: '#078780', fontWeight: 600, textDecoration: 'none' }}>
              Lihat semua →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {spks.slice(0, 5).map((spk) => (
              <div
                key={spk.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#fbfdfd',
                  border: '1px solid #edf2f2',
                  borderRadius: '8px',
                  gap: '12px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#172324', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {spk.program_name || spk.title}
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#79898a' }}>
                    {spk.spk_number || spk.id} • Mitra: {spk.second_party || spk.partner || 'Mitra Lapangan'}
                  </span>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#078780' }}>
                    {spk.budget_formatted || spk.budget_amount || 'Rp 0'}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#556667' }}>
                    {spk.status}
                  </span>
                </div>
              </div>
            ))}

            {spks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#79898a', fontSize: '13px' }}>
                Belum ada dokumen SPK yang terdaftar di database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
