import { ReactNode } from 'react'
import AppLayout from '@/components/layout/AppLayout'

export const metadata = {
  title: 'Dashboard — Relawan Nusantara',
  description: 'Sistem Manajemen Program Relawan Nusantara',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

