'use client'

import { useState, useMemo, useEffect, ReactNode, useRef } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { api } from '@/lib/api'
import { Icon as CommonIcon, IconName as CommonIconName } from '@/components/common/Icons'

/* ==========================================================
   ICONS
   ========================================================== */
type IconName =
  | 'layers' | 'plus' | 'search' | 'arrowUpRight' | 'arrowRight'
  | 'shield' | 'file' | 'bullhorn' | 'close' | 'info' | 'chevronDown'
  | 'calendar' | 'tag' | 'sort' | 'send' | 'check' | 'trash' | 'eye'

const icons: Record<IconName, ReactNode> = {
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  layers: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  plus: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  arrowUpRight: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  file: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bullhorn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  close: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  chevronDown: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  tag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  sort: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M6 12h12m-9 6h6" />
    </svg>
  ),
  send: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
}

function Icon({ name }: { name: IconName }) {
  return <>{icons[name] || null}</>
}

/* ==========================================================
   TYPES & DEFAULT DATA
   ========================================================== */
export type MiproType = 'MIPro 1' | 'MIPro 2' | 'MIPro 3'
export type MiproSubtype = 'Kemitraan' | 'Aspirasi' | 'Campaign'

export interface CampaignEntry {
  campaignId: string
  campaignName: string
  donationPeriod: string
  totalDss: string
  program: string
  keterangan: string
}

export interface MiproItem {
  id: string
  type: MiproType
  subtype: MiproSubtype
  type_label: string
  title: string
  partner_name?: string
  campaign_id?: string
  category: string
  location?: string
  province?: string
  period: string
  disbursement_amount?: string
  beneficiaries?: string
  desired_output?: string
  description?: string
  campaigns?: CampaignEntry[]
  campaigns_data?: string
  updated_date: string
}

function formatRupiah(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return 'Rp ' + Number(digits).toLocaleString('id-ID')
}

function formatNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('id-ID')
}

const INITIAL_MIPRO_DATA: MiproItem[] = [
  {
    id: 'MIPRO-2026-001',
    type: 'MIPro 1',
    subtype: 'Kemitraan',
    type_label: 'Program dengan mitra',
    title: 'Air Bersih Desa Sukamaju',
    partner_name: 'PT Tirta Mandiri Sejahtera',
    category: 'Infrastruktur',
    location: 'Desa Sukamaju, Kec. Cimaung, Kab. Bandung, Jawa Barat',
    province: 'Jawa Barat',
    period: 'Januari – Maret 2027',
    disbursement_amount: 'Rp 82.500.000',
    beneficiaries: '1200',
    desired_output: 'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
    description: 'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
    updated_date: '28 Okt 2026',
  },
  {
    id: 'MIPRO-2026-002',
    type: 'MIPro 2',
    subtype: 'Aspirasi',
    type_label: 'Program tanpa mitra',
    title: 'Paket Belajar Nusantara',
    category: 'Pendidikan',
    location: 'Kampung Babakan, Desa Sukamulya, Kab. Cianjur, Jawa Barat',
    province: 'Jawa Barat',
    period: 'Februari – April 2027',
    disbursement_amount: 'Rp 45.000.000',
    beneficiaries: '350',
    desired_output: 'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
    description: 'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
    updated_date: '27 Okt 2026',
  },
  {
    id: 'MIPRO-2026-003',
    type: 'MIPro 3',
    subtype: 'Campaign',
    type_label: 'Campaign • ID 1025',
    title: 'Donasi untuk Pendidikan',
    campaign_id: '1025',
    category: 'Sosial',
    location: 'Nasional',
    province: 'Indonesia',
    period: 'Januari – Februari 2027',
    disbursement_amount: 'Rp 95.000.000',
    beneficiaries: '500 Siswa',
    desired_output: 'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa.',
    description: 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
    campaigns: [
      {
        campaignId: '1025',
        campaignName: 'Donasi untuk Pendidikan',
        donationPeriod: 'Januari – Februari 2027',
        totalDss: 'Rp 95.000.000',
        program: 'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa pelosok.',
        keterangan: 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
      },
    ],
    updated_date: '26 Okt 2026',
  },
]

export default function MiproPage() {
  const { setSubCrumbs, notify } = useDashboard()

  // Views: 'list' | 'form' | 'detail'
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list')

  // Selected Type for Form: 'Kemitraan' | 'Aspirasi' | 'Campaign'
  const [formSubtype, setFormSubtype] = useState<MiproSubtype>('Kemitraan')

  // Dropdown open state on "+ Buat MIPro"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // Data state
  const [miproList, setMiproList] = useState<MiproItem[]>([])
  const [counts, setCounts] = useState({
    total: 0,
    mipro1: 0,
    mipro2: 0,
    mipro3: 0,
  })

  // Filters state
  const [activeTab, setActiveTab] = useState<'Semua' | 'MIPro 1' | 'MIPro 2' | 'MIPro 3'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  // Selected Detail Item
  const [selectedMipro, setSelectedMipro] = useState<MiproItem | null>(null)

  // Form input fields
  const [titleInput, setTitleInput] = useState('')
  const [partnerInput, setPartnerInput] = useState('')
  const [campaignIdInput, setCampaignIdInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('Pendidikan')
  const [locationInput, setLocationInput] = useState('Kab. Bandung, Jawa Barat')
  const [periodInput, setPeriodInput] = useState('Januari – Maret 2027')
  const [amountInput, setAmountInput] = useState('Rp 50.000.000')
  const [beneficiariesInput, setBeneficiariesInput] = useState('200 Jiwa')
  const [desiredOutputInput, setDesiredOutputInput] = useState('')
  const [descriptionInput, setDescriptionInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Multi-Campaign state for MIPro 3 (Campaign)
  const [campaignEntries, setCampaignEntries] = useState<CampaignEntry[]>([
    {
      campaignId: '1025',
      campaignName: 'Donasi untuk Pendidikan',
      donationPeriod: 'Januari – Februari 2027',
      totalDss: 'Rp 95.000.000',
      program: 'Renovasi sarana belajar sekolah pelosok dan pengadaan perlengkapan edukasi.',
      keterangan: 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
    },
  ])

  // Total Accumulated DSS across all campaign entries
  const totalCampaignDss = useMemo(() => {
    let sum = 0
    campaignEntries.forEach((c) => {
      const digits = c.totalDss.replace(/\D/g, '')
      if (digits) sum += Number(digits)
    })
    return sum > 0 ? 'Rp ' + sum.toLocaleString('id-ID') : 'Rp 0'
  }, [campaignEntries])

  const handleAddCampaign = () => {
    setCampaignEntries((prev) => [
      ...prev,
      {
        campaignId: '',
        campaignName: '',
        donationPeriod: '',
        totalDss: '',
        program: '',
        keterangan: '',
      },
    ])
  }

  const handleRemoveCampaign = (index: number) => {
    if (campaignEntries.length <= 1) {
      notify('Minimal harus ada 1 campaign dalam formulir MIPro Campaign.')
      return
    }
    setCampaignEntries((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleCampaignChange = (index: number, field: keyof CampaignEntry, value: string) => {
    setCampaignEntries((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  // Fetch live from backend
  useEffect(() => {
    let ignore = false
    const fetchData = async () => {
      try {
        const res = await api.getMiproList()
        if (!ignore && Array.isArray(res?.mipros)) {
          setMiproList(res.mipros)
          if (res.counts) {
            setCounts(res.counts)
          }
        }
      } catch (err) {
        // Fallback to initial seed
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [])

  // Sync breadcrumbs
  useEffect(() => {
    if (view === 'list') {
      setSubCrumbs(['MIPro'])
    } else if (view === 'detail') {
      setSubCrumbs(['MIPro', 'Detail MIPro'])
    } else {
      const typeLabel =
        formSubtype === 'Kemitraan'
          ? 'MIPro 1 (Kemitraan)'
          : formSubtype === 'Aspirasi'
          ? 'MIPro 2 (Aspirasi)'
          : 'MIPro 3 (Campaign)'
      setSubCrumbs(['MIPro', selectedMipro ? `Ubah ${typeLabel}` : `Buat ${typeLabel}`])
    }
  }, [view, formSubtype, selectedMipro, setSubCrumbs])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Open Form for Editing an existing MIPro
  const handleEditMipro = (item: MiproItem) => {
    setSelectedMipro(item)
    setFormSubtype(item.subtype)
    setTitleInput(item.title || '')
    setPartnerInput(item.partner_name || '')
    setCampaignIdInput(item.campaign_id || '')
    setCategoryInput(item.category || 'Pendidikan')
    setLocationInput(item.location || '')
    setPeriodInput(item.period || '')
    setAmountInput(item.disbursement_amount || '')
    setBeneficiariesInput(item.beneficiaries || '')
    setDescriptionInput(item.description || '')
    setDesiredOutputInput(item.desired_output || '')
    if (item.campaigns && item.campaigns.length > 0) {
      setCampaignEntries(item.campaigns)
    }
    setView('form')
  }

  // Open Form with chosen Subtype (New MIPro)
  const handleStartCreate = (subtype: MiproSubtype) => {
    setSelectedMipro(null)
    setFormSubtype(subtype)
    setIsDropdownOpen(false)

    // Set sample defaults for quick fill
    if (subtype === 'Kemitraan') {
      setTitleInput('Air Bersih Desa Sukamaju')
      setPartnerInput('PT Tirta Mandiri Sejahtera')
      setCategoryInput('Infrastruktur')
      setLocationInput('Desa Sukamaju, Kec. Cimaung, Kab. Bandung, Jawa Barat')
      setPeriodInput('Januari – Maret 2027')
      setAmountInput('Rp 82.500.000')
      setBeneficiariesInput('1.200')
      setDesiredOutputInput(
        'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.'
      )
      setDescriptionInput(
        'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.'
      )
    } else if (subtype === 'Aspirasi') {
      setTitleInput('Renovasi Jembatan Pelosok')
      setPartnerInput('')
      setCategoryInput('Infrastruktur')
      setLocationInput('Kampung Cikadu, Desa Sukamaju, Kec. Cikembar, Kab. Sukabumi, Jawa Barat')
      setPeriodInput('April – Juni 2027')
      setAmountInput('Rp 60.000.000')
      setBeneficiariesInput('450')
      setDesiredOutputInput(
        'Pembangunan jembatan gantung baja sepanjang 30 meter penghubung dua desa untuk akses aman anak sekolah dan petani.'
      )
      setDescriptionInput(
        'Pembangunan jembatan gantung baja sepanjang 30 meter penghubung dua desa untuk akses aman anak sekolah dan petani.'
      )
    } else {
      setCampaignEntries([
        {
          campaignId: '1025',
          campaignName: 'Donasi untuk Pendidikan',
          donationPeriod: 'Januari – Februari 2027',
          totalDss: 'Rp 95.000.000',
          program: 'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa pelosok.',
          keterangan: 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
        },
      ])
      setTitleInput('Donasi untuk Pendidikan')
      setCampaignIdInput('1025')
      setCategoryInput('Sosial')
      setLocationInput('Nasional, Indonesia')
      setPeriodInput('Januari – Februari 2027')
      setAmountInput('Rp 95.000.000')
      setBeneficiariesInput('500 Siswa')
      setDescriptionInput('Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.')
      setDesiredOutputInput('Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa pelosok.')
    }

    setView('form')
  }

  // Filtered List
  const filteredList = useMemo(() => {
    return miproList
      .filter((item) => {
        // Tab filter
        if (activeTab === 'MIPro 1' && item.type !== 'MIPro 1') return false
        if (activeTab === 'MIPro 2' && item.type !== 'MIPro 2') return false
        if (activeTab === 'MIPro 3' && item.type !== 'MIPro 3') return false

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matches =
            item.title.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q) ||
            item.type_label.toLowerCase().includes(q) ||
            item.subtype.toLowerCase().includes(q) ||
            (item.partner_name && item.partner_name.toLowerCase().includes(q)) ||
            (item.campaign_id && item.campaign_id.toLowerCase().includes(q)) ||
            item.category.toLowerCase().includes(q)
          if (!matches) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortOrder === 'desc') return b.id.localeCompare(a.id)
        return a.id.localeCompare(b.id)
      })
  }, [miproList, activeTab, searchQuery, sortOrder])

  // Submit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formSubtype === 'Campaign') {
      const invalid = campaignEntries.find((c) => !c.campaignId.trim() || !c.campaignName.trim())
      if (invalid) {
        notify('ID Campaign dan Nama Campaign wajib diisi untuk semua campaign.')
        return
      }
    } else {
      if (!titleInput.trim()) {
        notify('Nama Program wajib diisi.')
        return
      }
    }

    setIsSubmitting(true)
    try {
      const allIds = campaignEntries.map((c) => c.campaignId.trim()).filter(Boolean)
      const primaryTitle =
        formSubtype === 'Campaign'
          ? campaignEntries.length > 1
            ? `${campaignEntries[0].campaignName} (+${campaignEntries.length - 1} campaign)`
            : campaignEntries[0].campaignName
          : titleInput

      const payload = {
        subtype: formSubtype,
        title: primaryTitle,
        partnerName: formSubtype === 'Kemitraan' ? partnerInput : undefined,
        campaignId: formSubtype === 'Campaign' ? allIds.join(', ') : undefined,
        category: formSubtype === 'Campaign' ? 'Sosial' : categoryInput,
        location: formSubtype === 'Campaign' ? 'Nasional' : locationInput,
        period: formSubtype === 'Campaign' ? campaignEntries[0].donationPeriod : periodInput,
        disbursementAmount: formSubtype === 'Campaign' ? totalCampaignDss : amountInput,
        beneficiaries:
          formSubtype === 'Campaign'
            ? `${campaignEntries.length * 250} Penerima`
            : beneficiariesInput,
        desiredOutput:
          formSubtype === 'Campaign'
            ? campaignEntries[0].program
            : desiredOutputInput,
        description:
          formSubtype === 'Campaign'
            ? campaignEntries[0].keterangan
            : desiredOutputInput || descriptionInput,
        campaigns: formSubtype === 'Campaign' ? campaignEntries : undefined,
      }

      const res = await api.createMipro(payload)
      const miproType =
        formSubtype === 'Kemitraan'
          ? 'MIPro 1'
          : formSubtype === 'Aspirasi'
          ? 'MIPro 2'
          : 'MIPro 3'

      const typeLabel =
        formSubtype === 'Kemitraan'
          ? 'Program dengan mitra'
          : formSubtype === 'Aspirasi'
          ? 'Program tanpa mitra'
          : campaignEntries.length > 1
          ? `Campaign (${campaignEntries.length} campaign) • ID ${allIds.join(', ')}`
          : `Campaign • ID ${campaignEntries[0]?.campaignId || '1025'}`

      const newItem: MiproItem = res?.mipro || {
        id: `MIPRO-2026-${String(miproList.length + 1).padStart(3, '0')}`,
        type: miproType,
        subtype: formSubtype,
        type_label: typeLabel,
        title: primaryTitle,
        partner_name: formSubtype === 'Kemitraan' ? partnerInput : undefined,
        campaign_id: formSubtype === 'Campaign' ? allIds.join(', ') : undefined,
        category: formSubtype === 'Campaign' ? 'Sosial' : categoryInput,
        location: formSubtype === 'Campaign' ? 'Nasional' : locationInput,
        period: formSubtype === 'Campaign' ? campaignEntries[0].donationPeriod : periodInput,
        disbursement_amount: formSubtype === 'Campaign' ? totalCampaignDss : amountInput,
        beneficiaries:
          formSubtype === 'Campaign'
            ? `${campaignEntries.length * 250} Penerima`
            : beneficiariesInput,
        desired_output:
          formSubtype === 'Campaign'
            ? campaignEntries[0].program
            : desiredOutputInput,
        description:
          formSubtype === 'Campaign'
            ? campaignEntries[0].keterangan
            : desiredOutputInput || descriptionInput,
        campaigns: formSubtype === 'Campaign' ? campaignEntries : undefined,
        updated_date: '05 Nov 2026',
      }

      if (selectedMipro) {
        const updatedItem: MiproItem = {
          ...newItem,
          id: selectedMipro.id,
          updated_date: 'Hari ini',
        }
        setMiproList((prev) =>
          prev.map((it) => (it.id === selectedMipro.id ? updatedItem : it))
        )
        setSelectedMipro(updatedItem)
        notify(`Berhasil memperbarui ${updatedItem.type} (${formSubtype}): ${updatedItem.title}!`)
        setView('detail')
      } else {
        setMiproList((prev) => [newItem, ...prev])
        setCounts((prev) => ({
          ...prev,
          total: prev.total + 1,
          mipro1: formSubtype === 'Kemitraan' ? prev.mipro1 + 1 : prev.mipro1,
          mipro2: formSubtype === 'Aspirasi' ? prev.mipro2 + 1 : prev.mipro2,
          mipro3: formSubtype === 'Campaign' ? prev.mipro3 + 1 : prev.mipro3,
        }))
        notify(`Berhasil membuat ${newItem.type} (${formSubtype}): ${newItem.title}!`)
        setView('list')
      }
    } catch (err: any) {
      notify(err?.message || 'Gagal menyimpan MIPro.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================================
  // VIEW: FORM TAMBAH / UBAH MIPRO
  // ==========================================================
  if (view === 'form') {
    return (
      <div className="mipro-form-page">
        {/* Header */}
        <div className="mipro-header-row">
          <div className="mipro-title-group">
            <h1 className="mipro-main-title">
              {selectedMipro ? 'Ubah' : 'Buat'} {formSubtype === 'Kemitraan' ? 'MIPro 1' : formSubtype === 'Aspirasi' ? 'MIPro 2' : 'MIPro 3'}{' '}
              {selectedMipro ? `(${selectedMipro.id})` : 'Baru'}
            </h1>
            <p className="mipro-subtitle">
              {formSubtype === 'Kemitraan'
                ? 'Lengkapi formulir program kolaborasi dengan mitra kemitraan (7 isian).'
                : formSubtype === 'Aspirasi'
                ? 'Lengkapi formulir program usulan aspirasi komunitas tanpa mitra (6 isian).'
                : 'Lengkapi formulir penggalangan donasi dan campaign publik (6 isian).'}
            </p>
          </div>
          <button
            type="button"
            className="dss-btn-secondary"
            onClick={() => (selectedMipro ? setView('detail') : setView('list'))}
            style={{ height: 38, padding: '0 16px', borderRadius: 8, cursor: 'pointer' }}
          >
            ← Batal &amp; Kembali
          </button>
        </div>

        {/* Form Card */}
        <div className="mipro-form-card">
          <div className="mipro-form-card-head">
            <div>
              <span className="mipro-form-type-pill">
                <Icon name={formSubtype === 'Kemitraan' ? 'shield' : formSubtype === 'Aspirasi' ? 'file' : 'bullhorn'} />
                <span>
                  {formSubtype === 'Kemitraan'
                    ? 'Tipe: Kemitraan (MIPro 1)'
                    : formSubtype === 'Aspirasi'
                    ? 'Tipe: Aspirasi (MIPro 2)'
                    : 'Tipe: Campaign (MIPro 3)'}
                </span>
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#7a8b8c' }}>
              Isian otomatis divalidasi ke database PostgreSQL Relawan Nusantara.
            </span>
          </div>

          <form onSubmit={handleSubmitForm}>
            <div className="mipro-form-grid">
              {formSubtype === 'Kemitraan' ? (
                /* ==========================================================
                   FORMULIR MIPRO KEMITRAAN (7 ISIAN SESUAI KETENTUAN)
                   1. Nama Program : Short Answer
                   2. Nama Mitra : Short Answer
                   3. Lokasi Program : Paragraf
                   4. Dana yang disalurkan : Short Answer (angka - Rupiah)
                   5. Jumlah Penerima Manfaat : Short Answer (angka)
                   6. Output yang diinginkan : Paragraf
                   7. Periode Implementasi Program : Short Answer
                   ========================================================== */
                <>
                  {/* 1. Nama Program (Short Answer) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Nama Program</span>
                      <span className="mipro-field-badge">Short Answer</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Contoh: Air Bersih Desa Sukamaju"
                      required
                    />
                  </div>

                  {/* 2. Nama Mitra (Short Answer) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Nama Mitra</span>
                      <span className="mipro-field-badge">Short Answer</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={partnerInput}
                      onChange={(e) => setPartnerInput(e.target.value)}
                      placeholder="Contoh: PT Tirta Mandiri Sejahtera"
                      required
                    />
                  </div>

                  {/* 3. Lokasi Program (Paragraf) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Lokasi Program</span>
                      <span className="mipro-field-badge">Paragraf</span>
                      <span className="req">*</span>
                    </label>
                    <textarea
                      className="mipro-form-textarea"
                      rows={3}
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Contoh: Desa Sukamaju, Kec. Cimaung, Kab. Bandung, Jawa Barat (Tuliskan rincian alamat/wilayah lengkap)"
                      required
                    />
                  </div>

                  {/* 4. Dana yang disalurkan (Short Answer angka - Rupiah) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Dana yang disalurkan</span>
                      <span className="mipro-field-badge">Short Answer (angka - Rupiah)</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={amountInput}
                      onChange={(e) => setAmountInput(formatRupiah(e.target.value))}
                      placeholder="Contoh: Rp 82.500.000"
                      required
                    />
                  </div>

                  {/* 5. Jumlah Penerima Manfaat (Short Answer angka) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Jumlah Penerima Manfaat</span>
                      <span className="mipro-field-badge">Short Answer (angka)</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={beneficiariesInput}
                      onChange={(e) => setBeneficiariesInput(formatNumber(e.target.value))}
                      placeholder="Contoh: 1200"
                      required
                    />
                  </div>

                  {/* 6. Output yang diinginkan (Paragraf) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Output yang diinginkan</span>
                      <span className="mipro-field-badge">Paragraf</span>
                      <span className="req">*</span>
                    </label>
                    <textarea
                      className="mipro-form-textarea"
                      rows={3}
                      value={desiredOutputInput}
                      onChange={(e) => setDesiredOutputInput(e.target.value)}
                      placeholder="Contoh: Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter."
                      required
                    />
                  </div>

                  {/* 7. Periode Implementasi Program (Short Answer) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Periode Implementasi Program</span>
                      <span className="mipro-field-badge">Short Answer</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={periodInput}
                      onChange={(e) => setPeriodInput(e.target.value)}
                      placeholder="Contoh: Januari – Maret 2027"
                      required
                    />
                  </div>
                </>
              ) : formSubtype === 'Campaign' ? (
                /* ==========================================================
                   FORMULIR MIPRO CAMPAIGN (6 ISIAN SESUAI KETENTUAN)
                   1. ID Campaign : Short Answer (angka)
                   2. Nama Campaign : Short Answer
                   3. Periode Donasi : Short Answer
                   4. Total DSS : Short Answer (angka-rupiah)
                   5. Program : Paragraf
                   6. Keterangan : Paragraf
                   Catatan: Bisa diisi beberapa campaign dalam 1 MIPRO
                   ========================================================== */
                <div className="mipro-campaigns-wrapper">
                  {/* Summary Bar */}
                  <div className="mipro-campaign-summary-bar">
                    <div className="mipro-summary-info">
                      <span className="mipro-summary-badge">Multi-Campaign</span>
                      <span>
                        {campaignEntries.length} Campaign terdaftar dalam 1 dokumen MIPro
                      </span>
                    </div>
                    <div className="mipro-summary-total">
                      <span>Total Akumulasi DSS:</span>
                      <strong>{totalCampaignDss}</strong>
                    </div>
                  </div>

                  {/* List of Campaign Cards */}
                  {campaignEntries.map((c, index) => (
                    <div key={index} className="mipro-campaign-card">
                      <div className="mipro-campaign-card-head">
                        <div className="mipro-campaign-num-title">
                          <Icon name="bullhorn" />
                          <span>
                            Campaign #{index + 1}
                            {c.campaignName ? ` • ${c.campaignName}` : ''}
                          </span>
                        </div>
                        {campaignEntries.length > 1 && (
                          <button
                            type="button"
                            className="mipro-campaign-delete-btn"
                            onClick={() => handleRemoveCampaign(index)}
                          >
                            <Icon name="trash" />
                            <span>Hapus Campaign</span>
                          </button>
                        )}
                      </div>

                      <div className="mipro-campaign-fields-grid">
                        {/* 1. ID Campaign (Short Answer angka) */}
                        <div className="mipro-form-field">
                          <label className="mipro-form-label">
                            <span>ID Campaign</span>
                            <span className="mipro-field-badge">Short Answer (angka)</span>
                            <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            className="mipro-form-input"
                            value={c.campaignId}
                            onChange={(e) =>
                              handleCampaignChange(index, 'campaignId', e.target.value.replace(/\D/g, ''))
                            }
                            placeholder="Contoh: 1025"
                            required
                          />
                        </div>

                        {/* 2. Nama Campaign (Short Answer) */}
                        <div className="mipro-form-field">
                          <label className="mipro-form-label">
                            <span>Nama Campaign</span>
                            <span className="mipro-field-badge">Short Answer</span>
                            <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            className="mipro-form-input"
                            value={c.campaignName}
                            onChange={(e) => handleCampaignChange(index, 'campaignName', e.target.value)}
                            placeholder="Contoh: Donasi untuk Pendidikan"
                            required
                          />
                        </div>

                        {/* 3. Periode Donasi (Short Answer) */}
                        <div className="mipro-form-field">
                          <label className="mipro-form-label">
                            <span>Periode Donasi</span>
                            <span className="mipro-field-badge">Short Answer</span>
                            <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            className="mipro-form-input"
                            value={c.donationPeriod}
                            onChange={(e) => handleCampaignChange(index, 'donationPeriod', e.target.value)}
                            placeholder="Contoh: Januari – Februari 2027"
                            required
                          />
                        </div>

                        {/* 4. Total DSS (Short Answer angka-rupiah) */}
                        <div className="mipro-form-field">
                          <label className="mipro-form-label">
                            <span>Total DSS</span>
                            <span className="mipro-field-badge">Short Answer (angka-rupiah)</span>
                            <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            className="mipro-form-input"
                            value={c.totalDss}
                            onChange={(e) =>
                              handleCampaignChange(index, 'totalDss', formatRupiah(e.target.value))
                            }
                            placeholder="Contoh: Rp 95.000.000"
                            required
                          />
                        </div>

                        {/* 5. Program (Paragraf) */}
                        <div className="mipro-form-field full">
                          <label className="mipro-form-label">
                            <span>Program</span>
                            <span className="mipro-field-badge">Paragraf</span>
                            <span className="req">*</span>
                          </label>
                          <textarea
                            className="mipro-form-textarea"
                            rows={3}
                            value={c.program}
                            onChange={(e) => handleCampaignChange(index, 'program', e.target.value)}
                            placeholder="Tuliskan rincian program kegiatan dan sasaran penyaluran donasi..."
                            required
                          />
                        </div>

                        {/* 6. Keterangan (Paragraf) */}
                        <div className="mipro-form-field full">
                          <label className="mipro-form-label">
                            <span>Keterangan</span>
                            <span className="mipro-field-badge">Paragraf</span>
                            <span className="req">*</span>
                          </label>
                          <textarea
                            className="mipro-form-textarea"
                            rows={3}
                            value={c.keterangan}
                            onChange={(e) => handleCampaignChange(index, 'keterangan', e.target.value)}
                            placeholder="Keterangan penggalangan dana atau catatan teknis campaign..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Button */}
                  <button
                    type="button"
                    className="mipro-add-campaign-btn"
                    onClick={handleAddCampaign}
                  >
                    <Icon name="plus" />
                    <span>+ Tambah Campaign Lainnya ke MIPro Ini</span>
                  </button>
                </div>
              ) : (
                /* ==========================================================
                   FORMULIR MIPRO ASPIRASI (6 ISIAN SESUAI KETENTUAN)
                   1. Nama Program : Short Answer
                   2. Lokasi Program : Paragraf
                   3. Dana yang disalurkan : Short Answer (angka - Rupiah)
                   4. Jumlah Penerima Manfaat : Short Answer (angka)
                   5. Output yang diinginkan : Paragraf
                   6. Periode Implementasi Program : Short Answer
                   ========================================================== */
                <>
                  {/* 1. Nama Program (Short Answer) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Nama Program</span>
                      <span className="mipro-field-badge">Short Answer</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="Contoh: Paket Belajar Nusantara"
                      required
                    />
                  </div>

                  {/* 2. Lokasi Program (Paragraf) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Lokasi Program</span>
                      <span className="mipro-field-badge">Paragraf</span>
                      <span className="req">*</span>
                    </label>
                    <textarea
                      className="mipro-form-textarea"
                      rows={3}
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Contoh: Kampung Babakan, Desa Sukamulya, Kab. Cianjur, Jawa Barat (Tuliskan rincian alamat/wilayah lengkap)"
                      required
                    />
                  </div>

                  {/* 3. Dana yang disalurkan (Short Answer angka - Rupiah) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Dana yang disalurkan</span>
                      <span className="mipro-field-badge">Short Answer (angka - Rupiah)</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={amountInput}
                      onChange={(e) => setAmountInput(formatRupiah(e.target.value))}
                      placeholder="Contoh: Rp 45.000.000"
                      required
                    />
                  </div>

                  {/* 4. Jumlah Penerima Manfaat (Short Answer angka) */}
                  <div className="mipro-form-field">
                    <label className="mipro-form-label">
                      <span>Jumlah Penerima Manfaat</span>
                      <span className="mipro-field-badge">Short Answer (angka)</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={beneficiariesInput}
                      onChange={(e) => setBeneficiariesInput(formatNumber(e.target.value))}
                      placeholder="Contoh: 350"
                      required
                    />
                  </div>

                  {/* 5. Output yang diinginkan (Paragraf) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Output yang diinginkan</span>
                      <span className="mipro-field-badge">Paragraf</span>
                      <span className="req">*</span>
                    </label>
                    <textarea
                      className="mipro-form-textarea"
                      rows={3}
                      value={desiredOutputInput}
                      onChange={(e) => setDesiredOutputInput(e.target.value)}
                      placeholder="Rincian output fisik, fasilitas, atau kapasitas yang diharapkan tercapai..."
                      required
                    />
                  </div>

                  {/* 6. Periode Implementasi Program (Short Answer) */}
                  <div className="mipro-form-field full">
                    <label className="mipro-form-label">
                      <span>Periode Implementasi Program</span>
                      <span className="mipro-field-badge">Short Answer</span>
                      <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="mipro-form-input"
                      value={periodInput}
                      onChange={(e) => setPeriodInput(e.target.value)}
                      placeholder="Contoh: Februari – April 2027"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Form Actions */}
            <div className="mipro-form-actions">
              <button
                type="button"
                className="dss-btn-secondary"
                onClick={() => setView('list')}
                style={{ height: 40, padding: '0 18px', borderRadius: 8, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button type="submit" className="dss-submit-btn" disabled={isSubmitting}>
                <Icon name="send" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Buat MIPro'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ==========================================================
  // VIEW: DETAIL MIPRO (SESUAI DESAIN REQUEST PROGRAM)
  // ==========================================================
  if (view === 'detail' && selectedMipro) {
    const m = selectedMipro
    const refs: { label: string; id: string; sub: string; icon: CommonIconName }[] = [
      { label: 'Request Program', id: m.id.replace('MIPRO', 'REQ'), sub: m.title, icon: 'inbox' },
      { label: 'Proposal', id: m.id.replace('MIPRO', 'PRO'), sub: m.title, icon: 'file' },
      { label: 'DSS (RAB)', id: m.id.replace('MIPRO', 'DSS'), sub: m.disbursement_amount || 'Rp 50.000.000', icon: 'calc' },
      { label: 'SPK', id: m.id.replace('MIPRO', 'SPK'), sub: 'Dalam proses', icon: 'fileText' },
      { label: 'Monitoring (Monev)', id: m.id.replace('MIPRO', 'MON'), sub: 'Dalam pemantauan', icon: 'pulse' },
    ]

    return (
      <div className="rq-detail-page">
        <div className="prop-upload-nav">
          <button
            type="button"
            className="prop-back-link"
            onClick={() => {
              setView('list')
              setSelectedMipro(null)
            }}
          >
            <CommonIcon name="back" size={16} />
            <span>Kembali ke daftar MIPro</span>
          </button>
        </div>

        {/* Header */}
        <div className="rq-detail-head">
          <div>
            <div className="rq-detail-eyebrow">
              <span className="rq-id">{m.id}</span>
              <span className="rq-status success">
                <i />
                Disahkan &amp; Aktif
              </span>
            </div>
            <h1>{m.title}</h1>
            <p>
              Diperbarui {m.updated_date || '28 Okt 2026'} • {m.type} ({m.subtype}) • {m.category}
            </p>
          </div>
          <div className="rq-detail-actions">
            <button
              type="button"
              className="db-btn db-btn-outline"
              onClick={() => handleEditMipro(m)}
            >
              <CommonIcon name="fileEdit" size={16} />
              <span>Ubah MIPro</span>
            </button>
          </div>
        </div>

        {/* Grid 2 Kolom Sesuai Desain Request Program */}
        <div className="rq-detail-grid">
          <div className="rq-detail-main">
            {/* Card 1: Informasi lengkap MIPro */}
            <section className="rq-detail-card">
              <h2>Informasi lengkap MIPro</h2>
              <div className="rq-info-grid">
                <div>
                  <small>Tipe dokumen</small>
                  <strong>{m.type}</strong>
                </div>
                <div>
                  <small>Subtipe / Skema</small>
                  <strong>{m.subtype}</strong>
                </div>
                <div>
                  <small>Klasifikasi</small>
                  <strong>{m.type_label}</strong>
                </div>
                <div>
                  <small>Kategori / tema program</small>
                  <strong>{m.category || 'Infrastruktur'}</strong>
                </div>
                <div>
                  <small>Dana yang disalurkan</small>
                  <strong style={{ color: '#078780' }}>{m.disbursement_amount || 'Rp 0'}</strong>
                </div>
                <div>
                  <small>Jumlah penerima manfaat</small>
                  <strong>{m.beneficiaries || '-'} Jiwa/Penerima</strong>
                </div>
                <div>
                  <small>Periode implementasi</small>
                  <strong>{m.period}</strong>
                </div>
                <div>
                  <small>Wilayah / Provinsi</small>
                  <strong>{m.province || 'Jawa Barat'}</strong>
                </div>
                <div>
                  <small>Tanggal pembaruan</small>
                  <strong>{m.updated_date}</strong>
                </div>
                <div>
                  <small>Status memo</small>
                  <strong style={{ color: '#057a6e' }}>Aktif &amp; Disetujui</strong>
                </div>
                {m.partner_name && (
                  <div>
                    <small>Nama mitra kerjasama</small>
                    <strong style={{ color: '#078780' }}>{m.partner_name}</strong>
                  </div>
                )}
                {m.campaign_id && (
                  <div>
                    <small>ID Campaign</small>
                    <strong>ID #{m.campaign_id}</strong>
                  </div>
                )}
              </div>

              {/* Lokasi Program */}
              <div className="rq-detail-desc">
                <small>Permintaan lokasi program (Detail Spesifik)</small>
                <p>{m.location || '-'}</p>
              </div>

              {/* Output yang diinginkan */}
              <div className="rq-detail-desc">
                <small>Output yang diinginkan / output program</small>
                <p>
                  {m.desired_output ||
                    `Terlaksananya kegiatan ${m.title} secara tepat sasaran bagi ${m.beneficiaries || 'masyarakat'} di ${m.location}.`}
                </p>
              </div>

              {/* Latar Belakang & Deskripsi Program */}
              <div className="rq-detail-desc">
                <small>Latar belakang &amp; deskripsi kebutuhan program</small>
                <p>
                  {m.description ||
                    'Program ini diinisiasi untuk memberikan dampak nyata dan terukur bagi penerima manfaat sesuai komitmen program Relawan Nusantara.'}
                </p>
              </div>

              {/* Khusus MIPro 3 Campaign: Tabel Rincian Campaign */}
              {m.subtype === 'Campaign' && m.campaigns && m.campaigns.length > 0 && (
                <div style={{ padding: '0 22px 22px' }}>
                  <small style={{ color: '#697879', fontSize: '11.5px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Rincian Batch Campaign Terdaftar ({m.campaigns.length}):
                  </small>
                  <div style={{ border: '1px solid #edf1f1', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#f8fafa', borderBottom: '1px solid #edf1f1', color: '#697879' }}>
                        <tr>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>ID Campaign</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nama Campaign</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>Periode Donasi</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total DSS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.campaigns.map((c, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #edf1f1' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: '#078780' }}>#{c.campaignId}</td>
                            <td style={{ padding: '8px 12px' }}>{c.campaignName}</td>
                            <td style={{ padding: '8px 12px', color: '#697879' }}>{c.donationPeriod}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#172324' }}>{c.totalDss}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {/* Card 2: Pemohon, mitra & sasaran */}
            <section className="rq-detail-card">
              <h2>Pemohon, mitra &amp; sasaran</h2>
              <div className="rq-info-grid">
                <div>
                  <small>Mitra / organisasi</small>
                  <strong>{m.partner_name || 'Inisiatif Internal Relawan Nusantara'}</strong>
                </div>
                <div>
                  <small>Nama pengaju / PIC program</small>
                  <strong>Tim Program (Cikipi)</strong>
                </div>
                <div>
                  <small>Kontak operasional</small>
                  <strong>program@relawannusantara.org</strong>
                </div>
                <div>
                  <small>Sasaran / target penerima</small>
                  <strong>{m.beneficiaries ? `${m.beneficiaries} Penerima Manfaat` : 'Warga Sasaran'}</strong>
                </div>
                <div>
                  <small>Provinsi / area</small>
                  <strong>{m.province || 'Jawa Barat'}</strong>
                </div>
                <div>
                  <small>Tipe program</small>
                  <strong>{m.subtype === 'Kemitraan' ? 'Program Kemitraan' : m.subtype === 'Campaign' ? 'Program Campaign Publik' : 'Program Aspirasi'}</strong>
                </div>
              </div>
            </section>
          </div>

          {/* Kolom Kanan: Samping */}
          <aside className="rq-detail-side">
            {/* Card Kanan 1: Referensi asal */}
            <section className="rq-detail-card">
              <h2>Referensi asal</h2>
              <button
                type="button"
                className="rq-origin-ref"
                onClick={() => notify(`Membuka berkas pengajuan awal untuk ${m.id}...`)}
              >
                <span className="rq-ref-icon">
                  <CommonIcon name="database" size={18} />
                </span>
                <span className="rq-ref-body">
                  <small>Bank Data / Pengajuan</small>
                  <b>{m.id.replace('MIPRO', 'REQ')}</b>
                  <em>{m.title}</em>
                </span>
                <CommonIcon name="chevronRight" size={15} />
              </button>
            </section>

            {/* Card Kanan 2: Catatan lintas modul */}
            <section className="rq-detail-card">
              <h2>Catatan lintas modul</h2>
              <div className="rq-ref-list">
                {refs.map((refItem) => (
                  <button
                    type="button"
                    key={refItem.id}
                    className="rq-ref-item"
                    onClick={() => notify(`Membuka modul ${refItem.label} (${refItem.id})...`)}
                  >
                    <span className="rq-ref-icon">
                      <CommonIcon name={refItem.icon} size={17} />
                    </span>
                    <span className="rq-ref-body">
                      <small>{refItem.label}</small>
                      <b>{refItem.id}</b>
                      <em>{refItem.sub}</em>
                    </span>
                    <CommonIcon name="chevronRight" size={15} />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    )
  }

  // ==========================================================
  // VIEW: DAFTAR MIPRO (MATCHING ATTACHED IMAGE)
  // ==========================================================
  return (
    <div className="mipro-container">
      {/* 1. Top Header */}
      <div className="mipro-header-row">
        <div className="mipro-title-group">
          <h1 className="mipro-main-title">MIPro</h1>
          <p className="mipro-subtitle">Kelola MIPro program dan campaign dalam satu ruang kerja.</p>
        </div>

        {/* Buat MIPro Button with Interactive Choices Dropdown */}
        <div className="mipro-action-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="mipro-primary-btn"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <Icon name="plus" />
            <span>+ Buat MIPro</span>
            <Icon name="chevronDown" />
          </button>

          {isDropdownOpen && (
            <div className="mipro-dropdown-menu">
              <div className="mipro-dropdown-header">Pilih Tipe MIPro:</div>

              {/* Option 1: Kemitraan */}
              <button
                type="button"
                className="mipro-dropdown-item"
                onClick={() => handleStartCreate('Kemitraan')}
              >
                <div className="mipro-dropdown-icon">
                  <Icon name="shield" />
                </div>
                <div className="mipro-dropdown-text">
                  <span className="mipro-dropdown-title">Kemitraan</span>
                  <span className="mipro-dropdown-desc">MIPro 1 • Program dengan mitra kemitraan (7 isian)</span>
                </div>
              </button>

              {/* Option 2: Aspirasi */}
              <button
                type="button"
                className="mipro-dropdown-item"
                onClick={() => handleStartCreate('Aspirasi')}
              >
                <div className="mipro-dropdown-icon">
                  <Icon name="file" />
                </div>
                <div className="mipro-dropdown-text">
                  <span className="mipro-dropdown-title">Aspirasi</span>
                  <span className="mipro-dropdown-desc">MIPro 2 • Program tanpa mitra dari usulan aspirasi (6 isian)</span>
                </div>
              </button>

              {/* Option 3: Campaign */}
              <button
                type="button"
                className="mipro-dropdown-item"
                onClick={() => handleStartCreate('Campaign')}
              >
                <div className="mipro-dropdown-icon">
                  <Icon name="bullhorn" />
                </div>
                <div className="mipro-dropdown-text">
                  <span className="mipro-dropdown-title">Campaign</span>
                  <span className="mipro-dropdown-desc">MIPro 3 • Program donasi &amp; campaign (6 isian • bisa multi-campaign)</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Starter Cards Section ("Mulai dengan tipe yang sesuai") */}
      <div className="mipro-starter-section">
        <div className="mipro-starter-head">
          <h2 className="mipro-starter-title">Mulai dengan tipe yang sesuai</h2>
          <span className="mipro-starter-sub">Isian mengikuti kebutuhan setiap tipe.</span>
        </div>

        <div className="mipro-cards-grid">
          {/* Card 1: MIPro 1 */}
          <div className="mipro-starter-card">
            <div className="mipro-card-top">
              <div className="mipro-card-icon">
                <Icon name="shield" />
              </div>
              <div className="mipro-card-titles">
                <h3 className="mipro-card-badge-title">MIPro 1</h3>
                <span className="mipro-card-badge-sub">Program dengan mitra</span>
              </div>
            </div>
            <p className="mipro-card-desc">
              Informasi program, mitra, penyaluran dana, dan penerima manfaat.
            </p>
            <div className="mipro-card-footer">
              <span className="mipro-card-isian">7 isian</span>
              <button
                type="button"
                className="mipro-card-btn"
                onClick={() => handleStartCreate('Kemitraan')}
              >
                <span>Buat MIPro</span>
                <Icon name="arrowRight" />
              </button>
            </div>
          </div>

          {/* Card 2: MIPro 2 */}
          <div className="mipro-starter-card">
            <div className="mipro-card-top">
              <div className="mipro-card-icon">
                <Icon name="file" />
              </div>
              <div className="mipro-card-titles">
                <h3 className="mipro-card-badge-title">MIPro 2</h3>
                <span className="mipro-card-badge-sub">Program tanpa mitra</span>
              </div>
            </div>
            <p className="mipro-card-desc">
              Informasi program, penyaluran dana, dan penerima manfaat.
            </p>
            <div className="mipro-card-footer">
              <span className="mipro-card-isian">6 isian</span>
              <button
                type="button"
                className="mipro-card-btn"
                onClick={() => handleStartCreate('Aspirasi')}
              >
                <span>Buat MIPro</span>
                <Icon name="arrowRight" />
              </button>
            </div>
          </div>

          {/* Card 3: MIPro 3 */}
          <div className="mipro-starter-card">
            <div className="mipro-card-top">
              <div className="mipro-card-icon">
                <Icon name="bullhorn" />
              </div>
              <div className="mipro-card-titles">
                <h3 className="mipro-card-badge-title">MIPro 3</h3>
                <span className="mipro-card-badge-sub">Campaign</span>
              </div>
            </div>
            <p className="mipro-card-desc">
              Identitas campaign, periode donasi, total DSS, program, dan keterangan.
            </p>
            <div className="mipro-card-footer">
              <span className="mipro-card-isian">6 isian • Multi-campaign</span>
              <button
                type="button"
                className="mipro-card-btn"
                onClick={() => handleStartCreate('Campaign')}
              >
                <span>Buat MIPro</span>
                <Icon name="arrowRight" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Section ("Daftar MIPro") */}
      <div className="mipro-list-card">
        <div className="mipro-list-head">
          <div className="mipro-list-title-wrap">
            <div className="mipro-list-title-badge">
              <h2 className="mipro-list-title">Daftar MIPro</h2>
              <span className="mipro-data-badge">Data ilustratif</span>
            </div>
            <p className="mipro-list-sub">
              Cari dan temukan MIPro berdasarkan nama, tipe, atau ID campaign.
            </p>
          </div>
          <span className="mipro-list-count">{counts.total} MIPro</span>
        </div>

        {/* Search & Sort */}
        <div className="mipro-search-row">
          <div className="mipro-search-box">
            <Icon name="search" />
            <input
              type="text"
              className="mipro-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama program, campaign, atau ID campaign..."
            />
          </div>
          <button
            type="button"
            className="mipro-sort-btn"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
          >
            <Icon name="sort" />
            <span>Terbaru</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mipro-tabs-pills">
          <button
            type="button"
            className={`mipro-pill-btn ${activeTab === 'Semua' ? 'active' : ''}`}
            onClick={() => setActiveTab('Semua')}
          >
            Semua tipe {counts.total}
          </button>
          <button
            type="button"
            className={`mipro-pill-btn ${activeTab === 'MIPro 1' ? 'active' : ''}`}
            onClick={() => setActiveTab('MIPro 1')}
          >
            MIPro 1 {counts.mipro1}
          </button>
          <button
            type="button"
            className={`mipro-pill-btn ${activeTab === 'MIPro 2' ? 'active' : ''}`}
            onClick={() => setActiveTab('MIPro 2')}
          >
            MIPro 2 {counts.mipro2}
          </button>
          <button
            type="button"
            className={`mipro-pill-btn ${activeTab === 'MIPro 3' ? 'active' : ''}`}
            onClick={() => setActiveTab('MIPro 3')}
          >
            MIPro 3 {counts.mipro3}
          </button>
        </div>

        {/* Data Table */}
        <div className="mipro-table-wrap">
          <table className="mipro-table">
            <thead>
              <tr>
                <th>NAMA PROGRAM / CAMPAIGN</th>
                <th>TIPE</th>
                <th>PERIODE</th>
                <th>DIPERBARUI</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px 20px', color: '#889899' }}>
                    Tidak ada data MIPro yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedMipro(item)
                      setView('detail')
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Nama Program / Campaign */}
                    <td>
                      <div className="mipro-prog-cell">
                        <div className="mipro-cell-icon">
                          <Icon name="file" />
                        </div>
                        <div className="mipro-cell-titles">
                          <p className="mipro-cell-title">{item.title}</p>
                          <p className="mipro-cell-sub">{item.type_label}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipe */}
                    <td>
                      <span className="mipro-type-badge">{item.type}</span>
                    </td>

                    {/* Periode */}
                    <td>
                      <span className="mipro-date-val">{item.period}</span>
                    </td>

                    {/* Diperbarui */}
                    <td>
                      <span className="mipro-date-val">{item.updated_date}</span>
                    </td>

                    {/* Aksi */}
                    <td>
                      <button
                        type="button"
                        className="mipro-eye-btn"
                        title={`Lihat detail ${item.title}`}
                        aria-label={`Lihat detail ${item.title}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMipro(item)
                          setView('detail')
                        }}
                      >
                        <Icon name="eye" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="mipro-pagination-bar">
          <span>Menampilkan 1–{filteredList.length} dari {filteredList.length} MIPro</span>
          <div className="mipro-page-controls">
            <button type="button" className="mipro-nav-btn" disabled>
              Sebelumnya
            </button>
            <span className="mipro-page-num">1</span>
            <button type="button" className="mipro-nav-btn" disabled>
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Information Note */}
      <div className="mipro-bottom-note">
        <Icon name="info" />
        <span>
          MIPro 1 dan MIPro 2 memakai informasi program yang sama; MIPro 1 menambahkan Nama Mitra. MIPro 3 khusus campaign.
        </span>
      </div>
    </div>
  )
}

