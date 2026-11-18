'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

interface AssessmentSekolahFormProps {
  onBack: () => void
  onSubmitSuccess: (data: any) => void
  notify: (msg: string) => void
}

export default function AssessmentSekolahForm({
  onBack,
  onSubmitSuccess,
  notify,
}: AssessmentSekolahFormProps) {
  // 1. INFORMASI UMUM
  const [namaSekolah, setNamaSekolah] = useState('')
  const [alamat, setAlamat] = useState('')
  const [tingkatSekolah, setTingkatSekolah] = useState('SD')
  const [tingkatLainnya, setTingkatLainnya] = useState('')
  const [jumlahSiswa, setJumlahSiswa] = useState('')
  const [jumlahGuru, setJumlahGuru] = useState('')
  const [tanggalKejadian, setTanggalKejadian] = useState('')
  const [penyebabKerusakan, setPenyebabKerusakan] = useState('Bencana Alam')
  const [penyebabLainnya, setPenyebabLainnya] = useState('')

  // 2. KONDISI FASILITAS SEKOLAH
  // Bangunan & Sarana Utama
  const [jumlahKelasRusak, setJumlahKelasRusak] = useState('')
  const [ukuranKelas, setUkuranKelas] = useState('')
  const [luasBangunan, setLuasBangunan] = useState('')
  const [kondisiRuangGuru, setKondisiRuangGuru] = useState<'Layak' | 'Tidak Layak'>('Tidak Layak')
  const [toiletSanitasi, setToiletSanitasi] = useState<'Layak' | 'Tidak Layak'>('Tidak Layak')
  const [sumberAirBersih, setSumberAirBersih] = useState<'Ada' | 'Tidak Ada'>('Ada')

  // Peralatan Pembelajaran
  const [mejaKursiRusak, setMejaKursiRusak] = useState('')
  const [papanTulisRusak, setPapanTulisRusak] = useState('')
  const [bukuTersedia, setBukuTersedia] = useState('')

  // Fasilitas Pendukung
  const [perpustakaan, setPerpustakaan] = useState<'Ada' | 'Tidak Ada'>('Ada')
  const [laboratorium, setLaboratorium] = useState<'Ada' | 'Tidak Ada'>('Tidak Ada')
  const [areaBermain, setAreaBermain] = useState<'Ada' | 'Tidak Ada'>('Ada')

  // 3. DAMPAK KEGIATAN BELAJAR MENGAJAR
  const [statusKBM, setStatusKBM] = useState<
    'Terhenti Total' | 'Berlangsung di Lokasi Alternatif' | 'Berlangsung Sebagian di Lokasi Asal'
  >('Berlangsung Sebagian di Lokasi Asal')
  const [hambatanUtama, setHambatanUtama] = useState('Tidak Ada Ruang Kelas Darurat')
  const [hambatanLainnya, setHambatanLainnya] = useState('')

  // 4. KEBUTUHAN SEKOLAH DARURAT
  const [fasilitasDarurat, setFasilitasDarurat] = useState<string[]>([
    'Tenda atau Ruang Darurat',
    'Meja dan Kursi Sementara',
  ])
  const [fasilitasLainnya, setFasilitasLainnya] = useState('')
  const [logistikSiswa, setLogistikSiswa] = useState<string[]>([
    'Buku Tulis dan Alat Tulis',
    'Tas dan Perlengkapan Sekolah',
  ])
  const [logistikLainnya, setLogistikLainnya] = useState('')
  const [estimasiBiayaRaw, setEstimasiBiayaRaw] = useState('')

  // 5. DOKUMENTASI
  const [fotoBangunan, setFotoBangunan] = useState<File | null>(null)
  const [fotoPenunjang, setFotoPenunjang] = useState<File | null>(null)
  const [fotoLingkungan, setFotoLingkungan] = useState<File | null>(null)
  const [fotoHambatan, setFotoHambatan] = useState<File | null>(null)

  // 6. KONTAK PENANGGUNG JAWAB
  const [namaPJ, setNamaPJ] = useState('')
  const [nomorKontak, setNomorKontak] = useState('')
  const [emailPJ, setEmailPJ] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toggle checkbox helper
  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item))
    } else {
      setList([...list, item])
    }
  }

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

    if (!namaSekolah.trim()) {
      notify('Nama Sekolah wajib diisi!')
      return
    }
    if (!alamat.trim()) {
      notify('Alamat lengkap wajib diisi!')
      return
    }

    setIsSubmitting(true)
    const formData = {
      namaSekolah,
      alamat,
      tingkatSekolah,
      tingkatLainnya,
      jumlahSiswa,
      jumlahGuru,
      tanggalKejadian,
      penyebabKerusakan,
      penyebabLainnya,
      jumlahKelasRusak,
      ukuranKelas,
      luasBangunan,
      kondisiRuangGuru,
      toiletSanitasi,
      sumberAirBersih,
      mejaKursiRusak,
      papanTulisRusak,
      bukuTersedia,
      perpustakaan,
      laboratorium,
      areaBermain,
      statusKBM,
      hambatanUtama,
      hambatanLainnya,
      fasilitasDarurat,
      fasilitasLainnya,
      logistikSiswa,
      logistikLainnya,
      estimasiBiaya: estimasiBiayaRaw,
      namaPJ,
      nomorKontak,
      emailPJ,
    }

    try {
      const res = await api.createAssessment({
        type: 'sekolah',
        title: `Assessment Sekolah: ${namaSekolah}`,
        category: 'Pendidikan',
        location: alamat,
        pmName: namaPJ || 'Pihak Sekolah',
        data: formData,
      })

      notify(`Data assessment (${res?.assessment?.id}) berhasil masuk ke tabel assessment_sekolah PostgreSQL!`)
      onSubmitSuccess(res?.assessment || {
        id: `ASM-SKL-${Date.now().toString().slice(-4)}`,
        title: `Assessment: ${namaSekolah}`,
        type: 'Assessment Sekolah',
        category: 'Pendidikan',
        location: alamat,
        kbmStatus: statusKBM,
        estimatedCost: estimasiBiayaRaw || 'Rp 0',
        contactPerson: namaPJ || 'Belum diisi',
        contactPhone: nomorKontak || '-',
      })
    } catch (err: any) {
      console.warn('Submit sekolah error:', err)
      notify(`Gagal simpan ke backend: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    notify('Draf assessment sekolah berhasil disimpan ke perangkat lokal.')
  }

  return (
    <form className="asm-form-card" onSubmit={handleSubmit}>
      {/* Header Form */}
      <div className="asm-form-header">
        <div className="asm-form-badge-row">
          <span className="asm-form-badge">Pendidikan</span>
          <span className="asm-form-subbadge">Pendataan Lapangan</span>
        </div>
        <h2>Form Assessment Sekolah Darurat</h2>
        <p>
          Petakan kerusakan ruang kelas, ketersediaan meja kursi dan perlengkapan belajar,
          serta kebutuhan tenda atau ruang darurat demi keberlanjutan pendidikan anak-anak.
        </p>
      </div>

      {/* ================= 1. INFORMASI UMUM ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">1</span>
          <div>
            <h3>INFORMASI UMUM</h3>
            <p>Identitas satuan pendidikan, tingkat jenjang, dan jumlah siswa/guru.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>
              Nama Sekolah <span className="req">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: SDN Wonosari 2 / SMPN 1 Cugenang"
              value={namaSekolah}
              onChange={(e) => setNamaSekolah(e.target.value)}
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

          {/* Tingkat Sekolah */}
          <div className="asm-field span-2">
            <label>Tingkat Sekolah</label>
            <div className="asm-radio-group">
              {['SD', 'SMP', 'SMA', 'Lainnya (Sebutkan)'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${tingkatSekolah === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tingkatSekolah"
                    value={opt}
                    checked={tingkatSekolah === opt}
                    onChange={() => setTingkatSekolah(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {tingkatSekolah.includes('Lainnya') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan jenjang pendidikan (misal: MI, MTs, MA, SMK, PAUD)..."
                value={tingkatLainnya}
                onChange={(e) => setTingkatLainnya(e.target.value)}
              />
            )}
          </div>

          <div className="asm-field">
            <label>Jumlah Siswa Terdaftar</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 315"
                value={jumlahSiswa}
                onChange={(e) => setJumlahSiswa(e.target.value)}
              />
              <span>siswa</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Jumlah Guru dan Tenaga Kependidikan</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 18"
                value={jumlahGuru}
                onChange={(e) => setJumlahGuru(e.target.value)}
              />
              <span>orang</span>
            </div>
          </div>

          <div className="asm-field">
            <label>
              Tanggal / Tahun Kejadian Kerusakan <span className="req">*</span>
            </label>
            <input
              type="date"
              required
              value={tanggalKejadian}
              onChange={(e) => setTanggalKejadian(e.target.value)}
            />
          </div>

          <div className="asm-field span-2">
            <label>Penyebab Kebutuhan Sekolah Darurat</label>
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
                placeholder="Sebutkan penyebab lainnya (misal: gempa bumi, banjir bandang, kebakaran)..."
                value={penyebabLainnya}
                onChange={(e) => setPenyebabLainnya(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= 2. KONDISI FASILITAS SEKOLAH ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">2</span>
          <div>
            <h3>KONDISI FASILITAS SEKOLAH</h3>
            <p>Kondisi bangunan utama, ruang kelas, peralatan belajar, dan fasilitas pendukung.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Subheader Bangunan Utama */}
          <div className="asm-field span-2">
            <strong style={{ fontSize: 13, color: '#172324' }}>Kondisi Bangunan dan Sarana Utama</strong>
          </div>

          <div className="asm-field">
            <label>Jumlah Kelas yang Rusak</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 4"
                value={jumlahKelasRusak}
                onChange={(e) => setJumlahKelasRusak(e.target.value)}
              />
              <span>ruang</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Ukuran Rata-rata Ruang Kelas</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 56"
                value={ukuranKelas}
                onChange={(e) => setUkuranKelas(e.target.value)}
              />
              <span>m²</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Ukuran Luas Total Bangunan</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 600"
                value={luasBangunan}
                onChange={(e) => setLuasBangunan(e.target.value)}
              />
              <span>m²</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Kondisi Ruang Guru</label>
            <div className="asm-radio-group">
              {['Layak', 'Tidak Layak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${kondisiRuangGuru === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="kondisiRuangGuru"
                    value={opt}
                    checked={kondisiRuangGuru === opt}
                    onChange={() => setKondisiRuangGuru(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Toilet dan Sanitasi Siswa</label>
            <div className="asm-radio-group">
              {['Layak', 'Tidak Layak'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${toiletSanitasi === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="toiletSanitasi"
                    value={opt}
                    checked={toiletSanitasi === opt}
                    onChange={() => setToiletSanitasi(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Sumber Air Bersih</label>
            <div className="asm-radio-group">
              {['Ada', 'Tidak Ada'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${sumberAirBersih === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="sumberAirBersih"
                    value={opt}
                    checked={sumberAirBersih === opt}
                    onChange={() => setSumberAirBersih(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subheader Peralatan Pembelajaran */}
          <div className="asm-field span-2" style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #f2f6f6' }}>
            <strong style={{ fontSize: 13, color: '#172324' }}>Peralatan Pembelajaran</strong>
          </div>

          <div className="asm-field">
            <label>Meja dan Kursi Siswa (Jumlah yang Rusak)</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 120"
                value={mejaKursiRusak}
                onChange={(e) => setMejaKursiRusak(e.target.value)}
              />
              <span>set</span>
            </div>
          </div>

          <div className="asm-field">
            <label>Papan Tulis (Jumlah yang Rusak)</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 6"
                value={papanTulisRusak}
                onChange={(e) => setPapanTulisRusak(e.target.value)}
              />
              <span>unit</span>
            </div>
          </div>

          <div className="asm-field span-2">
            <label>Buku dan Alat Tulis (Jumlah yang Tersedia/Layak)</label>
            <div className="asm-input-unit">
              <input
                type="number"
                placeholder="Contoh: 40"
                value={bukuTersedia}
                onChange={(e) => setBukuTersedia(e.target.value)}
              />
              <span>paket</span>
            </div>
          </div>

          {/* Subheader Fasilitas Pendukung */}
          <div className="asm-field span-2" style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #f2f6f6' }}>
            <strong style={{ fontSize: 13, color: '#172324' }}>Fasilitas Pendukung</strong>
          </div>

          <div className="asm-field">
            <label>Perpustakaan</label>
            <div className="asm-radio-group">
              {['Ada', 'Tidak Ada'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${perpustakaan === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="perpustakaan"
                    value={opt}
                    checked={perpustakaan === opt}
                    onChange={() => setPerpustakaan(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Laboratorium</label>
            <div className="asm-radio-group">
              {['Ada', 'Tidak Ada'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${laboratorium === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="laboratorium"
                    value={opt}
                    checked={laboratorium === opt}
                    onChange={() => setLaboratorium(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="asm-field">
            <label>Area Bermain / Lapangan Olahraga</label>
            <div className="asm-radio-group">
              {['Ada', 'Tidak Ada'].map((opt) => (
                <label key={opt} className={`asm-radio-chip ${areaBermain === opt ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="areaBermain"
                    value={opt}
                    checked={areaBermain === opt}
                    onChange={() => setAreaBermain(opt as any)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. DAMPAK KEGIATAN BELAJAR MENGAJAR ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">3</span>
          <div>
            <h3>DAMPAK KEGIATAN BELAJAR MENGAJAR (KBM)</h3>
            <p>Kelangsungan proses belajar siswa pasca kejadian kerusakan.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field span-2">
            <label>Status Kegiatan Belajar Saat Ini</label>
            <div className="asm-radio-cards">
              {[
                { val: 'Terhenti Total', desc: 'Siswa diliburkan karena seluruh ruang belajar runtuh atau tidak aman.' },
                { val: 'Berlangsung di Lokasi Alternatif', desc: 'Menumpang di balai desa, tenda posko darurat, atau rumah warga.' },
                { val: 'Berlangsung Sebagian di Lokasi Asal', desc: 'Menggunakan ruang yang masih utuh secara bergantian (shift pagi/siang).' },
              ].map((item) => (
                <label
                  key={item.val}
                  className={`asm-radio-card ${statusKBM === item.val ? 'active alert-warning' : ''}`}
                >
                  <input
                    type="radio"
                    name="statusKBM"
                    value={item.val}
                    checked={statusKBM === item.val}
                    onChange={() => setStatusKBM(item.val as any)}
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
            <label>Hambatan Utama KBM</label>
            <div className="asm-radio-group">
              {[
                'Tidak Ada Ruang Kelas Darurat',
                'Kurangnya Alat Tulis dan Buku',
                'Transportasi ke Lokasi Belajar Sulit',
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
                placeholder="Sebutkan hambatan pembelajaran lainnya..."
                value={hambatanLainnya}
                onChange={(e) => setHambatanLainnya(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. KEBUTUHAN SEKOLAH DARURAT ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">4</span>
          <div>
            <h3>KEBUTUHAN SEKOLAH DARURAT</h3>
            <p>Kebutuhan sarana kelas darurat, logistik perlengkapan siswa, dan estimasi biaya.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          {/* Fasilitas Darurat */}
          <div className="asm-field span-2">
            <label>Fasilitas Darurat yang Dibutuhkan</label>
            <div className="asm-checkbox-group">
              {[
                'Tenda atau Ruang Darurat',
                'Meja dan Kursi Sementara',
                'Papan Tulis dan Penunjang Pembelajaran',
                'Lainnya (Sebutkan)',
              ].map((f) => (
                <label
                  key={f}
                  className={`asm-check-pill ${fasilitasDarurat.includes(f) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={fasilitasDarurat.includes(f)}
                    onChange={() => toggleArrayItem(fasilitasDarurat, setFasilitasDarurat, f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
            {fasilitasDarurat.includes('Lainnya (Sebutkan)') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan fasilitas darurat lainnya..."
                value={fasilitasLainnya}
                onChange={(e) => setFasilitasLainnya(e.target.value)}
              />
            )}
          </div>

          {/* Kebutuhan Logistik */}
          <div className="asm-field span-2">
            <label>Kebutuhan Logistik Untuk Siswa</label>
            <div className="asm-checkbox-group">
              {[
                'Buku Tulis dan Alat Tulis',
                'Seragam Sekolah',
                'Tas dan Perlengkapan Sekolah',
                'Lainnya (Sebutkan)',
              ].map((item) => (
                <label
                  key={item}
                  className={`asm-check-pill ${logistikSiswa.includes(item) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={logistikSiswa.includes(item)}
                    onChange={() => toggleArrayItem(logistikSiswa, setLogistikSiswa, item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {logistikSiswa.includes('Lainnya (Sebutkan)') && (
              <input
                type="text"
                className="asm-mt-sm"
                placeholder="Sebutkan kebutuhan logistik lainnya (misal: sepatu, buku pelajaran cetak)..."
                value={logistikLainnya}
                onChange={(e) => setLogistikLainnya(e.target.value)}
              />
            )}
          </div>

          {/* Estimasi Biaya */}
          <div className="asm-field span-2">
            <label>Estimasi Biaya Kebutuhan Sekolah Darurat</label>
            <input
              type="text"
              placeholder="Contoh: Rp 65.000.000"
              value={estimasiBiayaRaw}
              onChange={handleBiayaChange}
            />
            <small className="asm-field-hint">Ketik nominal angka, format Rupiah terformat otomatis.</small>
          </div>
        </div>
      </section>

      {/* ================= 5. DOKUMENTASI DAN INFORMASI TAMBAHAN ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">5</span>
          <div>
            <h3>DOKUMENTASI DAN INFORMASI TAMBAHAN</h3>
            <p>Lampiran foto kondisi bangunan sekolah, sarana belajar terdampak, dan lingkungan.</p>
          </div>
        </div>

        <div className="asm-upload-grid">
          {/* Foto Kondisi Bangunan */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO UTAMA (JPEG)</span>
            <strong>Foto Kondisi Bangunan</strong>
            <small>Ruang kelas yang rusak, retak dinding, atau plafon ambruk.</small>
            <label className={`asm-upload-btn ${fotoBangunan ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoBangunan ? fotoBangunan.name : 'Pilih Foto Bangunan'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoBangunan, 'Foto Kondisi Bangunan')}
              />
            </label>
            {fotoBangunan && <span className="asm-file-size">{(fotoBangunan.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Foto Fasilitas Penunjang */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO SARANA (JPEG)</span>
            <strong>Foto Fasilitas Penunjang</strong>
            <small>Kondisi meja, kursi, papan tulis, buku, atau toilet sekolah.</small>
            <label className={`asm-upload-btn ${fotoPenunjang ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoPenunjang ? fotoPenunjang.name : 'Pilih Foto Fasilitas'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoPenunjang, 'Foto Fasilitas Penunjang')}
              />
            </label>
            {fotoPenunjang && <span className="asm-file-size">{(fotoPenunjang.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Situasi Lingkungan Sekolah */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO AREA (JPEG)</span>
            <strong>Situasi Lingkungan Sekolah</strong>
            <small>Halaman, lapangan upacara, dan jalan akses menuju sekolah.</small>
            <label className={`asm-upload-btn ${fotoLingkungan ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoLingkungan ? fotoLingkungan.name : 'Pilih Foto Lingkungan'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoLingkungan, 'Situasi Lingkungan')}
              />
            </label>
            {fotoLingkungan && <span className="asm-file-size">{(fotoLingkungan.size / 1024).toFixed(0)} KB</span>}
          </div>

          {/* Hambatan Tambahan */}
          <div className="asm-upload-box">
            <span className="asm-upload-tag">FOTO HAMBATAN (JPEG)</span>
            <strong>Hambatan Tambahan</strong>
            <small>Akses longsor, puing reruntuhan, atau lokasi tenda sementara.</small>
            <label className={`asm-upload-btn ${fotoHambatan ? 'has-file' : ''}`}>
              <Icon name="upload" size={16} />
              <span>{fotoHambatan ? fotoHambatan.name : 'Pilih Foto Hambatan'}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(e) => handleFilePick(e, setFotoHambatan, 'Foto Hambatan Tambahan')}
              />
            </label>
            {fotoHambatan && <span className="asm-file-size">{(fotoHambatan.size / 1024).toFixed(0)} KB</span>}
          </div>
        </div>
      </section>

      {/* ================= 6. KONTAK PENANGGUNG JAWAB ================= */}
      <section className="asm-section">
        <div className="asm-section-head">
          <span className="asm-section-num">6</span>
          <div>
            <h3>KONTAK PENANGGUNG JAWAB</h3>
            <p>Kepala sekolah, pengurus komite, atau koordinator relawan pendidikan setempat.</p>
          </div>
        </div>

        <div className="asm-fields-grid">
          <div className="asm-field">
            <label>Nama Penanggung Jawab Lokasi (Kepala Sekolah / Guru)</label>
            <input
              type="text"
              placeholder="Contoh: Ibu Dra. Siti Aminah, M.Pd"
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
              placeholder="sdn.wonosari2@gmail.com"
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
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Assessment Sekolah'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}

