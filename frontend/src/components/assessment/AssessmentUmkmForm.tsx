'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Icon } from '@/components/common/Icons'
import { api } from '@/lib/api'

interface AssessmentUmkmFormProps {
  onBack: () => void
  onSubmitSuccess: (data: any) => void
  notify: (msg: string) => void
}

export default function AssessmentUmkmForm({
  onBack,
  onSubmitSuccess,
  notify,
}: AssessmentUmkmFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ==========================================
  // 1. IDENTITAS PENERIMA MANFAAT
  // ==========================================
  const [namaLengkap, setNamaLengkap] = useState('')
  const [nomorKTP, setNomorKTP] = useState('')
  const [nomorKK, setNomorKK] = useState('')
  const [nomorHP, setNomorHP] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-Laki' | 'Perempuan' | ''>('')
  const [usia, setUsia] = useState('')
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState<string>('')
  const [statusPerkawinan, setStatusPerkawinan] = useState<string>('')
  const [jumlahAnggotaKeluarga, setJumlahAnggotaKeluarga] = useState('')
  const [alamatLengkap, setAlamatLengkap] = useState('')

  // ==========================================
  // 2. STATUS SOSIAL EKONOMI
  // ==========================================
  const [pekerjaanUtama, setPekerjaanUtama] = useState('')
  const [pekerjaanSampingan, setPekerjaanSampingan] = useState('')
  const [pendapatanRataRata, setPendapatanRataRata] = useState('')
  const [pengeluaranRataRata, setPengeluaranRataRata] = useState('')
  const [memilikiKendaraan, setMemilikiKendaraan] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiTabungan, setMemilikiTabungan] = useState<'Ya' | 'Tidak' | ''>('')

  // ==========================================
  // 3. DATA DESIL DAN BANTUAN PEMERINTAH
  // ==========================================
  const [terdaftarDTKS, setTerdaftarDTKS] = useState<'Terdaftar' | 'Tidak Terdaftar' | ''>('')
  const [nomorDTKS, setNomorDTKS] = useState('')
  const [desilBerapa, setDesilBerapa] = useState('')
  const [mendapatPKH, setMendapatPKH] = useState<'Ya' | 'Tidak' | ''>('')
  const [mendapatBPNT, setMendapatBPNT] = useState<'Ya' | 'Tidak' | ''>('')
  const [mendapatBLT, setMendapatBLT] = useState<'Ya' | 'Tidak' | ''>('')
  const [mendapatKIS, setMendapatKIS] = useState<'Ya' | 'Tidak' | ''>('')
  const [mendapatKIP, setMendapatKIP] = useState<'Ya' | 'Tidak' | ''>('')
  const [bantuanPemerintahLain, setBantuanPemerintahLain] = useState('')

  // ==========================================
  // 4. KONDISI USAHA
  // ==========================================
  const [produkUtama, setProdukUtama] = useState('')
  const [pendapatanPerbulan, setPendapatanPerbulan] = useState('')
  const [kendalaTerbesar, setKendalaTerbesar] = useState('')
  const [modalPerbulan, setModalPerbulan] = useState('')
  const [sumberModal, setSumberModal] = useState('')
  const [memilikiHutangUsaha, setMemilikiHutangUsaha] = useState<'Ya' | 'Tidak' | ''>('')
  const [hutangKepada, setHutangKepada] = useState<string[]>([])
  const [hutangLainnya, setHutangLainnya] = useState('')

  // ==========================================
  // 5. LITERASI KEUANGAN
  // ==========================================
  const [memilikiRekeningBank, setMemilikiRekeningBank] = useState<'Ya' | 'Tidak' | ''>('')
  const [bankApa, setBankApa] = useState<string[]>([])
  const [bankLainnya, setBankLainnya] = useState('')
  const [menggunakanMobileBanking, setMenggunakanMobileBanking] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiQRIS, setMemilikiQRIS] = useState<'Ya' | 'Tidak' | ''>('')
  const [pernahMengajukanKUR, setPernahMengajukanKUR] = useState<'Ya' | 'Tidak' | ''>('')
  const [mencatatPemasukan, setMencatatPemasukan] = useState<'Ya' | 'Tidak' | ''>('')
  const [mencatatPengeluaran, setMencatatPengeluaran] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiBukuKas, setMemilikiBukuKas] = useState<'Ya' | 'Tidak' | ''>('')
  const [mengetahuiHPP, setMengetahuiHPP] = useState<'Ya' | 'Tidak' | ''>('')
  const [memisahkanUangUsaha, setMemisahkanUangUsaha] = useState<'Ya' | 'Tidak' | ''>('')

  // ==========================================
  // 6. LEGALITAS USAHA
  // ==========================================
  const [memilikiNIB, setMemilikiNIB] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiPIRT, setMemilikiPIRT] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiSertifikatHalal, setMemilikiSertifikatHalal] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiMerek, setMemilikiMerek] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiKemasan, setMemilikiKemasan] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiLabel, setMemilikiLabel] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiMediaSosial, setMemilikiMediaSosial] = useState<'Ya' | 'Tidak' | ''>('')
  const [menjualOnline, setMenjualOnline] = useState<'Ya' | 'Tidak' | ''>('')

  // ==========================================
  // 7. PENGEMBANGAN PRODUK
  // ==========================================
  const [produkYangDijual, setProdukYangDijual] = useState('')
  const [bentukPenjualan, setBentukPenjualan] = useState<string>('')
  const [bentukPenjualanLainnya, setBentukPenjualanLainnya] = useState('')
  const [memilikiProdukOlahan, setMemilikiProdukOlahan] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiBranding, setMemilikiBranding] = useState<'Ya' | 'Tidak' | ''>('')
  const [kendalaPemasaran, setKendalaPemasaran] = useState('')
  const [targetUsaha, setTargetUsaha] = useState('')

  // ==========================================
  // 8. AKSES PEMASARAN
  // ==========================================
  const [menjualKemana, setMenjualKemana] = useState<string[]>([])
  const [menjualKemanaLainnya, setMenjualKemanaLainnya] = useState('')
  const [adaPelangganTetap, setAdaPelangganTetap] = useState<'Ya' | 'Tidak' | ''>('')
  const [pernahIkutBazaar, setPernahIkutBazaar] = useState<'Ya' | 'Tidak' | ''>('')
  const [pernahPromosiOnline, setPernahPromosiOnline] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiMarketplace, setMemilikiMarketplace] = useState<'Ya' | 'Tidak' | ''>('')
  const [memilikiWABusiness, setMemilikiWABusiness] = useState<'Ya' | 'Tidak' | ''>('')

  // ==========================================
  // 9. KEBUTUHAN BANTUAN USAHA
  // ==========================================
  const [jenisBantuan, setJenisBantuan] = useState<string[]>([])
  const [jenisBantuanLainnya, setJenisBantuanLainnya] = useState('')
  const [perkiraanNilaiBantuan, setPerkiraanNilaiBantuan] = useState('')
  const [rencanaPenggunaanBantuan, setRencanaPenggunaanBantuan] = useState('')
  const [dampakYangDiharapkan, setDampakYangDiharapkan] = useState('')
  const [kesediaanPendampingan, setKesediaanPendampingan] = useState<'Ya' | 'Tidak' | ''>('')

  // ==========================================
  // 10. SARANA PRODUKTIF
  // ==========================================
  const [saranaProduktif, setSaranaProduktif] = useState<string>('')
  const [saranaProduktifLainnya, setSaranaProduktifLainnya] = useState('')

  // ==========================================
  // 11. HARAPAN PENERIMA MANFAAT
  // ==========================================
  const [harapanProgram, setHarapanProgram] = useState('')
  const [perubahanPalingDiharapkan, setPerubahanPalingDiharapkan] = useState('')
  const [rencanaSetelahProgram, setRencanaSetelahProgram] = useState('')

  // ==========================================
  // 12. DOKUMENTASI WAJIB (12 berkas)
  // ==========================================
  const [fotoFiles, setFotoFiles] = useState<Record<string, File | null>>({
    fotoRumahTampakDepan: null,
    fotoDepanRumah: null,
    fotoRuangTamu: null,
    fotoDapur: null,
    fotoKamarMandi: null,
    fotoBersamaKeluarga: null,
    fotoBersamaPM: null,
    fotoTempatBerjualan: null,
    fotoAktivitasBerjualan: null,
    fotoProduk: null,
    fotoKTP: null,
    fotoKK: null,
  })

  // Format rupiah helper
  const formatRupiah = (val: string) => {
    const num = val.replace(/\D/g, '')
    if (!num) return ''
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(parseInt(num, 10))
  }

  // Toggle checkbox helper
  const toggleCheckbox = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item))
    } else {
      setList([...list, item])
    }
  }

  // File upload handler
  const handleFileChange = (key: string, e: ChangeEvent<HTMLInputElement>, label: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFotoFiles((prev) => ({ ...prev, [key]: file }))
      notify(`Berkas "${file.name}" untuk ${label} berhasil dipilih.`)
    }
  }

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('asm_umkm_draft')
      if (saved) {
        const d = JSON.parse(saved)
        if (d.namaLengkap) setNamaLengkap(d.namaLengkap)
        if (d.nomorKTP) setNomorKTP(d.nomorKTP)
        if (d.nomorKK) setNomorKK(d.nomorKK)
        if (d.nomorHP) setNomorHP(d.nomorHP)
        if (d.jenisKelamin) setJenisKelamin(d.jenisKelamin)
        if (d.usia) setUsia(d.usia)
        if (d.pendidikanTerakhir) setPendidikanTerakhir(d.pendidikanTerakhir)
        if (d.statusPerkawinan) setStatusPerkawinan(d.statusPerkawinan)
        if (d.jumlahAnggotaKeluarga) setJumlahAnggotaKeluarga(d.jumlahAnggotaKeluarga)
        if (d.alamatLengkap) setAlamatLengkap(d.alamatLengkap)
        if (d.pekerjaanUtama) setPekerjaanUtama(d.pekerjaanUtama)
        if (d.pekerjaanSampingan) setPekerjaanSampingan(d.pekerjaanSampingan)
        if (d.pendapatanRataRata) setPendapatanRataRata(d.pendapatanRataRata)
        if (d.pengeluaranRataRata) setPengeluaranRataRata(d.pengeluaranRataRata)
        if (d.memilikiKendaraan) setMemilikiKendaraan(d.memilikiKendaraan)
        if (d.memilikiTabungan) setMemilikiTabungan(d.memilikiTabungan)
        if (d.terdaftarDTKS) setTerdaftarDTKS(d.terdaftarDTKS)
        if (d.nomorDTKS) setNomorDTKS(d.nomorDTKS)
        if (d.desilBerapa) setDesilBerapa(d.desilBerapa)
        if (d.mendapatPKH) setMendapatPKH(d.mendapatPKH)
        if (d.mendapatBPNT) setMendapatBPNT(d.mendapatBPNT)
        if (d.mendapatBLT) setMendapatBLT(d.mendapatBLT)
        if (d.mendapatKIS) setMendapatKIS(d.mendapatKIS)
        if (d.mendapatKIP) setMendapatKIP(d.mendapatKIP)
        if (d.bantuanPemerintahLain) setBantuanPemerintahLain(d.bantuanPemerintahLain)
        if (d.produkUtama) setProdukUtama(d.produkUtama)
        if (d.pendapatanPerbulan) setPendapatanPerbulan(d.pendapatanPerbulan)
        if (d.kendalaTerbesar) setKendalaTerbesar(d.kendalaTerbesar)
        if (d.modalPerbulan) setModalPerbulan(d.modalPerbulan)
        if (d.sumberModal) setSumberModal(d.sumberModal)
        if (d.memilikiHutangUsaha) setMemilikiHutangUsaha(d.memilikiHutangUsaha)
        if (d.hutangKepada) setHutangKepada(d.hutangKepada)
        if (d.hutangLainnya) setHutangLainnya(d.hutangLainnya)
        if (d.memilikiRekeningBank) setMemilikiRekeningBank(d.memilikiRekeningBank)
        if (d.bankApa) setBankApa(d.bankApa)
        if (d.bankLainnya) setBankLainnya(d.bankLainnya)
        if (d.menggunakanMobileBanking) setMenggunakanMobileBanking(d.menggunakanMobileBanking)
        if (d.memilikiQRIS) setMemilikiQRIS(d.memilikiQRIS)
        if (d.pernahMengajukanKUR) setPernahMengajukanKUR(d.pernahMengajukanKUR)
        if (d.mencatatPemasukan) setMencatatPemasukan(d.mencatatPemasukan)
        if (d.mencatatPengeluaran) setMencatatPengeluaran(d.mencatatPengeluaran)
        if (d.memilikiBukuKas) setMemilikiBukuKas(d.memilikiBukuKas)
        if (d.mengetahuiHPP) setMengetahuiHPP(d.mengetahuiHPP)
        if (d.memisahkanUangUsaha) setMemisahkanUangUsaha(d.memisahkanUangUsaha)
        if (d.memilikiNIB) setMemilikiNIB(d.memilikiNIB)
        if (d.memilikiPIRT) setMemilikiPIRT(d.memilikiPIRT)
        if (d.memilikiSertifikatHalal) setMemilikiSertifikatHalal(d.memilikiSertifikatHalal)
        if (d.memilikiMerek) setMemilikiMerek(d.memilikiMerek)
        if (d.memilikiKemasan) setMemilikiKemasan(d.memilikiKemasan)
        if (d.memilikiLabel) setMemilikiLabel(d.memilikiLabel)
        if (d.memilikiMediaSosial) setMemilikiMediaSosial(d.memilikiMediaSosial)
        if (d.menjualOnline) setMenjualOnline(d.menjualOnline)
        if (d.produkYangDijual) setProdukYangDijual(d.produkYangDijual)
        if (d.bentukPenjualan) setBentukPenjualan(d.bentukPenjualan)
        if (d.bentukPenjualanLainnya) setBentukPenjualanLainnya(d.bentukPenjualanLainnya)
        if (d.memilikiProdukOlahan) setMemilikiProdukOlahan(d.memilikiProdukOlahan)
        if (d.memilikiBranding) setMemilikiBranding(d.memilikiBranding)
        if (d.kendalaPemasaran) setKendalaPemasaran(d.kendalaPemasaran)
        if (d.targetUsaha) setTargetUsaha(d.targetUsaha)
        if (d.menjualKemana) setMenjualKemana(d.menjualKemana)
        if (d.menjualKemanaLainnya) setMenjualKemanaLainnya(d.menjualKemanaLainnya)
        if (d.adaPelangganTetap) setAdaPelangganTetap(d.adaPelangganTetap)
        if (d.pernahIkutBazaar) setPernahIkutBazaar(d.pernahIkutBazaar)
        if (d.pernahPromosiOnline) setPernahPromosiOnline(d.pernahPromosiOnline)
        if (d.memilikiMarketplace) setMemilikiMarketplace(d.memilikiMarketplace)
        if (d.memilikiWABusiness) setMemilikiWABusiness(d.memilikiWABusiness)
        if (d.jenisBantuan) setJenisBantuan(d.jenisBantuan)
        if (d.jenisBantuanLainnya) setJenisBantuanLainnya(d.jenisBantuanLainnya)
        if (d.perkiraanNilaiBantuan) setPerkiraanNilaiBantuan(d.perkiraanNilaiBantuan)
        if (d.rencanaPenggunaanBantuan) setRencanaPenggunaanBantuan(d.rencanaPenggunaanBantuan)
        if (d.dampakYangDiharapkan) setDampakYangDiharapkan(d.dampakYangDiharapkan)
        if (d.kesediaanPendampingan) setKesediaanPendampingan(d.kesediaanPendampingan)
        if (d.saranaProduktif) setSaranaProduktif(d.saranaProduktif)
        if (d.saranaProduktifLainnya) setSaranaProduktifLainnya(d.saranaProduktifLainnya)
        if (d.harapanProgram) setHarapanProgram(d.harapanProgram)
        if (d.perubahanPalingDiharapkan) setPerubahanPalingDiharapkan(d.perubahanPalingDiharapkan)
        if (d.rencanaSetelahProgram) setRencanaSetelahProgram(d.rencanaSetelahProgram)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSaveDraft = () => {
    const payload = {
      namaLengkap,
      nomorKTP,
      nomorKK,
      nomorHP,
      jenisKelamin,
      usia,
      pendidikanTerakhir,
      statusPerkawinan,
      jumlahAnggotaKeluarga,
      alamatLengkap,
      pekerjaanUtama,
      pekerjaanSampingan,
      pendapatanRataRata,
      pengeluaranRataRata,
      memilikiKendaraan,
      memilikiTabungan,
      terdaftarDTKS,
      nomorDTKS,
      desilBerapa,
      mendapatPKH,
      mendapatBPNT,
      mendapatBLT,
      mendapatKIS,
      mendapatKIP,
      bantuanPemerintahLain,
      produkUtama,
      pendapatanPerbulan,
      kendalaTerbesar,
      modalPerbulan,
      sumberModal,
      memilikiHutangUsaha,
      hutangKepada,
      hutangLainnya,
      memilikiRekeningBank,
      bankApa,
      bankLainnya,
      menggunakanMobileBanking,
      memilikiQRIS,
      pernahMengajukanKUR,
      mencatatPemasukan,
      mencatatPengeluaran,
      memilikiBukuKas,
      mengetahuiHPP,
      memisahkanUangUsaha,
      memilikiNIB,
      memilikiPIRT,
      memilikiSertifikatHalal,
      memilikiMerek,
      memilikiKemasan,
      memilikiLabel,
      memilikiMediaSosial,
      menjualOnline,
      produkYangDijual,
      bentukPenjualan,
      bentukPenjualanLainnya,
      memilikiProdukOlahan,
      memilikiBranding,
      kendalaPemasaran,
      targetUsaha,
      menjualKemana,
      menjualKemanaLainnya,
      adaPelangganTetap,
      pernahIkutBazaar,
      pernahPromosiOnline,
      memilikiMarketplace,
      memilikiWABusiness,
      jenisBantuan,
      jenisBantuanLainnya,
      perkiraanNilaiBantuan,
      rencanaPenggunaanBantuan,
      dampakYangDiharapkan,
      kesediaanPendampingan,
      saranaProduktif,
      saranaProduktifLainnya,
      harapanProgram,
      perubahanPalingDiharapkan,
      rencanaSetelahProgram,
    }
    localStorage.setItem('asm_umkm_draft', JSON.stringify(payload))
    notify('Draf assessment UMKM berhasil disimpan ke perangkat lokal.')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!namaLengkap.trim()) {
      notify('Nama lengkap penerima manfaat wajib diisi!')
      return
    }

    setIsSubmitting(true)

    const formData = {
      namaLengkap,
      nomorKTP,
      nomorKK,
      nomorHP,
      jenisKelamin,
      usia,
      pendidikanTerakhir,
      statusPerkawinan,
      jumlahAnggotaKeluarga,
      alamatLengkap,
      pekerjaanUtama,
      pekerjaanSampingan,
      pendapatanRataRata,
      pengeluaranRataRata,
      memilikiKendaraan,
      memilikiTabungan,
      terdaftarDTKS,
      nomorDTKS,
      desilBerapa,
      mendapatPKH,
      mendapatBPNT,
      mendapatBLT,
      mendapatKIS,
      mendapatKIP,
      bantuanPemerintahLain,
      produkUtama,
      pendapatanPerbulan,
      kendalaTerbesar,
      modalPerbulan,
      sumberModal,
      memilikiHutangUsaha,
      hutangKepada,
      hutangLainnya,
      memilikiRekeningBank,
      bankApa,
      bankLainnya,
      menggunakanMobileBanking,
      memilikiQRIS,
      pernahMengajukanKUR,
      mencatatPemasukan,
      mencatatPengeluaran,
      memilikiBukuKas,
      mengetahuiHPP,
      memisahkanUangUsaha,
      memilikiNIB,
      memilikiPIRT,
      memilikiSertifikatHalal,
      memilikiMerek,
      memilikiKemasan,
      memilikiLabel,
      memilikiMediaSosial,
      menjualOnline,
      produkYangDijual,
      bentukPenjualan,
      bentukPenjualanLainnya,
      memilikiProdukOlahan,
      memilikiBranding,
      kendalaPemasaran,
      targetUsaha,
      menjualKemana,
      menjualKemanaLainnya,
      adaPelangganTetap,
      pernahIkutBazaar,
      pernahPromosiOnline,
      memilikiMarketplace,
      memilikiWABusiness,
      jenisBantuan,
      perkiraanNilaiBantuan,
      rencanaPenggunaanBantuan,
      dampakYangDiharapkan,
      kesediaanPendampingan,
      saranaProduktif,
      harapanProgram,
      perubahanPalingDiharapkan,
      rencanaSetelahProgram,
    }

    try {
      const res = await api.createAssessment({
        type: 'umkm',
        title: `Assessment UMKM: ${namaLengkap} (${produkUtama || 'Usaha Mikro'})`,
        pmName: namaLengkap,
        category: 'Ekonomi masyarakat',
        location: alamatLengkap || 'Jawa Barat',
        data: formData,
        photos: Object.entries(fotoFiles)
          .filter(([_, file]) => Boolean(file))
          .map(([key, file]) => ({ key, name: (file as File).name })),
      })

      localStorage.removeItem('asm_umkm_draft')
      notify(`Data assessment (${res.assessment?.id}) berhasil masuk ke tabel assessment_umkm PostgreSQL!`)
      onSubmitSuccess(res.assessment || { title: `Assessment UMKM: ${namaLengkap}` })
    } catch (err: any) {
      console.warn('Submit error:', err)
      notify(`Gagal tersambung ke backend: ${err.message || 'Error koneksi'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Opsi Radio Ya / Tidak
  const yaTidakOptions = ['Ya', 'Tidak'] as const

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
          <h1 className="asm-pohon-title">Assessment UMKM</h1>
          <span className="asm-pohon-step-badge">12 Bagian Formulir</span>
        </div>
        <p className="asm-pohon-subtitle">
          Identitas penerima manfaat, status sosial ekonomi, profil usaha, literasi keuangan, legalitas, pemasaran, dan dokumentasi lapangan.
        </p>
      </div>

      {/* Form Container */}
      <form className="asm-pohon-card" onSubmit={handleSubmit}>
        <div className="asm-pohon-step-content">
          {/* ========================================================= */}
          {/* 01 IDENTITAS PENERIMA MANFAAT */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">01</span>
              <h2 className="asm-pohon-sec-title">Identitas Penerima Manfaat</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Nama sesuai KTP"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    required
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Nomor KTP (16 digit angka)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 3201..."
                    value={nomorKTP}
                    onChange={(e) => setNomorKTP(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Nomor KK (16 digit angka)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 3201..."
                    value={nomorKK}
                    onChange={(e) => setNomorKK(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Nomor HP (WhatsApp)</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 0812..."
                    value={nomorHP}
                    onChange={(e) => setNomorHP(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jenis Kelamin</label>
                  <div className="asm-pohon-radio-list">
                    {(['Laki-Laki', 'Perempuan'] as const).map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value={opt}
                          checked={jenisKelamin === opt}
                          onChange={(e) => setJenisKelamin(e.target.value as any)}
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
                  <label className="asm-pohon-label">Usia (Tahun)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 42"
                    value={usia}
                    onChange={(e) => setUsia(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pendidikan Terakhir</label>
                  <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {['SD', 'SMP', 'SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="pendidikanTerakhir"
                          value={opt}
                          checked={pendidikanTerakhir === opt}
                          onChange={(e) => setPendidikanTerakhir(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Status Perkawinan</label>
                  <div className="asm-pohon-radio-list">
                    {['Belum Menikah', 'Menikah', 'Duda', 'Janda'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="statusPerkawinan"
                          value={opt}
                          checked={statusPerkawinan === opt}
                          onChange={(e) => setStatusPerkawinan(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jumlah Anggota Keluarga (Orang)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 4"
                    value={jumlahAnggotaKeluarga}
                    onChange={(e) => setJumlahAnggotaKeluarga(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {/* Full Width Alamat */}
              <div className="asm-pohon-col span-2">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Alat / Alamat Lengkap</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={3}
                    placeholder="Nama jalan/kampung, RT/RW, Desa, Kelurahan, Kecamatan, Kabupaten/Kota"
                    value={alamatLengkap}
                    onChange={(e) => setAlamatLengkap(e.target.value)}
                  />
                  <span className="asm-pohon-hint">Format: Desa/Kelurahan, Kecamatan, Kabupaten/Kota</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 02 STATUS SOSIAL EKONOMI */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">02</span>
              <h2 className="asm-pohon-sec-title">Status Sosial Ekonomi</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pekerjaan Utama</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Pedagang Gorengan"
                    value={pekerjaanUtama}
                    onChange={(e) => setPekerjaanUtama(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pekerjaan Sampingan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Ojek Online / Buruh Lepas / Tidak Ada"
                    value={pekerjaanSampingan}
                    onChange={(e) => setPekerjaanSampingan(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pendapatan Rata-Rata Perbulan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Rp 2.500.000"
                    value={pendapatanRataRata}
                    onChange={(e) => setPendapatanRataRata(formatRupiah(e.target.value))}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pengeluaran Rata-Rata Perbulan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Rp 2.000.000"
                    value={pengeluaranRataRata}
                    onChange={(e) => setPengeluaranRataRata(formatRupiah(e.target.value))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Kendaraan</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiKendaraan"
                          value={opt}
                          checked={memilikiKendaraan === opt}
                          onChange={(e) => setMemilikiKendaraan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Tabungan</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiTabungan"
                          value={opt}
                          checked={memilikiTabungan === opt}
                          onChange={(e) => setMemilikiTabungan(e.target.value as any)}
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
          {/* 03 DATA DESIL DAN BANTUAN PEMERINTAH */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">03</span>
              <h2 className="asm-pohon-sec-title">Data Desil dan Bantuan Pemerintah</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Terdaftar DTKS</label>
                  <div className="asm-pohon-radio-list">
                    {['Terdaftar', 'Tidak Terdaftar'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="terdaftarDTKS"
                          value={opt}
                          checked={terdaftarDTKS === opt}
                          onChange={(e) => setTerdaftarDTKS(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Nomor DTKS</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Nomor ID DTKS jika terdaftar"
                    value={nomorDTKS}
                    onChange={(e) => setNomorDTKS(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Desil Berapa (Angka)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="asm-pohon-input"
                    placeholder="Contoh: 1, 2, 3, atau 4"
                    value={desilBerapa}
                    onChange={(e) => setDesilBerapa(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mendapat PKH (Program Keluarga Harapan)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mendapatPKH"
                          value={opt}
                          checked={mendapatPKH === opt}
                          onChange={(e) => setMendapatPKH(e.target.value as any)}
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
                  <label className="asm-pohon-label">Mendapat BPNT (Bantuan Pangan Non Tunai)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mendapatBPNT"
                          value={opt}
                          checked={mendapatBPNT === opt}
                          onChange={(e) => setMendapatBPNT(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mendapat BLT</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mendapatBLT"
                          value={opt}
                          checked={mendapatBLT === opt}
                          onChange={(e) => setMendapatBLT(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mendapat KIS (Kartu Indonesia Sehat)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mendapatKIS"
                          value={opt}
                          checked={mendapatKIS === opt}
                          onChange={(e) => setMendapatKIS(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mendapat KIP (Kartu Indonesia Pintar)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mendapatKIP"
                          value={opt}
                          checked={mendapatKIP === opt}
                          onChange={(e) => setMendapatKIP(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Width Bantuan Lain */}
              <div className="asm-pohon-col span-2">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Bantuan Pemerintah Lain</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={2}
                    placeholder="Sebutkan bantuan lain yang pernah atau sedang diterima (jika ada)..."
                    value={bantuanPemerintahLain}
                    onChange={(e) => setBantuanPemerintahLain(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 04 KONDISI USAHA */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">04</span>
              <h2 className="asm-pohon-sec-title">Kondisi Usaha</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Produk Utama</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Aneka Keripik Singkong"
                    value={produkUtama}
                    onChange={(e) => setProdukUtama(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pendapatan Perbulan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Rp 3.500.000"
                    value={pendapatanPerbulan}
                    onChange={(e) => setPendapatanPerbulan(formatRupiah(e.target.value))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Modal Perbulan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Rp 1.500.000"
                    value={modalPerbulan}
                    onChange={(e) => setModalPerbulan(formatRupiah(e.target.value))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Sumber Modal</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Tabungan Sendiri / Pinjaman Keluarga"
                    value={sumberModal}
                    onChange={(e) => setSumberModal(e.target.value)}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Hutang Usaha</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiHutangUsaha"
                          value={opt}
                          checked={memilikiHutangUsaha === opt}
                          onChange={(e) => setMemilikiHutangUsaha(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Hutang Kepada Siapa (Bisa pilih lebih dari satu)</label>
                  <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {[
                      'Tidak Memiliki Hutang',
                      'Bank',
                      'Koperasi',
                      'Lembaga Keuangan Non Bank',
                      'Pinjaman Online',
                      'Rentenir',
                      'Keluarga',
                      'Teman',
                      'Toko / Warung',
                      'Lainnya',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="checkbox"
                          checked={hutangKepada.includes(opt)}
                          onChange={() => toggleCheckbox(hutangKepada, setHutangKepada, opt)}
                        />
                        <span className="asm-pohon-check-box" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {hutangKepada.includes('Lainnya') && (
                    <input
                      type="text"
                      className="asm-pohon-input"
                      style={{ marginTop: 6 }}
                      placeholder="Sebutkan pemberi pinjaman lainnya..."
                      value={hutangLainnya}
                      onChange={(e) => setHutangLainnya(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* Full Width Kendala */}
              <div className="asm-pohon-col span-2">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kendala Terbesar Usaha</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={3}
                    placeholder="Ceritakan kendala terbesar dalam operasional, bahan baku, atau penjualan..."
                    value={kendalaTerbesar}
                    onChange={(e) => setKendalaTerbesar(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 05 LITERASI KEUANGAN */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">05</span>
              <h2 className="asm-pohon-sec-title">Literasi Keuangan</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Rekening Bank</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiRekeningBank"
                          value={opt}
                          checked={memilikiRekeningBank === opt}
                          onChange={(e) => setMemilikiRekeningBank(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {memilikiRekeningBank === 'Ya' && (
                  <div className="asm-pohon-field">
                    <label className="asm-pohon-label">Bank Apa yang Digunakan</label>
                    <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {['BRI', 'BNI', 'BCA', 'Mandiri', 'BSI', 'Muamalat', 'Lainnya'].map((opt) => (
                        <label key={opt} className="asm-pohon-radio-item">
                          <input
                            type="checkbox"
                            checked={bankApa.includes(opt)}
                            onChange={() => toggleCheckbox(bankApa, setBankApa, opt)}
                          />
                          <span className="asm-pohon-check-box" />
                          <span className="asm-pohon-radio-text">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {bankApa.includes('Lainnya') && (
                      <input
                        type="text"
                        className="asm-pohon-input"
                        style={{ marginTop: 6 }}
                        placeholder="Sebutkan nama bank lainnya..."
                        value={bankLainnya}
                        onChange={(e) => setBankLainnya(e.target.value)}
                      />
                    )}
                  </div>
                )}

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Menggunakan Mobile Banking</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="menggunakanMobileBanking"
                          value={opt}
                          checked={menggunakanMobileBanking === opt}
                          onChange={(e) => setMenggunakanMobileBanking(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki QRIS</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiQRIS"
                          value={opt}
                          checked={memilikiQRIS === opt}
                          onChange={(e) => setMemilikiQRIS(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pernah Mengajukan KUR (Kredit Usaha Rakyat)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="pernahMengajukanKUR"
                          value={opt}
                          checked={pernahMengajukanKUR === opt}
                          onChange={(e) => setPernahMengajukanKUR(e.target.value as any)}
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
                  <label className="asm-pohon-label">Mencatat Pemasukan Rutin</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mencatatPemasukan"
                          value={opt}
                          checked={mencatatPemasukan === opt}
                          onChange={(e) => setMencatatPemasukan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mencatat Pengeluaran Rutin</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mencatatPengeluaran"
                          value={opt}
                          checked={mencatatPengeluaran === opt}
                          onChange={(e) => setMencatatPengeluaran(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Buku Kas</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiBukuKas"
                          value={opt}
                          checked={memilikiBukuKas === opt}
                          onChange={(e) => setMemilikiBukuKas(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Mengetahui HPP (Harga Pokok Penjualan)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="mengetahuiHPP"
                          value={opt}
                          checked={mengetahuiHPP === opt}
                          onChange={(e) => setMengetahuiHPP(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memisahkan Uang Usaha dan Uang Pribadi</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memisahkanUangUsaha"
                          value={opt}
                          checked={memisahkanUangUsaha === opt}
                          onChange={(e) => setMemisahkanUangUsaha(e.target.value as any)}
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
          {/* 06 LEGALITAS USAHA */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">06</span>
              <h2 className="asm-pohon-sec-title">Legalitas Usaha</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki NIB (Nomor Induk Berusaha)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiNIB"
                          value={opt}
                          checked={memilikiNIB === opt}
                          onChange={(e) => setMemilikiNIB(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki P-IRT (Pangan Industri Rumah Tangga)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiPIRT"
                          value={opt}
                          checked={memilikiPIRT === opt}
                          onChange={(e) => setMemilikiPIRT(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Sertifikat Halal</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiSertifikatHalal"
                          value={opt}
                          checked={memilikiSertifikatHalal === opt}
                          onChange={(e) => setMemilikiSertifikatHalal(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Merek Terdaftar</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiMerek"
                          value={opt}
                          checked={memilikiMerek === opt}
                          onChange={(e) => setMemilikiMerek(e.target.value as any)}
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
                  <label className="asm-pohon-label">Memiliki Kemasan Khusus</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiKemasan"
                          value={opt}
                          checked={memilikiKemasan === opt}
                          onChange={(e) => setMemilikiKemasan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Label / Stiker Produk</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiLabel"
                          value={opt}
                          checked={memilikiLabel === opt}
                          onChange={(e) => setMemilikiLabel(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Media Sosial Usaha</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiMediaSosial"
                          value={opt}
                          checked={memilikiMediaSosial === opt}
                          onChange={(e) => setMemilikiMediaSosial(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Menjual Secara Online</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="menjualOnline"
                          value={opt}
                          checked={menjualOnline === opt}
                          onChange={(e) => setMenjualOnline(e.target.value as any)}
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
          {/* 07 PENGEMBANGAN PRODUK */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">07</span>
              <h2 className="asm-pohon-sec-title">Pengembangan Produk</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Produk yang Dijual</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={3}
                    placeholder="Rincikan variasi produk dan jenis barang yang dijual..."
                    value={produkYangDijual}
                    onChange={(e) => setProdukYangDijual(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Bentuk Penjualan</label>
                  <div className="asm-pohon-radio-list">
                    {['Eceran', 'Grosir', 'Borongan', 'Konsinyasi', 'Pre-Order', 'Kontrak / Kemitraan', 'Lainnya'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="bentukPenjualan"
                          value={opt}
                          checked={bentukPenjualan === opt}
                          onChange={(e) => setBentukPenjualan(e.target.value)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {bentukPenjualan === 'Lainnya' && (
                    <input
                      type="text"
                      className="asm-pohon-input"
                      style={{ marginTop: 6 }}
                      placeholder="Sebutkan bentuk penjualan lainnya..."
                      value={bentukPenjualanLainnya}
                      onChange={(e) => setBentukPenjualanLainnya(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Produk Olahan</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiProdukOlahan"
                          value={opt}
                          checked={memilikiProdukOlahan === opt}
                          onChange={(e) => setMemilikiProdukOlahan(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Branding / Identitas Visual</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiBranding"
                          value={opt}
                          checked={memilikiBranding === opt}
                          onChange={(e) => setMemilikiBranding(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kendala Pemasaran</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={2}
                    placeholder="Uraikan kendala dalam menjangkau pembeli baru..."
                    value={kendalaPemasaran}
                    onChange={(e) => setKendalaPemasaran(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Target Usaha ke Depan</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={2}
                    placeholder="Target peningkatan omzet, perluasan toko, atau penambahan alat..."
                    value={targetUsaha}
                    onChange={(e) => setTargetUsaha(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 08 AKSES PEMASARAN */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">08</span>
              <h2 className="asm-pohon-sec-title">Akses Pemasaran</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Menjual Kemana Saja (Bisa pilih beberapa)</label>
                  <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {[
                      'Konsumen Langsung',
                      'Tetangga / Sekitar',
                      'Pasar Tradisional',
                      'Warung / Toko',
                      'Pengepul',
                      'Pedagang Besar',
                      'Koperasi',
                      'Restoran / Hotel',
                      'Marketplace / Online',
                      'Lainnya',
                    ].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="checkbox"
                          checked={menjualKemana.includes(opt)}
                          onChange={() => toggleCheckbox(menjualKemana, setMenjualKemana, opt)}
                        />
                        <span className="asm-pohon-check-box" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {menjualKemana.includes('Lainnya') && (
                    <input
                      type="text"
                      className="asm-pohon-input"
                      style={{ marginTop: 6 }}
                      placeholder="Sebutkan target pemasaran lainnya..."
                      value={menjualKemanaLainnya}
                      onChange={(e) => setMenjualKemanaLainnya(e.target.value)}
                    />
                  )}
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Ada Pelanggan Tetap</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="adaPelangganTetap"
                          value={opt}
                          checked={adaPelangganTetap === opt}
                          onChange={(e) => setAdaPelangganTetap(e.target.value as any)}
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
                  <label className="asm-pohon-label">Pernah Ikut Bazaar / Pameran</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="pernahIkutBazaar"
                          value={opt}
                          checked={pernahIkutBazaar === opt}
                          onChange={(e) => setPernahIkutBazaar(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Pernah Promosi Online (Iklan Medsos/Endorse)</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="pernahPromosiOnline"
                          value={opt}
                          checked={pernahPromosiOnline === opt}
                          onChange={(e) => setPernahPromosiOnline(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki Toko di Marketplace</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiMarketplace"
                          value={opt}
                          checked={memilikiMarketplace === opt}
                          onChange={(e) => setMemilikiMarketplace(e.target.value as any)}
                        />
                        <span className="asm-pohon-radio-circle" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Memiliki WhatsApp Business</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="memilikiWABusiness"
                          value={opt}
                          checked={memilikiWABusiness === opt}
                          onChange={(e) => setMemilikiWABusiness(e.target.value as any)}
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
          {/* 09 KEBUTUHAN BANTUAN USAHA */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">09</span>
              <h2 className="asm-pohon-sec-title">Kebutuhan Bantuan Usaha</h2>
            </div>

            <div className="asm-pohon-grid">
              {/* Kolom Kiri */}
              <div className="asm-pohon-col">
                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Jenis Bantuan yang Dibutuhkan</label>
                  <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {['Modal Usaha', 'Sarana Produksi', 'Pelatihan', 'Lainnya'].map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="checkbox"
                          checked={jenisBantuan.includes(opt)}
                          onChange={() => toggleCheckbox(jenisBantuan, setJenisBantuan, opt)}
                        />
                        <span className="asm-pohon-check-box" />
                        <span className="asm-pohon-radio-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {jenisBantuan.includes('Lainnya') && (
                    <input
                      type="text"
                      className="asm-pohon-input"
                      style={{ marginTop: 6 }}
                      placeholder="Sebutkan jenis bantuan lainnya..."
                      value={jenisBantuanLainnya}
                      onChange={(e) => setJenisBantuanLainnya(e.target.value)}
                    />
                  )}
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Perkiraan Nilai Bantuan yang Dibutuhkan</label>
                  <input
                    type="text"
                    className="asm-pohon-input"
                    placeholder="Contoh: Rp 5.000.000"
                    value={perkiraanNilaiBantuan}
                    onChange={(e) => setPerkiraanNilaiBantuan(formatRupiah(e.target.value))}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Kesediaan Mengikuti Pendampingan Lanjutan</label>
                  <div className="asm-pohon-radio-list">
                    {yaTidakOptions.map((opt) => (
                      <label key={opt} className="asm-pohon-radio-item">
                        <input
                          type="radio"
                          name="kesediaanPendampingan"
                          value={opt}
                          checked={kesediaanPendampingan === opt}
                          onChange={(e) => setKesediaanPendampingan(e.target.value as any)}
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
                  <label className="asm-pohon-label">Rencana Penggunaan Bantuan</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={3}
                    placeholder="Rincian alokasi belanja alat, bahan baku, atau renovasi lapak..."
                    value={rencanaPenggunaanBantuan}
                    onChange={(e) => setRencanaPenggunaanBantuan(e.target.value)}
                  />
                </div>

                <div className="asm-pohon-field">
                  <label className="asm-pohon-label">Dampak yang Diharapkan Dari Bantuan</label>
                  <textarea
                    className="asm-pohon-textarea"
                    rows={3}
                    placeholder="Contoh: Kenaikan kapasitas produksi 50%, penambahan varian rasa, pendapatan meningkat..."
                    value={dampakYangDiharapkan}
                    onChange={(e) => setDampakYangDiharapkan(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 10 SARANA PRODUKTIF */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">10</span>
              <h2 className="asm-pohon-sec-title">Sarana Produktif</h2>
            </div>

            <div className="asm-pohon-field">
              <label className="asm-pohon-label">Memiliki Sarana Produktif Saat Ini</label>
              <div className="asm-pohon-radio-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {['Gerobak', 'Motor', 'Warung', 'Lainnya'].map((opt) => (
                  <label key={opt} className="asm-pohon-radio-item">
                    <input
                      type="radio"
                      name="saranaProduktif"
                      value={opt}
                      checked={saranaProduktif === opt}
                      onChange={(e) => setSaranaProduktif(e.target.value)}
                    />
                    <span className="asm-pohon-radio-circle" />
                    <span className="asm-pohon-radio-text">{opt}</span>
                  </label>
                ))}
              </div>
              {saranaProduktif === 'Lainnya' && (
                <input
                  type="text"
                  className="asm-pohon-input"
                  style={{ marginTop: 8 }}
                  placeholder="Sebutkan sarana produktif lainnya yang dimiliki..."
                  value={saranaProduktifLainnya}
                  onChange={(e) => setSaranaProduktifLainnya(e.target.value)}
                />
              )}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 11 HARAPAN PENERIMA MANFAAT */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">11</span>
              <h2 className="asm-pohon-sec-title">Harapan Penerima Manfaat</h2>
            </div>

            <div className="asm-pohon-single-col">
              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Apa Harapan Bapak/Ibu Terhadap Program Ini?</label>
                <textarea
                  className="asm-pohon-textarea"
                  rows={3}
                  placeholder="Tuliskan harapan terhadap bantuan dan pendampingan program..."
                  value={harapanProgram}
                  onChange={(e) => setHarapanProgram(e.target.value)}
                />
              </div>

              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Perubahan Apa yang Paling Diharapkan?</label>
                <textarea
                  className="asm-pohon-textarea"
                  rows={3}
                  placeholder="Contoh: Mandiri finansial, bisa menyekolahkan anak hingga sarjana..."
                  value={perubahanPalingDiharapkan}
                  onChange={(e) => setPerubahanPalingDiharapkan(e.target.value)}
                />
              </div>

              <div className="asm-pohon-field">
                <label className="asm-pohon-label">Setelah Program Selesai, Apa yang Ingin Dikembangkan?</label>
                <textarea
                  className="asm-pohon-textarea"
                  rows={3}
                  placeholder="Rencana jangka panjang pengembangan usaha..."
                  value={rencanaSetelahProgram}
                  onChange={(e) => setRencanaSetelahProgram(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 12 DOKUMENTASI WAJIB (12 Berkas Upload) */}
          {/* ========================================================= */}
          <section className="asm-pohon-section">
            <div className="asm-pohon-sec-head">
              <span className="asm-pohon-sec-num">12</span>
              <div>
                <h2 className="asm-pohon-sec-title">Dokumentasi Wajib</h2>
                <span className="asm-pohon-hint">Format file: JPG / JPEG / PNG (Maksimal 5 MB per foto)</span>
              </div>
            </div>

            <div className="asm-umkm-upload-grid">
              {[
                { key: 'fotoRumahTampakDepan', title: 'Foto Rumah Tampak Depan' },
                { key: 'fotoDepanRumah', title: 'Foto Depan Rumah' },
                { key: 'fotoRuangTamu', title: 'Foto Ruang Tamu' },
                { key: 'fotoDapur', title: 'Foto Dapur' },
                { key: 'fotoKamarMandi', title: 'Foto Kamar Mandi' },
                { key: 'fotoBersamaKeluarga', title: 'Foto Bersama Keluarga' },
                { key: 'fotoBersamaPM', title: 'Foto Bersama PM' },
                { key: 'fotoTempatBerjualan', title: 'Foto Tempat Berjualan' },
                { key: 'fotoAktivitasBerjualan', title: 'Foto Aktivitas Berjualan' },
                { key: 'fotoProduk', title: 'Foto Produk' },
                { key: 'fotoKTP', title: 'Foto KTP' },
                { key: 'fotoKK', title: 'Foto KK' },
              ].map(({ key, title }) => {
                const currentFile = fotoFiles[key]
                return (
                  <div key={key} className={`asm-umkm-upload-card ${currentFile ? 'has-file' : ''}`}>
                    <div className="asm-umkm-upload-header">
                      <span className="asm-umkm-upload-tag">JPEG</span>
                      {currentFile && (
                        <span className="asm-umkm-file-status">
                          <Icon name="check" size={13} /> Terpilih
                        </span>
                      )}
                    </div>

                    <strong className="asm-umkm-upload-title">{title}</strong>

                    <label className={`asm-umkm-upload-btn ${currentFile ? 'active' : ''}`}>
                      <Icon name="upload" size={15} />
                      <span>{currentFile ? currentFile.name : 'Pilih Berkas'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => handleFileChange(key, e, title)}
                      />
                    </label>

                    {currentFile && (
                      <span className="asm-umkm-file-size">
                        {(currentFile.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>
                )
              })}
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
            <span>Pastikan data penerima manfaat dan dokumentasi sesuai hasil survei lapangan.</span>
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

