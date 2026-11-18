'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

interface AssessmentPohonFormProps {
  onBack: () => void
  onSubmitSuccess: (data: any) => void
  notify: (msg: string) => void
}

export default function AssessmentPohonForm({
  onBack,
  onSubmitSuccess,
  notify,
}: AssessmentPohonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ==========================================
  // FORM STATE (10 SECTIONS)
  // ==========================================
  // 01 Perizinan dan legalitas
  const [statusKepemilikanLahan, setStatusKepemilikanLahan] = useState<'Hak Milik' | 'Sewa' | 'HGU' | ''>('Hak Milik')
  const [suratIzinKelurahan, setSuratIzinKelurahan] = useState<'Ada' | 'Tidak Ada' | ''>('')
  const [persetujuanKecamatan, setPersetujuanKecamatan] = useState<'Ada' | 'Tidak Ada' | ''>('')
  const [persetujuanDinasTerkait, setPersetujuanDinasTerkait] = useState<'Ada' | 'Tidak Ada' | ''>('')
  const [dukunganRTRW, setDukunganRTRW] = useState<'Ada' | 'Tidak Ada' | ''>('')

  // 02 Pemetaan lokasi
  const [luasAreaTanam, setLuasAreaTanam] = useState('')
  const [titikLintang, setTitikLintang] = useState('')
  const [titikBujur, setTitikBujur] = useState('')
  const [kondisiTopografi, setKondisiTopografi] = useState<
    'Dataran Rendah' | 'Lereng Bukit' | 'Pegunungan' | 'Lembah' | ''
  >('')
  const [jarakAntarTitikTanam, setJarakAntarTitikTanam] = useState('')
  const [luasAreaBerpotensiTergenang, setLuasAreaBerpotensiTergenang] = useState('')

  // 03 Kondisi lingkungan
  const [jenisTanah, setJenisTanah] = useState<
    | 'Tanah Liat'
    | 'Tanah Berpasir'
    | 'Tanah Berhumus'
    | 'Tanah Gambut'
    | 'Tanah Kapur'
    | 'Tanah Vulkanik'
    | 'Tanah Campuran'
    | 'Tidak diketahui'
    | ''
  >('')
  const [pHTanah, setPHTanah] = useState<
    | 'Sangat Asam (<4,5)'
    | 'Asam (4,5 - 5,5)'
    | 'Agak Asam (5,6 - 6,5)'
    | 'Netral (6,6 - 7,5)'
    | 'Basa (> 7,5)'
    | 'Belum diukur / Tidak diukur'
    | ''
  >('')
  const [tingkatKelembapan, setTingkatKelembapan] = useState<
    | 'Sangat Kering'
    | 'Kering'
    | 'Sedang / lembap'
    | 'Basah'
    | 'Sangat Basah / Jenuh Air'
    | ''
  >('')
  const [intensitasGenanganAir, setIntensitasGenanganAir] = useState<
    | 'Tidak Pernah Tergenang'
    | 'Jarang'
    | 'Kadang-Kadang'
    | 'Sering'
    | 'Selalu / Hampir Selalu Tergenang'
    | ''
  >('')
  const [curahHujan, setCurahHujan] = useState<
    | 'Sangat rendah'
    | 'Rendah'
    | 'Sedang'
    | 'Tinggi'
    | 'Sangat Tinggi'
    | 'Tidak diketahui'
    | ''
  >('')

  // 04 Analisis risiko
  const [risikoAbrasi, setRisikoAbrasi] = useState<string>('')
  const [risikoBanjir, setRisikoBanjir] = useState<string>('')
  const [risikoKebakaranLahan, setRisikoKebakaranLahan] = useState<string>('')
  const [risikoGangguanHewanTernak, setRisikoGangguanHewanTernak] = useState<string>('')
  const [risikoVandalisme, setRisikoVandalisme] = useState<string>('')

  // 05 Identifikasi jenis pohon
  const [spesiesAdaptif, setSpesiesAdaptif] = useState('')

  // 06 Kapasitas tanam
  const [luasAreaEfektif, setLuasAreaEfektif] = useState('')
  const [kerapatanTanam, setKerapatanTanam] = useState('')
  const [jalurAksesDistribusiBibit, setJalurAksesDistribusiBibit] = useState<string>('')

  // 07 Sistem perawatan
  const [penanggungJawabPerawatan, setPenanggungJawabPerawatan] = useState('')
  const [jadwalPenyiraman, setJadwalPenyiraman] = useState('')
  const [jadwalPemupukan, setJadwalPemupukan] = useState('')
  const [jadwalMonitoringPerawatan, setJadwalMonitoringPerawatan] = useState('')

  // 08 Keterlibatan masyarakat
  const [kelompokMasyarakatSekitar, setKelompokMasyarakatSekitar] = useState<string>('')
  const [karangTaruna, setKarangTaruna] = useState<string>('')
  const [sekolahSekitar, setSekolahSekitar] = useState<string>('')
  const [relawanLokal, setRelawanLokal] = useState<string>('')

  // 09 Kebutuhan sarana dan prasarana
  const [alatTanam, setAlatTanam] = useState('')
  const [pupuk, setPupuk] = useState('')
  const [ajirBambu, setAjirBambu] = useState('')
  const [pagarPelindung, setPagarPelindung] = useState('')

  // 10 Monitoring dan evaluasi
  const [indikatorKeberhasilan, setIndikatorKeberhasilan] = useState('')
  const [persentaseHidupPohon, setPersentaseHidupPohon] = useState('')
  const [jadwalMonitoringEvaluasi, setJadwalMonitoringEvaluasi] = useState('')

  // Restore draft if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('asm_pohon_draft')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.statusKepemilikanLahan) setStatusKepemilikanLahan(data.statusKepemilikanLahan)
        if (data.suratIzinKelurahan) setSuratIzinKelurahan(data.suratIzinKelurahan)
        if (data.persetujuanKecamatan) setPersetujuanKecamatan(data.persetujuanKecamatan)
        if (data.persetujuanDinasTerkait) setPersetujuanDinasTerkait(data.persetujuanDinasTerkait)
        if (data.dukunganRTRW) setDukunganRTRW(data.dukunganRTRW)
        if (data.luasAreaTanam) setLuasAreaTanam(data.luasAreaTanam)
        if (data.titikLintang) setTitikLintang(data.titikLintang)
        if (data.titikBujur) setTitikBujur(data.titikBujur)
        if (data.kondisiTopografi) setKondisiTopografi(data.kondisiTopografi)
        if (data.jarakAntarTitikTanam) setJarakAntarTitikTanam(data.jarakAntarTitikTanam)
        if (data.luasAreaBerpotensiTergenang) setLuasAreaBerpotensiTergenang(data.luasAreaBerpotensiTergenang)
        if (data.jenisTanah) setJenisTanah(data.jenisTanah)
        if (data.pHTanah) setPHTanah(data.pHTanah)
        if (data.tingkatKelembapan) setTingkatKelembapan(data.tingkatKelembapan)
        if (data.intensitasGenanganAir) setIntensitasGenanganAir(data.intensitasGenanganAir)
        if (data.curahHujan) setCurahHujan(data.curahHujan)
        if (data.risikoAbrasi) setRisikoAbrasi(data.risikoAbrasi)
        if (data.risikoBanjir) setRisikoBanjir(data.risikoBanjir)
        if (data.risikoKebakaranLahan) setRisikoKebakaranLahan(data.risikoKebakaranLahan)
        if (data.risikoGangguanHewanTernak) setRisikoGangguanHewanTernak(data.risikoGangguanHewanTernak)
        if (data.risikoVandalisme) setRisikoVandalisme(data.risikoVandalisme)
        if (data.spesiesAdaptif) setSpesiesAdaptif(data.spesiesAdaptif)
        if (data.luasAreaEfektif) setLuasAreaEfektif(data.luasAreaEfektif)
        if (data.kerapatanTanam) setKerapatanTanam(data.kerapatanTanam)
        if (data.jalurAksesDistribusiBibit) setJalurAksesDistribusiBibit(data.jalurAksesDistribusiBibit)
        if (data.penanggungJawabPerawatan) setPenanggungJawabPerawatan(data.penanggungJawabPerawatan)
        if (data.jadwalPenyiraman) setJadwalPenyiraman(data.jadwalPenyiraman)
        if (data.jadwalPemupukan) setJadwalPemupukan(data.jadwalPemupukan)
        if (data.jadwalMonitoringPerawatan) setJadwalMonitoringPerawatan(data.jadwalMonitoringPerawatan)
        if (data.kelompokMasyarakatSekitar) setKelompokMasyarakatSekitar(data.kelompokMasyarakatSekitar)
        if (data.karangTaruna) setKarangTaruna(data.karangTaruna)
        if (data.sekolahSekitar) setSekolahSekitar(data.sekolahSekitar)
        if (data.relawanLokal) setRelawanLokal(data.relawanLokal)
        if (data.alatTanam) setAlatTanam(data.alatTanam)
        if (data.pupuk) setPupuk(data.pupuk)
        if (data.ajirBambu) setAjirBambu(data.ajirBambu)
        if (data.pagarPelindung) setPagarPelindung(data.pagarPelindung)
        if (data.indikatorKeberhasilan) setIndikatorKeberhasilan(data.indikatorKeberhasilan)
        if (data.persentaseHidupPohon) setPersentaseHidupPohon(data.persentaseHidupPohon)
        if (data.jadwalMonitoringEvaluasi) setJadwalMonitoringEvaluasi(data.jadwalMonitoringEvaluasi)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSaveDraft = () => {
    const payload = {
      statusKepemilikanLahan,
      suratIzinKelurahan,
      persetujuanKecamatan,
      persetujuanDinasTerkait,
      dukunganRTRW,
      luasAreaTanam,
      titikLintang,
      titikBujur,
      kondisiTopografi,
      jarakAntarTitikTanam,
      luasAreaBerpotensiTergenang,
      jenisTanah,
      pHTanah,
      tingkatKelembapan,
      intensitasGenanganAir,
      curahHujan,
      risikoAbrasi,
      risikoBanjir,
      risikoKebakaranLahan,
      risikoGangguanHewanTernak,
      risikoVandalisme,
      spesiesAdaptif,
      luasAreaEfektif,
      kerapatanTanam,
      jalurAksesDistribusiBibit,
      penanggungJawabPerawatan,
      jadwalPenyiraman,
      jadwalPemupukan,
      jadwalMonitoringPerawatan,
      kelompokMasyarakatSekitar,
      karangTaruna,
      sekolahSekitar,
      relawanLokal,
      alatTanam,
      pupuk,
      ajirBambu,
      pagarPelindung,
      indikatorKeberhasilan,
      persentaseHidupPohon,
      jadwalMonitoringEvaluasi,
    }
    localStorage.setItem('asm_pohon_draft', JSON.stringify(payload))
    notify('Draf assessment pohon berhasil disimpan ke perangkat lokal.')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = {
      statusKepemilikanLahan,
      suratIzinKelurahan,
      persetujuanKecamatan,
      persetujuanDinasTerkait,
      dukunganRTRW,
      luasAreaTanam,
      titikLintang,
      titikBujur,
      kondisiTopografi,
      jarakAntarTitikTanam,
      luasAreaBerpotensiTergenang,
      jenisTanah,
      pHTanah,
      tingkatKelembapan,
      intensitasGenanganAir,
      curahHujan,
      risikoAbrasi,
      risikoBanjir,
      risikoKebakaranLahan,
      risikoGangguanHewanTernak,
      risikoVandalisme,
      spesiesAdaptif,
      luasAreaEfektif,
      kerapatanTanam,
      jalurAksesDistribusiBibit,
      penanggungJawabPerawatan,
      jadwalPenyiraman,
      jadwalPemupukan,
      jadwalMonitoringPerawatan,
      kelompokMasyarakatSekitar,
      karangTaruna,
      sekolahSekitar,
      relawanLokal,
      alatTanam,
      pupuk,
      ajirBambu,
      pagarPelindung,
      indikatorKeberhasilan,
      persentaseHidupPohon,
      jadwalMonitoringEvaluasi,
    }

    try {
      const res = await api.createAssessment({
        type: 'pohon',
        title: spesiesAdaptif ? `Assessment Pohon: ${spesiesAdaptif.slice(0, 30)}` : 'Assessment Pohon Lapangan',
        category: 'Lingkungan',
        location: titikLintang && titikBujur ? `${titikLintang}, ${titikBujur}` : 'Area Penanaman',
        pmName: penanggungJawabPerawatan || 'Kelompok Tani Hutan',
        data: formData,
      })

      localStorage.removeItem('asm_pohon_draft')
      notify(`Data assessment (${res.assessment?.id}) berhasil masuk ke tabel assessment_pohon PostgreSQL!`)
      onSubmitSuccess(res.assessment || { title: 'Assessment Pohon' })
    } catch (err: any) {
      console.warn('Submit error:', err)
      notify(`Gagal tersambung ke backend: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="asm-pohon-container">
      {/* Back button */}
      <div className="asm-pohon-nav">
        <button type="button" className="asm-pohon-back-btn" onClick={onBack}>
          <Icon name="back" size={15} />
          <span>Semua assessment</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="asm-pohon-header">
        <div className="asm-pohon-title-row">
          <h1 className="asm-pohon-title">Assessment Pohon</h1>
          <span className="asm-pohon-step-badge">10 Bagian Formulir</span>
        </div>
        <p className="asm-pohon-subtitle">
          Perizinan, pemetaan lokasi, kondisi lingkungan, analisis risiko, kapasitas tanam, sistem perawatan, keterlibatan masyarakat, sarana, dan evaluasi.
        </p>
      </div>

      {/* Main Unified Form Box */}
      <form className="asm-pohon-card" onSubmit={handleSubmit}>
        <div className="asm-pohon-step-content">
          {/* ========================================================= */}
          {/* 01 Perizinan dan legalitas */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">01</span>
              <h2 className="asm-pohon-sec-title">Perizinan dan legalitas</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Status Kepemilikan Lahan</label>
                  <div className="asm-pohon-radio-list">
                    {(['Hak Milik', 'Sewa', 'HGU'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="statusKepemilikanLahan"
                          value={opt}
                          checked={statusKepemilikanLahan === opt}
                          onChange={(e) => setStatusKepemilikanLahan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Persetujuan Kecamatan</label>
                  <div className="asm-pohon-radio-list">
                    {(['Ada', 'Tidak Ada'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="persetujuanKecamatan"
                          value={opt}
                          checked={persetujuanKecamatan === opt}
                          onChange={(e) => setPersetujuanKecamatan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Dukungan RT/RW</label>
                  <div className="asm-pohon-radio-list">
                    {(['Ada', 'Tidak Ada'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="dukunganRTRW"
                          value={opt}
                          checked={dukunganRTRW === opt}
                          onChange={(e) => setDukunganRTRW(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Surat Izin dari Kelurahan</label>
                  <div className="asm-pohon-radio-list">
                    {(['Ada', 'Tidak Ada'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="suratIzinKelurahan"
                          value={opt}
                          checked={suratIzinKelurahan === opt}
                          onChange={(e) => setSuratIzinKelurahan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Persetujuan Dinas Terkait</label>
                  <div className="asm-pohon-radio-list">
                    {(['Ada', 'Tidak Ada'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="persetujuanDinasTerkait"
                          value={opt}
                          checked={persetujuanDinasTerkait === opt}
                          onChange={(e) => setPersetujuanDinasTerkait(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <span className="asm-pohon-hint">Contoh: DLH, PUPR, BBWS, bila dekat sempadan sungai.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 02 Pemetaan lokasi */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">02</span>
              <h2 className="asm-pohon-sec-title">Pemetaan lokasi</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Luas Area Tanam</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 2.500 m²"
                    value={luasAreaTanam}
                    onChange={(e) => setLuasAreaTanam(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kondisi Topografi</label>
                  <div className="asm-pohon-radio-list">
                    {(['Dataran Rendah', 'Lereng Bukit', 'Pegunungan', 'Lembah'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="kondisiTopografi"
                          value={opt}
                          checked={kondisiTopografi === opt}
                          onChange={(e) => setKondisiTopografi(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Titik Koordinat Lokasi</label>
                  <div className="asm-pohon-coords-row">
                    <input
                      type="text"
                      className="asm-pohon-input"
                      placeholder="Lintang"
                      value={titikLintang}
                      onChange={(e) => setTitikLintang(e.target.value)}
                    />
                    <input
                      type="text"
                      className="asm-pohon-input"
                      placeholder="Bujur"
                      value={titikBujur}
                      onChange={(e) => setTitikBujur(e.target.value)}
                    />
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jarak Antar Titik Tanam</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 3 x 3 meter"
                    value={jarakAntarTitikTanam}
                    onChange={(e) => setJarakAntarTitikTanam(e.target.value)}
                  />
                </div>
              </div>

              {/* Full Width Baris Bawah */}
              <div className="asm-pohon-col span-2">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Luas Area yang Berpotensi Tergenang</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 500 m²"
                    value={luasAreaBerpotensiTergenang}
                    onChange={(e) => setLuasAreaBerpotensiTergenang(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 03 Kondisi lingkungan */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">03</span>
              <h2 className="asm-pohon-sec-title">Kondisi lingkungan</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jenis Tanah</label>
                  <div className="asm-pohon-radio-list">
                    {[
                      'Tanah Liat',
                      'Tanah Berpasir',
                      'Tanah Berhumus',
                      'Tanah Gambut',
                      'Tanah Kapur',
                      'Tanah Vulkanik',
                      'Tanah Campuran',
                      'Tidak diketahui',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="jenisTanah"
                          value={opt}
                          checked={jenisTanah === opt}
                          onChange={(e) => setJenisTanah(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Tingkat Kelembapan</label>
                  <div className="asm-pohon-radio-list">
                    {[
                      'Sangat Kering',
                      'Kering',
                      'Sedang / lembap',
                      'Basah',
                      'Sangat Basah / Jenuh Air',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="tingkatKelembapan"
                          value={opt}
                          checked={tingkatKelembapan === opt}
                          onChange={(e) => setTingkatKelembapan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Curah Hujan</label>
                  <div className="asm-pohon-radio-list">
                    {[
                      'Sangat rendah',
                      'Rendah',
                      'Sedang',
                      'Tinggi',
                      'Sangat Tinggi',
                      'Tidak diketahui',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="curahHujan"
                          value={opt}
                          checked={curahHujan === opt}
                          onChange={(e) => setCurahHujan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">pH Tanah</label>
                  <div className="asm-pohon-radio-list">
                    {[
                      'Sangat Asam (<4,5)',
                      'Asam (4,5 - 5,5)',
                      'Agak Asam (5,6 - 6,5)',
                      'Netral (6,6 - 7,5)',
                      'Basa (> 7,5)',
                      'Belum diukur / Tidak diukur',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="pHTanah"
                          value={opt}
                          checked={pHTanah === opt}
                          onChange={(e) => setPHTanah(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Intensitas Genangan Air</label>
                  <div className="asm-pohon-radio-list">
                    {[
                      'Tidak Pernah Tergenang',
                      'Jarang',
                      'Kadang-Kadang',
                      'Sering',
                      'Selalu / Hampir Selalu Tergenang',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="intensitasGenanganAir"
                          value={opt}
                          checked={intensitasGenanganAir === opt}
                          onChange={(e) => setIntensitasGenanganAir(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 04 Analisis risiko */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">04</span>
              <h2 className="asm-pohon-sec-title">Analisis risiko</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Risiko Abrasi</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="risikoAbrasi"
                          value={opt}
                          checked={risikoAbrasi === opt}
                          onChange={(e) => setRisikoAbrasi(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Risiko Kebakaran Lahan</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="risikoKebakaranLahan"
                          value={opt}
                          checked={risikoKebakaranLahan === opt}
                          onChange={(e) => setRisikoKebakaranLahan(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Risiko Vandalisme</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="risikoVandalisme"
                          value={opt}
                          checked={risikoVandalisme === opt}
                          onChange={(e) => setRisikoVandalisme(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Risiko Banjir</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="risikoBanjir"
                          value={opt}
                          checked={risikoBanjir === opt}
                          onChange={(e) => setRisikoBanjir(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Risiko Gangguan Hewan ternak</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat rendah', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="risikoGangguanHewanTernak"
                          value={opt}
                          checked={risikoGangguanHewanTernak === opt}
                          onChange={(e) => setRisikoGangguanHewanTernak(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 05 Identifikasi jenis pohon */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">05</span>
              <h2 className="asm-pohon-sec-title">Identifikasi jenis pohon</h2>
            </div>

            <div className="asm-pohon-field">
              <label className="asm-pohon-label">Spesies yang Adaptif Terhadap Kondisi Lahan</label>
              <textarea
                className="asm-pohon-textarea"
                rows={4}
                placeholder="Tuliskan rekomendasi spesies pohon yang adaptif..."
                value={spesiesAdaptif}
                onChange={(e) => setSpesiesAdaptif(e.target.value)}
              />
            </div>
          </section>

          {/* ========================================================= */}
          {/* 06 Kapasitas tanam */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">06</span>
              <h2 className="asm-pohon-sec-title">Kapasitas tanam</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Luas Area Efektif</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 2.000 m²"
                    value={luasAreaEfektif}
                    onChange={(e) => setLuasAreaEfektif(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jalur Akses Distribusi Bibit</label>
                  <div className="asm-pohon-radio-list">
                    {['Sangat Sulit', 'Sulit', 'Cukup Mudah', 'Mudah', 'Sangat Mudah'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="jalurAksesDistribusiBibit"
                          value={opt}
                          checked={jalurAksesDistribusiBibit === opt}
                          onChange={(e) => setJalurAksesDistribusiBibit(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kerapatan Tanam</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 400 bibit/Ha"
                    value={kerapatanTanam}
                    onChange={(e) => setKerapatanTanam(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 07 Sistem perawatan */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">07</span>
              <h2 className="asm-pohon-sec-title">Sistem perawatan</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Penanggung Jawab Perawatan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Nama kelompok/individu PJ"
                    value={penanggungJawabPerawatan}
                    onChange={(e) => setPenanggungJawabPerawatan(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jadwal Pemupukan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 1x setiap 3 bulan"
                    value={jadwalPemupukan}
                    onChange={(e) => setJadwalPemupukan(e.target.value)}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jadwal Penyiraman</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Setiap pagi dan sore"
                    value={jadwalPenyiraman}
                    onChange={(e) => setJadwalPenyiraman(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jadwal Monitoring</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 1x setiap 2 minggu"
                    value={jadwalMonitoringPerawatan}
                    onChange={(e) => setJadwalMonitoringPerawatan(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 08 Keterlibatan masyarakat */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">08</span>
              <h2 className="asm-pohon-sec-title">Keterlibatan masyarakat</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kelompok Masyarakat Sekitar</label>
                  <div className="asm-pohon-radio-list">
                    {['Terlibat', 'Tidak Terlibat'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="kelompokMasyarakatSekitar"
                          value={opt}
                          checked={kelompokMasyarakatSekitar === opt}
                          onChange={(e) => setKelompokMasyarakatSekitar(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Sekolah Sekitar</label>
                  <div className="asm-pohon-radio-list">
                    {['Terlibat', 'Tidak Terlibat'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="sekolahSekitar"
                          value={opt}
                          checked={sekolahSekitar === opt}
                          onChange={(e) => setSekolahSekitar(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Karang Taruna</label>
                  <div className="asm-pohon-radio-list">
                    {['Terlibat', 'Tidak Terlibat'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="karangTaruna"
                          value={opt}
                          checked={karangTaruna === opt}
                          onChange={(e) => setKarangTaruna(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Relawan Lokal</label>
                  <div className="asm-pohon-radio-list">
                    {['Terlibat', 'Tidak Terlibat'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="relawanLokal"
                          value={opt}
                          checked={relawanLokal === opt}
                          onChange={(e) => setRelawanLokal(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 09 Kebutuhan sarana dan prasarana */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">09</span>
              <h2 className="asm-pohon-sec-title">Kebutuhan sarana dan prasarana</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Alat Tanam (Unit)</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 25 unit"
                    value={alatTanam}
                    onChange={(e) => setAlatTanam(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Ajir Bambu (Unit)</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 500 batang"
                    value={ajirBambu}
                    onChange={(e) => setAjirBambu(e.target.value)}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pupuk (Kg)</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 250 kg"
                    value={pupuk}
                    onChange={(e) => setPupuk(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pagar Pelindung (Unit)</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: 500 unit"
                    value={pagarPelindung}
                    onChange={(e) => setPagarPelindung(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 10 Monitoring dan evaluasi */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">10</span>
              <h2 className="asm-pohon-sec-title">Monitoring dan evaluasi</h2>
            </div>

            <div className="asm-pohon-single-col">
              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Indikator Keberhasilan</label>
                <textarea
                  className="asm-pohon-textarea"
                  rows={4}
                  placeholder="Tuliskan indikator keberhasilan program penanaman pohon..."
                  value={indikatorKeberhasilan}
                  onChange={(e) => setIndikatorKeberhasilan(e.target.value)}
                />
              </div>

              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Persentase Hidup Pohon (%)</label>
                <input
                  type="text"
                  className="asm-pohon-input"
                  placeholder="Contoh: 85%"
                  value={persentaseHidupPohon}
                  onChange={(e) => setPersentaseHidupPohon(e.target.value)}
                />
              </div>

              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Jadwal Monitoring</label>
                <textarea
                  className="asm-pohon-textarea"
                  rows={4}
                  placeholder="Tuliskan jadwal dan mekanisme monitoring evaluasi..."
                  value={jadwalMonitoringEvaluasi}
                  onChange={(e) => setJadwalMonitoringEvaluasi(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ACTION BAR */}
        {/* ========================================================= */}
        <div className="asm-pohon-bottom-bar">
          <div className="asm-pohon-status-hint">
            <span className="asm-pohon-status-icon">
              <Icon name="checkCircle" size={17} />
            </span>
            <span>Pastikan data sesuai hasil survei lapangan.</span>
          </div>

          <div className="asm-pohon-actions">
            <button
              type="button"
              className="asm-pohon-btn asm-pohon-btn-outline"
              onClick={handleSaveDraft}
            >
              <Icon name="fileText" size={15} />
              <span>Simpan draf</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="asm-pohon-btn asm-pohon-btn-primary"
            >
              <Icon name="send" size={15} />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim assessment'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
