'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDashboard } from '@/context/DashboardContext'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { role, notify } = useDashboard()

  const [isClosing, setIsClosing] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isDirector = pathname.startsWith('/director') || role === 'direktur'
  const isFinance = pathname.startsWith('/finance') || role === 'keuangan'

  const userName = isDirector ? 'Aditya Pratama' : isFinance ? 'Siti Rahma' : 'Cikipi'
  const userInitials = isDirector ? 'AP' : isFinance ? 'SR' : 'CK'
  const userRole = isDirector ? 'Direktur Utama' : isFinance ? 'Divisi Keuangan' : 'Tim Program'
  const userEmail = isDirector
    ? 'aditya.pratama@relawannusantara.org'
    : isFinance
    ? 'keuangan@relawannusantara.org'
    : 'tim.program@relawannusantara.org'

  // Handle Close with smooth exit animation
  const handleClose = () => {
    if (isLoggingOut) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  // Handle Logout Confirmation
  const handleConfirmLogout = () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    // Smooth delay for micro-interaction feedback
    setTimeout(() => {
      notify('Anda telah berhasil keluar dari sistem.')
      setIsClosing(true)
      setTimeout(() => {
        onClose()
        router.push('/login')
      }, 180)
    }, 600)
  }

  // Keyboard accessibility: ESC to cancel, ENTER to confirm
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      } else if (e.key === 'Enter' && !isLoggingOut) {
        e.preventDefault()
        handleConfirmLogout()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoggingOut])

  if (!isOpen) return null

  return (
    <div
      className={`logout-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div className="logout-card">
        {/* Close Button */}
        <button
          type="button"
          className="logout-close-btn"
          onClick={handleClose}
          aria-label="Tutup jendela konfirmasi"
          disabled={isLoggingOut}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header with Animated Icon */}
        <div className="logout-header">
          <div className="logout-icon-wrapper">
            <div className="logout-icon-ripple" />
            <div className="logout-icon-ripple delay" />
            <div className="logout-icon-badge">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
          </div>

          <span className="logout-tag">
            <span className="logout-tag-dot" />
            Konfirmasi Keluar
          </span>

          <h2 id="logout-modal-title" className="logout-title">
            Apakah Anda yakin ingin keluar?
          </h2>
          <p className="logout-desc">
            Sesi aktif Anda akan segera diakhiri. Pastikan semua draf data atau perubahan pekerjaan Anda telah disimpan.
          </p>
        </div>

        {/* User Profile Card Preview */}
        <div className="logout-user-box">
          <div className="logout-user-avatar">
            {userInitials}
            <span className="logout-online-indicator" title="Sesi aktif" />
          </div>
          <div className="logout-user-info">
            <div className="logout-user-name">{userName}</div>
            <div className="logout-user-role">
              <span className="logout-role-pill">{userRole}</span>
              <span>•</span>
              <span>{userEmail}</span>
            </div>
          </div>
          <div className="logout-user-badge">
            <span className="logout-badge-active">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Aktif
            </span>
          </div>
        </div>

        {/* Alert Note */}
        <div className="logout-alert-box">
          <svg className="logout-alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="logout-alert-text">
            Setelah keluar, Anda perlu memasukkan kembali email dan kata sandi untuk mengakses sistem.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="logout-actions">
          <button
            type="button"
            className="logout-btn-cancel"
            onClick={handleClose}
            disabled={isLoggingOut}
          >
            Batal
          </button>

          <button
            type="button"
            className="logout-btn-confirm"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <span className="logout-spinner" />
                <span>Mengakhiri sesi...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Ya, Keluar Akun</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

