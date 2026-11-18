import json
import os
from werkzeug.security import generate_password_hash
from app.db import query_one, execute_db

def seed_database(app):
    """Seed sample data into database if empty."""
    with app.app_context():
        # Ensure core users exist in users table
        core_users = [
            ('program@relawannusantara.org', 'Cikipi', generate_password_hash('admin123'), 'Divisi Program'),
            ('direktur@relawannusantara.org', 'Aditya Pratama', generate_password_hash('admin123'), 'Direktur Utama'),
            ('keuangan@relawannusantara.org', 'Siti Rahma', generate_password_hash('admin123'), 'Divisi Keuangan'),
        ]
        for u_email, u_name, u_hash, u_role in core_users:
            existing_user = query_one("SELECT id FROM users WHERE LOWER(email) = ?", (u_email.lower(),))
            if not existing_user:
                print(f"[*] Seeding user: {u_email} ({u_role})...")
                execute_db("""
                    INSERT INTO users (email, name, password_hash, role)
                    VALUES (?, ?, ?, ?)
                """, (u_email, u_name, u_hash, u_role))

        if os.getenv('SEED_SAMPLE_DATA', '0') != '1':
            return

        # Check if proposals exist
        prop_row = query_one("SELECT COUNT(*) as count FROM proposals")
        proposal_count = prop_row['count'] if prop_row else 0
        if proposal_count == 0:
            print("[*] Seeding proposals...")
            sample_proposals = [
                ('PR-2026-006', 'Beasiswa Anak Nusantara', 'Pendidikan', 'Kab. Bandung', 'Jawa Barat', '29 Okt 2026', 'PDF', '2,4 MB', 'Perlu revisi', 'Catatan peninjau tersedia', 'Lihat catatan'),
                ('PR-2026-005', 'Air Bersih untuk Desa', 'Infrastruktur', 'Lombok Timur', 'Nusa Tenggara Barat', '28 Okt 2026', 'PDF', '3,1 MB', 'Dalam tinjauan', 'Menunggu peninjauan', 'Lihat detail'),
                ('PR-2026-004', 'Pemberdayaan UMKM Perempuan', 'Ekonomi', 'Kab. Bogor', 'Jawa Barat', '27 Okt 2026', 'PDF', '1,8 MB', 'Dalam tinjauan', 'Menunggu peninjauan', 'Lihat detail'),
                ('PR-2026-003', 'Bantuan Banjir Bandung', 'Kemanusiaan', 'Kab. Bandung', 'Jawa Barat', '25 Okt 2026', 'PDF', '4,2 MB', 'Disetujui', 'Peninjauan selesai', 'Lihat detail'),
                ('PR-2026-002', 'Renovasi Sekolah Pelosok', 'Pendidikan', 'Kab. Cianjur', 'Jawa Barat', '23 Okt 2026', 'PDF', '3,6 MB', 'Disetujui', 'Peninjauan selesai', 'Lihat detail'),
                ('PR-2026-001', 'Penghijauan Desa Lestari', 'Lingkungan', 'Gunungkidul', 'DI Yogyakarta', '21 Okt 2026', 'PDF', '2,0 MB', 'Disetujui', 'Peninjauan selesai', 'Lihat detail'),
            ]
            for p in sample_proposals:
                execute_db("""
                    INSERT INTO proposals (id, title, category, location, province, date, file_type, file_size, status, status_note, action_text)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, p)

        # Check if mous exist
        mou_row = query_one("SELECT COUNT(*) as count FROM mous")
        mou_count = mou_row['count'] if mou_row else 0
        if mou_count == 0:
            print("[*] Seeding MOUs...")
            sample_mous = [
                (
                    'MOU-2026-006',
                    'Kemitraan Penyaluran Beasiswa Cerdas Anak Nusantara',
                    'PT Bank Syariah Utama',
                    'Ahmad Syafiq (Head of CSR)',
                    '0812-3344-5566',
                    'csr@bsutama.co.id',
                    'Pendidikan',
                    'Kab. Bandung',
                    'Jawa Barat',
                    '29 Okt 2026',
                    'Nov 2026 – Nov 2027',
                    'Rp 450.000.000',
                    'PDF',
                    '2,6 MB',
                    'Perlu revisi',
                    'Klausul pertanggungjawaban termin II perlu disesuaikan',
                    'Lihat catatan',
                    'Pemberian biaya pendidikan dan pendampingan 100 siswa berprestasi di wilayah Jawa Barat.'
                ),
                (
                    'MOU-2026-005',
                    'Penyediaan Sarana Air Bersih Berkelanjutan Lombok',
                    'Yayasan Bakti Air Lestari',
                    'Ir. Hendra Gunawan',
                    '0811-9988-7766',
                    'contact@baktiair.org',
                    'Infrastruktur',
                    'Lombok Timur',
                    'Nusa Tenggara Barat',
                    '28 Okt 2026',
                    'Nov 2026 – Des 2027',
                    'Rp 320.000.000',
                    'PDF',
                    '3,4 MB',
                    'Dalam tinjauan',
                    'Menunggu review klausul hukum dan tandatangan pihak kedua',
                    'Lihat detail',
                    'Pembangunan 3 titik sumur bor tenaga surya serta pipanisasi desa terpencil.'
                ),
                (
                    'MOU-2026-004',
                    'Pelatihan & Permodalan Bergulir UMKM Perempuan Mandiri',
                    'Koperasi Citra Wanita Mandiri',
                    'Hj. Dewi Sartika, M.M.',
                    '0813-8877-6655',
                    'koperasi@citrawanita.id',
                    'Ekonomi',
                    'Kab. Bogor',
                    'Jawa Barat',
                    '27 Okt 2026',
                    'Nov 2026 – Mei 2027',
                    'Rp 175.000.000',
                    'PDF',
                    '1,9 MB',
                    'Dalam tinjauan',
                    'Draf final telah diajukan ke tim legal Relawan Nusantara',
                    'Lihat detail',
                    'Inkubasi bisnis dan modal alat usaha untuk 50 ibu rumah tangga prasejahtera.'
                ),
                (
                    'MOU-2026-003',
                    'Tanggap Darurat dan Rehabilitasi Pasca Banjir Jawa Barat',
                    'BPBD Kabupaten Bandung',
                    'Drs. Yudi Hartono (Plt. Kepala)',
                    '022-77889900',
                    'bpbd@bandungkab.go.id',
                    'Kemanusiaan',
                    'Kab. Bandung',
                    'Jawa Barat',
                    '25 Okt 2026',
                    'Okt 2026 – Jan 2027',
                    'Rp 600.000.000',
                    'PDF',
                    '4,1 MB',
                    'Disetujui',
                    'MoU sah & aktif berjalan',
                    'Lihat detail',
                    'Mobilisasi relawan evakuasi, dapur umum darurat, dan trauma healing anak-anak.'
                ),
                (
                    'MOU-2026-002',
                    'Rehabilitasi Sarana Prasarana Sekolah Pelosok',
                    'PT Infrastruktur Mega Nusa',
                    'Bambang Trihatmodjo (CSR Manager)',
                    '0815-4433-2211',
                    'csr@meganusa.co.id',
                    'Pendidikan',
                    'Kab. Cianjur',
                    'Jawa Barat',
                    '23 Okt 2026',
                    'Nov 2026 – Apr 2027',
                    'Rp 500.000.000',
                    'PDF',
                    '3,8 MB',
                    'Disetujui',
                    'MoU sah & aktif berjalan',
                    'Lihat detail',
                    'Pembangunan kembali 4 ruang kelas rusak berat akibat bencana gempa.'
                ),
                (
                    'MOU-2026-001',
                    'Penanaman 10.000 Pohon Agroforestri Desa Lestari',
                    'Dinas Kehutanan DIY & KTH Gunungkidul',
                    'Ir. Sri Wahyuni (Kabid Reboisasi)',
                    '0274-556677',
                    'dishut@jogjaprov.go.id',
                    'Lingkungan',
                    'Gunungkidul',
                    'DI Yogyakarta',
                    '21 Okt 2026',
                    'Nov 2026 – Nov 2028',
                    'Rp 280.000.000',
                    'PDF',
                    '2,2 MB',
                    'Disetujui',
                    'MoU sah & aktif berjalan',
                    'Lihat detail',
                    'Konservasi lahan kritis, penanaman alpukat, sengon, dan monitoring via satelit.'
                ),
            ]
            for m in sample_mous:
                execute_db("""
                    INSERT INTO mous (
                        id, title, partner, partner_signer, partner_phone, partner_email,
                        category, location, province, date, period, commitment_value,
                        file_type, file_size, status, status_note, action_text, scope
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, m)

        # Check if assessments exist
        asm_row = query_one("SELECT COUNT(*) as count FROM assessments")
        asm_count = asm_row['count'] if asm_row else 0
        if asm_count == 0:
            print("[*] Seeding assessments...")
            sample_assessments = [
                (
                    'ASM-POHON-001',
                    'pohon',
                    'Assessment Kelayakan Reboisasi Bukit Lestari',
                    'Kelompok Tani Hutan Sumber Rejeki',
                    'Lingkungan',
                    'Gunungkidul',
                    'DI Yogyakarta',
                    'Diajukan',
                    'Survei lapangan dan kesesuaian tanah selesai',
                    json.dumps({
                        'statusKepemilikan': 'Hak Milik',
                        'izinKelurahan': 'Ada',
                        'persetujuanKecamatan': 'Ada',
                        'persetujuanDinas': 'Ada',
                        'dukunganRtRw': 'Ada',
                        'luasArea': '15 Hektar',
                        'kondisiTopografi': 'Lereng Bukit',
                        'jenisTanah': 'Tanah Berhumus',
                        'phTanah': 'Netral (6,6 - 7,5)',
                        'spesiesAdaptif': 'Sengon, Jati Putih, Alpukat Mentega',
                        'luasAreaEfektif': '12 Ha',
                        'kerapatanTanam': '3 x 3 Meter',
                    }),
                    json.dumps([]),
                    'Cikipi'
                ),
                (
                    'ASM-UMKM-001',
                    'umkm',
                    'Assessment Pemberdayaan Usaha Olahan Keripik Pisang Mandiri',
                    'Ibu Siti Aminah',
                    'Ekonomi',
                    'Kab. Bandung',
                    'Jawa Barat',
                    'Diajukan',
                    'Data profil PM & rincian alat usaha lengkap',
                    json.dumps({
                        'namaLengkap': 'Ibu Siti Aminah',
                        'nomorKtp': '3204123456780001',
                        'jenisKelamin': 'Perempuan',
                        'usia': '42',
                        'pendidikanTerakhir': 'SMA',
                        'statusPerkawinan': 'Menikah',
                        'jumlahAnggotaKeluarga': '4',
                        'alamatLengkap': 'Desa Cibodas, RT 02 / RW 05, Kec. Pasirjambu, Kab. Bandung',
                        'pekerjaanUtama': 'Pedagang Keripik Olahan Pisang',
                        'pendapatanBulanan': '2500000',
                        'pengeluaranBulanan': '2100000',
                        'terdaftarDtks': 'Terdaftar',
                        'produkUtama': 'Keripik Pisang Aneka Rasa',
                        'bantuanDibutuhkan': ['Modal Usaha', 'Sarana Produksi'],
                        'nilaiBantuan': '7500000'
                    }),
                    json.dumps([]),
                    'Cikipi'
                ),
                (
                    'ASM-PETANI-001',
                    'petani',
                    'Assessment Bantuan Bibit & Pompanisasi Petani Padi Organik',
                    'Bapak Maman Suherman',
                    'Pertanian',
                    'Kab. Cianjur',
                    'Jawa Barat',
                    'Diajukan',
                    'Menunggu validasi kelompok tani dan PPL',
                    json.dumps({
                        'namaLengkap': 'Bapak Maman Suherman',
                        'nomorKtp': '3203112233440002',
                        'jenisKelamin': 'Laki-Laki',
                        'usia': '51',
                        'pendidikanTerakhir': 'SMP',
                        'statusPerkawinan': 'Menikah',
                        'kelompokTani': 'Poktan Tani Makmur Mandiri',
                        'alamatLengkap': 'Kampung Rawabogo RT 01/RW 04, Cianjur',
                        'luasLahan': '0.8',
                        'statusLahan': 'Milik',
                        'komoditasUtama': 'Padi Organik Ciherang',
                        'lamaBertani': '24',
                        'produktivitasPanen': '3200',
                        'frekuensiPanen': 'Semester',
                        'bantuanDibutuhkan': ['Bibit-Pupuk', 'Sarana Produksi'],
                        'nilaiBantuan': '12000000'
                    }),
                    json.dumps([]),
                    'Cikipi'
                )
            ]
            for a in sample_assessments:
                execute_db("""
                    INSERT INTO assessments (
                        id, type, title, pm_name, category, location, province,
                        status, status_note, data_json, photos_json, created_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, a)

        # Check if dashboard activities exist
        act_row = query_one("SELECT COUNT(*) as count FROM dashboard_activities")
        act_count = act_row['count'] if act_row else 0
        if act_count == 0:
            print("[*] Seeding dashboard activities...")
            sample_acts = [
                ('Proposal beasiswa perlu revisi', 'Dina Rahma • Catatan review telah ditambahkan', '15 menit lalu', 'fileEdit'),
                ('SPK Bantuan Banjir Bandung disetujui', 'Tim Program • Program siap dilanjutkan ke implementasi', '1 jam lalu', 'checkCircle'),
                ('Laporan Final Layanan Sehat diterima', 'Aditya Pratama • Seluruh dokumen telah lengkap', '2 jam lalu', 'fileCheck'),
            ]
            for act in sample_acts:
                execute_db("""
                    INSERT INTO dashboard_activities (title, meta, time_ago, icon)
                    VALUES (?, ?, ?, ?)
                """, act)

        # Check if dashboard tasks exist
        task_row = query_one("SELECT COUNT(*) as count FROM dashboard_tasks")
        task_count = task_row['count'] if task_row else 0
        if task_count == 0:
            print("[*] Seeding dashboard tasks...")
            sample_tasks = [
                ('Revisi proposal beasiswa', 'Beasiswa Anak Nusantara', 'Perbaiki proposal', 'Hari ini', 1),
                ('Lengkapi dokumen RAB', 'Air Bersih untuk Desa', 'Lengkapi dokumen', 'Besok', 0),
                ('Unggah laporan penyaluran', 'Bantuan Banjir Bandung', 'Unggah laporan', '02 Nov', 0),
            ]
            for t in sample_tasks:
                execute_db("""
                    INSERT INTO dashboard_tasks (title, program, action, due, urgent)
                    VALUES (?, ?, ?, ?, ?)
                """, t)

        # Check if spks exist
        spk_row = query_one("SELECT COUNT(*) as count FROM spks")
        spk_count = spk_row['count'] if spk_row else 0
        if spk_count == 0:
            print("[*] Seeding SPK documents...")
            sample_spks = [
                (
                    'SPK-2026-006',
                    'SPK/RN-PRG/X/2026/042',
                    'Pangan Sehat Balita Nusantara',
                    'Kesehatan',
                    'Divisi Program Relawan Nusantara',
                    'Forum Relawan Gizi Sehat Kupang',
                    'Koordinator Wilayah NTT',
                    '0813-8899-7711',
                    'Kupang, Nusa Tenggara Timur',
                    'Nusa Tenggara Timur',
                    'Rp 45.000.000',
                    '01 Nov 2026',
                    '31 Des 2026',
                    'Pengadaan dan pendistribusian 300 paket suplemen gizi balita serta monitoring berat badan berkala.',
                    'Termin I (50%) saat SPK ditandatangani, Termin II (50%) setelah laporan penyaluran awal diserahkan.',
                    'Tersalurkannya paket nutrisi balita di 4 puskesmas pembantu wilayah Kupang.',
                    'Koordinasi berkala bersama bidan desa setempat.',
                    'PDF',
                    '2.4 MB',
                    'Dalam pelaksanaan',
                    'Tahap distribusi logistik tahap 1',
                    'Lihat detail'
                ),
                (
                    'SPK-2026-005',
                    'SPK/RN-PRG/X/2026/039',
                    'Penyediaan Air Bersih Desa Sukamaju',
                    'Infrastruktur',
                    'Divisi Program Relawan Nusantara',
                    'PT Tirta Mandiri Sejahtera',
                    'Kontraktor Pelaksana',
                    '0812-7766-5544',
                    'Desa Sukamaju, Kec. Cimaung, Kab. Bandung',
                    'Jawa Barat',
                    'Rp 82.500.000',
                    '28 Okt 2026',
                    '15 Jan 2027',
                    'Pengeboran 4 titik sumur air bersih, instalasi pipa sepanjang 2.5 km, dan perakitan toren komunal.',
                    'Termin I (40%), Termin II (30%) uji coba aliran, Termin III (30%) serah terima fasilitas.',
                    '4 unit sumur bor berfungsi optimal dan melayani 1.200 KK.',
                    'Garansi pemeliharaan instalasi pipa selama 6 bulan.',
                    'PDF',
                    '3.8 MB',
                    'Dalam pelaksanaan',
                    'Pengeboran sumur titik 2 sedang berlangsung',
                    'Lihat detail'
                ),
                (
                    'SPK-2026-004',
                    'SPK/RN-PRG/X/2026/035',
                    'Beasiswa Pendidikan Pelosok Negeri',
                    'Pendidikan',
                    'Divisi Program Relawan Nusantara',
                    'Komunitas Pendidik Relawan Bandung',
                    'Koordinator Program Beasiswa',
                    '0819-2233-4455',
                    'Kab. Bandung Barat & Cimahi',
                    'Jawa Barat',
                    'Rp 65.000.000',
                    '05 Nov 2026',
                    '28 Feb 2027',
                    'Seleksi verifikasi faktual dan pencairan dana bantuan pendidikan bagi 100 siswa yatim dhuafa.',
                    'Pembayaran bertahap sesuai jadwal semester genap.',
                    'Penerimaan SPP dan perlengkapan sekolah 100 penerima manfaat.',
                    'Menunggu penandatanganan pakta integritas penerima tugas.',
                    'PDF',
                    '1.9 MB',
                    'Dalam pelaksanaan',
                    'Pekerjaan berjalan',
                    'Lihat detail'
                ),
                (
                    'SPK-2026-003',
                    'SPK/RN-PRG/X/2026/031',
                    'Posko Logistik Siaga Bencana Banjir',
                    'Kemanusiaan',
                    'Divisi Program Relawan Nusantara',
                    'Unit Tanggap Darurat Bencana Dayeuhkolot',
                    'Komandan Lapangan',
                    '0821-4455-6677',
                    'Dayeuhkolot & Baleendah, Kab. Bandung',
                    'Jawa Barat',
                    'Rp 120.000.000',
                    '02 Nov 2026',
                    '20 Nov 2026',
                    'Pendirian posko dapur umum, distribusi bantuan pangan harian, dan evakuasi warga rentan.',
                    'Pencairan langsung dana tanggap darurat bencana 100%.',
                    'Pelayanan makan bagi 1.500 pengungsi setiap hari selama tanggap darurat.',
                    'Pelaksanaan operasional posko dapur umum bencana.',
                    'PDF',
                    '4.1 MB',
                    'Dalam pelaksanaan',
                    'Pekerjaan berjalan',
                    'Lihat detail'
                ),
                (
                    'SPK-2026-002',
                    'SPK/RN-PRG/X/2026/028',
                    'Renovasi Jembatan Penyeberangan Cikadu',
                    'Infrastruktur',
                    'Divisi Program Relawan Nusantara',
                    'CV Mandiri Logam Nusantara',
                    'Kepala Proyek',
                    '0856-1122-3344',
                    'Kampung Cikadu, Kec. Cikembar, Kab. Sukabumi',
                    'Jawa Barat',
                    'Rp 60.000.000',
                    '10 Sep 2026',
                    '20 Okt 2026',
                    'Pembangunan jembatan gantung baja sling 30 meter penghubung dua desa.',
                    'Termin I (50%), Termin II (50%) serah terima pekerjaan.',
                    'Jembatan selesai dibangun dan telah diresmikan warga desa.',
                    'Pekerjaan selesai 100% tepat waktu.',
                    'PDF',
                    '5.2 MB',
                    'Selesai',
                    'Pekerjaan rampung dan terverifikasi',
                    'Lihat detail'
                ),
                (
                    'SPK-2026-001',
                    'SPK/RN-PRG/X/2026/024',
                    'Penanaman 10.000 Pohon Desa Lestari',
                    'Lingkungan',
                    'Divisi Program Relawan Nusantara',
                    'Kelompok Sadar Lingkungan Gunungkidul',
                    'Ketua Pokdarwis',
                    '0877-3344-5566',
                    'Kec. Panggang, Kab. Gunungkidul',
                    'DI Yogyakarta',
                    'Rp 20.800.000',
                    '01 Sep 2026',
                    '15 Okt 2026',
                    'Pengadaan bibit beringin dan trembesi serta penanaman bersama warga di zona tangkapan air.',
                    'Pencairan 100% setelah penyerahan bibit dan tanam serentak.',
                    '10.000 pohon tertanam di lahan seluas 15 hektar.',
                    'Laporan serah terima dan foto geo-tagging telah lengkap.',
                    'PDF',
                    '3.0 MB',
                    'Selesai',
                    'Pekerjaan rampung dan terverifikasi',
                    'Lihat detail'
                )
            ]
            for s in sample_spks:
                execute_db("""
                    INSERT INTO spks (
                        id, spk_number, program_name, category, assignor_name,
                        assignee_name, assignee_role, assignee_contact, location, province,
                        budget_amount, start_date, end_date, scope_of_work, payment_terms,
                        target_output, notes, file_type, file_size, status, status_note, action_text
                    ) VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?
                    )
                """, s)

        # Check if dss_evaluations exist
        dss_row = query_one("SELECT COUNT(*) as count FROM dss_evaluations")
        dss_count = dss_row['count'] if dss_row else 0
        if dss_count == 0:
            print("[*] Seeding DSS RAB evaluations...")
            sample_dss = [
                (
                    'RAB-2026-042', 'PR-2026-042', 'RAB Pelatihan Relawan Siaga Bencana',
                    'Divisi Kesiapsiagaan', 'Divisi Kesiapsiagaan', 'Kab. Bandung', 'Jawa Barat',
                    'Rp 45.200.000', '120 Relawan', 82.0, 'Dalam telaah', 1,
                    'Perlu revisi', 'Catatan reviewer tersedia', 'Lihat catatan',
                    'Excel/PDF', '3.4 MB', '29 Okt 2026',
                    'Mohon lampirkan rincian biaya konsumsi per hari dan kurangi pagu transport maksimal 15% sesuai standar acuan DSS.'
                ),
                (
                    'RAB-2026-039', 'PR-2026-039', 'RAB Distribusi Air Bersih Musim Kemarau',
                    'Divisi Sosial', 'Divisi Sosial', 'Lombok Timur', 'Nusa Tenggara Barat',
                    'Rp 82.500.000', '1.200 Jiwa', 88.5, 'Dalam telaah', 1,
                    'Dalam telaah', 'Menunggu peninjauan', 'Tinjau RAB',
                    'Excel/PDF', '4.1 MB', '28 Okt 2026',
                    'Sedang dalam proses evaluasi kelayakan pagu armada tangki air dan distribusi jeriken warga.'
                ),
                (
                    'RAB-2026-035', 'PR-2026-035', 'RAB Modal Usaha UMKM Perempuan Berdaya',
                    'Divisi Ekonomi', 'Divisi Ekonomi', 'Kab. Bogor', 'Jawa Barat',
                    'Rp 65.000.000', '50 Pelaku Usaha', 85.0, 'Dalam telaah', 2,
                    'Dalam telaah', 'Menunggu peninjauan', 'Tinjau RAB',
                    'Excel/PDF', '2.8 MB', '27 Okt 2026',
                    'Verifikasi rincian modal alat produksi dan bahan baku untuk kelompok UMKM binaan.'
                ),
                (
                    'RAB-2026-031', 'PR-2026-031', 'RAB Posko Logistik Bencana Banjir',
                    'Divisi Tanggap Darurat', 'Divisi Tanggap Darurat', 'Kab. Bandung', 'Jawa Barat',
                    'Rp 120.000.000', '1.500 Jiwa', 94.0, 'Disetujui', 1,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '5.2 MB', '25 Okt 2026',
                    'RAB telah disetujui komite pagu darurat bencana. Siap proses penerbitan SPK pencairan.'
                ),
                (
                    'RAB-2026-028', 'PR-2026-028', 'RAB Renovasi Sarana Sekolah Pelosok',
                    'Divisi Pendidikan', 'Divisi Pendidikan', 'Kab. Cianjur', 'Jawa Barat',
                    'Rp 95.000.000', '180 Siswa', 91.5, 'Disetujui', 2,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '3.9 MB', '23 Okt 2026',
                    'Kelayakan RAB renovasi gedung kelas dan fasilitas sanitasi sekolah selesai disahkan.'
                ),
                (
                    'RAB-2026-024', 'PR-2026-024', 'RAB Bibit Pohon Penghijauan Desa Lestari',
                    'Divisi Lingkungan', 'Divisi Lingkungan', 'Gunungkidul', 'DI Yogyakarta',
                    'Rp 20.800.000', '1 Desa', 89.0, 'Disetujui', 3,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '1.9 MB', '21 Okt 2026',
                    'RAB bibit dan sarana tanam disetujui sesuai HPS standar konservasi hutan.'
                ),
                (
                    'RAB-2026-021', 'PR-2026-021', 'RAB Bantuan Nutrisi Balita Stunting',
                    'Divisi Kesehatan', 'Divisi Kesehatan', 'Kab. Garut', 'Jawa Barat',
                    'Rp 35.000.000', '75 Balita', 87.5, 'Disetujui', 4,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '2.4 MB', '19 Okt 2026',
                    'Paket makanan bergizi dan suplemen balita selama 90 hari disetujui.'
                ),
                (
                    'RAB-2026-018', 'PR-2026-018', 'RAB Layanan Kesehatan Keliling Terpencil',
                    'Divisi Kesehatan', 'Divisi Kesehatan', 'Sumba Barat', 'Nusa Tenggara Timur',
                    'Rp 52.000.000', '400 Warga', 84.0, 'Dalam telaah', 3,
                    'Dalam telaah', 'Menunggu peninjauan', 'Tinjau RAB',
                    'Excel/PDF', '3.1 MB', '17 Okt 2026',
                    'Pemeriksaan estimasi BBM armada ambulans keliling dan honorarium tenaga medis.'
                ),
                (
                    'RAB-2026-015', 'PR-2026-015', 'RAB Pemberdayaan Tani Hidroponik Perkotaan',
                    'Divisi Ekonomi', 'Divisi Ekonomi', 'Kota Depok', 'Jawa Barat',
                    'Rp 28.000.000', '35 Petani Urban', 79.5, 'Perlu revisi', 2,
                    'Perlu revisi', 'Catatan reviewer tersedia', 'Lihat catatan',
                    'Excel/PDF', '2.2 MB', '15 Okt 2026',
                    'Rincian instalasi hidroponik perlu melampirkan 3 surat penawaran harga vendor pembanding.'
                ),
                (
                    'RAB-2026-012', 'PR-2026-012', 'RAB Dapur Umum Tanggap Bencana Gempa',
                    'Divisi Tanggap Darurat', 'Divisi Tanggap Darurat', 'Kab. Majene', 'Sulawesi Barat',
                    'Rp 44.000.000', '800 Pengungsi', 93.0, 'Disetujui', 5,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '4.5 MB', '12 Okt 2026',
                    'Dapur umum darurat disetujui sesuai pagu tanggap kebencanaan.'
                ),
                (
                    'RAB-2026-009', 'PR-2026-009', 'RAB Pengadaan Buku & Pojok Baca Anak',
                    'Divisi Pendidikan', 'Divisi Pendidikan', 'Kab. Lebak', 'Banten',
                    'Rp 18.500.000', '250 Siswa', 88.0, 'Disetujui', 6,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '1.8 MB', '10 Okt 2026',
                    'Pengadaan 500 eksemplar buku dan rak baca anak disetujui.'
                ),
                (
                    'RAB-2026-006', 'PR-2026-006', 'RAB Beasiswa Pendidikan Anak Nusantara',
                    'Divisi Pendidikan', 'Divisi Pendidikan', 'Kab. Jayapura', 'Papua',
                    'Rp 25.000.000', '40 Pelajar', 86.0, 'Dalam telaah', 4,
                    'Dalam telaah', 'Menunggu peninjauan', 'Tinjau RAB',
                    'Excel/PDF', '2.7 MB', '08 Okt 2026',
                    'Validasi berkas administrasi calon penerima beasiswa sedang berlangsung.'
                ),
                (
                    'RAB-2026-004', 'PR-2026-004', 'RAB Sosialisasi Sanitasi Hidup Bersih',
                    'Divisi Sosial', 'Divisi Sosial', 'Kab. Sukabumi', 'Jawa Barat',
                    'Rp 15.000.000', '300 Warga', 90.0, 'Disetujui', 7,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '1.6 MB', '05 Okt 2026',
                    'Penyuluhan dan paket hygiene kit disetujui.'
                ),
                (
                    'RAB-2026-001', 'PR-2026-001', 'RAB Pembinaan Karang Taruna Produktif',
                    'Divisi Ekonomi', 'Divisi Ekonomi', 'Kab. Pasuruan', 'Jawa Timur',
                    'Rp 17.000.000', '60 Pemuda', 89.5, 'Disetujui', 8,
                    'Disetujui', 'Telaah selesai disahkan', 'Lihat detail',
                    'Excel/PDF', '2.1 MB', '01 Okt 2026',
                    'Pelatihan keterampilan sablon dan peralatan usaha karang taruna disetujui.'
                )
            ]
            for d in sample_dss:
                execute_db("""
                    INSERT INTO dss_evaluations (
                        id, program_id, title, category, division, location, province,
                        estimated_budget, beneficiaries, final_score, recommendation, rank_priority,
                        status, status_note, action_text, file_type, file_size, date, evaluation_notes
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?
                    )
                """, d)

        # Check if request_programs exist
        req_row = query_one("SELECT COUNT(*) as count FROM request_programs")
        req_count = req_row['count'] if req_row else 0
        if req_count == 0:
            print("[*] Seeding request_programs...")
            sample_reqs = [
                ('REQ-2026-038', 'UMKM Tangguh Sembalun', 'Request RAB', 'Koperasi Sembalun', '0812-3344-5511', 'info@sembalun.org', 'Lombok Timur', '260 orang', 'Pemberdayaan UMKM lokal pasca pandemi', 'Selesai'),
                ('REQ-2026-041', 'Air Bersih Cisarua', 'Request Proposal', 'Yayasan Tirta Bakti', '0813-2233-4455', 'tirtabakti@gmail.com', 'Bogor', '420 orang', 'Permohonan instalasi pipa air bersih', 'Diproses'),
                ('REQ-2026-052', 'Hunian Aman Cugenang', 'Permohonan Bantuan', 'Forum Warga Cugenang', '0852-1122-3344', 'cugenang@warga.id', 'Cianjur', '188 keluarga', 'Pembangunan hunian sementara warga gempa', 'Menunggu persetujuan'),
                ('REQ-2026-067', 'Sekolah Siaga Bencana', 'Request Assessment', 'SDN Wonosari 2', '0877-6655-4433', 'sdnwonosari2@sch.id', 'Gunungkidul', '315 siswa', 'Permohonan assessment konstruksi tahan gempa', 'Baru'),
                ('REQ-2026-071', 'Klinik Bergerak Lombok', 'Request Proposal', 'Sehat Bersama', '0819-4455-6677', 'sehatbersama@org.id', 'Lombok Utara', '540 orang', 'Penyediaan obat-obatan dan armada periksa mobile', 'Diproses'),
                ('REQ-2026-074', 'Dapur Umum Garut', 'Permohonan Bantuan', 'Relawan Garut Bergerak', '0812-9988-7711', 'garutbergerak@gmail.com', 'Garut', '320 keluarga', 'Bantuan logistik darurat bencana banjir bandang', 'Baru'),
                ('REQ-2026-079', 'Perpustakaan Desa Sleman', 'Request RAB', 'Karang Taruna Sleman', '0813-7766-5544', 'kt.sleman@gmail.com', 'Sleman', '150 siswa', 'Penyusunan anggaran sarana pojok literasi desa', 'Menunggu persetujuan'),
                ('REQ-2026-083', 'Pangan Sehat Balita', 'Request Assessment', 'Posyandu Melati', '0821-3344-9988', 'posyandu.melati@gmail.com', 'Kupang', '210 balita', 'Survei awal angka stunting dan kebutuhan nutrisi', 'Baru'),
            ]
            for r in sample_reqs:
                execute_db("""
                    INSERT INTO request_programs (
                        id, program_name, category, applicant_name, applicant_phone,
                        applicant_email, location, estimated_budget, description, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, r)

        # Check if mipros exist
        mipro_row = query_one("SELECT COUNT(*) as count FROM mipros")
        mipro_count = mipro_row['count'] if mipro_row else 0
        if mipro_count == 0:
            print("[*] Seeding mipros...")
            sample_mipros = [
                (
                    'MIPRO-2026-001', 'MIPro 1', 'Kemitraan', 'Program dengan mitra',
                    'Air Bersih Desa Sukamaju', 'PT Tirta Mandiri Sejahtera', None,
                    'Infrastruktur', 'Desa Sukamaju, Kec. Cimaung, Kab. Bandung, Jawa Barat', 'Jawa Barat',
                    'Januari – Maret 2027', 'Rp 82.500.000', '1200',
                    'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
                    'Pembangunan 4 titik sumur bor, instalasi jaringan pipa transmisi sepanjang 2,5 km, dan 2 unit toren penampungan kapasitas 5.000 liter.',
                    None, '28 Okt 2026'
                ),
                (
                    'MIPRO-2026-002', 'MIPro 2', 'Aspirasi', 'Program tanpa mitra',
                    'Paket Belajar Nusantara', None, None,
                    'Pendidikan', 'Kampung Babakan, Desa Sukamulya, Kab. Cianjur, Jawa Barat', 'Jawa Barat',
                    'Februari – April 2027', 'Rp 45.000.000', '350',
                    'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
                    'Penyaluran 350 paket perlengkapan belajar, buku tulis, dan seragam sekolah bagi anak-anak pelosok.',
                    None, '27 Okt 2026'
                ),
                (
                    'MIPRO-2026-003', 'MIPro 3', 'Campaign', 'Campaign • ID 1025',
                    'Donasi untuk Pendidikan', None, '1025',
                    'Sosial', 'Nasional', 'Indonesia',
                    'Januari – Februari 2027', 'Rp 95.000.000', '500 Siswa',
                    'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.',
                    'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa.',
                    json.dumps([{
                        'campaignId': '1025',
                        'campaignName': 'Donasi untuk Pendidikan',
                        'donationPeriod': 'Januari – Februari 2027',
                        'totalDss': 'Rp 95.000.000',
                        'program': 'Renovasi gedung sekolah dan pengadaan meja kursi belajar untuk 500 siswa pelosok.',
                        'keterangan': 'Penggalangan dana donasi publik melalui platform digital untuk renovasi sarana belajar sekolah.'
                    }]),
                    '26 Okt 2026'
                )
            ]
            for m in sample_mipros:
                execute_db("""
                    INSERT INTO mipros (
                        id, type, subtype, type_label,
                        title, partner_name, campaign_id,
                        category, location, province,
                        period, disbursement_amount, beneficiaries,
                        description, desired_output,
                        campaigns_data, updated_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, m)

        # Check if monevs exist
        monev_row = query_one("SELECT COUNT(*) as count FROM monevs")
        monev_count = monev_row['count'] if monev_row else 0
        if monev_count == 0:
            print("[*] Seeding monevs...")
            sample_monevs = [
                (
                    'MON-2026-028',
                    'UMKM Tangguh Sembalun',
                    'MIP-2026-017',
                    'BD-2026-009',
                    'REQ-2026-038',
                    'Lombok Timur',
                    '15 Okt 2026',
                    '15 Oktober 2026',
                    '05 Nov 2026',
                    '2026-11-05',
                    'Fajar Malik',
                    82,
                    'Sesuai rencana',
                    'Distribusi peralatan usaha dan sesi pendampingan manajemen keuangan berjalan lancar. Kelompok usaha mulai menyusun pembukuan harian secara mandiri.',
                    json.dumps([
                        {'component': 'Penyaluran peralatan produksi', 'plan': '100%', 'actual': 90, 'note': 'Unit utama telah diterima'},
                        {'component': 'Pelatihan manajemen usaha', 'plan': '4 sesi', 'actual': 80, 'note': '3 dari 4 sesi terlaksana'},
                        {'component': 'Pendampingan kelompok UMKM', 'plan': '85 pelaku', 'actual': 76, 'note': 'Berjalan sesuai jadwal'},
                    ], ensure_ascii=False),
                    json.dumps([
                        {
                            'id': 'ISS-01',
                            'title': 'Penyesuaian jadwal pendampingan sesi akhir',
                            'description': 'Menyesuaikan waktu panen raya warga di Sembalun.',
                            'owner': 'Aulia Rahman',
                            'deadline': '02 Nov 2026',
                            'status': 'Dalam Proses',
                        }
                    ], ensure_ascii=False),
                    json.dumps([
                        {'name': 'Foto pendampingan Sembalun.zip', 'size': '9,8 MB', 'date': '15 Okt 2026', 'kind': 'zip'},
                        {'name': 'Daftar hadir pelatihan UMKM.pdf', 'size': '1,4 MB', 'date': '15 Okt 2026', 'kind': 'pdf'},
                    ], ensure_ascii=False),
                    json.dumps([], ensure_ascii=False),
                ),
            ]
            for mv in sample_monevs:
                execute_db("""
                    INSERT INTO monevs (
                        id, title, mipro_id, assessment_id, request_id,
                        location, visit_date, visit_date_full, next_visit, next_visit_iso,
                        officer, progress, status, notes,
                        indicators_json, issues_json, docs_json, photos_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, mv)

        print("[OK] Database seeding verified.")
