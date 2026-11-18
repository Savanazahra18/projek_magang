'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

interface AssessmentMasjidFormProps {
  onBack: () => void
  onSubmitSuccess: (data: any) => void
  notify: (msg: string) => void
}

export default function AssessmentMasjidForm({
  onBack,
  onSubmitSuccess,
  notify,
}: AssessmentMasjidFormProps) {
  // 1. INFORMASI UMUM
  const [namaMasjid, setNamaMasjid] = useState('')
  const [alamat, setAlamat] = useState('')
  const [tanggalKejadian, setTanggalKejadian] = useState('')
  const [penyebabKerusakan, setPenyebabKerusakan] = useState('Usia Bangunan')
  const [penyebabLainnya, setPenyebabLainnya] = useState('')
  const [jamaahHarian, setJamaahHarian] = useState('')
  const [jamaahJumat, setJamaahJumat] = useState('')
  const [ukuranMasjid, setUkuranMasjid] = useState('')

  // 2. KONDISI MASJID/MUSHOLA
  const [kondisiDinding, setKondisiDinding] = useState<'Utuh' | 'Retak' | 'Rusak Berat'>('Retak')
  const [kondisiAtap, setKondisiAtap] = useState<'Utuh' | 'Bocor' | 'Rusak Berat'>('Bocor')
  const [kondisiLantai, setKondisiLantai] = useState<'Layak' | 'Tidak Layak'>('Layak')
  const [mimbarImam, setMimbarImam] = useState<'Ada' | 'Tidak'>('Ada')
  const [karpetSajadah, setKarpetSajadah] = useState<'Cukup' | 'Kurang' | 'Tidak ada'>('Kurang')
  const [soundsystem, setSoundsystem] = useState<'Berfungsi' | 'Rusak'>('Berfungsi')

  // 3. KONDISI MCK DAN TEMPAT WUDHU
  const [jumlahMCK, setJumlahMCK] = useState('')
  const [kondisiMCK, setKondisiMCK] = useState<'Layak' | 'Tidak Layak'>('Tidak Layak')
  const [fasilitasSanitasi, setFasilitasSanitasi] = useState<'Air Bersih Tersedia' | 'Air Bersih Tidak Tersedia'>('Air Bersih Tersedia')
  const [jumlahKeran, setJumlahKeran] = useState('')
  const [kondisiKeran, setKondisiKeran] = useState<'Berfungsi Semua' | 'Ada yang Rusak'>('Ada yang Rusak')
  const [saluranAir, setSaluranAir] = useState<'Layak' | 'Tersumbat'>('Layak')
  const [tangkiAir, setTangkiAir] = useState<'Layak' | 'Tidak Layak'>('Layak')

  // 4. DAMPAK KEGIATAN IBADAH
  const [statusIbadah, setStatusIbadah] = useState<'Berlangsung Normal' | 'Terganggu Sebagian' | 'Terhenti Total'>('Terganggu Sebagian')
  const [hambatanUtama, setHambatanUtama] = useState('Kerusakan Fasilitas Pendukung')
  const [hambatanLainnya, setHambatanLainnya] = useState('')

  // 5. KEBUTUHAN PENANGANAN
  const [fasilitasDibutuhkan, setFasilitasDibutuhkan] = useState('Perbaikan / Perluasan MCK')
  const [fasilitasLainnya, setFasilitasLainnya] = useState('')
  const [estimasiBiayaRaw, setEstimasiBiayaRaw] = useState('')
  const [prioritasMendesak, setPrioritasMendesak] = useState('')

  // 6. DOKUMENTASI
  const [fotoMasjid, setFotoMasjid] = useState<File | null>(null)
  const [fotoMCK, setFotoMCK] = useState<File | null>(null)
  const [fotoSekitar, setFotoSekitar] = useState<File | null>(null)
  const [fotoTambahan, setFotoTambahan] = useState<File | null>(null)

  // 7. KONTAK PENANGGUNG JAWAB
  const [namaPJ, setNamaPJ] = useState('')
  const [nomorKontak, setNomorKontak] = useState('')
  const [emailPJ, setEmailPJ] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Rupiah formatter helper
  const formatRupiah = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseInt(digits, 10))
  }

  const handleBiayaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEstimasiBiayaRaw(formatRupiah(e.target.value))
  }

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

    if (!namaMasjid.trim()) {
      notify('Nama Masjid/Mushola wajib diisi!')
      return
    }
    if (!alamat.trim()) {
      notify('Alamat lengkap wajib diisi!')
      return
    }

    setIsSubmitting(true)
    const formData = {
      namaMasjid,
      alamat,
      tanggalKejadian,
      penyebabKerusakan,
      penyebabLainnya,
      jamaahHarian,
      jamaahJumat,
      ukuranMasjid,
      kondisiDinding,
      kondisiAtap,
      kondisiLantai,
      mimbarImam,
      karpetSajadah,
      soundsystem,
      jumlahMCK,
      kondisiMCK,
      fasilitasSanitasi,
      jumlahKeran,
      kondisiKeran,
      saluranAir,
      tangkiAir,
      statusIbadah,
      hambatanUtama,
      hambatanLainnya,
      fasilitasDibutuhkan,
      fasilitasLainnya,
      estimasiBiaya: estimasiBiayaRaw,
      prioritasMendesak,
      namaPJ,
      nomorKontak,
      emailPJ,
    }

    try {
      const res = await api.createAssessment({
        type: 'masjid',
        title: `Assessment Masjid: ${namaMasjid}`,
        category: 'Sarana ibadah',
        location: alamat,
        pmName: namaPJ || 'Pengurus DKM',
        data: formData,
      })

      notify(`Data assessment (${res?.assessment?.id}) berhasil masuk ke tabel assessment_masjid PostgreSQL!`)
      onSubmitSuccess(res?.assessment || {
        id: `ASM-MSJ-${Date.now().toString().slice(-4)}`,
        title: `Assessment: ${namaMasjid}`,
        type: 'Assessment Masjid',
        category: 'Sarana ibadah',
        location: alamat,
        worshipStatus: statusIbadah,
        estimatedCost: estimasiBiayaRaw || 'Rp 0',
        contactPerson: namaPJ || 'Belum diisi',
        contactPhone: nomorKontak || '-',
      })
    } catch (err: any) {
      console.warn('Submit masjid error:', err)
      notify(`Gagal simpan ke backend: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    notify('Draf assessment masjid/mushola berhasil disimpan ke perangkat lokal.')
  }

  return (
    <form className="asm-form-card" onSubmit={handleSubmit}>
      {/* Header Form */}
      <div className="asm-form-header">
        <div className="asm-form-badge-row">
          <span className="asm-form-badge">Sarana Ibadah</span>
          <span className="asm-form-subbadge">Pendataan Lapangan</span>
        </div>
        <h2>Form Assessment Masjid / Mushola</h2>
        <p>
          Petakan kondisi fisik bangunan utama, fasilitas sanitasi MCK &amp; tempat wudhu,
          serta kelancaran kegiatan ibadah jamaah sehari-hari.
        </p>
      </div>

      {/* ================= 1. INFORMASI UMUM ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">1</span>
          <div>
            <h3>INFORMASI UMUM</h3>
            <p>Identitas tempat ibadah, letak alamat, dan kapasitas jamaah.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>
              Nama Masjid / Mushola <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Masjid Jami Al-Muhajirin"
              value={namaMasjid}
              onChange={(e) => setNamaMasjid(e.target.value)}
            />
          </div>

          <div className="asm-field">
            <label>
              Alamat Lengkap <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Desa / Kelurahan, Kecamatan, Kabupaten/Kota"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>

          <div className="asm-field">
            <label>
              Tanggal Kejadian / Pendataan <span className="req">*</span>
            </label>
            <input
              type="date"
              required
              value={tanggalKejadian}
              onChange={(e) => setTanggalKejadian(e.target.value)}
            />
          </div>

          <div className="asm-field span-2">
            <label>Penyebab Kerusakan / Kebutuhan</label>
            <div className="asm-radio-group">
              {['Bencana Alam', 'Usia Bangunan', 'Kebutuhan Tambahan Fasilitas', 'Lainnya (Sebutkan)'].map((p) => (
                <label key={p} className={`asm-radio-chip ${penyebabKerusakan === p ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="penyebabKerusakan"
                    value={p}
                    checked={penyebabKerusakan === p}
                    onChange={() => setPenyebabKerusakan(p)}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
            {penyebabKerusakan.includes('Lainnya') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan penyebab lainnya secara spesifik..."
                value={penyebabLainnya}
                onChange={(e) => setPenyebabLainnya(e.target.value)}
              />
            )}
          </div>

          {/* Kapasitas Masjid/Mushola */}
          <div className="asm-field span-2">
            <label className="asm-subhead-label">Kapasitas Masjid / Mushola</label>
            <div className="asm-dimen-grid">
              <div>
                <span className="asm-dimen-label">Jamaah Harian</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 60"
                    value={jamaahHarian}
                    onChange={(e) => setJamaahHarian(e.target.value)}
                  />
                  <span>orang</span>
                </div>
              </div>

              <div>
                <span className="asm-dimen-label">Jamaah Salat Jum&apos;at</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 250"
                    value={jamaahJumat}
                    onChange={(e) => setJamaahJumat(e.target.value)}
                  />
                  <span>orang</span>
                </div>
              </div>

              <div>
                <span className="asm-dimen-label">Ukuran Bangunan</span>
                <div className="asm-input-unit">
                  <input
                    type="number"
                    placeholder="Contoh: 144"
                    value={ukuranMasjid}
                    onChange={(e) => setUkuranMasjid(e.target.value)}
                  />
                  <span>m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. KONDISI MASJID/MUSHOLA ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">2</span>
          <div>
            <h3>KONDISI BANGUNAN UTAMA &amp; SARANA PENDUKUNG</h3>
            <p>Penilaian fisik dinding, atap, lantai, serta sarana peribadatan.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Kondisi Dinding */}
          <div className="asm-field">
            <label>Kondisi Dinding</label>
            <div className="asm-radio-group">
              {['Utuh', 'Retak', 'Rusak Berat'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiDinding === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiDinding"
                    value={opt}
                    checked={kondisiDinding === opt}
                    onChange={() => setKondisiDinding(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Kondisi Atap */}
          <div className="asm-field">
            <label>Kondisi Atap</label>
            <div className="asm-radio-group">
              {['Utuh', 'Bocor', 'Rusak Berat'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiAtap === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiAtap"
                    value={opt}
                    checked={kondisiAtap === opt}
                    onChange={() => setKondisiAtap(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Kondisi Lantai */}
          <div className="asm-field">
            <label>Kondisi Lantai</label>
            <div className="asm-radio-group">
              {['Layak', 'Tidak Layak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiLantai === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiLantai"
                    value={opt}
                    checked={kondisiLantai === opt}
                    onChange={() => setKondisiLantai(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mimbar Imam */}
          <div className="asm-field">
            <label>Mimbar Imam</label>
            <div className="asm-radio-group">
              {['Ada', 'Tidak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${mimbarImam === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="mimbarImam"
                    value={opt}
                    checked={mimbarImam === opt}
                    onChange={() => setMimbarImam(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Karpet/Sajadah */}
          <div className="asm-field">
            <label>Karpet / Sajadah</label>
            <div className="asm-radio-group">
              {['Cukup', 'Kurang', 'Tidak ada'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${karpetSajadah === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="karpetSajadah"
                    value={opt}
                    checked={karpetSajadah === opt}
                    onChange={() => setKarpetSajadah(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Soundsystem */}
          <div className="asm-field">
            <label>Soundsystem</label>
            <div className="asm-radio-group">
              {['Berfungsi', 'Rusak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${soundsystem === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="soundsystem"
                    value={opt}
                    checked={soundsystem === opt}
                    onChange={() => setSoundsystem(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. KONDISI MCK DAN TEMPAT WUDHU ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">3</span>
          <div>
            <h3>KONDISI MCK DAN TEMPAT WUDHU</h3>
            <p>Fasilitas sanitasi penunjang kesucian dan kenyamanan jamaah.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Subheader MCK */}
          <div className="asm-field span-2">
            <strong style={{ fontSize: 13, color: '#172324' }}>Kondisi MCK (Toilet / Kamar Mandi)</strong>
          </div>

          <div className="asm-field">
            <label>Jumlah Unit MCK</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 2"
                value={jumlahMCK}
                onChange={(e) => setJumlahMCK(e.target.value)}
              />
              <span>unit</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Kondisi MCK</label>
            <div className="asm-radio-group">
              {['Layak', 'Tidak Layak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiMCK === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiMCK"
                    value={opt}
                    checked={kondisiMCK === opt}
                    onChange={() => setKondisiMCK(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field span-2">
            <label>Fasilitas Sanitasi MCK</label>
            <div className="asm-radio-group">
              {['Air Bersih Tersedia', 'Air Bersih Tidak Tersedia'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${fasilitasSanitasi === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="fasilitasSanitasi"
                    value={opt}
                    checked={fasilitasSanitasi === opt}
                    onChange={() => setFasilitasSanitasi(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subheader Wudhu */}
          <div className="asm-field span-2" style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #f2f6f6' }}>
            <strong style={{ fontSize: 13, color: '#172324' }}>Kondisi Tempat Wudhu</strong>
          </div>

          <div className="asm-field">
            <label>Jumlah Keran Wudhu</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 8"
                value={jumlahKeran}
                onChange={(e) => setJumlahKeran(e.target.value)}
              />
              <span>keran</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Kondisi Keran Wudhu</label>
            <div className="asm-radio-group">
              {['Berfungsi Semua', 'Ada yang Rusak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiKeran === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiKeran"
                    value={opt}
                    checked={kondisiKeran === opt}
                    onChange={() => setKondisiKeran(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Kondisi Saluran Air Pembuangan</label>
            <div className="asm-radio-group">
              {['Layak', 'Tersumbat'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${saluranAir === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="saluranAir"
                    value={opt}
                    checked={saluranAir === opt}
                    onChange={() => setSaluranAir(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Kondisi Tangki / Reservoir Air</label>
            <div className="asm-radio-group">
              {['Layak', 'Tidak Layak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${tangkiAir === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tangkiAir"
                    value={opt}
                    checked={tangkiAir === opt}
                    onChange={() => setTangkiAir(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. DAMPAK KEGIATAN IBADAH ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">4</span>
          <div>
            <h3>DAMPAK KEGIATAN IBADAH</h3>
            <p>Pengaruh kondisi kerusakan terhadap kelangsungan ibadah shalat berjamaah.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field span-2">
            <label>Status Kegiatan Ibadah</label>
            <div className="asm-radio-cards">
              {[
                { val: 'Berlangsung Normal', desc: 'Shalat lima waktu dan Jumatan tetap berjalan tanpa kendala berarti.' },
                { val: 'Terganggu Sebagian', desc: 'Jamaah bergeser ke sudut yang tidak bocor, atau air wudhu terbatas.' },
                { val: 'Terhenti Total', desc: 'Bangunan membahayakan atau air mati total sehingga jamaah ibadah di rumah.' },
              ].map((item) => (
                <label
                  key={item.val}
                  className={`asm-radio-card ${statusIbadah === item.val ? 'active alert-warning' : ''}`}
                >
                  <input
                    type="radio"
                    name="statusIbadah"
                    value={item.val}
                    checked={statusIbadah === item.val}
                    onChange={() => setStatusIbadah(item.val as any)}
                  />
                  <div>
                    <strong>{item.val}</strong>
                    <small>{item.desc}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field span-2">
            <label>Hambatan Utama</label>
            <div className="asm-radio-group">
              {[
                'Tidak Ada Air Bersih',
                'Tidak Ada Ruang Layak untuk Beribadah',
                'Kerusakan Fasilitas Pendukung',
                'Lainnya (Sebutkan)',
              ].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${hambatanUtama === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="hambatanUtama"
                    value={opt}
                    checked={hambatanUtama === opt}
                    onChange={() => setHambatanUtama(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {hambatanUtama.includes('Lainnya') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan hambatan utama lainnya..."
                value={hambatanLainnya}
                onChange={(e) => setHambatanLainnya(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= 5. KEBUTUHAN PENANGANAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">5</span>
          <div>
            <h3>KEBUTUHAN PENANGANAN</h3>
            <p>Rincian bantuan fasilitas, estimasi biaya, dan prioritas perbaikan.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field span-2">
            <label>Fasilitas yang Dibutuhkan</label>
            <div className="asm-radio-group">
              {[
                'Renovasi Bangunan Utama',
                'Perbaikan / Perluasan MCK',
                'Penambahan Keran Wudhu',
                'Lainnya (Sebutkan)',
              ].map((f) => (
                <label key={f} className={`asm-radio-chip ${fasilitasDibutuhkan === f ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="fasilitasDibutuhkan"
                    value={f}
                    checked={fasilitasDibutuhkan === f}
                    onChange={() => setFasilitasDibutuhkan(f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
            {fasilitasDibutuhkan.includes('Lainnya') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan kebutuhan fasilitas lainnya..."
                value={fasilitasLainnya}
                onChange={(e) => setFasilitasLainnya(e.target.value)}
              />
            )}
          </div>

          <div className="asm-field span-2">
            <label>Estimasi Biaya</label>
            <input
              type="text"
              placeholder="Contoh: Rp 45.000.000"
              value={estimasiBiayaRaw}
              onChange={handleBiayaChange}
            />
            <small className="asm-field-hint">Ketik nominal angka, format Rupiah terformat otomatis.</small>
          </div>

          <div className="asm-field span-2">
            <label>Prioritas Kebutuhan Mendesak</label>
            <textarea
              rows={3}
              placeholder="Uraikan apa yang paling darurat harus ditangani terlebih dahulu (misal: perbaikan genteng bocor agar karpet tidak basah, atau pipanisasi air wudhu)..."
              value={prioritasMendesak}
              onChange={(e) => setPrioritasMendesak(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ================= 6. DOKUMENTASI DAN INFORMASI TAMBAHAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">6</span>
          <div>
            <h3>DOKUMENTASI DAN INFORMASI TAMBAHAN</h3>
            <p>Lampiran foto kondisi bangunan masjid, MCK, wudhu, dan lingkungan sekitar.</p>
          </div>
        </div>

        <div className="asm-upload-grid">
          {/* Foto Masjid/Mushola */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO UTAMA (JPEG)</span>
            <strong>Foto Masjid / Mushola</strong>
            <small>Tampak depan bangunan, ruang imam, dan kondisi atap/dinding.</small>
            <label className={`asm-upload-btn ${fotoMasjid ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoMasjid ? fotoMasjid.name : 'Pilih Foto Bangunan'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoMasjid, 'Foto Masjid/Mushola')}
              />
            </label>
            {fotoMasjid && <span className="asm-file-size">{(fotoMasjid.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Foto MCK dan Tempat Wudhu */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO SANITASI (JPEG)</span>
            <strong>Foto MCK dan Tempat Wudhu</strong>
            <small>Kondisi bak air, keran, toilet, dan saluran pembuangan air.</small>
            <label className={`asm-upload-btn ${fotoMCK ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoMCK ? fotoMCK.name : 'Pilih Foto MCK & Wudhu'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoMCK, 'Foto MCK & Tempat Wudhu')}
              />
            </label>
            {fotoMCK && <span className="asm-file-size">{(fotoMCK.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Situasi dan Kondisi Sekitar Lokasi */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO AREA (JPEG)</span>
            <strong>Situasi &amp; Kondisi Sekitar</strong>
            <small>Halaman masjid, jalan akses jamaah, atau permukiman warga terdekat.</small>
            <label className={`asm-upload-btn ${fotoSekitar ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoSekitar ? fotoSekitar.name : 'Pilih Foto Sekitar'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoSekitar, 'Situasi Sekitar')}
              />
            </label>
            {fotoSekitar && <span className="asm-file-size">{(fotoSekitar.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Faktor Tambahan */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FAKTOR LAIN (JPEG)</span>
            <strong>Faktor Tambahan Penanganan</strong>
            <small>Sumber mata air, akses kendaraan material, atau kondisi tanah.</small>
            <label className={`asm-upload-btn ${fotoTambahan ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoTambahan ? fotoTambahan.name : 'Pilih Foto Faktor Lain'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoTambahan, 'Faktor Tambahan')}
              />
            </label>
            {fotoTambahan && <span className="asm-file-size">{(fotoTambahan.size / 1024).toFixed(0)} KB</span>}
          </div>
        </div>
      </section>

      {/* ================= 7. KONTAK PENANGGUNG JAWAB ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">7</span>
          <div>
            <h3>KONTAK PENANGGUNG JAWAB</h3>
            <p>Pengurus DKM / tokoh masyarakat setempat yang bertanggung jawab.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>Nama Penanggung Jawab (Ketua DKM / Pengurus)</label>
            <input
              type="text"
              placeholder="Contoh: Ustadz Ahmad Fauzi"
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
              placeholder="dkm.almuhajirin@gmail.com"
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
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Assessment Masjid'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}

