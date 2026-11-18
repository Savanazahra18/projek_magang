'use client'

import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import '@/styles/login.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showNotice = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3400)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      nextErrors.email = 'Alamat email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Format alamat email tidak valid.'
    }

    if (!password) {
      nextErrors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 4) {
      nextErrors.password = 'Kata sandi minimal 4 karakter.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      // Validasi mutlak ke database (tabel users)
      const res = await api.login({
        email: email.trim().toLowerCase(),
        password: password,
      })

      const user = res?.user
      const roleStr = (user?.role || '').toLowerCase()
      const isDirector = roleStr.includes('direktur')
      const isFinance = roleStr.includes('keuangan') || roleStr.includes('finance')

      const detectedRole = isDirector ? 'direktur' : isFinance ? 'keuangan' : 'program'

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_role', detectedRole)
        localStorage.setItem('user_email', user?.email || email.trim())
        localStorage.setItem('user_name', user?.name || '')
        if (res?.token) {
          localStorage.setItem('auth_token', res.token)
        }
      }

      showNotice(`Login berhasil. Selamat datang, ${user?.name || 'Pengguna'}!`)

      setTimeout(() => {
        if (isDirector) {
          router.push('/director')
        } else if (isFinance) {
          router.push('/finance')
        } else {
          router.push('/dashboard')
        }
      }, 350)
    } catch (err: any) {
      const errMsg =
        err?.message ||
        'Email atau kata sandi tidak cocok. Hanya akun yang terdaftar di database yang dapat masuk.'
      setErrors({
        password: errMsg,
      })
      showNotice(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      {/* Top Header */}
      <header className="login-topbar">
        <div className="login-topbar-inner">
          <div className="login-brand">
            <div className="login-brand-logo" aria-hidden="true">
              {/* Relawan Nusantara Slanted 'rn' Monogram SVG */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  d="M7 30L10.2 6H29.5L28.6 11.4H14.8L12.3 30H7Z"
                  fill="#057A6E"
                />
                <path
                  d="M15.4 30L17.4 15.2H29.2L27.2 30H22.1L23.5 19.8H21.7L20.3 30H15.4Z"
                  fill="#078780"
                />
              </svg>
            </div>
            <div className="login-brand-text">
              <strong>Relawan Nusantara</strong>
              <span>Bergerak bersama, berdampak nyata</span>
            </div>
          </div>

          <button
            type="button"
            className="login-help-link"
            onClick={() =>
              showNotice('Pusat bantuan Relawan Nusantara siap membantu Anda.')
            }
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.5 9a2.7 2.7 0 115 1.4c-.8 1-2.5 1.4-2.5 3.1" />
              <path d="M12 17.5h.01" />
            </svg>
            <span>Pusat bantuan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-container">
          {/* Left Column: Hero & Visual */}
          <section className="login-hero">
            <div className="login-pill">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20c0-3.8 2.2-6.5 6-6.5s6 2.7 6 6.5" />
                <path d="M16 5a3 3 0 010 6" />
                <path d="M17 13.5c3 0 4 2.5 4 6" />
              </svg>
              <span>RUANG KOLABORASI RELAWAN</span>
            </div>

            <h1>
              Bersama, hadirkan
              <br />
              lebih banyak kebaikan.
            </h1>

            <p className="login-hero-desc">
              Satu tempat untuk mengelola program, menyatukan relawan, dan
              menyalurkan bantuan ke seluruh Nusantara.
            </p>

            <div className="login-photo-frame">
              <img
                src="/images/relawan-bantuan.jpg"
                alt="Penyaluran Bantuan Pangan Relawan Nusantara kepada warga"
                className="login-photo-img"
              />
            </div>

            <div className="login-Perks">
              <div className="login-perk-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M8.5 12.2l2.3 2.3 4.8-4.8" />
                </svg>
                <span>Program terkoordinasi</span>
              </div>

              <div className="login-perk-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M8.5 12.2l2.3 2.3 4.8-4.8" />
                </svg>
                <span>Bantuan lebih terarah</span>
              </div>
            </div>
          </section>

          {/* Right Column: Login Card */}
          <section className="login-card-wrap">
            <div className="login-card">
              <div className="login-card-icon" aria-hidden="true">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>

              <h2>Selamat datang kembali</h2>
              <p className="login-card-subtitle">
                Masuk ke akun Anda untuk melanjutkan langkah baik hari ini.
              </p>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <label className="login-field">
                  <span className="login-field-label">Alamat email</span>
                  <div className="login-input-wrap">
                    <span className="login-input-icon" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <polyline points="3 7 12 13 21 7" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className={`login-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="Masukkan alamat email Anda"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <span className="login-error-msg">{errors.email}</span>
                  )}
                </label>

                {/* Password Field */}
                <label className="login-field">
                  <span className="login-field-label">Kata sandi</span>
                  <div className="login-input-wrap">
                    <span className="login-input-icon" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`login-input ${errors.password ? 'has-error' : ''}`}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password)
                          setErrors({ ...errors, password: undefined })
                      }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      aria-label={
                        showPassword
                          ? 'Sembunyikan kata sandi'
                          : 'Tampilkan kata sandi'
                      }
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="login-error-msg">{errors.password}</span>
                  )}
                </label>

                {/* Remember & Forgot Password */}
                <div className="login-row-between">
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Ingat saya</span>
                  </label>

                  <button
                    type="button"
                    className="login-forgot-btn"
                    onClick={() =>
                      showNotice(
                        'Tautan pemulihan kata sandi dapat diminta melalui koordinator unit Anda.'
                      )
                    }
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  <span>{loading ? 'Memproses...' : 'Masuk'}</span>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="13 6 19 12 13 18" />
                  </svg>
                </button>
              </form>

              {/* Akun Terdaftar di Database (users) */}
              <div style={{ marginTop: '16px', padding: '12px 14px', background: '#f6fafa', border: '1px solid #dce8e7', borderRadius: '8px', fontSize: '11.5px', color: '#4a6062' }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '8px', color: '#078780' }}>
                  🔑 Akun Resmi Terdaftar di Database (tabel users):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: '#172324', fontSize: '11.5px' }}
                    onClick={() => {
                      setEmail('direktur@relawannusantara.org')
                      setPassword('admin123')
                      setErrors({})
                    }}
                    title="Gunakan akun Direktur Utama"
                  >
                    👑 <strong>Direktur Utama:</strong> <span style={{ color: '#078780', textDecoration: 'underline' }}>direktur@relawannusantara.org</span> (sandi: admin123)
                  </button>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: '#172324', fontSize: '11.5px' }}
                    onClick={() => {
                      setEmail('keuangan@relawannusantara.org')
                      setPassword('admin123')
                      setErrors({})
                    }}
                    title="Gunakan akun Divisi Keuangan"
                  >
                    💼 <strong>Divisi Keuangan:</strong> <span style={{ color: '#078780', textDecoration: 'underline' }}>keuangan@relawannusantara.org</span> (sandi: admin123)
                  </button>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: '#172324', fontSize: '11.5px' }}
                    onClick={() => {
                      setEmail('program@relawannusantara.org')
                      setPassword('admin123')
                      setErrors({})
                    }}
                    title="Gunakan akun Divisi Program"
                  >
                    📋 <strong>Divisi Program:</strong> <span style={{ color: '#078780', textDecoration: 'underline' }}>program@relawannusantara.org</span> (sandi: admin123)
                  </button>
                </div>
              </div>

              <div className="login-divider" />

              <div className="login-coordinator-box">
                <span>Belum memiliki akun?</span>
                <button
                  type="button"
                  className="login-coordinator-link"
                  onClick={() =>
                    showNotice(
                      'Silakan hubungi koordinator wilayah atau admin Kantor Pusat untuk pembuatan akun.'
                    )
                  }
                >
                  <span>Hubungi koordinator Anda</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="8 7 17 7 17 16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="login-security-note">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2l7 3v6c0 5-3 8.7-7 10.5C8 19.7 5 16 5 11V5l7-3z" />
                <path d="M9.2 12l2 2 3.8-4" />
              </svg>
              <span>Akses aman untuk setiap langkah kebaikan.</span>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-footer-inner">
          <span>© 2026 Relawan Nusantara. Semua hak dilindungi.</span>
          <div className="login-footer-links">
            <button
              type="button"
              onClick={() => showNotice('Halaman Kebijakan Privasi dibuka.')}
            >
              Kebijakan Privasi
            </button>
            <button
              type="button"
              onClick={() => showNotice('Halaman Syarat & Ketentuan dibuka.')}
            >
              Syarat &amp; Ketentuan
            </button>
            <button
              type="button"
              onClick={() => showNotice('Bahasa aktif: Bahasa Indonesia.')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Bahasa Indonesia</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div>
            <strong>Informasi</strong>
            <small>{toast}</small>
          </div>
          <button type="button" onClick={() => setToast('')}>
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

