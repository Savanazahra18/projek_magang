import { ReactNode } from 'react'
import AppLayout from '@/components/layout/AppLayout'

export const metadata = {
  title: 'Dasbor Direktur — Relawan Nusantara',
  description: 'Pantau pengajuan, tinjau anggaran, dan tetapkan keputusan dalam satu ruang kerja.',
}

export default function DirectorLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

