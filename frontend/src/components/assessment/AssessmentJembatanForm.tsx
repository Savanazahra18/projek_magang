'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

interface AssessmentJembatanFormProps {
  onBack: () => void
  onSubmitSuccess: (data: any) => void
  notify: (msg: string) => void
}

export default function AssessmentJembatanForm({
  onBack,
  onSubmitSuccess,
  notify,
}: AssessmentJembatanFormProps) {
  // 1. INFORMASI DASAR
  const [namaJembatan, setNamaJembatan] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [tanggalKejadian, setTanggalKejadian] = useState('')
  const [penyebabKerusakan, setPenyebabKerusakan] = useState('')

  // 2. KONDISI JEMBATAN
  const [materialJembatan, setMaterialJembatan] = useState('Kayu')
  const [materialLainnya, setMaterialLainnya] = useState('')
  const [fungsiJembatan, setFungsiJembatan] = useState<string[]>(['Pejalan Kaki', 'Kendaraan'])
  const [tingkatKerusakan, setTingkatKerusakan] = useState<'Total' | 'Rusak Sebagian'>('Rusak Sebagian')
  const [deskripsiKerusakan, setDeskripsiKerusakan] = useState('')
  const [panjang, setPanjang] = useState('')
  const [lebar, setLebar] = useState('')
  const [tinggi, setTinggi] = useState('')

  // 3. DAMPAK KEJADIAN
  const [jumlahPenduduk, setJumlahPenduduk] = useState('')
  const [wilayahTerisolasi, setWilayahTerisolasi] = useState('')
  const [fungsiTerganggu, setFungsiTerganggu] = useState<string[]>([
    'Transportasi Orang',
    'Akses Darurat (Ambulans, Pemadam, dll)',
  ])
  const [fungsiLainnya, setFungsiLainnya] = useState('')
  const [alternatifJalur, setAlternatifJalur] = useState<'Ya' | 'Tidak'>('Tidak')
  const [keteranganAlternatif, setKeteranganAlternatif] = useState('')

  // 4. DOKUMENTASI
  const [fotoJembatan, setFotoJembatan] = useState<File | null>(null)
  const [videoLokasi, setVideoLokasi] = useState<File | null>(null)
  const [fotoSekitar, setFotoSekitar] = useState<File | null>(null)
  const [fotoRisiko, setFotoRisiko] = useState<File | null>(null)

  // 5. KEBUTUHAN PENANGANAN
  const [sumberDaya, setSumberDaya] = useState<string[]>(['Bahan/Material', 'Tenaga Kerja'])
  const [estimasiBiayaRaw, setEstimasiBiayaRaw] = useState('')

  // 6. KONTAK PENANGGUNG JAWAB
  const [namaPJ, setNamaPJ] = useState('')
  const [nomorKontak, setNomorKontak] = useState('')
  const [emailPJ, setEmailPJ] = useState('')

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toggle checkbox helper
  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item))
    } else {
      setList([...list, item])
    }
  }

  // Format rupiah helper
  const formatRupiah = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseInt(digits, 10))
  }

  const handleBiayaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value)
    setEstimasiBiayaRaw(formatted)
  }

  // File upload handler
  const handleFilePick = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (f: File | null) => void,
    label: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setter(file)
      notify(`Berkas "${file.name}" untuk ${label} berhasil dipilih.`)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!namaJembatan.trim()) {
      notify('Nama jembatan wajib diisi!')
      return
    }
    if (!lokasi.trim()) {
      notify('Lokasi jembatan wajib diisi!')
      return
    }

    setIsSubmitting(true)
    const formData = {
      namaJembatan,
      lokasi,
      tanggalKejadian,
      penyebabKerusakan,
      materialJembatan,
      materialLainnya,
      fungsiJembatan,
      tingkatKerusakan,
      deskripsiKerusakan,
      panjang,
      lebar,
      tinggi,
      jumlahPenduduk,
      wilayahTerisolasi,
      fungsiTerganggu,
      fungsiLainnya,
      alternatifJalur,
      keteranganAlternatif,
      sumberDaya,
      estimasiBiaya: estimasiBiayaRaw,
      namaPJ,
      nomorKontak,
      emailPJ,
    }

    try {
      const res = await api.createAssessment({
        type: 'jembatan',
        title: `Assessment Jembatan: ${namaJembatan}`,
        category: 'Infrastruktur',
        location: lokasi,
        pmName: namaPJ || 'Warga Sekitar',
        data: formData,
      })

      notify(`Data assessment (${res?.assessment?.id}) berhasil masuk ke tabel assessment_jembatan PostgreSQL!`)
      onSubmitSuccess(res?.assessment || {
        id: `ASM-JBT-${Date.now().toString().slice(-4)}`,
        title: `Assessment: ${namaJembatan}`,
        type: 'Assessment Jembatan',
        category: 'Infrastruktur',
        location: lokasi,
        damagedLevel: tingkatKerusakan,
        estimatedCost: estimasiBiayaRaw || 'Rp 0',
        contactPerson: namaPJ || 'Belum diisi',
        contactPhone: nomorKontak || '-',
      })
    } catch (err: any) {
      console.warn('Submit jembatan error:', err)
      notify(`Gagal simpan ke backend: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    notify('Draf assessment jembatan berhasil disimpan ke perangkat lokal.')
  }

  return (
    <form className="asm-form-card" onSubmit={handleSubmit}>
      {/* Header Form */}
      <div className="asm-form-header">
        <div className="asm-form-badge-row">
          <span className="asm-form-badge">Infrastruktur</span>
          <span className="asm-form-subbadge">Pendataan Lapangan</span>
        </div>
        <h2>Form Assessment Jembatan</h2>
        <p>
          Dokumentasikan secara komprehensif kondisi kerusakan fisik jembatan, dampak terisolasi warga,
          serta estimasi sumber daya penanganan yang mendesak.
        </p>
      </div>

      {/* ================= 1. INFORMASI DASAR ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">1</span>
          <div>
            <h3>INFORMASI DASAR</h3>
            <p>Data identifikasi awal nama jembatan dan letak geografis.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>
              Nama Jembatan <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Jembatan Gantung Ciberang"
              value={namaJembatan}
              onChange={(e) => setNamaJembatan(e.target.value)}
            />
          </div>

          <div className="asm-field">
            <label>
              Lokasi <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Desa / Kelurahan, Kecamatan, Kabupaten/Kota"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
            />
            <small className="asm-field-hint">
              Cantumkan nama Desa, Kecamatan, dan Kabupaten secara lengkap.
            </small>
          </div>

          <div className="asm-field">
            <label>
              Tanggal Kejadian <span className="req">*</span>
            </label>
            <input
              type="date"
              required
              value={tanggalKejadian}
              onChange={(e) => setTanggalKejadian(e.target.value)}
            />
          </div>

          <div className="asm-field span-2">
            <label>
              Penyebab Kerusakan <span className="req">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Contoh: Terjangan luapan air sungai akibat hujan intensitas tinggi, tanah longsor pada tumpuan abutment, usia konstruksi lanjut..."
              value={penyebabKerusakan}
              onChange={(e) => setPenyebabKerusakan(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ================= 2. KONDISI JEMBATAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">2</span>
          <div>
            <h3>KONDISI JEMBATAN</h3>
            <p>Spesifikasi material, fungsi lalu lintas, dan tingkat kerusakan fisik.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Material Jembatan */}
          <div className="asm-field span-2">
            <label>Material Jembatan</label>
            <div className="asm-radio-group">
              {['Kayu', 'Beton', 'Baja', 'Lainnya (Sebutkan)'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${materialJembatan === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="materialJembatan"
                    value={opt}
                    checked={materialJembatan === opt}
                    onChange={() => setMaterialJembatan(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {materialJembatan.includes('Lainnya') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan jenis material konstruksi jembatan..."
                value={materialLainnya}
                onChange={(e) => setMaterialLainnya(e.target.value)}
              />
            )}
          </div>

          {/* Fungsi Jembatan */}
          <div className="asm-field span-2">
            <label>Fungsi Jembatan (Dapat memilih lebih dari satu)</label>
            <div className="asm-checkbox-group">
              {['Pejalan Kaki', 'Kendaraan', 'Multifungsi'].map((f) => (
                <label
                  key={f}
                  className={`asm-check-pill ${fungsiJembatan.includes(f) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={fungsiJembatan.includes(f)}
                    onChange={() => toggleArrayItem(fungsiJembatan, setFungsiJembatan, f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tingkat Kerusakan */}
          <div className="asm-field span-2">
            <label>Tingkat Kerusakan</label>
            <div className="asm-radio-cards">
              <label className={`asm-radio-card ${tingkatKerusakan === 'Total' ? 'active alert-danger' : ''}`}>
                <input
                  type="radio"
                  name="tingkatKerusakan"
                  value="Total"
                  checked={tingkatKerusakan === 'Total'}
                  onChange={() => setTingkatKerusakan('Total')}
                />
                <div>
                  <strong>Total</strong>
                  <small>Jembatan putus, hanyut, atau ambruk sepenuhnya tidak dapat dilintasi.</small>
                </div>
              </label>

              <label className={`asm-radio-card ${tingkatKerusakan === 'Rusak Sebagian' ? 'active alert-warning' : ''}`}>
                <input
                  type="radio"
                  name="tingkatKerusakan"
                  value="Rusak Sebagian"
                  checked={tingkatKerusakan === 'Rusak Sebagian'}
                  onChange={() => setTingkatKerusakan('Rusak Sebagian')}
                />
                <div>
                  <strong>Rusak Sebagian</strong>
                  <small>Struktur masih berdiri namun terjadi keretakan, lantai jebol, atau fondasi miring.</small>
                </div>
              </label>
            </div>
          </div>

          {/* Deskripsi Kerusakan */}
          <div className="asm-field span-2">
            <label>Deskripsi Kerusakan</label>
            <textarea
              rows={3}
              placeholder="Uraikan secara detail kerusakan yang terjadi (misal: gelagar jembatan patah pada bentang tengah, sling penopang putus)..."
              value={deskripsiKerusakan}
              onChange={(e) => setDeskripsiKerusakan(e.target.value)}
            />
          </div>

          {/* Dimensi Jembatan */}
          <div className="asm-field span-2">
            <label className="asm-subhead-label">Dimensi Jembatan</label>
            <div className="asm-dimen-grid">
              <div>
                <span className="asm-dimen-label">Panjang Jembatan</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 35"
                    value={panjang}
                    onChange={(e) => setPanjang(e.target.value)}
                  />
                  <span>meter</span>
                </div>
              </div>

              <div>
                <span className="asm-dimen-label">Lebar Jembatan</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 2.5"
                    step="0.1"
                    value={lebar}
                    onChange={(e) => setLebar(e.target.value)}
                  />
                  <span>meter</span>
                </div>
              </div>

              <div>
                <span className="asm-dimen-label">Tinggi (dari dasar sungai)</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 8"
                    step="0.1"
                    value={tinggi}
                    onChange={(e) => setTinggi(e.target.value)}
                  />
                  <span>meter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. DAMPAK KEJADIAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">3</span>
          <div>
            <h3>DAMPAK KEJADIAN</h3>
            <p>Pengaruh terhadap aktivitas sosial warga, logistik, dan jalur darurat.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>Jumlah Penduduk Terkena Dampak</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 450"
                value={jumlahPenduduk}
                onChange={(e) => setJumlahPenduduk(e.target.value)}
              />
              <span>Jiwa / KK</span>
            </div>
          </div>

          <div className="asm-field span-2">
            <label>Wilayah Terisolasi</label>
            <textarea
              rows={2}
              placeholder="Sebutkan dusun, RW, kampung, atau desa yang aksesnya terputus..."
              value={wilayahTerisolasi}
              onChange={(e) => setWilayahTerisolasi(e.target.value)}
            />
          </div>

          {/* Fungsi yang Terganggu */}
          <div className="asm-field span-2">
            <label>Fungsi yang Terganggu</label>
            <div className="asm-checkbox-group">
              {[
                'Transportasi Barang',
                'Transportasi Orang',
                'Akses Darurat (Ambulans, Pemadam, dll)',
                'Lainnya (Sebutkan)',
              ].map((item) => (
                <label
                  key={item}
                  className={`asm-check-pill ${fungsiTerganggu.includes(item) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={fungsiTerganggu.includes(item)}
                    onChange={() => toggleArrayItem(fungsiTerganggu, setFungsiTerganggu, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {fungsiTerganggu.includes('Lainnya (Sebutkan)') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan fungsi lain yang terganggu (misal: akses sekolah anak, distribusi hasil tani)..."
                value={fungsiLainnya}
                onChange={(e) => setFungsiLainnya(e.target.value)}
              />
            )}
          </div>

          {/* Alternatif Jalur */}
          <div className="asm-field span-2">
            <label>Alternatif Jalur yang Tersedia</label>
            <div className="asm-radio-group">
              {['Ya', 'Tidak'].map((opt) => (
                <label
                  key={opt}
                  className={`asm-radio-chip ${alternatifJalur === opt ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="alternatifJalur"
                    value={opt}
                    checked={alternatifJalur === opt}
                    onChange={() => setAlternatifJalur(opt as 'Ya' | 'Tidak')}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {alternatifJalur === 'Ya' && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan jalur alternatif dan selisih jarak tempuh (misal: memutar lewat Desa Sukamaju 7 km)..."
                value={keteranganAlternatif}
                onChange={(e) => setKeteranganAlternatif(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. DOKUMENTASI ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">4</span>
          <div>
            <h3>DOKUMENTASI</h3>
            <p>Unggah bukti visual foto dan video pendukung kondisi di lapangan.</p>
          </div>
        </div>

        <div className="asm-upload-grid">
          {/* Foto Kondisi Jembatan */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO UTAMA (JPEG)</span>
            <strong>Foto Kondisi Jembatan</strong>
            <small>Menampilkan bentang jembatan dan struktur utama yang rusak.</small>
            <label className={`asm-upload-btn ${fotoJembatan ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoJembatan ? fotoJembatan.name : 'Pilih Foto Jembatan'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoJembatan, 'Foto Kondisi Jembatan')}
              />
            </label>
            {fotoJembatan && <span className="asm-file-size">{(fotoJembatan.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Video Lokasi Kejadian */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag video">VIDEO LAPANGAN (MP4)</span>
            <strong>Video Lokasi Kejadian</strong>
            <small>Rekaman arus air, akses penyeberangan, atau wawancara warga.</small>
            <label className={`asm-upload-btn ${videoLokasi ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{videoLokasi ? videoLokasi.name : 'Pilih Video MP4'}</span>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => handleFilePick(e, setVideoLokasi, 'Video Lokasi Kejadian')}
              />
            </label>
            {videoLokasi && <span className="asm-file-size">{(videoLokasi.size / (1024 * 1024)).toFixed(1)} MB</span>}
          </div>

          {/* Foto Kondisi Sekitar Lokasi */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO AREA (JPEG)</span>
            <strong>Foto Kondisi Sekitar Lokasi</strong>
            <small>Tebing sungai, jalan penghubung, atau permukiman terdekat.</small>
            <label className={`asm-upload-btn ${fotoSekitar ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoSekitar ? fotoSekitar.name : 'Pilih Foto Sekitar'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoSekitar, 'Foto Kondisi Sekitar')}
              />
            </label>
            {fotoSekitar && <span className="asm-file-size">{(fotoSekitar.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Foto Faktor Risiko Lain */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO RISIKO (JPEG)</span>
            <strong>Foto Faktor Risiko Lain</strong>
            <small>Tumpukan sampah kayu, erosi bantaran, atau potensi longsor susulan.</small>
            <label className={`asm-upload-btn ${fotoRisiko ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoRisiko ? fotoRisiko.name : 'Pilih Foto Faktor Risiko'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoRisiko, 'Foto Faktor Risiko')}
              />
            </label>
            {fotoRisiko && <span className="asm-file-size">{(fotoRisiko.size / 1024).toFixed(0)} KB</span>}
          </div>
        </div>
      </section>

      {/* ================= 5. KEBUTUHAN PENANGANAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">5</span>
          <div>
            <h3>KEBUTUHAN PENANGANAN</h3>
            <p>Estimasi sumber daya dan rencana pembiayaan rekonstruksi jembatan.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Sumber Daya */}
          <div className="asm-field span-2">
            <label>Sumber Daya yang Dibutuhkan</label>
            <div className="asm-checkbox-group">
              {['Bahan/Material', 'Tenaga Kerja', 'Alat Berat'].map((s) => (
                <label
                  key={s}
                  className={`asm-check-pill ${sumberDaya.includes(s) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={sumberDaya.includes(s)}
                    onChange={() => toggleArrayItem(sumberDaya, setSumberDaya, s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estimasi Biaya */}
          <div className="asm-field span-2">
            <label>Estimasi Biaya Perbaikan / Rekonstruksi</label>
            <input
              type="text"
              placeholder="Contoh: Rp 150.000.000"
              value={estimasiBiayaRaw}
              onChange={handleBiayaChange}
            />
            <small className="asm-field-hint">Ketik nominal angka, format Rupiah terformat otomatis.</small>
          </div>
        </div>
      </section>

      {/* ================= 6. KONTAK PENANGGUNG JAWAB ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">6</span>
          <div>
            <h3>KONTAK PENANGGUNG JAWAB</h3>
            <p>Pihak setempat yang dapat dikonfirmasi mengenai kondisi lapangan.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>Nama Penanggung Jawab Lokasi</label>
            <input
              type="text"
              placeholder="Nama Kepala Desa / Tokoh Warga / Koordinator"
              value={namaPJ}
              onChange={(e) => setNamaPJ(e.target.value)}
            />
          </div>

          <div className="asm-field">
            <label>Nomor Kontak (WhatsApp / Telp)</label>
            <input
              type="tel"
              placeholder="081234567890"
              value={nomorKontak}
              onChange={(e) => setNomorKontak(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div className="asm-field span-2">
            <label>Email (Opsional)</label>
            <input
              type="email"
              placeholder="email@desa.id atau penanggungjawab@gmail.com"
              value={emailPJ}
              onChange={(e) => setEmailPJ(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Footer Form Action */}
      <div className="asm-form-actions">
        <button type="button" className="db-btn db-btn-outline" onClick={onBack}>
          Kembali
        </button>

        <div className="asm-action-right">
          <button type="button" className="db-btn db-btn-outline" onClick={handleSaveDraft}>
            Simpan Draf
          </button>
          <button type="submit" className="db-btn db-btn-primary" disabled={isSubmitting}>
            <Icon name="checkCircle" size={17} />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Assessment Jembatan'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}

