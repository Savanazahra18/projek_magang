import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Relawan Nusantara — Ruang Kolaborasi Relawan',
  description:
    'Satu tempat untuk mengelola program, menyatukan relawan, dan menyalurkan bantuan ke seluruh Nusantara.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
