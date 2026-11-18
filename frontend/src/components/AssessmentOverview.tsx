'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'

export interface AssessmentCategory {
  id: string
  tag: string
  title: string
  desc: string
  image: string
}

export const assessmentCategories: AssessmentCategory[] = [
  {
    id: 'jembatan',
    tag: 'Infrastruktur',
    title: 'Assessment Jembatan',
    desc: 'Tinjau kondisi struktur dan akses warga untuk menentukan kebutuhan perbaikan.',
    image: '/images/assessment/jembatan.jpg',
  },
  {
    id: 'masjid',
    tag: 'Sarana ibadah',
    title: 'Assessment Masjid',
    desc: 'Petakan kondisi masjid, fasilitas ibadah, dan kebutuhan jamaah setempat.',
    image: '/images/assessment/masjid.jpg',
  },
  {
    id: 'sekolah',
    tag: 'Pendidikan',
    title: 'Assessment Sekolah',
    desc: 'Nilai kelayakan ruang belajar dan sarana pendukung kegiatan pendidikan.',
    image: '/images/assessment/sekolah.jpg',
  },
  {
    id: 'pohon',
    tag: 'Lingkungan',
    title: 'Assessment Pohon',
    desc: 'Identifikasi kesehatan pohon dan potensi perawatan atau penanaman baru.',
    image: '/images/assessment/pohon.jpg',
  },
  {
    id: 'umkm',
    tag: 'Ekonomi masyarakat',
    title: 'Assessment UMKM',
    desc: 'Kenali potensi usaha, kendala operasional, dan dukungan pengembangan.',
    image: '/images/assessment/umkm.jpg',
  },
  {
    id: 'petani',
    tag: 'Pertanian',
    title: 'Assessment Petani',
    desc: 'Petakan kondisi lahan, hasil pertanian, dan kebutuhan bantuan petani.',
    image: '/images/assessment/petani.jpg',
  },
]

interface AssessmentOverviewProps {
  onSelectCategory: (category: AssessmentCategory) => void
}

export default function AssessmentOverview({ onSelectCategory }: AssessmentOverviewProps) {
  const [countsByType, setCountsByType] = useState<Record<string, number>>({})

  useEffect(() => {
    api.getAssessments()
      .then((res) => {
        if (res?.counts && typeof res.counts === 'object') {
          setCountsByType(res.counts)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4">
      {/* Heading */}
      <div className="flex items-start justify-between gap-5 max-sm:flex-col">
        <div>
          <div className="mb-1 text-xs font-medium text-app-muted">Pendataan lapangan</div>
          <h1 className="mb-2 text-[28px] font-semibold tracking-tight text-app-text">Assessment</h1>
          <p className="text-sm leading-relaxed text-app-muted">Mulai dari kondisi nyata di lapangan. Pilih kategori untuk melihat daftar assessment atau mencatat kebutuhan baru.</p>
        </div>
        <span className="shrink-0 rounded-full bg-teal-soft px-3.5 py-1.5 text-xs font-semibold text-teal">6 kategori assessment</span>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 rounded-[10px] border border-[#c6e7e1] bg-[#eaf6f4] px-[18px] py-[13px] text-[13px] font-medium text-[#11534b]">
        <span className="grid shrink-0 place-items-center text-teal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </span>
        <span>Pilih salah satu kategori di bawah untuk melihat daftar assessment yang tersimpan di database sebelum mengisi formulir baru.</span>
      </div>

      {/* Grid 6 Kategori (3 Kolom x 2 Baris) */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {assessmentCategories.map((cat) => {
          const count = countsByType[cat.id] ?? 0
          return (
            <article
              key={cat.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-app-border bg-white text-app-text shadow-sm transition hover:-translate-y-1 hover:border-[#b7ded8] hover:shadow-[0_12px_28px_rgba(11,138,128,0.1)]"
              onClick={() => onSelectCategory(cat)}
            >
              <div className="relative h-[148px] w-full overflow-hidden bg-[#e9ecec]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-teal shadow-sm">
                  {count} data
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 pb-[18px]">
                <span className="mb-1.5 text-xs font-medium text-[#7b8b8c]">{cat.tag}</span>
                <h2 className="mb-2 text-[17px] font-bold leading-tight text-app-text">{cat.title}</h2>
                <p className="mb-[18px] flex-1 text-xs leading-normal text-app-muted">{cat.desc}</p>
                <div className="flex items-center justify-between border-t border-[#f2f6f6] pt-2.5 text-[13px] font-semibold text-teal">
                  <span>Lihat daftar assessment</span>
                  <span className="transition group-hover:translate-x-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Footer Notice */}
      <div className="mt-1.5 flex items-center gap-2 px-0.5 py-1.5 text-xs text-app-muted">
        <span className="grid place-items-center text-teal">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <span>Data assessment menjadi dasar perencanaan program dan penentuan prioritas bantuan.</span>
      </div>
    </div>
  )
}

