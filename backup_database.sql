--
-- PostgreSQL database dump
--

\restrict g3rpkf4lQ0ehlQ1OeuDdH6gQv7OGehJfuIAX1fiLRJ0Lt7BCF9BjWbamMuE7Xx7

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assessment_jembatan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_jembatan (
    id character varying(50) NOT NULL,
    nama_jembatan character varying(255) NOT NULL,
    lokasi text NOT NULL,
    tanggal_kejadian character varying(50),
    penyebab_kerusakan character varying(255),
    material_jembatan character varying(100),
    material_lainnya character varying(100),
    fungsi_jembatan text,
    tingkat_kerusakan character varying(50),
    deskripsi_kerusakan text,
    panjang character varying(50),
    lebar character varying(50),
    tinggi character varying(50),
    jumlah_penduduk character varying(100),
    wilayah_terisolasi text,
    fungsi_terganggu text,
    fungsi_lainnya text,
    alternatif_jalur character varying(50),
    keterangan_alternatif text,
    sumber_daya text,
    estimasi_biaya character varying(100),
    nama_pj character varying(255),
    nomor_kontak character varying(50),
    email_pj character varying(100),
    foto_jembatan text,
    video_lokasi text,
    foto_sekitar text,
    foto_risiko text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_jembatan OWNER TO postgres;

--
-- Name: assessment_masjid; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_masjid (
    id character varying(50) NOT NULL,
    nama_masjid character varying(255) NOT NULL,
    alamat text NOT NULL,
    tanggal_kejadian character varying(50),
    penyebab_kerusakan character varying(255),
    penyebab_lainnya character varying(255),
    jamaah_harian character varying(100),
    jamaah_jumat character varying(100),
    ukuran_masjid character varying(100),
    kondisi_dinding character varying(50),
    kondisi_atap character varying(50),
    kondisi_lantai character varying(50),
    mimbar_imam character varying(50),
    karpet_sajadah character varying(50),
    soundsystem character varying(50),
    jumlah_mck character varying(50),
    kondisi_mck character varying(50),
    fasilitas_sanitasi character varying(100),
    jumlah_keran character varying(50),
    kondisi_keran character varying(50),
    saluran_air character varying(50),
    tangki_air character varying(50),
    status_ibadah character varying(100),
    hambatan_utama character varying(255),
    hambatan_lainnya text,
    fasilitas_dibutuhkan character varying(255),
    fasilitas_lainnya text,
    estimasi_biaya character varying(100),
    prioritas_mendesak character varying(100),
    nama_pj character varying(255),
    nomor_kontak character varying(50),
    email_pj character varying(100),
    foto_masjid text,
    foto_mck text,
    foto_sekitar text,
    foto_tambahan text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_masjid OWNER TO postgres;

--
-- Name: assessment_petani; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_petani (
    id character varying(50) NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    nomor_ktp character varying(50),
    nomor_kk character varying(50),
    nomor_hp character varying(50),
    jenis_kelamin character varying(50),
    usia character varying(20),
    pendidikan_terakhir character varying(50),
    status_perkawinan character varying(50),
    jumlah_anggota_keluarga character varying(20),
    alamat_lengkap text,
    nama_kelompok_tani character varying(255),
    pekerjaan_utama character varying(255),
    pekerjaan_sampingan character varying(255),
    pendapatan_rata_rata character varying(100),
    pengeluaran_rata_rata character varying(100),
    memiliki_lahan character varying(50),
    luas_lahan character varying(50),
    status_lahan character varying(50),
    komoditas_utama character varying(255),
    lama_bertani character varying(50),
    memiliki_ternak character varying(50),
    memiliki_tabungan character varying(50),
    terdaftar_dtks character varying(50),
    nomor_dtks character varying(100),
    desil_berapa character varying(50),
    mendapat_pkh character varying(50),
    mendapat_bpnt character varying(50),
    mendapat_blt character varying(50),
    mendapat_kis character varying(50),
    mendapat_kip character varying(50),
    bantuan_pemerintah_lain text,
    produktivitas_panen character varying(100),
    frekuensi_panen character varying(100),
    pendapatan_perpanen character varying(100),
    kendala_terbesar text,
    modal_per_musim character varying(100),
    sumber_modal character varying(100),
    memiliki_hutang_usaha character varying(50),
    hutang_kepada text,
    memiliki_rekening_bank character varying(50),
    bank_apa text,
    menggunakan_mobile_banking character varying(50),
    memiliki_qris character varying(50),
    pernah_mengajukan_kur character varying(50),
    mencatat_pemasukan character varying(50),
    mencatat_pengeluaran character varying(50),
    memiliki_buku_kas character varying(50),
    mengetahui_hpp character varying(50),
    memisahkan_uang_usaha character varying(50),
    memiliki_nib character varying(50),
    memiliki_pirt character varying(50),
    memiliki_sertifikat_halal character varying(50),
    memiliki_merek character varying(50),
    memiliki_kemasan character varying(50),
    memiliki_label character varying(50),
    memiliki_media_sosial character varying(50),
    menjual_online character varying(50),
    produk_yang_dijual text,
    bentuk_penjualan character varying(100),
    memiliki_produk_olahan character varying(50),
    memiliki_branding character varying(50),
    kendala_pemasaran text,
    target_usaha text,
    menjual_kemana text,
    ada_pelanggan_tetap character varying(50),
    pernah_ikut_bazaar character varying(50),
    pernah_promosi_online character varying(50),
    memiliki_marketplace character varying(50),
    memiliki_wa_business character varying(50),
    jenis_bantuan text,
    nilai_bantuan character varying(100),
    rencana_penggunaan_bantuan text,
    dampak_diharapkan text,
    kesediaan_pendampingan character varying(50),
    sarana_produktif text,
    harapan_program text,
    perubahan_diharapkan text,
    rencana_setelah_program text,
    dokumentasi_foto text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_petani OWNER TO postgres;

--
-- Name: assessment_pohon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_pohon (
    id character varying(50) NOT NULL,
    status_kepemilikan_lahan character varying(100),
    surat_izin_kelurahan character varying(50),
    persetujuan_kecamatan character varying(50),
    persetujuan_dinas_terkait character varying(50),
    dukungan_rt_rw character varying(50),
    luas_area_tanam character varying(100),
    titik_lintang character varying(100),
    titik_bujur character varying(100),
    kondisi_topografi character varying(100),
    jarak_antar_titik_tanam character varying(100),
    luas_area_berpotensi_tergenang character varying(100),
    jenis_tanah character varying(100),
    ph_tanah character varying(100),
    tingkat_kelembapan character varying(100),
    intensitas_genangan_air character varying(100),
    curah_hujan character varying(100),
    risiko_abrasi character varying(100),
    risiko_banjir character varying(100),
    risiko_kebakaran_lahan character varying(100),
    risiko_gangguan_hewan_ternak character varying(100),
    risiko_vandalisme character varying(100),
    spesies_adaptif text,
    luas_area_efektif character varying(100),
    kerapatan_tanam character varying(100),
    jalur_akses_distribusi_bibit character varying(100),
    penanggung_jawab_perawatan character varying(255),
    jadwal_penyiraman character varying(255),
    jadwal_pemupukan character varying(255),
    jadwal_monitoring_perawatan character varying(255),
    kelompok_masyarakat_sekitar character varying(100),
    karang_taruna character varying(100),
    sekolah_sekitar character varying(100),
    relawan_lokal character varying(100),
    alat_tanam character varying(255),
    pupuk character varying(255),
    ajir_bambu character varying(255),
    pagar_pelindung character varying(255),
    indikator_keberhasilan text,
    persentase_hidup_pohon character varying(50),
    jadwal_monitoring_evaluasi text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_pohon OWNER TO postgres;

--
-- Name: assessment_sekolah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_sekolah (
    id character varying(50) NOT NULL,
    nama_sekolah character varying(255) NOT NULL,
    alamat text NOT NULL,
    tingkat_sekolah character varying(50),
    tingkat_lainnya character varying(100),
    jumlah_siswa character varying(50),
    jumlah_guru character varying(50),
    tanggal_kejadian character varying(50),
    penyebab_kerusakan character varying(255),
    penyebab_lainnya character varying(255),
    jumlah_kelas_rusak character varying(50),
    ukuran_kelas character varying(100),
    luas_bangunan character varying(100),
    kondisi_ruang_guru character varying(50),
    toilet_sanitasi character varying(50),
    sumber_air_bersih character varying(50),
    meja_kursi_rusak character varying(50),
    papan_tulis_rusak character varying(50),
    buku_tersedia character varying(50),
    perpustakaan character varying(50),
    laboratorium character varying(50),
    area_bermain character varying(50),
    status_kbm character varying(100),
    hambatan_utama character varying(255),
    hambatan_lainnya text,
    fasilitas_darurat text,
    fasilitas_lainnya text,
    logistik_siswa text,
    logistik_lainnya text,
    estimasi_biaya character varying(100),
    nama_pj character varying(255),
    nomor_kontak character varying(50),
    email_pj character varying(100),
    foto_bangunan text,
    foto_penunjang text,
    foto_lingkungan text,
    foto_hambatan text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_sekolah OWNER TO postgres;

--
-- Name: assessment_umkm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_umkm (
    id character varying(50) NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    nomor_ktp character varying(50),
    nomor_kk character varying(50),
    nomor_hp character varying(50),
    jenis_kelamin character varying(50),
    usia character varying(20),
    pendidikan_terakhir character varying(50),
    status_perkawinan character varying(50),
    jumlah_anggota_keluarga character varying(20),
    alamat_lengkap text,
    pekerjaan_utama character varying(255),
    pekerjaan_sampingan character varying(255),
    pendapatan_rata_rata character varying(100),
    pengeluaran_rata_rata character varying(100),
    memiliki_kendaraan character varying(50),
    memiliki_tabungan character varying(50),
    terdaftar_dtks character varying(50),
    nomor_dtks character varying(100),
    desil_berapa character varying(50),
    mendapat_pkh character varying(50),
    mendapat_bpnt character varying(50),
    mendapat_blt character varying(50),
    mendapat_kis character varying(50),
    mendapat_kip character varying(50),
    bantuan_pemerintah_lain text,
    produk_utama character varying(255),
    pendapatan_perbulan character varying(100),
    kendala_terbesar text,
    modal_perbulan character varying(100),
    sumber_modal character varying(100),
    memiliki_hutang_usaha character varying(50),
    hutang_kepada text,
    memiliki_rekening_bank character varying(50),
    bank_apa text,
    menggunakan_mobile_banking character varying(50),
    memiliki_qris character varying(50),
    pernah_mengajukan_kur character varying(50),
    mencatat_pemasukan character varying(50),
    mencatat_pengeluaran character varying(50),
    memiliki_buku_kas character varying(50),
    mengetahui_hpp character varying(50),
    memisahkan_uang_usaha character varying(50),
    memiliki_nib character varying(50),
    memiliki_pirt character varying(50),
    memiliki_sertifikat_halal character varying(50),
    memiliki_merek character varying(50),
    memiliki_kemasan character varying(50),
    memiliki_label character varying(50),
    memiliki_media_sosial character varying(50),
    menjual_online character varying(50),
    produk_yang_dijual text,
    bentuk_penjualan character varying(100),
    memiliki_produk_olahan character varying(50),
    memiliki_branding character varying(50),
    kendala_pemasaran text,
    target_usaha text,
    menjual_kemana text,
    ada_pelanggan_tetap character varying(50),
    pernah_ikut_bazaar character varying(50),
    pernah_promosi_online character varying(50),
    memiliki_marketplace character varying(50),
    memiliki_wa_business character varying(50),
    jenis_bantuan text,
    nilai_bantuan character varying(100),
    rencana_penggunaan_bantuan text,
    dampak_diharapkan text,
    kesediaan_pendampingan character varying(50),
    sarana_produktif text,
    harapan_program text,
    perubahan_diharapkan text,
    rencana_setelah_program text,
    dokumentasi_foto text,
    status character varying(50) DEFAULT 'Diajukan'::character varying,
    status_note text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessment_umkm OWNER TO postgres;

--
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    pm_name character varying(255) NOT NULL,
    category character varying(100) DEFAULT 'Umum'::character varying NOT NULL,
    location character varying(255) NOT NULL,
    province character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'Diajukan'::character varying NOT NULL,
    status_note text,
    data_json text NOT NULL,
    photos_json text,
    created_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- Name: dashboard_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dashboard_activities (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    meta text NOT NULL,
    time_ago character varying(50) NOT NULL,
    icon character varying(50) DEFAULT 'fileEdit'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dashboard_activities OWNER TO postgres;

--
-- Name: dashboard_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dashboard_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dashboard_activities_id_seq OWNER TO postgres;

--
-- Name: dashboard_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dashboard_activities_id_seq OWNED BY public.dashboard_activities.id;


--
-- Name: dashboard_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dashboard_tasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    program character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    due character varying(50) NOT NULL,
    urgent integer DEFAULT 0 NOT NULL,
    completed integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.dashboard_tasks OWNER TO postgres;

--
-- Name: dashboard_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dashboard_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dashboard_tasks_id_seq OWNER TO postgres;

--
-- Name: dashboard_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dashboard_tasks_id_seq OWNED BY public.dashboard_tasks.id;


--
-- Name: mous; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mous (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    partner character varying(255) NOT NULL,
    partner_signer character varying(255),
    partner_phone character varying(50),
    partner_email character varying(255),
    category character varying(100) NOT NULL,
    location character varying(255) NOT NULL,
    province character varying(100) NOT NULL,
    date character varying(50) NOT NULL,
    period character varying(100) NOT NULL,
    commitment_value character varying(100) DEFAULT 'Rp 0'::character varying NOT NULL,
    file_type character varying(20) DEFAULT 'PDF'::character varying NOT NULL,
    file_size character varying(50) DEFAULT '1.8 MB'::character varying NOT NULL,
    file_url text,
    status character varying(50) DEFAULT 'Dalam tinjauan'::character varying NOT NULL,
    status_note text,
    action_text character varying(50) DEFAULT 'Lihat detail'::character varying NOT NULL,
    scope text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mous OWNER TO postgres;

--
-- Name: proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposals (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    location character varying(255) NOT NULL,
    province character varying(100) NOT NULL,
    date character varying(50) NOT NULL,
    file_type character varying(20) DEFAULT 'PDF'::character varying NOT NULL,
    file_size character varying(50) DEFAULT '2.4 MB'::character varying NOT NULL,
    file_url text,
    status character varying(50) DEFAULT 'Dalam tinjauan'::character varying NOT NULL,
    status_note text,
    action_text character varying(50) DEFAULT 'Lihat detail'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.proposals OWNER TO postgres;

--
-- Name: request_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_programs (
    id character varying(50) NOT NULL,
    program_name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    applicant_name character varying(255) NOT NULL,
    applicant_phone character varying(50),
    applicant_email character varying(255),
    location character varying(255) NOT NULL,
    estimated_budget character varying(100),
    description text,
    status character varying(50) DEFAULT 'Dalam antrean'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.request_programs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) DEFAULT 'Tim Program'::character varying NOT NULL,
    avatar text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: dashboard_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_activities ALTER COLUMN id SET DEFAULT nextval('public.dashboard_activities_id_seq'::regclass);


--
-- Name: dashboard_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_tasks ALTER COLUMN id SET DEFAULT nextval('public.dashboard_tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assessment_jembatan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_jembatan (id, nama_jembatan, lokasi, tanggal_kejadian, penyebab_kerusakan, material_jembatan, material_lainnya, fungsi_jembatan, tingkat_kerusakan, deskripsi_kerusakan, panjang, lebar, tinggi, jumlah_penduduk, wilayah_terisolasi, fungsi_terganggu, fungsi_lainnya, alternatif_jalur, keterangan_alternatif, sumber_daya, estimasi_biaya, nama_pj, nomor_kontak, email_pj, foto_jembatan, video_lokasi, foto_sekitar, foto_risiko, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessment_masjid; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_masjid (id, nama_masjid, alamat, tanggal_kejadian, penyebab_kerusakan, penyebab_lainnya, jamaah_harian, jamaah_jumat, ukuran_masjid, kondisi_dinding, kondisi_atap, kondisi_lantai, mimbar_imam, karpet_sajadah, soundsystem, jumlah_mck, kondisi_mck, fasilitas_sanitasi, jumlah_keran, kondisi_keran, saluran_air, tangki_air, status_ibadah, hambatan_utama, hambatan_lainnya, fasilitas_dibutuhkan, fasilitas_lainnya, estimasi_biaya, prioritas_mendesak, nama_pj, nomor_kontak, email_pj, foto_masjid, foto_mck, foto_sekitar, foto_tambahan, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessment_petani; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_petani (id, nama_lengkap, nomor_ktp, nomor_kk, nomor_hp, jenis_kelamin, usia, pendidikan_terakhir, status_perkawinan, jumlah_anggota_keluarga, alamat_lengkap, nama_kelompok_tani, pekerjaan_utama, pekerjaan_sampingan, pendapatan_rata_rata, pengeluaran_rata_rata, memiliki_lahan, luas_lahan, status_lahan, komoditas_utama, lama_bertani, memiliki_ternak, memiliki_tabungan, terdaftar_dtks, nomor_dtks, desil_berapa, mendapat_pkh, mendapat_bpnt, mendapat_blt, mendapat_kis, mendapat_kip, bantuan_pemerintah_lain, produktivitas_panen, frekuensi_panen, pendapatan_perpanen, kendala_terbesar, modal_per_musim, sumber_modal, memiliki_hutang_usaha, hutang_kepada, memiliki_rekening_bank, bank_apa, menggunakan_mobile_banking, memiliki_qris, pernah_mengajukan_kur, mencatat_pemasukan, mencatat_pengeluaran, memiliki_buku_kas, mengetahui_hpp, memisahkan_uang_usaha, memiliki_nib, memiliki_pirt, memiliki_sertifikat_halal, memiliki_merek, memiliki_kemasan, memiliki_label, memiliki_media_sosial, menjual_online, produk_yang_dijual, bentuk_penjualan, memiliki_produk_olahan, memiliki_branding, kendala_pemasaran, target_usaha, menjual_kemana, ada_pelanggan_tetap, pernah_ikut_bazaar, pernah_promosi_online, memiliki_marketplace, memiliki_wa_business, jenis_bantuan, nilai_bantuan, rencana_penggunaan_bantuan, dampak_diharapkan, kesediaan_pendampingan, sarana_produktif, harapan_program, perubahan_diharapkan, rencana_setelah_program, dokumentasi_foto, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessment_pohon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_pohon (id, status_kepemilikan_lahan, surat_izin_kelurahan, persetujuan_kecamatan, persetujuan_dinas_terkait, dukungan_rt_rw, luas_area_tanam, titik_lintang, titik_bujur, kondisi_topografi, jarak_antar_titik_tanam, luas_area_berpotensi_tergenang, jenis_tanah, ph_tanah, tingkat_kelembapan, intensitas_genangan_air, curah_hujan, risiko_abrasi, risiko_banjir, risiko_kebakaran_lahan, risiko_gangguan_hewan_ternak, risiko_vandalisme, spesies_adaptif, luas_area_efektif, kerapatan_tanam, jalur_akses_distribusi_bibit, penanggung_jawab_perawatan, jadwal_penyiraman, jadwal_pemupukan, jadwal_monitoring_perawatan, kelompok_masyarakat_sekitar, karang_taruna, sekolah_sekitar, relawan_lokal, alat_tanam, pupuk, ajir_bambu, pagar_pelindung, indikator_keberhasilan, persentase_hidup_pohon, jadwal_monitoring_evaluasi, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessment_sekolah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_sekolah (id, nama_sekolah, alamat, tingkat_sekolah, tingkat_lainnya, jumlah_siswa, jumlah_guru, tanggal_kejadian, penyebab_kerusakan, penyebab_lainnya, jumlah_kelas_rusak, ukuran_kelas, luas_bangunan, kondisi_ruang_guru, toilet_sanitasi, sumber_air_bersih, meja_kursi_rusak, papan_tulis_rusak, buku_tersedia, perpustakaan, laboratorium, area_bermain, status_kbm, hambatan_utama, hambatan_lainnya, fasilitas_darurat, fasilitas_lainnya, logistik_siswa, logistik_lainnya, estimasi_biaya, nama_pj, nomor_kontak, email_pj, foto_bangunan, foto_penunjang, foto_lingkungan, foto_hambatan, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessment_umkm; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_umkm (id, nama_lengkap, nomor_ktp, nomor_kk, nomor_hp, jenis_kelamin, usia, pendidikan_terakhir, status_perkawinan, jumlah_anggota_keluarga, alamat_lengkap, pekerjaan_utama, pekerjaan_sampingan, pendapatan_rata_rata, pengeluaran_rata_rata, memiliki_kendaraan, memiliki_tabungan, terdaftar_dtks, nomor_dtks, desil_berapa, mendapat_pkh, mendapat_bpnt, mendapat_blt, mendapat_kis, mendapat_kip, bantuan_pemerintah_lain, produk_utama, pendapatan_perbulan, kendala_terbesar, modal_perbulan, sumber_modal, memiliki_hutang_usaha, hutang_kepada, memiliki_rekening_bank, bank_apa, menggunakan_mobile_banking, memiliki_qris, pernah_mengajukan_kur, mencatat_pemasukan, mencatat_pengeluaran, memiliki_buku_kas, mengetahui_hpp, memisahkan_uang_usaha, memiliki_nib, memiliki_pirt, memiliki_sertifikat_halal, memiliki_merek, memiliki_kemasan, memiliki_label, memiliki_media_sosial, menjual_online, produk_yang_dijual, bentuk_penjualan, memiliki_produk_olahan, memiliki_branding, kendala_pemasaran, target_usaha, menjual_kemana, ada_pelanggan_tetap, pernah_ikut_bazaar, pernah_promosi_online, memiliki_marketplace, memiliki_wa_business, jenis_bantuan, nilai_bantuan, rencana_penggunaan_bantuan, dampak_diharapkan, kesediaan_pendampingan, sarana_produktif, harapan_program, perubahan_diharapkan, rencana_setelah_program, dokumentasi_foto, status, status_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (id, type, title, pm_name, category, location, province, status, status_note, data_json, photos_json, created_by, created_at, updated_at) FROM stdin;
ASM-POHON-001	pohon	Assessment Kelayakan Reboisasi Bukit Lestari	Kelompok Tani Hutan Sumber Rejeki	Lingkungan	Gunungkidul	DI Yogyakarta	Diajukan	Survei lapangan dan kesesuaian tanah selesai	{"statusKepemilikan": "Hak Milik", "izinKelurahan": "Ada", "persetujuanKecamatan": "Ada", "persetujuanDinas": "Ada", "dukunganRtRw": "Ada", "luasArea": "15 Hektar", "kondisiTopografi": "Lereng Bukit", "jenisTanah": "Tanah Berhumus", "phTanah": "Netral (6,6 - 7,5)", "spesiesAdaptif": "Sengon, Jati Putih, Alpukat Mentega", "luasAreaEfektif": "12 Ha", "kerapatanTanam": "3 x 3 Meter"}	[]	Cikipi	2026-11-04 18:07:40.259616+07	2026-11-04 18:07:40.259616+07
ASM-UMKM-001	umkm	Assessment Pemberdayaan Usaha Olahan Keripik Pisang Mandiri	Ibu Siti Aminah	Ekonomi	Kab. Bandung	Jawa Barat	Diajukan	Data profil PM & rincian alat usaha lengkap	{"namaLengkap": "Ibu Siti Aminah", "nomorKtp": "3204123456780001", "jenisKelamin": "Perempuan", "usia": "42", "pendidikanTerakhir": "SMA", "statusPerkawinan": "Menikah", "jumlahAnggotaKeluarga": "4", "alamatLengkap": "Desa Cibodas, RT 02 / RW 05, Kec. Pasirjambu, Kab. Bandung", "pekerjaanUtama": "Pedagang Keripik Olahan Pisang", "pendapatanBulanan": "2500000", "pengeluaranBulanan": "2100000", "terdaftarDtks": "Terdaftar", "produkUtama": "Keripik Pisang Aneka Rasa", "bantuanDibutuhkan": ["Modal Usaha", "Sarana Produksi"], "nilaiBantuan": "7500000"}	[]	Cikipi	2026-11-04 18:07:40.263251+07	2026-11-04 18:07:40.263251+07
ASM-PETANI-001	petani	Assessment Bantuan Bibit & Pompanisasi Petani Padi Organik	Bapak Maman Suherman	Pertanian	Kab. Cianjur	Jawa Barat	Diajukan	Menunggu validasi kelompok tani dan PPL	{"namaLengkap": "Bapak Maman Suherman", "nomorKtp": "3203112233440002", "jenisKelamin": "Laki-Laki", "usia": "51", "pendidikanTerakhir": "SMP", "statusPerkawinan": "Menikah", "kelompokTani": "Poktan Tani Makmur Mandiri", "alamatLengkap": "Kampung Rawabogo RT 01/RW 04, Cianjur", "luasLahan": "0.8", "statusLahan": "Milik", "komoditasUtama": "Padi Organik Ciherang", "lamaBertani": "24", "produktivitasPanen": "3200", "frekuensiPanen": "Semester", "bantuanDibutuhkan": ["Bibit-Pupuk", "Sarana Produksi"], "nilaiBantuan": "12000000"}	[]	Cikipi	2026-11-04 18:07:40.264267+07	2026-11-04 18:07:40.264267+07
ASM-UMKM-002	umkm	Assessment Warung Sembako Berkah	Ibu Nurhayati	Umum	Bandung Barat	Jawa Barat	Diajukan	Data survei lapangan tersimpan.	{"bantuanDibutuhkan": ["Modal Usaha"], "namaLengkap": "Ibu Nurhayati", "nomorKtp": "3201002233445566", "pekerjaanUtama": "Warung Kelontong", "pendapatanBulanan": "3000000"}	[]	Cikipi (Tim Program)	2026-11-04 18:07:55.23129+07	2026-11-04 18:07:55.23129+07
\.


--
-- Data for Name: dashboard_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dashboard_activities (id, title, meta, time_ago, icon, created_at) FROM stdin;
1	Proposal beasiswa perlu revisi	Dina Rahma • Catatan review telah ditambahkan	15 menit lalu	fileEdit	2026-11-04 18:07:40.265193+07
2	SPK Bantuan Banjir Bandung disetujui	Tim Program • Program siap dilanjutkan ke implementasi	1 jam lalu	checkCircle	2026-11-04 18:07:40.269147+07
3	Laporan Final Layanan Sehat diterima	Aditya Pratama • Seluruh dokumen telah lengkap	2 jam lalu	fileCheck	2026-11-04 18:07:40.270158+07
4	Proposal baru diajukan: Pemberdayaan Nelayan Pesisir	ID: PR-2026-007 • Menunggu review	Baru saja	file	2026-11-04 18:07:54.180524+07
5	Dokumen MOU baru: Kemitraan Konservasi Mangrove	Mitra: PT Pesisir Lestari • Status: Dalam tinjauan	Baru saja	file	2026-11-04 18:07:54.737282+07
6	Assessment UMKM baru: ASM-UMKM-002	Assessment Warung Sembako Berkah • PM: Ibu Nurhayati	Baru saja	checkCircle	2026-11-04 18:07:55.240319+07
7	Proposal baru diajukan: Proposal Internship 1 Savana	ID: PR-2026-008 • Menunggu review	Baru saja	file	2026-11-04 19:15:53.488517+07
8	Dokumen MOU baru: CV Savana Zahra Humaira	Mitra: TB Setia Nugraha 2 • Status: Dalam tinjauan	Baru saja	file	2026-11-04 19:25:50.414374+07
\.


--
-- Data for Name: dashboard_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dashboard_tasks (id, title, program, action, due, urgent, completed) FROM stdin;
1	Revisi proposal beasiswa	Beasiswa Anak Nusantara	Perbaiki proposal	Hari ini	1	0
2	Lengkapi dokumen RAB	Air Bersih untuk Desa	Lengkapi dokumen	Besok	0	0
3	Unggah laporan penyaluran	Bantuan Banjir Bandung	Unggah laporan	02 Nov	0	0
\.


--
-- Data for Name: mous; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mous (id, title, partner, partner_signer, partner_phone, partner_email, category, location, province, date, period, commitment_value, file_type, file_size, file_url, status, status_note, action_text, scope, created_at, updated_at) FROM stdin;
MOU-2026-006	Kemitraan Penyaluran Beasiswa Cerdas Anak Nusantara	PT Bank Syariah Utama	Ahmad Syafiq (Head of CSR)	0812-3344-5566	csr@bsutama.co.id	Pendidikan	Kab. Bandung	Jawa Barat	29 Okt 2026	Nov 2026 – Nov 2027	Rp 450.000.000	PDF	2,6 MB	\N	Perlu revisi	Klausul pertanggungjawaban termin II perlu disesuaikan	Lihat catatan	Pemberian biaya pendidikan dan pendampingan 100 siswa berprestasi di wilayah Jawa Barat.	2026-11-04 18:07:40.249438+07	2026-11-04 18:07:40.249438+07
MOU-2026-005	Penyediaan Sarana Air Bersih Berkelanjutan Lombok	Yayasan Bakti Air Lestari	Ir. Hendra Gunawan	0811-9988-7766	contact@baktiair.org	Infrastruktur	Lombok Timur	Nusa Tenggara Barat	28 Okt 2026	Nov 2026 – Des 2027	Rp 320.000.000	PDF	3,4 MB	\N	Dalam tinjauan	Menunggu review klausul hukum dan tandatangan pihak kedua	Lihat detail	Pembangunan 3 titik sumur bor tenaga surya serta pipanisasi desa terpencil.	2026-11-04 18:07:40.255059+07	2026-11-04 18:07:40.255059+07
MOU-2026-004	Pelatihan & Permodalan Bergulir UMKM Perempuan Mandiri	Koperasi Citra Wanita Mandiri	Hj. Dewi Sartika, M.M.	0813-8877-6655	koperasi@citrawanita.id	Ekonomi	Kab. Bogor	Jawa Barat	27 Okt 2026	Nov 2026 – Mei 2027	Rp 175.000.000	PDF	1,9 MB	\N	Dalam tinjauan	Draf final telah diajukan ke tim legal Relawan Nusantara	Lihat detail	Inkubasi bisnis dan modal alat usaha untuk 50 ibu rumah tangga prasejahtera.	2026-11-04 18:07:40.256078+07	2026-11-04 18:07:40.256078+07
MOU-2026-003	Tanggap Darurat dan Rehabilitasi Pasca Banjir Jawa Barat	BPBD Kabupaten Bandung	Drs. Yudi Hartono (Plt. Kepala)	022-77889900	bpbd@bandungkab.go.id	Kemanusiaan	Kab. Bandung	Jawa Barat	25 Okt 2026	Okt 2026 – Jan 2027	Rp 600.000.000	PDF	4,1 MB	\N	Disetujui	MoU sah & aktif berjalan	Lihat detail	Mobilisasi relawan evakuasi, dapur umum darurat, dan trauma healing anak-anak.	2026-11-04 18:07:40.257213+07	2026-11-04 18:07:40.257213+07
MOU-2026-002	Rehabilitasi Sarana Prasarana Sekolah Pelosok	PT Infrastruktur Mega Nusa	Bambang Trihatmodjo (CSR Manager)	0815-4433-2211	csr@meganusa.co.id	Pendidikan	Kab. Cianjur	Jawa Barat	23 Okt 2026	Nov 2026 – Apr 2027	Rp 500.000.000	PDF	3,8 MB	\N	Disetujui	MoU sah & aktif berjalan	Lihat detail	Pembangunan kembali 4 ruang kelas rusak berat akibat bencana gempa.	2026-11-04 18:07:40.258068+07	2026-11-04 18:07:40.258068+07
MOU-2026-001	Penanaman 10.000 Pohon Agroforestri Desa Lestari	Dinas Kehutanan DIY & KTH Gunungkidul	Ir. Sri Wahyuni (Kabid Reboisasi)	0274-556677	dishut@jogjaprov.go.id	Lingkungan	Gunungkidul	DI Yogyakarta	21 Okt 2026	Nov 2026 – Nov 2028	Rp 280.000.000	PDF	2,2 MB	\N	Disetujui	MoU sah & aktif berjalan	Lihat detail	Konservasi lahan kritis, penanaman alpukat, sengon, dan monitoring via satelit.	2026-11-04 18:07:40.258911+07	2026-11-04 18:07:40.258911+07
MOU-2026-007	Kemitraan Konservasi Mangrove	PT Pesisir Lestari	-	-	-	Lingkungan	Indramayu	Jawa Barat	4 Nov 2026	1 Tahun (Terhitung TTD)	Rp 200.000.000	PDF	1,8 MB	\N	Disetujui	MoU sah & ditandatangani kedua pihak	Lihat detail	Kerja sama kemitraan pelaksanaan program Relawan Nusantara.	2026-11-04 18:07:54.7289+07	2026-11-04 18:07:54.888091+07
MOU-2026-008	CV Savana Zahra Humaira	TB Setia Nugraha 2	-	085863936544	-	Pendidikan	Kab. Bandung	Jawa Barat	4 Nov 2026	Nov 2026 – Nov 2027	Rp 250.000.000	PDF	0.0 MB	\N	Dalam tinjauan	Menunggu peninjauan legal & tanda tangan mitra	Lihat detail	Kerja sama pelaksanaan program sosial bersama Relawan Nusantara.	2026-11-04 19:25:50.394871+07	2026-11-04 19:25:50.394871+07
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proposals (id, title, category, location, province, date, file_type, file_size, file_url, status, status_note, action_text, created_at, updated_at) FROM stdin;
PR-2026-006	Beasiswa Anak Nusantara	Pendidikan	Kab. Bandung	Jawa Barat	29 Okt 2026	PDF	2,4 MB	\N	Perlu revisi	Catatan peninjau tersedia	Lihat catatan	2026-11-04 18:07:40.239586+07	2026-11-04 18:07:40.239586+07
PR-2026-005	Air Bersih untuk Desa	Infrastruktur	Lombok Timur	Nusa Tenggara Barat	28 Okt 2026	PDF	3,1 MB	\N	Dalam tinjauan	Menunggu peninjauan	Lihat detail	2026-11-04 18:07:40.243959+07	2026-11-04 18:07:40.243959+07
PR-2026-004	Pemberdayaan UMKM Perempuan	Ekonomi	Kab. Bogor	Jawa Barat	27 Okt 2026	PDF	1,8 MB	\N	Dalam tinjauan	Menunggu peninjauan	Lihat detail	2026-11-04 18:07:40.245649+07	2026-11-04 18:07:40.245649+07
PR-2026-003	Bantuan Banjir Bandung	Kemanusiaan	Kab. Bandung	Jawa Barat	25 Okt 2026	PDF	4,2 MB	\N	Disetujui	Peninjauan selesai	Lihat detail	2026-11-04 18:07:40.246632+07	2026-11-04 18:07:40.246632+07
PR-2026-002	Renovasi Sekolah Pelosok	Pendidikan	Kab. Cianjur	Jawa Barat	23 Okt 2026	PDF	3,6 MB	\N	Disetujui	Peninjauan selesai	Lihat detail	2026-11-04 18:07:40.247487+07	2026-11-04 18:07:40.247487+07
PR-2026-001	Penghijauan Desa Lestari	Lingkungan	Gunungkidul	DI Yogyakarta	21 Okt 2026	PDF	2,0 MB	\N	Disetujui	Peninjauan selesai	Lihat detail	2026-11-04 18:07:40.248424+07	2026-11-04 18:07:40.248424+07
PR-2026-007	Pemberdayaan Nelayan Pesisir	Ekonomi	Pangandaran	Jawa Barat	4 Nov 2026	PDF	2,4 MB	\N	Disetujui	Proposal disahkan oleh Direktur	Lihat detail	2026-11-04 18:07:54.171985+07	2026-11-04 18:07:54.363741+07
PR-2026-008	Proposal Internship 1 Savana	Pendidikan	Kab. Bandung	Jawa Barat	4 Nov 2026	PDF	0.5 MB	\N	Dalam tinjauan	Menunggu peninjauan	Lihat detail	2026-11-04 19:15:53.473984+07	2026-11-04 19:15:53.473984+07
\.


--
-- Data for Name: request_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_programs (id, program_name, category, applicant_name, applicant_phone, applicant_email, location, estimated_budget, description, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password_hash, role, avatar, created_at) FROM stdin;
1	admin@relawannusantara.org	Cikipi	scrypt:32768:8:1$CHrjj7B36ndEah24$b719f2300dbf030df3930be97d6d0c2d343ad4965f99816774a0db4965440600a44297107a00604913e0a2a3fb1fd8d884086a869cab6964c3c27832de60c6a6	Divisi Program	\N	2026-11-04 18:07:39.966106+07
\.


--
-- Name: dashboard_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dashboard_activities_id_seq', 8, true);


--
-- Name: dashboard_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dashboard_tasks_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: assessment_jembatan assessment_jembatan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_jembatan
    ADD CONSTRAINT assessment_jembatan_pkey PRIMARY KEY (id);


--
-- Name: assessment_masjid assessment_masjid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_masjid
    ADD CONSTRAINT assessment_masjid_pkey PRIMARY KEY (id);


--
-- Name: assessment_petani assessment_petani_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_petani
    ADD CONSTRAINT assessment_petani_pkey PRIMARY KEY (id);


--
-- Name: assessment_pohon assessment_pohon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_pohon
    ADD CONSTRAINT assessment_pohon_pkey PRIMARY KEY (id);


--
-- Name: assessment_sekolah assessment_sekolah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_sekolah
    ADD CONSTRAINT assessment_sekolah_pkey PRIMARY KEY (id);


--
-- Name: assessment_umkm assessment_umkm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_umkm
    ADD CONSTRAINT assessment_umkm_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: dashboard_activities dashboard_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_activities
    ADD CONSTRAINT dashboard_activities_pkey PRIMARY KEY (id);


--
-- Name: dashboard_tasks dashboard_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_tasks
    ADD CONSTRAINT dashboard_tasks_pkey PRIMARY KEY (id);


--
-- Name: mous mous_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mous
    ADD CONSTRAINT mous_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: request_programs request_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_programs
    ADD CONSTRAINT request_programs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict g3rpkf4lQ0ehlQ1OeuDdH6gQv7OGehJfuIAX1fiLRJ0Lt7BCF9BjWbamMuE7Xx7

