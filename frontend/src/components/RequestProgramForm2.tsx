'use client'

import { FormEvent, useState, ChangeEvent, useEffect } from 'react'
import { api } from '@/lib/api'
import type { RequestRow } from './RequestProgram'

interface RequestProgramForm2Props {
  onBack: () => void
  onSubmitSuccess: (newReq: RequestRow) => void
  notify: (msg: string) => void
  initialData?: RequestRow | null
}

export default function RequestProgramForm2({
  onBack,
  onSubmitSuccess,
  notify,
  initialData,
}: RequestProgramForm2Props) {
  // 1. Nama Pengaju (Short Answer)
  const [pengaju, setPengaju] = useState('')

  // 2. Lokasi Program (Short Answer by maps)
  const [lokasi, setLokasi] = useState('')
  const [coordinates, setCoordinates] = useState<string | null>(null)
  const [fetchingLocation, setFetchingLocation] = useState(false)

  // 3. Latar Belakang / Tujuan Program (Paragraf)
  const [latarBelakang, setLatarBelakang] = useState('')

  // 4. Estimasi Anggaran Program (Short Answer: angka - Rupiah)
  const [anggaranRaw, setAnggaranRaw] = useState<number | ''>('')
  const [anggaranDisplay, setAnggaranDisplay] = useState('')

  // 5. Target Penerima Manfaat (Short Answer: angka)
  const [targetPenerima, setTargetPenerima] = useState('')

  // 6. Output Program (Paragraf)
  const [outputProgram, setOutputProgram] = useState('')

  // 7. Tingkat Urgensi (Multiple Choice: Tinggi, Sedang, Rendah; sertakan alasan jika mendesak)
  const [urgensi, setUrgensi] = useState<'Tinggi' | 'Sedang' | 'Rendah' | ''>('')
  const [alasanMendesak, setAlasanMendesak] = useState('')

  // 8. Dokumen Assessment (Upload gambar dan file)
  const [dokumenFiles, setDokumenFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'Hasil_Observasi_Assessment_Awal.pdf', size: '2.4 MB', type: 'file' },
  ])

  // Form errors & submitting state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill state ketika mengedit request yang sudah ada
  useEffect(() => {
    if (!initialData) return
    setPengaju(initialData.pic || '')
    setLokasi(initialData.location || '')
    setLatarBelakang(
      initialData.description ||
        'Masyarakat membutuhkan dukungan program lapangan yang sesuai hasil pemetaan kebutuhan warga.'
    )
    const rawDigits = (initialData.estimatedBudget || '65000000').replace(/[^0-9]/g, '')
    const parsedNum = rawDigits ? parseInt(rawDigits, 10) : 65000000
    setAnggaranRaw(parsedNum)
    setAnggaranDisplay(`Rp ${parsedNum.toLocaleString('id-ID')}`)
    const digits = (initialData.beneficiary || '').match(/\d+/)?.[0] || '315'
    setTargetPenerima(digits)
    setOutputProgram(
      initialData.outputMitra ||
        `Pelaksanaan assessment dan penyaluran program ${initialData.title} di ${initialData.location}.`
    )
    const mappedUrgensi =
      initialData.priority === 'Kritis' || initialData.priority === 'Tinggi'
        ? 'Tinggi'
        : initialData.priority === 'Rendah'
        ? 'Rendah'
        : 'Sedang'
    setUrgensi(mappedUrgensi)
    if (mappedUrgensi === 'Tinggi' || initialData.alasanMendesak) {
      setAlasanMendesak(
        initialData.alasanMendesak || 'Kondisi di lapangan memerlukan tindak lanjut segera.'
      )
    }
  }, [initialData])

  // Handler Format Anggaran Rupiah
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

  // Handler Target Penerima (hanya angka)
  const handleTargetPenerimaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '')
    setTargetPenerima(rawVal)
    if (errors.targetPenerima) {
      setErrors((prev) => ({ ...prev, targetPenerima: '' }))
    }
  }

  // Handler Ambil Lokasi by Maps / Geolocation
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
        setLokasi(`Titik Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        setFetchingLocation(false)
        notify('Titik lokasi maps berhasil didapatkan!')
      },
      () => {
        setFetchingLocation(false)
        // Fallback koordinat
        const lat = -6.208763
        const lng = 106.845599
        setCoordinates(`${lat}, ${lng}`)
        setLokasi(`Jakarta & Sekitarnya (Maps: ${lat}, ${lng})`)
        notify('Lokasi maps berhasil dimuat.')
      }
    )
  }

  // Handler Upload Dokumen Assessment
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setDokumenFiles([
        ...dokumenFiles,
        {
          name: file.name,
          size: `${sizeMb} MB`,
          type: file.type.includes('image') ? 'image' : 'file',
        },
      ])
      notify(`Dokumen assessment "${file.name}" berhasil diunggah.`)
    }
  }

  const removeFile = (idx: number) => {
    setDokumenFiles(dokumenFiles.filter((_, i) => i !== idx))
  }

  // Handler Form Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!pengaju.trim()) newErrors.pengaju = 'Nama pengaju wajib diisi.'
    if (!lokasi.trim()) newErrors.lokasi = 'Lokasi program (by maps) wajib diisi.'
    if (!latarBelakang.trim()) newErrors.latarBelakang = 'Latar belakang / tujuan program wajib diisi.'
    if (!anggaranRaw) newErrors.anggaran = 'Estimasi anggaran program wajib diisi.'
    if (!targetPenerima.trim()) newErrors.targetPenerima = 'Target penerima manfaat (angka) wajib diisi.'
    if (!outputProgram.trim()) newErrors.outputProgram = 'Output program wajib diisi.'
    if (!urgensi) newErrors.urgensi = 'Pilih salah satu tingkat urgensi.'
    if (urgensi === 'Tinggi' && !alasanMendesak.trim()) {
      newErrors.alasanMendesak = 'Sertakan alasan karena tingkat urgensi Tinggi (mendesak).'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      notify('Mohon lengkapi seluruh field yang wajib diisi.')
      const firstErr = document.querySelector('.rq-form-error')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    const priorityMap: Record<string, 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'> = {
      Tinggi: 'Tinggi',
      Sedang: 'Sedang',
      Rendah: 'Rendah',
    }
    const cleanLocation = lokasi.split('(')[0].trim() || 'Lokasi Program'
    const programTitle = initialData ? initialData.title : `Program Lapangan: ${cleanLocation}`

    if (initialData) {
      const updatedReq: RequestRow = {
        ...initialData,
        title: programTitle,
        priority: priorityMap[urgensi] || initialData.priority,
        location: cleanLocation,
        beneficiary: `${targetPenerima} penerima`,
        pic: pengaju,
        description: latarBelakang,
        estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
        outputMitra: outputProgram,
        alasanMendesak: urgensi === 'Tinggi' ? alasanMendesak : undefined,
      }
      onSubmitSuccess(updatedReq)
      notify(`Perubahan assessment ${initialData.id} berhasil disimpan!`)
      setSubmitting(false)
      return
    }

    api.createRequestProgram({
      programName: programTitle,
      category: 'Request Assessment',
      applicantName: pengaju,
      applicantPhone: '',
      applicantEmail: '',
      location: cleanLocation,
      estimatedBudget: anggaranRaw,
      description: `${latarBelakang}\nOutput: ${outputProgram}\nTarget: ${targetPenerima} penerima`,
      priority: priorityMap[urgensi] || 'Sedang',
      status: 'Baru',
    })
      .then((res) => {
        const created = res?.request || res?.data
        const genId = created?.id || `REQ-2026-0${Math.floor(Math.random() * 89 + 10)}`
        onSubmitSuccess({
          id: genId,
          title: programTitle,
          type: 'Request Assessment',
          priority: priorityMap[urgensi] || 'Sedang',
          requester: pengaju,
          location: cleanLocation,
          beneficiary: `${targetPenerima} penerima`,
          pic: pengaju,
          status: 'Baru',
          description: latarBelakang,
          estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
          outputMitra: outputProgram,
          alasanMendesak: urgensi === 'Tinggi' ? alasanMendesak : undefined,
        })
        notify(`Form request assessment ${genId} berhasil diajukan dan disimpan di database!`)
      })
      .catch(() => {
        const generatedId = `REQ-2026-0${Math.floor(Math.random() * 89 + 10)}`
        onSubmitSuccess({
          id: generatedId,
          title: programTitle,
          type: 'Request Assessment',
          priority: priorityMap[urgensi] || 'Sedang',
          requester: pengaju,
          location: cleanLocation,
          beneficiary: `${targetPenerima} penerima`,
          pic: pengaju,
          status: 'Baru',
          description: latarBelakang,
          estimatedBudget: anggaranDisplay || `Rp ${anggaranRaw}`,
          outputMitra: outputProgram,
          alasanMendesak: urgensi === 'Tinggi' ? alasanMendesak : undefined,
        })
        notify(`Form request assessment ${generatedId} berhasil diajukan!`)
      })
      .finally(() => {
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
          {initialData ? `Edit Assessment • ${initialData.id}` : 'Form 2 • Pengajuan Assessment Program'}
        </span>
      </div>

      <div className="rq-form-header">
        <div>
          <h1>
            {initialData
              ? `Ubah Assessment Program (${initialData.id})`
              : 'Form Pengajuan Assessment Program'}
          </h1>
          <p>
            {initialData
              ? 'Perbarui data assessment lapangan yang sudah terisi sebelumnya di bawah ini.'
              : 'Lengkapi formulir identifikasi program lapangan dan assessment awal di bawah ini.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rq-form-shell">
        {/* Card 1: Data Pengaju & Lokasi */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">1</span>
            <div>
              <h3>Pengaju &amp; Lokasi Program</h3>
              <p>Informasi pelaksana dan titik lokasi target program.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 1. Nama Pengaju (Short Answer) */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Nama Pengaju <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`rq-input ${errors.pengaju ? 'error' : ''}`}
                placeholder="Masukkan nama lengkap pengaju program..."
                value={pengaju}
                onChange={(e) => {
                  setPengaju(e.target.value)
                  if (errors.pengaju) setErrors((prev) => ({ ...prev, pengaju: '' }))
                }}
              />
              {errors.pengaju && <span className="rq-form-error">{errors.pengaju}</span>}
            </div>

            {/* 2. Lokasi Program (Short Answer by maps) */}
            <div className="rq-field-group full">
              <div className="rq-label-row">
                <label className="rq-label">
                  Lokasi Program (by Maps) <span className="req">*</span>
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
                  <span>{fetchingLocation ? 'Mengambil titik...' : 'Ambil Titik Maps'}</span>
                </button>
              </div>
              <input
                type="text"
                className={`rq-input ${errors.lokasi ? 'error' : ''}`}
                placeholder="Contoh: Jl. Sukamaju No. 12, Cisarua, Bogor atau gunakan tombol Ambil Titik Maps..."
                value={lokasi}
                onChange={(e) => {
                  setLokasi(e.target.value)
                  if (errors.lokasi) setErrors((prev) => ({ ...prev, lokasi: '' }))
                }}
              />
              {coordinates && (
                <div className="rq-maps-info">
                  <span className="rq-maps-pin">📍</span>
                  <span>Titik Koordinat Maps: <strong>{coordinates}</strong></span>
                </div>
              )}
              {errors.lokasi && <span className="rq-form-error">{errors.lokasi}</span>}
            </div>
          </div>
        </div>

        {/* Card 2: Latar Belakang, Anggaran & Target */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">2</span>
            <div>
              <h3>Latar Belakang, Anggaran &amp; Output Program</h3>
              <p>Rincian urgensi, kebutuhan biaya, dan sasaran kuantitatif penerima.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 3. Latar Belakang / Tujuan Program (Paragraf) */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Latar Belakang / Tujuan Program <span className="req">*</span>
              </label>
              <textarea
                rows={4}
                className={`rq-textarea ${errors.latarBelakang ? 'error' : ''}`}
                placeholder="Jelaskan latar belakang kondisi di lapangan dan tujuan yang ingin dicapai melalui program ini..."
                value={latarBelakang}
                onChange={(e) => {
                  setLatarBelakang(e.target.value)
                  if (errors.latarBelakang) setErrors((prev) => ({ ...prev, latarBelakang: '' }))
                }}
              />
              {errors.latarBelakang && <span className="rq-form-error">{errors.latarBelakang}</span>}
            </div>

            {/* 4. Estimasi Anggaran Program (Short Answer: angka - Rupiah) */}
            <div className="rq-field-group half">
              <label className="rq-label">
                Estimasi Anggaran Program <span className="req">*</span>
              </label>
              <p className="rq-hint">Format angka (Rupiah otomatis)</p>
              <input
                type="text"
                className={`rq-input ${errors.anggaran ? 'error' : ''}`}
                placeholder="Rp 0"
                value={anggaranDisplay}
                onChange={handleAnggaranChange}
              />
              {errors.anggaran && <span className="rq-form-error">{errors.anggaran}</span>}
            </div>

            {/* 5. Target Penerima Manfaat (Short Answer: angka) */}
            <div className="rq-field-group half">
              <label className="rq-label">
                Target Penerima Manfaat <span className="req">*</span>
              </label>
              <p className="rq-hint">Hanya angka (misal: 150)</p>
              <div className="rq-input-unit-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  className={`rq-input ${errors.targetPenerima ? 'error' : ''}`}
                  placeholder="Contoh: 250"
                  value={targetPenerima}
                  onChange={handleTargetPenerimaChange}
                />
              </div>
              {errors.targetPenerima && <span className="rq-form-error">{errors.targetPenerima}</span>}
            </div>

            {/* 6. Output Program (Paragraf) */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Output Program <span className="req">*</span>
              </label>
              <textarea
                rows={3}
                className={`rq-textarea ${errors.outputProgram ? 'error' : ''}`}
                placeholder="Rincikan output konkret program (contoh: 2 titik sumber air bersih komunal, 500 paket makanan bernutrisi, dsb)..."
                value={outputProgram}
                onChange={(e) => {
                  setOutputProgram(e.target.value)
                  if (errors.outputProgram) setErrors((prev) => ({ ...prev, outputProgram: '' }))
                }}
              />
              {errors.outputProgram && <span className="rq-form-error">{errors.outputProgram}</span>}
            </div>
          </div>
        </div>

        {/* Card 3: Tingkat Urgensi & Dokumen Assessment */}
        <div className="rq-form-card">
          <div className="rq-card-title">
            <span className="rq-badge-num">3</span>
            <div>
              <h3>Urgensi &amp; Dokumen Assessment</h3>
              <p>Tingkat prioritas eksekusi dan lampiran berkas hasil assessment.</p>
            </div>
          </div>

          <div className="rq-form-grid">
            {/* 7. Tingkat Urgensi (Multiple Choice) */}
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
                      name="tingkatUrgensi2"
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
                        ? 'Mendesak / tanggap darurat'
                        : lvl === 'Sedang'
                        ? 'Tindak lanjut prioritas reguler'
                        : 'Bisa dijadwalkan bertahap'}
                    </small>
                  </label>
                ))}
              </div>
              {errors.urgensi && <span className="rq-form-error">{errors.urgensi}</span>}

              {/* Alasan jika mendesak */}
              {urgensi === 'Tinggi' && (
                <div className="rq-urgent-box">
                  <label className="rq-label">
                    Alasan Jika Mendesak <span className="req">*</span>
                  </label>
                  <p className="rq-hint">Sertakan penjelasan rinci mengapa kondisi ini memerlukan penanganan segera:</p>
                  <textarea
                    rows={2}
                    className={`rq-textarea ${errors.alasanMendesak ? 'error' : ''}`}
                    placeholder="Tuliskan alasan mengapa mendesak (misal: potensi longsor susulan, keterbatasan stok logistik darurat)..."
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

            {/* 8. Dokumen Assessment (Upload gambar dan file) */}
            <div className="rq-field-group full">
              <label className="rq-label">
                Dokumen Assessment (Gambar &amp; File)
              </label>
              <p className="rq-hint">Unggah berkas lembar assessment, foto kondisi fisik lapangan, data spasial, atau form survei:</p>

              <div className="rq-upload-dropzone">
                <input
                  type="file"
                  id="dokumenAssessmentUpload"
                  className="rq-file-input"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label htmlFor="dokumenAssessmentUpload" className="rq-upload-label">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <div>
                    <strong>Pilih berkas assessment atau tarik ke sini</strong>
                    <p>Format: PDF, Word, Excel, JPG, atau PNG</p>
                  </div>
                  <span className="rq-browse-btn">Unggah Berkas</span>
                </label>
              </div>

              {/* List files */}
              {dokumenFiles.length > 0 && (
                <div className="rq-file-list">
                  {dokumenFiles.map((f, i) => (
                    <div key={`${f.name}-${i}`} className="rq-file-item">
                      <span className="rq-file-icon">
                        {f.type === 'image' ? '🖼️' : '📑'}
                      </span>
                      <div className="rq-file-meta">
                        <strong>{f.name}</strong>
                        <small>{f.size} • Terlampir</small>
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
            onClick={() => notify('Draft form assessment berhasil disimpan.')}
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
              ? 'Simpan Perubahan Assessment'
              : 'Kirim Form Assessment'}
          </button>
        </div>
      </form>
    </div>
  )
}

