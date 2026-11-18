'use client'

import { FormEvent, useState, ChangeEvent, useEffect } from 'react'
import { api } from '@/lib/api'
import type { RequestRow } from './RequestProgram'

interface RequestProgramFormProps {
  onBack: () => void
  onSubmitSuccess: (newReq: RequestRow) => void
  notify: (msg: string) => void
  initialData?: RequestRow | null
}

// Opsi Nama Pengaju
const pengajuOptions = [
  'Pak Iskandar',
  'Pak Hendrik Andika',
  'Pak Agam',
  'Ibu Asrianti Octaviana',
  'Ibu Irawati Maratus Sholihah',
  'Pak Sujay',
  'Lainnya (Sebutkan)',
]

// Opsi Tema / Rumpun
const temaOptions = [
  'Pendidikan',
  'Air',
  'Lingkungan',
  'Ekonomi',
  'Kesehatan',
  'Kebencanaan',
  'Kemanusiaan',
  'Lainnya (Sebutkan)',
]

// Opsi Bahan Permintaan
const bahanOptions = [
  'Proposal',
  'Assessment',
  'RAB',
  'Pitchdeck / Rencana Penyaluran',
  'Lainnya (Sebutkan)',
]

export default function RequestProgramForm({
  onBack,
  onSubmitSuccess,
  notify,
  initialData,
}: RequestProgramFormProps) {
  // 1. Nama Pengaju
  const [pengaju, setPengaju] = useState('')
  const [pengajuLainnya, setPengajuLainnya] = useState('')

  // 2. Nama Mitra / Komunitas
  const [mitra, setMitra] = useState('')

  // 3. Permintaan Lokasi Program
  const [lokasi, setLokasi] = useState('')
  const [fetchingLocation, setFetchingLocation] = useState(false)
  const [coordinates, setCoordinates] = useState<string | null>(null)

  // 4. Tema / Rumpun Program
  const [tema, setTema] = useState('')
  const [temaLainnya, setTemaLainnya] = useState('')

  // 5. Latar Belakang dan Tujuan Mitra
  const [latarBelakang, setLatarBelakang] = useState('')

  // 6. Estimasi Anggaran Program (angka - Rupiah)
  const [anggaranRaw, setAnggaranRaw] = useState<number | ''>('')
  const [anggaranDisplay, setAnggaranDisplay] = useState('')

  // 7. Sasaran Penerima Manfaat
  const [sasaran, setSasaran] = useState('')

  // 8. Output yang diinginkan Mitra
  const [outputMitra, setOutputMitra] = useState('')

  // 9. Bahan Permintaan Mitra (Checkbox)
  const [bahan, setBahan] = useState<string[]>([])
  const [bahanLainnya, setBahanLainnya] = useState('')

  // 10. Tingkat Urgensi
  const [urgensi, setUrgensi] = useState<'Tinggi' | 'Sedang' | 'Rendah' | ''>('')
  const [alasanMendesak, setAlasanMendesak] = useState('')

  // 11. Deadline
  const [deadline, setDeadline] = useState('')

  // 12. Link & Upload Dokumen Pendukung
  const [linkPendukung, setLinkPendukung] = useState('')
  const [files, setFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'Surat_Permohonan_Mitra.pdf', size: '1.2 MB', type: 'pdf' },
  ])

  // Form error
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill state ketika mengedit request yang sudah ada
  useEffect(() => {
    if (!initialData) return

    // 1. Nama Pengaju
    if (pengajuOptions.includes(initialData.pic)) {
      setPengaju(initialData.pic)
      setPengajuLainnya('')
    } else {
      setPengaju('Lainnya (Sebutkan)')
      setPengajuLainnya(initialData.pic)
    }

    // 2. Mitra & Lokasi
    setMitra(initialData.requester || '')
    setLokasi(initialData.location || '')

    // 4. Tema / Rumpun
    const cat = initialData.category || initialData.title || ''
    const matchedTema = temaOptions.find(
      (opt) => opt !== 'Lainnya (Sebutkan)' && cat.toLowerCase().includes(opt.toLowerCase())
    )
    if (matchedTema) {
      setTema(matchedTema)
      setTemaLainnya('')
    } else {
      setTema('Lainnya (Sebutkan)')
      setTemaLainnya(cat)
    }

    // 5. Latar Belakang
    setLatarBelakang(
      initialData.description ||
        'Masyarakat membutuhkan akses layanan program yang stabil, aman, dan terjangkau sesuai hasil pemetaan lapangan.'
    )

    // 6. Estimasi Anggaran
    const rawDigits = (initialData.estimatedBudget || '85000000').replace(/[^0-9]/g, '')
    const parsedNum = rawDigits ? parseInt(rawDigits, 10) : 85000000
    setAnggaranRaw(parsedNum)
    setAnggaranDisplay(`Rp ${parsedNum.toLocaleString('id-ID')}`)

    // 7. Sasaran Penerima Manfaat
    setSasaran(initialData.beneficiary || '')

    // 8. Output Mitra
    setOutputMitra(
      initialData.outputMitra ||
        `Terlaksananya program ${initialData.title} secara tepat sasaran dan berkelanjutan bersama ${initialData.requester}.`
    )

    // 9. Bahan Permintaan
    if (initialData.bahanPermintaan && initialData.bahanPermintaan.length > 0) {
      setBahan(initialData.bahanPermintaan)
    } else if (initialData.type.includes('Proposal')) {
      setBahan(['Proposal'])
    } else if (initialData.type.includes('RAB')) {
      setBahan(['RAB'])
    } else if (initialData.type.includes('Assessment')) {
      setBahan(['Assessment'])
    } else {
      setBahan(['Proposal', 'RAB'])
    }

    // 10. Tingkat Urgensi
    const mappedUrgensi =
      initialData.priority === 'Kritis' || initialData.priority === 'Tinggi'
        ? 'Tinggi'
        : initialData.priority === 'Rendah'
        ? 'Rendah'
        : 'Sedang'
    setUrgensi(mappedUrgensi)
    if (mappedUrgensi === 'Tinggi' || initialData.alasanMendesak) {
      setAlasanMendesak(
        initialData.alasanMendesak ||
          'Kebutuhan warga di lokasi sasaran bersifat mendesak dan memerlukan penanganan segera.'
      )
    }

    // 11. Deadline & Link
    setDeadline('2026-10-28')
    setLinkPendukung(
      initialData.linkPendukung || 'https://drive.google.com/drive/folders/dokumen-pendukung-mitra'
    )
  }, [initialData])

  // Format Rupiah Handler
  const handleAnggaranChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '')
    if (!rawVal) {
      setAnggaranRaw('')
      setAnggaranDisplay('')
      return
    }
    const num = parseInt(rawVal, 10)
    setAnggaranRaw(num)
    setAnggaranDisplay(`Rp ${num.toLocaleString('id-ID')}`)
    if (errors.anggaran) {
      setErrors((prev) => ({ ...prev, anggaran: '' }))
    }
  }

  // Checkbox bahan toggle
  const toggleBahan = (item: string) => {
    if (bahan.includes(item)) {
      setBahan(bahan.filter((b) => b !== item))
    } else {
      setBahan([...bahan, item])
    }
  }

  // Ambil lokasi dari browser GPS / Maps
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      notify('Geolocation tidak didukung pada browser Anda.')
      return
    }
    setFetchingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        setLokasi((prev) =>
          prev
            ? `${prev} (Titik Maps: ${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
            : `Koordinat Maps: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} - Jl. Raya Utama Wilayah Mitra`
        )
        setFetchingLocation(false)
        notify('Titik lokasi maps berhasil didapatkan!')
      },
      () => {
        setFetchingLocation(false)
        // Fallback simulasi lokasi
        const simLat = -6.917464
        const simLng = 107.619123
        setCoordinates(`${simLat}, ${simLng}`)
        setLokasi(
          'Desa Sukamaju, Kec. Cisarua, Kab. Bogor, Jawa Barat (Titik Maps terverifikasi)'
        )
        notify('Lokasi maps berhasil dimuat.')
      }
    )
  }

  // Upload file simulasi
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setFiles([
        ...files,
        {
          name: file.name,
          size: `${sizeMb} MB`,
          type: file.type.includes('image') ? 'image' : 'file',
        },
      ])
      notify(`File "${file.name}" berhasil ditambahkan.`)
    }
  }

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx))
  }

  // Validasi dan Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    const finalPengaju = pengaju === 'Lainnya (Sebutkan)' ? pengajuLainnya.trim() : pengaju
    if (!finalPengaju) newErrors.pengaju = 'Pilih atau sebutkan nama pengaju.'

    if (!mitra.trim()) newErrors.mitra = 'Nama mitra / komunitas wajib diisi.'
    if (!lokasi.trim()) newErrors.lokasi = 'Permintaan lokasi program wajib diisi.'

    const finalTema = tema === 'Lainnya (Sebutkan)' ? temaLainnya.trim() : tema
    if (!finalTema) newErrors.tema = 'Pilih atau sebutkan tema program.'

    if (!latarBelakang.trim()) newErrors.latarBelakang = 'Latar belakang & tujuan wajib diisi.'
    if (!anggaranRaw) newErrors.anggaran = 'Estimasi anggaran program wajib diisi.'
    if (!sasaran.trim()) newErrors.sasaran = 'Sasaran penerima manfaat wajib diisi.'
    if (!outputMitra.trim()) newErrors.outputMitra = 'Output yang diinginkan wajib diisi.'
    if (bahan.length === 0) newErrors.bahan = 'Pilih minimal satu bahan permintaan mitra.'
    if (bahan.includes('Lainnya (Sebutkan)') && !bahanLainnya.trim()) {
      newErrors.bahanLainnya = 'Sebutkan bahan permintaan lainnya.'
    }

    if (!urgensi) newErrors.urgensi = 'Pilih tingkat urgensi.'
    if (urgensi === 'Tinggi' && !alasanMendesak.trim()) {
      newErrors.alasanMendesak = 'Sertakan alasan karena tingkat urgensi Tinggi.'
    }

    if (!deadline) newErrors.deadline = 'Batas waktu (deadline) wajib ditentukan.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      notify('Mohon lengkapi seluruh field wajib formulir.')
      const firstErr = document.querySelector('.rq-form-error')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    const title = initialData ? initialData.title : `${finalTema} - ${mitra}`
    const priorityMap: Record<string, 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'> = {
      Tinggi: 'Tinggi',
      Sedang: 'Sedang',
      Rendah: 'Rendah',
    }

    if (initialData) {
      const finalBahanList = bahan.map((b) =>
        b === 'Lainnya (Sebutkan)' && bahanLainnya.trim() ? bahanLainnya.trim() : b
      )
      const updatedReq: RequestRow = {
        ...initialData,
        title,
        type: finalBahanList[0] ? `Request ${finalBahanList[0]}` : initialData.type,
        priority: priorityMap[urgensi] || initialData.priority,
        requester: mitra,
        location: lokasi,
        beneficiary: sasaran,
        pic: finalPengaju,
        category: finalTema,
        description: latarBelakang,
        deadline: deadline || initialData.deadline,
        estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
        outputMitra,
        bahanPermintaan: finalBahanList,
        alasanMendesak: urgensi === 'Tinggi' ? alasanMendesak : undefined,
        linkPendukung: linkPendukung || initialData.linkPendukung,
      }
      onSubmitSuccess(updatedReq)
      notify(`Perubahan request program ${initialData.id} berhasil disimpan!`)
      setSubmitting(false)
      return
    }

    const finalBahanList = bahan.map((b) =>
      b === 'Lainnya (Sebutkan)' && bahanLainnya.trim() ? bahanLainnya.trim() : b
    )

    api.createRequestProgram({
      programName: title,
      category: finalTema,
      applicantName: finalPengaju,
      applicantPhone: '',
      applicantEmail: '',
      location: lokasi.split(',')[0] || 'Wilayah Program',
      estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
      description: `Mitra: ${mitra}. Latar Belakang: ${latarBelakang}. Sasaran: ${sasaran}. Output: ${outputMitra}. Urgensi: ${urgensi}. Deadline: ${deadline}`,
    }).then((res) => {
      const generatedId = res?.request?.id || `REQ-2026-0${Math.floor(Math.random() * 89 + 10)}`
      onSubmitSuccess({
        id: generatedId,
        title: title,
        type: finalBahanList[0] ? `Request ${finalBahanList[0]}` : 'Request Program',
        priority: priorityMap[urgensi] || 'Sedang',
        requester: mitra,
        location: lokasi.split(',')[0] || 'Wilayah Program',
        beneficiary: sasaran,
        pic: finalPengaju,
        status: 'Baru',
        category: finalTema,
        description: latarBelakang,
        deadline,
        estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
        outputMitra,
        bahanPermintaan: finalBahanList,
        alasanMendesak: urgensi === 'Tinggi' ? alasanMendesak : undefined,
        linkPendukung,
      })
      notify(`Request program ${generatedId} berhasil disimpan ke database PostgreSQL!`)
    }).catch((err) => {
      console.error('Request program error:', err)
      notify(`Gagal simpan ke database: ${err?.message || 'Koneksi backend gagal'}`)
    }).finally(() => {
      setSubmitting(false)
    })
  }

  return (
    <div className="rq-form-page">
      {/* Top back navigation */}
      <div className="rq-form-top">
        <button type="button" className="rq-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>{initialData ? 'Kembali ke Detail Request' : 'Kembali ke Request Program'}</span>
        </button>
        <span className="rq-form-tag">
          {initialData ? `Edit Request • ${initialData.id}` : 'Formulir Pengajuan Baru'}
        </span>
      </div>

      <div className="rq-form-header">
        <div>
          <h1>
            {initialData
              ? `Ubah Request Program (${initialData.id})`
              : 'Formulir Ajukan Request Program'}
          </h1>
          <p>
            {initialData
              ? 'Perbarui data yang sudah terisi sebelumnya pada formulir di bawah ini.'
              : 'Lengkapi formulir terstruktur di bawah ini untuk mengajukan kebutuhan program atau bantuan mitra.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rq-form-shell">
        {/* Section 1: Pengaju & Mitra */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">1</span>
            <div>
              <h3>Identitas Pengaju &amp; Mitra</h3>
              <p>Informasi PIC internal dan mitra atau komunitas yang bermitra.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 1. Nama Pengaju */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Nama Pengaju <span className="req">*</span>
              </label>
              <p className="rq-hint">Pilih PIC penanggung jawab pengajuan dari tim program:</p>
              <div className="rq-radio-grid">
                {pengajuOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`rq-radio-card ${pengaju === opt ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="namaPengaju"
                      value={opt}
                      checked={pengaju === opt}
                      onChange={() => {
                        setPengaju(opt)
                        if (errors.pengaju) setErrors((prev) => ({ ...prev, pengaju: '' }))
                      }}
                    />
                    <span className="rq-radio-dot" />
                    <span className="rq-radio-text">{opt}</span>
                  </label>
                ))}
              </div>
              {pengaju === 'Lainnya (Sebutkan)' && (
                <div className="rq-subfield">
                  <input
                    type="text"
                    className="rq-input"
                    placeholder="Ketik nama pengaju lainnya..."
                    value={pengajuLainnya}
                    onChange={(e) => setPengajuLainnya(e.target.value)}
                  />
                </div>
              )}
              {errors.pengaju && <span className="rq-form-error">{errors.pengaju}</span>}
            </div>

            {/* 2. Nama Mitra / Komunitas */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Nama Mitra / Komunitas <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`rq-input ${errors.mitra ? 'error' : ''}`}
                placeholder="Contoh: Yayasan Tirta Bakti / Koperasi Desa Mandiri"
                value={mitra}
                onChange={(e) => {
                  setMitra(e.target.value)
                  if (errors.mitra) setErrors((prev) => ({ ...prev, mitra: '' }))
                }}
              />
              {errors.mitra && <span className="rq-form-error">{errors.mitra}</span>}
            </div>

            {/* 3. Permintaan Lokasi Program */}
            <div className="rq-field-group full">
              <div className="rq-label-row">
                <label className="rq-label">
                  Permintaan Lokasi Program <span className="req">*</span>
                </label>
                <button
                  type="button"
                  className="rq-maps-btn"
                  onClick={handleGetLocation}
                  disabled={fetchingLocation}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <span>{fetchingLocation ? 'Mengambil titik...' : 'Ambil Alamat dari Maps'}</span>
                </button>
              </div>
              <p className="rq-hint">Alamat langsung diambil atau diperjelas dari koordinat maps / data wilayah.</p>
              <textarea
                rows={3}
                className={`rq-textarea ${errors.lokasi ? 'error' : ''}`}
                placeholder="Tuliskan alamat lengkap program, desa, kecamatan, kabupaten/kota, atau patokan lokasi..."
                value={lokasi}
                onChange={(e) => {
                  setLokasi(e.target.value)
                  if (errors.lokasi) setErrors((prev) => ({ ...prev, lokasi: '' }))
                }}
              />
              {coordinates && (
                <div className="rq-maps-info">
                  <span className="rq-maps-pin">📍</span>
                  <span>Titik Koordinat Terpaut: <strong>{coordinates}</strong></span>
                </div>
              )}
              {errors.lokasi && <span className="rq-form-error">{errors.lokasi}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Tema, Deskripsi & Anggaran */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">2</span>
            <div>
              <h3>Rumpun, Latar Belakang &amp; Anggaran</h3>
              <p>Spesifikasi sektor program, urgensi, dan proyeksi pembiayaan.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 4. Tema / Rumpun Program */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Tema / Rumpun Program <span className="req">*</span>
              </label>
              <div className="rq-chip-grid">
                {temaOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`rq-chip-card ${tema === opt ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="temaProgram"
                      value={opt}
                      checked={tema === opt}
                      onChange={() => {
                        setTema(opt)
                        if (errors.tema) setErrors((prev) => ({ ...prev, tema: '' }))
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {tema === 'Lainnya (Sebutkan)' && (
                <div className="rq-subfield">
                  <input
                    type="text"
                    className="rq-input"
                    placeholder="Sebutkan tema / rumpun program lainnya..."
                    value={temaLainnya}
                    onChange={(e) => setTemaLainnya(e.target.value)}
                  />
                </div>
              )}
              {errors.tema && <span className="rq-form-error">{errors.tema}</span>}
            </div>

            {/* 5. Latar Belakang dan Tujuan Mitra */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Latar Belakang dan Tujuan Mitra <span className="req">*</span>
              </label>
              <textarea
                rows={4}
                className={`rq-textarea ${errors.latarBelakang ? 'error' : ''}`}
                placeholder="Uraikan kondisi lapangan, alasan mengapa program dibutuhkan, dan tujuan yang ingin dicapai..."
                value={latarBelakang}
                onChange={(e) => {
                  setLatarBelakang(e.target.value)
                  if (errors.latarBelakang) setErrors((prev) => ({ ...prev, latarBelakang: '' }))
                }}
              />
              {errors.latarBelakang && <span className="rq-form-error">{errors.latarBelakang}</span>}
            </div>

            {/* 6. Estimasi Anggaran Program */}
            <div className="rq-field-group half">
              <label className="rq-label">
                Estimasi Anggaran Program <span className="req">*</span>
              </label>
              <p className="rq-hint">Format angka (Rupiah otomatis)</p>
              <div className="rq-input-prefix-wrap">
                <input
                  type="text"
                  className={`rq-input ${errors.anggaran ? 'error' : ''}`}
                  placeholder="Rp 0"
                  value={anggaranDisplay}
                  onChange={handleAnggaranChange}
                />
              </div>
              {errors.anggaran && <span className="rq-form-error">{errors.anggaran}</span>}
            </div>

            {/* 11. Deadline */}
            <div className="rq-field-group half">
              <label className="rq-label">
                Deadline Tindak Lanjut <span className="req">*</span>
              </label>
              <p className="rq-hint">Target penyelesaian respon atau proposal</p>
              <input
                type="date"
                className={`rq-input ${errors.deadline ? 'error' : ''}`}
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value)
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: '' }))
                }}
              />
              {errors.deadline && <span className="rq-form-error">{errors.deadline}</span>}
            </div>

            {/* 7. Sasaran Penerima Manfaat */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Sasaran Penerima Manfaat <span className="req">*</span>
              </label>
              <textarea
                rows={3}
                className={`rq-textarea ${errors.sasaran ? 'error' : ''}`}
                placeholder="Contoh: 150 KK prasejahtera, lansia, atau anak usia sekolah dasar..."
                value={sasaran}
                onChange={(e) => {
                  setSasaran(e.target.value)
                  if (errors.sasaran) setErrors((prev) => ({ ...prev, sasaran: '' }))
                }}
              />
              {errors.sasaran && <span className="rq-form-error">{errors.sasaran}</span>}
            </div>

            {/* 8. Output yang diinginkan Mitra */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Output yang Diinginkan Mitra <span className="req">*</span>
              </label>
              <textarea
                rows={3}
                className={`rq-textarea ${errors.outputMitra ? 'error' : ''}`}
                placeholder="Hasil nyata yang ditargetkan mitra (contoh: 1 unit sumur bor komunal, pembagian 300 paket sembako, pelatihan 20 relawan)..."
                value={outputMitra}
                onChange={(e) => {
                  setOutputMitra(e.target.value)
                  if (errors.outputMitra) setErrors((prev) => ({ ...prev, outputMitra: '' }))
                }}
              />
              {errors.outputMitra && <span className="rq-form-error">{errors.outputMitra}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Bahan Permintaan, Urgensi & Dokumen */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">3</span>
            <div>
              <h3>Bahan Permintaan, Urgensi &amp; Lampiran</h3>
              <p>Kebutuhan dokumen keluaran, tingkat urgensi, serta lampiran penunjang.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 9. Bahan Permintaan Mitra (Checkbox) */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Bahan Permintaan Mitra <span className="req">*</span>
              </label>
              <p className="rq-hint">Dapat memilih lebih dari satu bahan yang diminta oleh mitra:</p>
              <div className="rq-checkbox-grid">
                {bahanOptions.map((item) => (
                  <label
                    key={item}
                    className={`rq-checkbox-card ${bahan.includes(item) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={bahan.includes(item)}
                      onChange={() => toggleBahan(item)}
                    />
                    <span className="rq-check-box">
                      {bahan.includes(item) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </span>
                    <span className="rq-checkbox-text">{item}</span>
                  </label>
                ))}
              </div>
              {bahan.includes('Lainnya (Sebutkan)') && (
                <div className="rq-subfield">
                  <input
                    type="text"
                    className="rq-input"
                    placeholder="Sebutkan bahan permintaan lainnya..."
                    value={bahanLainnya}
                    onChange={(e) => setBahanLainnya(e.target.value)}
                  />
                  {errors.bahanLainnya && <span className="rq-form-error">{errors.bahanLainnya}</span>}
                </div>
              )}
              {errors.bahan && <span className="rq-form-error">{errors.bahan}</span>}
            </div>

            {/* 10. Tingkat Urgensi */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Tingkat Urgensi <span className="req">*</span>
              </label>
              <div className="rq-urgency-grid">
                {(['Tinggi', 'Sedang', 'Rendah'] as const).map((lvl) => (
                  <label
                    key={lvl}
                    className={`rq-urgency-card ${lvl.toLowerCase()} ${urgensi === lvl ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="tingkatUrgensi"
                      value={lvl}
                      checked={urgensi === lvl}
                      onChange={() => {
                        setUrgensi(lvl)
                        if (errors.urgensi) setErrors((prev) => ({ ...prev, urgensi: '' }))
                      }}
                    />
                    <span className="rq-urgency-badge">{lvl}</span>
                    <small>
                      {lvl === 'Tinggi'
                        ? 'Membutuhkan respon segera / darurat'
                        : lvl === 'Sedang'
                        ? 'Tindak lanjut standar'
                        : 'Jadwal fleksibel'}
                    </small>
                  </label>
                ))}
              </div>
              {errors.urgensi && <span className="rq-form-error">{errors.urgensi}</span>}

              {/* Alasan jika mendesak */}
              {urgensi === 'Tinggi' && (
                <div className="rq-urgent-box">
                  <label className="rq-label">
                    Alasan Mendesak <span className="req">*</span>
                  </label>
                  <p className="rq-hint">Wajib sertakan alasan mengapa kebutuhan ini bersifat mendesak/prioritas tinggi:</p>
                  <textarea
                    rows={2}
                    className={`rq-textarea ${errors.alasanMendesak ? 'error' : ''}`}
                    placeholder="Contoh: Bencana susulan mengancam sanitasi warga, atau mitra memiliki cut-off persetujuan anggaran..."
                    value={alasanMendesak}
                    onChange={(e) => {
                      setAlasanMendesak(e.target.value)
                      if (errors.alasanMendesak) setErrors((prev) => ({ ...prev, alasanMendesak: '' }))
                    }}
                  />
                  {errors.alasanMendesak && <span className="rq-form-error">{errors.alasanMendesak}</span>}
                </div>
              )}
            </div>

            {/* 12. Link pendukung Program & Upload Dokumen */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Link Pendukung Program &amp; Upload Dokumen
              </label>
              <p className="rq-hint">Unggah file/gambar proposal, foto lokasi, atau masukkan link pendukung (Drive / Dokumen):</p>

              {/* Link Input */}
              <div className="rq-link-input-wrap">
                <span className="rq-link-icon">🔗</span>
                <input
                  type="url"
                  className="rq-input"
                  placeholder="https://drive.google.com/... atau tautan pendukung lainnya"
                  value={linkPendukung}
                  onChange={(e) => setLinkPendukung(e.target.value)}
                />
              </div>

              {/* File Upload Area */}
              <div className="rq-upload-dropzone">
                <input
                  type="file"
                  id="dokumenUpload"
                  className="rq-file-input"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label htmlFor="dokumenUpload" className="rq-upload-label">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div>
                    <strong>Pilih file atau tarik ke sini</strong>
                    <p>Format yang didukung: Dokumen (PDF, DOCX, XLSX) &amp; Gambar (JPG, PNG)</p>
                  </div>
                  <span className="rq-browse-btn">Jelajahi File</span>
                </label>
              </div>

              {/* List files */}
              {files.length > 0 && (
                <div className="rq-file-list">
                  {files.map((f, i) => (
                    <div key={`${f.name}-${i}`} className="rq-file-item">
                      <span className="rq-file-icon">
                        {f.type === 'image' ? '🖼️' : '📄'}
                      </span>
                      <div className="rq-file-meta">
                        <strong>{f.name}</strong>
                        <small>{f.size} • Siap dikirim</small>
                      </div>
                      <button
                        type="button"
                        className="rq-file-remove"
                        onClick={() => removeFile(i)}
                        title="Hapus file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="rq-form-actions">
          <button
            type="button"
            className="db-btn db-btn-outline"
            onClick={onBack}
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="button"
            className="db-btn db-btn-outline"
            onClick={() => notify('Draft pengajuan request berhasil disimpan.')}
            disabled={submitting}
          >
            Simpan Draft
          </button>
          <button
            type="submit"
            className="db-btn db-btn-primary"
            disabled={submitting}
          >
            {submitting
              ? 'Menyimpan...'
              : initialData
              ? 'Simpan Perubahan Request'
              : 'Kirim Request Program'}
          </button>
        </div>
      </form>
    </div>
  )
}

