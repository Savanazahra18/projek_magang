'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Icon, IconName } from '@/components/common/Icons'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'

/* ==========================================================
   DATA AWAL DASHBOARD (SELARAS DATABASE)
   ========================================================== */
const summaries = [
  { title: 'Total Assesment', value: 0, unit: 'Assesment', note: '0 data tersimpan', emoji: '🧑‍💼' },
  { title: 'Total Proposal', value: 0, unit: 'Proposal', note: '0 proposal sedang diajukan', emoji: '📝' },
  { title: 'Total MIPro', value: 0, unit: 'Memo Internal Project', note: '0 proyek terdata', emoji: '📂' },
  { title: 'Total DSS', value: 0, unit: 'Decision Support System', note: '0 menunggu telaah', emoji: '🧮' },
  { title: 'Total SPK', value: 0, unit: 'Surat Perintah Kerja', note: '0 dalam pelaksanaan', emoji: '🛠️' },
  { title: 'Request Program', value: 0, unit: 'Permohonan Masuk', note: '0 antrean permohonan', emoji: '📥' },
  { title: 'Laporan & CA', value: 0, unit: 'Cash Advance & Realisasi', note: '0 laporan berkala', emoji: '📱' },
  { title: 'Laporan Final', value: 0, unit: 'Dokumentasi Akhir', note: '0 laporan akhir', emoji: '📄' },
]

type Status = 'Berjalan' | 'Perlu revisi' | 'Review' | 'Selesai' | 'Pengajuan'
type Program = {
  id: string
  name: string
  location: string
  category: string
  stage: string
  progress: number
  due: string
  status: Status
  group: 'berjalan' | 'pengajuan' | 'selesai'
}

const programs: Program[] = []

const statusTone: Record<Status, string> = {
  Berjalan: 'teal',
  'Perlu revisi': 'orange',
  Review: 'yellow',
  Selesai: 'green',
  Pengajuan: 'blue',
}

const tasks: { id?: number | string; title: string; program: string; action: string; due: string; urgent: boolean }[] = []

const activities: { id?: number | string; title: string; meta: string; time: string; icon: IconName }[] = []

const PER_PAGE = 3
const periods = ['Oktober 2026', 'September 2026', 'Agustus 2026']

/* ==========================================================
   HALAMAN UTAMA DASHBOARD
   ========================================================== */
export default function DashboardHomePage() {
  const { notify, setSubCrumbs } = useDashboard()

  const [tab, setTab] = useState<'semua' | 'berjalan' | 'pengajuan'>('semua')
  const [stageFilter, setStageFilter] = useState('Semua tahapan')
  const [filterOpen, setFilterOpen] = useState(false)
  const [period, setPeriod] = useState(periods[0])
  const [periodOpen, setPeriodOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [today, setToday] = useState('Kamis, 29 Oktober 2026')
  const [greeting, setGreeting] = useState('pagi')
  const [liveSummaries, setLiveSummaries] = useState(summaries)
  const [livePrograms, setLivePrograms] = useState(programs)
  const [liveTasks, setLiveTasks] = useState(tasks)
  const [liveActivities, setLiveActivities] = useState(activities)

  // Pastikan breadcrumb berada di level Dashboard
  useEffect(() => {
    setSubCrumbs([])
  }, [setSubCrumbs])

  // Sync with live PostgreSQL backend
  useEffect(() => {
    Promise.all([
      api.getDashboardSummary().catch(() => null),
      api.getDashboardPrograms().catch(() => null),
      api.getDashboardTasks().catch(() => null),
      api.getDashboardActivities().catch(() => null),
    ]).then(([sumRes, progRes, taskRes, actRes]) => {
      if (Array.isArray(sumRes?.summaries)) setLiveSummaries(sumRes.summaries)
      if (Array.isArray(progRes?.programs)) setLivePrograms(progRes.programs)
      if (Array.isArray(taskRes?.tasks)) setLiveTasks(taskRes.tasks)
      if (Array.isArray(actRes?.activities)) setLiveActivities(actRes.activities)
    })
  }, [])

  // Indikator scroll kartu ringkasan
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ width: 30, left: 0 })

  const updateThumb = () => {
    const el = scrollRef.current
    if (!el) return
    const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100)
    const max = el.scrollWidth - el.clientWidth
    const ratio = max > 0 ? el.scrollLeft / max : 0
    setThumb({ width, left: ratio * (100 - width) })
  }

  useEffect(() => {
    const now = new Date()
    const formatted = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now)
    setToday(formatted)
    const h = now.getHours()
    setGreeting(h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam')

    updateThumb()
    window.addEventListener('resize', updateThumb)
    return () => window.removeEventListener('resize', updateThumb)
  }, [])

  const counts = useMemo(
    () => ({
      semua: livePrograms.length,
      berjalan: livePrograms.filter((p) => p.group === 'berjalan').length,
      pengajuan: livePrograms.filter((p) => p.group === 'pengajuan').length,
      selesai: livePrograms.filter((p) => p.group === 'selesai' || p.status === 'Selesai').length,
    }),
    [livePrograms]
  )

  const stages = useMemo(() => ['Semua tahapan', ...Array.from(new Set(livePrograms.map((p) => p.stage)))], [livePrograms])

  const filtered = useMemo(
    () =>
      livePrograms.filter(
        (p) =>
          (tab === 'semua' || p.group === tab) &&
          (stageFilter === 'Semua tahapan' || p.stage === stageFilter) &&
          `${p.name} ${p.id} ${p.location} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [livePrograms, tab, stageFilter, query]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const statusSummary = [
    { label: 'Dalam pengajuan', value: counts.pengajuan, tone: 'light' },
    { label: 'Sedang berjalan', value: counts.berjalan, tone: 'mid' },
    { label: 'Selesai', value: counts.selesai, tone: 'dark' },
  ]
  const statusTotal = statusSummary.reduce((s, x) => s + x.value, 0)
  const urgentTaskCount = liveTasks.filter((t) => t.urgent).length

  return (
    <>
      {/* Heading */}
      <section className="db-heading">
        <div>
          <small>{today}</small>
          <h1>Selamat {greeting}, Cikipi.</h1>
          <p>Pantau progres program dan tindak lanjut prioritas Anda hari ini.</p>
        </div>
        <div className="db-heading-actions">
          <div className="db-dropdown">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() => setPeriodOpen(!periodOpen)}
            >
              <Icon name="calendar" size={16} />
              <span>{period}</span>
            </button>
            {periodOpen && (
              <div className="db-menu">
                {periods.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={p === period ? 'selected' : ''}
                    onClick={() => {
                      setPeriod(p)
                      setPeriodOpen(false)
                    }}
                  >
                    {p}
                    {p === period && <Icon name="check" size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/dashboard/proposal" className="db-btn db-btn-primary">
            <Icon name="plus" size={17} />
            <span>Buat proposal</span>
          </Link>
        </div>
      </section>

      {/* Summary cards track */}
      <section className="db-summary">
        <div className="db-summary-track" ref={scrollRef} onScroll={updateThumb}>
          {liveSummaries.map((s, idx) => (
            <article key={`sum-${s.title}-${idx}`} className="db-kpi">
              <div className="db-kpi-head">
                <span>{s.title}</span>
                <span className="db-kpi-emoji" aria-hidden="true">{s.emoji}</span>
              </div>
              <div className="db-kpi-value">
                <strong>{s.value}</strong>
                <span>{s.unit}</span>
              </div>
              <button
                type="button"
                className="db-kpi-note"
                onClick={() => notify(s.note)}
              >
                {s.note}
              </button>
            </article>
          ))}
        </div>
        <div className="db-scroll-hint">
          <span>Geser untuk melihat semua ringkasan</span>
          <div className="db-scroll-bar">
            <i style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }} />
          </div>
        </div>
      </section>

      {/* Grid 2 Kolom */}
      <div className="db-grid">
        <div className="db-col">
          {/* Program saya */}
          <section className="db-card">
            <div className="db-card-head">
              <div>
                <h2>Program saya</h2>
                <p>Kelola seluruh tahapan program dalam satu tempat.</p>
              </div>
              <button
                type="button"
                className="db-link"
                onClick={() => {
                  setTab('semua')
                  setStageFilter('Semua tahapan')
                  setQuery('')
                  setPage(1)
                }}
              >
                Lihat semua <Icon name="arrowRight" size={15} />
              </button>
            </div>

            <div className="db-toolbar">
              <div className="db-tabs">
                {([
                  ['semua', `Semua (${counts.semua})`],
                  ['berjalan', `Berjalan (${counts.berjalan})`],
                  ['pengajuan', `Pengajuan (${counts.pengajuan})`],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={tab === key ? 'active' : ''}
                    onClick={() => {
                      setTab(key)
                      setPage(1)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="db-dropdown">
                <button
                  type="button"
                  className={`db-filter ${stageFilter !== 'Semua tahapan' ? 'on' : ''}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Icon name="sliders" size={15} />
                  <span>{stageFilter === 'Semua tahapan' ? 'Filter' : stageFilter}</span>
                </button>
                {filterOpen && (
                  <div className="db-menu right">
                    {stages.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={s === stageFilter ? 'selected' : ''}
                        onClick={() => {
                          setStageFilter(s)
                          setFilterOpen(false)
                          setPage(1)
                        }}
                      >
                        {s}
                        {s === stageFilter && <Icon name="check" size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>NAMA PROGRAM</th>
                    <th>TAHAPAN</th>
                    <th>PROGRES</th>
                    <th>TENGGAT</th>
                    <th>STATUS</th>
                    <th aria-label="Aksi" />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p, idx) => (
                    <tr
                      key={p.id ? `prog-${p.id}` : `prog-${idx}`}
                      onClick={() => notify(`Membuka detail program ${p.name}.`)}
                    >
                      <td>
                        <strong>{p.name}</strong>
                        <small>{p.id} • {p.location} • {p.category}</small>
                      </td>
                      <td>{p.stage}</td>
                      <td>
                        <div className="db-progress">
                          <b>{p.progress}%</b>
                          <span><i style={{ width: `${p.progress}%` }} /></span>
                        </div>
                      </td>
                      <td>{p.due}</td>
                      <td>
                        <span className={`db-badge ${statusTone[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="db-chevron">
                        <Icon name="chevronRight" size={17} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visible.length === 0 && (
                <div className="db-empty">
                  <Icon name="search" size={22} />
                  <b>Program tidak ditemukan</b>
                  <span>Coba ubah kata kunci, tab, atau filter tahapan.</span>
                </div>
              )}
            </div>

            <div className="db-pagination">
              <span>Menampilkan {visible.length} dari {filtered.length} program</span>
              <div>
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <Icon name="chevronLeft" size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === currentPage ? 'current' : ''}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Berikutnya"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <Icon name="chevronRight" size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* Aktivitas terbaru */}
          <section className="db-card">
            <div className="db-card-head compact">
              <h2>Aktivitas terbaru</h2>
              <span className="db-muted">Hari ini</span>
            </div>
            <ul className="db-activity">
              {liveActivities.map((a, idx) => (
                <li key={a.id ? `act-${a.id}` : `act-${idx}-${a.title}`}>
                  <span className="db-activity-icon">
                    <Icon name={a.icon} size={16} />
                  </span>
                  <div>
                    <strong>{a.title}</strong>
                    <small>{a.meta}</small>
                  </div>
                  <time>{a.time}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="db-col">
          {/* Perlu perhatian */}
          <section className="db-card db-pad">
            <div className="db-side-head">
              <h2>Perlu perhatian</h2>
              <span className="db-badge orange solid">{liveTasks.length} tugas</span>
            </div>
            <div className="db-alert">
              <Icon name="clock" size={15} />
              <span>{urgentTaskCount} tugas mendekati tenggat waktu</span>
            </div>
            <ul className="db-tasks">
              {liveTasks.map((t, idx) => (
                <li key={t.id ? `task-${t.id}` : `task-${idx}-${t.title}`}>
                  <div className="db-task-top">
                    <strong>{t.title}</strong>
                    <span className={`db-badge ${t.urgent ? 'orange solid' : 'gray'}`}>
                      {t.due}
                    </span>
                  </div>
                  <small>{t.program}</small>
                  <button
                    type="button"
                    className="db-link"
                    onClick={() => notify(`${t.action} — ${t.program}`)}
                  >
                    {t.action} <Icon name="arrowRight" size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="db-btn db-btn-outline full"
              onClick={() => notify(`Menampilkan seluruh ${liveTasks.length} tugas.`)}
            >
              Lihat semua tugas
            </button>
          </section>

          {/* Status program */}
          <section className="db-card db-pad">
            <h2 className="db-side-title">Status program</h2>
            <p className="db-muted">Distribusi {statusTotal} program Anda</p>
            <div className="db-stack">
              {statusSummary.map((s) => (
                <i
                  key={s.label}
                  className={s.tone}
                  style={{ width: `${statusTotal > 0 ? (s.value / statusTotal) * 100 : 0}%` }}
                />
              ))}
            </div>
            <ul className="db-legend">
              {statusSummary.map((s) => (
                <li key={s.label}>
                  <i className={s.tone} />
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                  <small>{statusTotal > 0 ? Math.round((s.value / statusTotal) * 100) : 0}%</small>
                </li>
              ))}
            </ul>
            <div className="db-trend">
              <Icon name="trend" size={16} />
              <span>{counts.selesai} program selesai pada bulan ini</span>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
