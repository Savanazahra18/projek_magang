import { ReactNode } from 'react'
import AppLayout from '@/components/layout/AppLayout'

export const metadata = {
  title: 'Dasbor Keuangan — Relawan Nusantara',
  description: 'Verifikasi anggaran, pencairan dana, dan akuntabilitas keuangan program.',
}

export default function FinanceLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

