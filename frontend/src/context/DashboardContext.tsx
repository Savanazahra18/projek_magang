'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface DashboardContextType {
  role: 'program' | 'direktur' | 'keuangan'
  setRole: (role: 'program' | 'direktur' | 'keuangan') => void
  switchRole: (role: 'program' | 'direktur' | 'keuangan') => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  toggleSidebar: () => void
  subCrumbs: string[]
  setSubCrumbs: (crumbs: string[]) => void
  toast: string
  notify: (msg: string) => void
  isLogoutModalOpen: boolean
  openLogoutModal: () => void
  closeLogoutModal: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<'program' | 'direktur' | 'keuangan'>('program')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [subCrumbs, setSubCrumbs] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('user_role') as 'program' | 'direktur' | 'keuangan' | null
      if (savedRole === 'direktur' || savedRole === 'program' || savedRole === 'keuangan') {
        setRoleState(savedRole)
      }
    }
  }, [])

  const setRole = (newRole: 'program' | 'direktur' | 'keuangan') => {
    setRoleState(newRole)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_role', newRole)
    }
  }

  const switchRole = (newRole: 'program' | 'direktur' | 'keuangan') => {
    setRole(newRole)
    const roleLabel =
      newRole === 'direktur'
        ? 'Direktur Utama (Aditya Pratama)'
        : newRole === 'keuangan'
        ? 'Divisi Keuangan (Siti Rahma)'
        : 'Pengguna Program (Cikipi)'
    notify(`Peran berhasil dialihkan ke ${roleLabel}.`)
  }

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const openLogoutModal = () => setIsLogoutModalOpen(true)
  const closeLogoutModal = () => setIsLogoutModalOpen(false)

  const notify = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 3000)
  }

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        switchRole,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        subCrumbs,
        setSubCrumbs,
        toast,
        notify,
        isLogoutModalOpen,
        openLogoutModal,
        closeLogoutModal,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

