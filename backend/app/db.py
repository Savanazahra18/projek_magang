import os
import sqlite3
import json
from flask import g, current_app

# Try importing psycopg2 for PostgreSQL support
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False

_ACTIVE_DB_TYPE = None

def get_active_db_type():
    """Return 'postgresql' or 'sqlite' based on current active connection."""
    global _ACTIVE_DB_TYPE
    return _ACTIVE_DB_TYPE or current_app.config.get('DB_TYPE', 'sqlite')

def _create_postgres_db_if_not_exists(config):
    """Ensure PostgreSQL target database exists, creating it if needed."""
    if not PSYCOPG2_AVAILABLE:
        return
    try:
        # Connect to maintenance database 'postgres'
        conn = psycopg2.connect(
            host=config.get('DB_HOST', 'localhost'),
            port=config.get('DB_PORT', 5432),
            user=config.get('DB_USER', 'postgres'),
            password=config.get('DB_PASSWORD', ''),
            dbname='postgres',
            connect_timeout=3
        )
        conn.autocommit = True
        cur = conn.cursor()
        target_db = config.get('DB_NAME', 'madipro_db')
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
        exists = cur.fetchone()
        if not exists:
            cur.execute(f'CREATE DATABASE "{target_db}"')
            print(f"[OK] Database '{target_db}' created successfully on PostgreSQL.")
        cur.close()
        conn.close()
    except Exception as e:
        # If unable to auto-create, let main connect attempt report exact status
        pass

def get_db():
    """Get database connection for current request context."""
    global _ACTIVE_DB_TYPE

    if 'db' not in g:
        config = current_app.config
        desired_type = config.get('DB_TYPE', 'postgresql').lower()

        # 1. Attempt PostgreSQL connection if requested and psycopg2 is installed
        if desired_type == 'postgresql' and PSYCOPG2_AVAILABLE:
            try:
                _create_postgres_db_if_not_exists(config)
                
                if config.get('DATABASE_URL'):
                    conn = psycopg2.connect(
                        config['DATABASE_URL'],
                        cursor_factory=RealDictCursor
                    )
                else:
                    conn = psycopg2.connect(
                        host=config.get('DB_HOST', 'localhost'),
                        port=config.get('DB_PORT', 5432),
                        dbname=config.get('DB_NAME', 'madipro_db'),
                        user=config.get('DB_USER', 'postgres'),
                        password=config.get('DB_PASSWORD', ''),
                        cursor_factory=RealDictCursor,
                        connect_timeout=3
                    )
                g.db = conn
                g.db_type = 'postgresql'
                _ACTIVE_DB_TYPE = 'postgresql'
                return g.db
            except Exception as e:
                if not config.get('FALLBACK_TO_SQLITE', True):
                    raise RuntimeError(f"Gagal terhubung ke database PostgreSQL: {e}")
                print(f"[!] PostgreSQL notice ({e}). Using SQLite...")

        # 2. SQLite Connection (Native fallback / default)
        db_path = config.get('DATABASE_PATH')
        conn = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        g.db = conn
        g.db_type = 'sqlite'
        _ACTIVE_DB_TYPE = 'sqlite'

    return g.db

def close_db(e=None):
    """Close the database connection at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def _format_sql(sql, db_type):
    """Adapt SQL placeholders and syntax between PostgreSQL and SQLite."""
    if db_type == 'postgresql':
        return sql.replace('?', '%s')
    return sql

def query_db(query, args=(), one=False):
    """Run a SELECT query and return rows as list of dicts."""
    db = get_db()
    db_type = getattr(g, 'db_type', _ACTIVE_DB_TYPE or 'sqlite')
    formatted_sql = _format_sql(query, db_type)

    if db_type == 'postgresql':
        cur = db.cursor()
        cur.execute(formatted_sql, args)
        rows = cur.fetchall()
        cur.close()
        rv = [dict(r) for r in rows]
    else:
        cur = db.execute(formatted_sql, args)
        rv = [dict(row) for row in cur.fetchall()]
        cur.close()

    return (rv[0] if rv else None) if one else rv

def query_one(query, args=()):
    """Run a query and return a single dict or None."""
    return query_db(query, args, one=True)

def execute_db(query, args=(), commit=True):
    """Execute INSERT/UPDATE/DELETE query and return last_id and row_count."""
    db = get_db()
    db_type = getattr(g, 'db_type', _ACTIVE_DB_TYPE or 'sqlite')
    formatted_sql = _format_sql(query, db_type)

    last_id = None
    row_count = 0

    if db_type == 'postgresql':
        cur = db.cursor()
        # Check if INSERT without explicit ID to fetch serial ID
        is_insert = query.strip().upper().startswith('INSERT INTO')
        has_returning = 'RETURNING' in query.upper()
        
        if is_insert and not has_returning and any(tbl in query.lower() for tbl in ['users', 'dashboard_activities', 'dashboard_tasks']):
            formatted_sql += ' RETURNING id'
            cur.execute(formatted_sql, args)
            res = cur.fetchone()
            if res:
                last_id = res['id']
            row_count = cur.rowcount
        else:
            cur.execute(formatted_sql, args)
            row_count = cur.rowcount

        if commit:
            db.commit()
        cur.close()
    else:
        cur = db.execute(formatted_sql, args)
        if commit:
            db.commit()
        last_id = cur.lastrowid
        row_count = cur.rowcount
        cur.close()

    return {'last_id': last_id, 'row_count': row_count}

def init_db(app):
    """Initialize tables if they do not exist."""
    with app.app_context():
        db = get_db()
        db_type = getattr(g, 'db_type', _ACTIVE_DB_TYPE or 'sqlite')

        if db_type == 'postgresql':
            cur = db.cursor()
            cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'Tim Program',
                avatar TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS proposals (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                province VARCHAR(100) NOT NULL,
                date VARCHAR(50) NOT NULL,
                file_type VARCHAR(20) NOT NULL DEFAULT 'PDF',
                file_size VARCHAR(50) NOT NULL DEFAULT '2.4 MB',
                file_name TEXT,
                file_url TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'Dalam tinjauan',
                status_note TEXT,
                action_text VARCHAR(50) NOT NULL DEFAULT 'Lihat detail',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS mous (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                partner VARCHAR(255) NOT NULL,
                partner_signer VARCHAR(255),
                partner_phone VARCHAR(50),
                partner_email VARCHAR(255),
                category VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                province VARCHAR(100) NOT NULL,
                date VARCHAR(50) NOT NULL,
                period VARCHAR(100) NOT NULL,
                commitment_value VARCHAR(100) NOT NULL DEFAULT 'Rp 0',
                file_type VARCHAR(20) NOT NULL DEFAULT 'PDF',
                file_size VARCHAR(50) NOT NULL DEFAULT '1.8 MB',
                file_name TEXT,
                file_url TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'Dalam tinjauan',
                status_note TEXT,
                action_text VARCHAR(50) NOT NULL DEFAULT 'Lihat detail',
                scope TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessments (
                id VARCHAR(50) PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                pm_name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL DEFAULT 'Umum',
                location VARCHAR(255) NOT NULL,
                province VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'Diajukan',
                status_note TEXT,
                data_json TEXT NOT NULL,
                photos_json TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS request_programs (
                id VARCHAR(50) PRIMARY KEY,
                program_name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                applicant_name VARCHAR(255) NOT NULL,
                applicant_phone VARCHAR(50),
                applicant_email VARCHAR(255),
                location VARCHAR(255) NOT NULL,
                estimated_budget VARCHAR(100),
                description TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'Dalam antrean',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_pohon (
                id VARCHAR(50) PRIMARY KEY,
                status_kepemilikan_lahan VARCHAR(100),
                surat_izin_kelurahan VARCHAR(50),
                persetujuan_kecamatan VARCHAR(50),
                persetujuan_dinas_terkait VARCHAR(50),
                dukungan_rt_rw VARCHAR(50),
                luas_area_tanam VARCHAR(100),
                titik_lintang VARCHAR(100),
                titik_bujur VARCHAR(100),
                kondisi_topografi VARCHAR(100),
                jarak_antar_titik_tanam VARCHAR(100),
                luas_area_berpotensi_tergenang VARCHAR(100),
                jenis_tanah VARCHAR(100),
                ph_tanah VARCHAR(100),
                tingkat_kelembapan VARCHAR(100),
                intensitas_genangan_air VARCHAR(100),
                curah_hujan VARCHAR(100),
                risiko_abrasi VARCHAR(100),
                risiko_banjir VARCHAR(100),
                risiko_kebakaran_lahan VARCHAR(100),
                risiko_gangguan_hewan_ternak VARCHAR(100),
                risiko_vandalisme VARCHAR(100),
                spesies_adaptif TEXT,
                luas_area_efektif VARCHAR(100),
                kerapatan_tanam VARCHAR(100),
                jalur_akses_distribusi_bibit VARCHAR(100),
                penanggung_jawab_perawatan VARCHAR(255),
                jadwal_penyiraman VARCHAR(255),
                jadwal_pemupukan VARCHAR(255),
                jadwal_monitoring_perawatan VARCHAR(255),
                kelompok_masyarakat_sekitar VARCHAR(100),
                karang_taruna VARCHAR(100),
                sekolah_sekitar VARCHAR(100),
                relawan_lokal VARCHAR(100),
                alat_tanam VARCHAR(255),
                pupuk VARCHAR(255),
                ajir_bambu VARCHAR(255),
                pagar_pelindung VARCHAR(255),
                indikator_keberhasilan TEXT,
                persentase_hidup_pohon VARCHAR(50),
                jadwal_monitoring_evaluasi TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_umkm (
                id VARCHAR(50) PRIMARY KEY,
                nama_lengkap VARCHAR(255) NOT NULL,
                nomor_ktp VARCHAR(50),
                nomor_kk VARCHAR(50),
                nomor_hp VARCHAR(50),
                jenis_kelamin VARCHAR(50),
                usia VARCHAR(20),
                pendidikan_terakhir VARCHAR(50),
                status_perkawinan VARCHAR(50),
                jumlah_anggota_keluarga VARCHAR(20),
                alamat_lengkap TEXT,
                pekerjaan_utama VARCHAR(255),
                pekerjaan_sampingan VARCHAR(255),
                pendapatan_rata_rata VARCHAR(100),
                pengeluaran_rata_rata VARCHAR(100),
                memiliki_kendaraan VARCHAR(50),
                memiliki_tabungan VARCHAR(50),
                terdaftar_dtks VARCHAR(50),
                nomor_dtks VARCHAR(100),
                desil_berapa VARCHAR(50),
                mendapat_pkh VARCHAR(50),
                mendapat_bpnt VARCHAR(50),
                mendapat_blt VARCHAR(50),
                mendapat_kis VARCHAR(50),
                mendapat_kip VARCHAR(50),
                bantuan_pemerintah_lain TEXT,
                produk_utama VARCHAR(255),
                pendapatan_perbulan VARCHAR(100),
                kendala_terbesar TEXT,
                modal_perbulan VARCHAR(100),
                sumber_modal VARCHAR(100),
                memiliki_hutang_usaha VARCHAR(50),
                hutang_kepada TEXT,
                memiliki_rekening_bank VARCHAR(50),
                bank_apa TEXT,
                menggunakan_mobile_banking VARCHAR(50),
                memiliki_qris VARCHAR(50),
                pernah_mengajukan_kur VARCHAR(50),
                mencatat_pemasukan VARCHAR(50),
                mencatat_pengeluaran VARCHAR(50),
                memiliki_buku_kas VARCHAR(50),
                mengetahui_hpp VARCHAR(50),
                memisahkan_uang_usaha VARCHAR(50),
                memiliki_nib VARCHAR(50),
                memiliki_pirt VARCHAR(50),
                memiliki_sertifikat_halal VARCHAR(50),
                memiliki_merek VARCHAR(50),
                memiliki_kemasan VARCHAR(50),
                memiliki_label VARCHAR(50),
                memiliki_media_sosial VARCHAR(50),
                menjual_online VARCHAR(50),
                produk_yang_dijual TEXT,
                bentuk_penjualan VARCHAR(100),
                memiliki_produk_olahan VARCHAR(50),
                memiliki_branding VARCHAR(50),
                kendala_pemasaran TEXT,
                target_usaha TEXT,
                menjual_kemana TEXT,
                ada_pelanggan_tetap VARCHAR(50),
                pernah_ikut_bazaar VARCHAR(50),
                pernah_promosi_online VARCHAR(50),
                memiliki_marketplace VARCHAR(50),
                memiliki_wa_business VARCHAR(50),
                jenis_bantuan TEXT,
                nilai_bantuan VARCHAR(100),
                rencana_penggunaan_bantuan TEXT,
                dampak_diharapkan TEXT,
                kesediaan_pendampingan VARCHAR(50),
                sarana_produktif TEXT,
                harapan_program TEXT,
                perubahan_diharapkan TEXT,
                rencana_setelah_program TEXT,
                dokumentasi_foto TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_petani (
                id VARCHAR(50) PRIMARY KEY,
                nama_lengkap VARCHAR(255) NOT NULL,
                nomor_ktp VARCHAR(50),
                nomor_kk VARCHAR(50),
                nomor_hp VARCHAR(50),
                jenis_kelamin VARCHAR(50),
                usia VARCHAR(20),
                pendidikan_terakhir VARCHAR(50),
                status_perkawinan VARCHAR(50),
                jumlah_anggota_keluarga VARCHAR(20),
                alamat_lengkap TEXT,
                nama_kelompok_tani VARCHAR(255),
                pekerjaan_utama VARCHAR(255),
                pekerjaan_sampingan VARCHAR(255),
                pendapatan_rata_rata VARCHAR(100),
                pengeluaran_rata_rata VARCHAR(100),
                memiliki_lahan VARCHAR(50),
                luas_lahan VARCHAR(50),
                status_lahan VARCHAR(50),
                komoditas_utama VARCHAR(255),
                lama_bertani VARCHAR(50),
                memiliki_ternak VARCHAR(50),
                memiliki_tabungan VARCHAR(50),
                terdaftar_dtks VARCHAR(50),
                nomor_dtks VARCHAR(100),
                desil_berapa VARCHAR(50),
                mendapat_pkh VARCHAR(50),
                mendapat_bpnt VARCHAR(50),
                mendapat_blt VARCHAR(50),
                mendapat_kis VARCHAR(50),
                mendapat_kip VARCHAR(50),
                bantuan_pemerintah_lain TEXT,
                produktivitas_panen VARCHAR(100),
                frekuensi_panen VARCHAR(100),
                pendapatan_perpanen VARCHAR(100),
                kendala_terbesar TEXT,
                modal_per_musim VARCHAR(100),
                sumber_modal VARCHAR(100),
                memiliki_hutang_usaha VARCHAR(50),
                hutang_kepada TEXT,
                memiliki_rekening_bank VARCHAR(50),
                bank_apa TEXT,
                menggunakan_mobile_banking VARCHAR(50),
                memiliki_qris VARCHAR(50),
                pernah_mengajukan_kur VARCHAR(50),
                mencatat_pemasukan VARCHAR(50),
                mencatat_pengeluaran VARCHAR(50),
                memiliki_buku_kas VARCHAR(50),
                mengetahui_hpp VARCHAR(50),
                memisahkan_uang_usaha VARCHAR(50),
                memiliki_nib VARCHAR(50),
                memiliki_pirt VARCHAR(50),
                memiliki_sertifikat_halal VARCHAR(50),
                memiliki_merek VARCHAR(50),
                memiliki_kemasan VARCHAR(50),
                memiliki_label VARCHAR(50),
                memiliki_media_sosial VARCHAR(50),
                menjual_online VARCHAR(50),
                produk_yang_dijual TEXT,
                bentuk_penjualan VARCHAR(100),
                memiliki_produk_olahan VARCHAR(50),
                memiliki_branding VARCHAR(50),
                kendala_pemasaran TEXT,
                target_usaha TEXT,
                menjual_kemana TEXT,
                ada_pelanggan_tetap VARCHAR(50),
                pernah_ikut_bazaar VARCHAR(50),
                pernah_promosi_online VARCHAR(50),
                memiliki_marketplace VARCHAR(50),
                memiliki_wa_business VARCHAR(50),
                jenis_bantuan TEXT,
                nilai_bantuan VARCHAR(100),
                rencana_penggunaan_bantuan TEXT,
                dampak_diharapkan TEXT,
                kesediaan_pendampingan VARCHAR(50),
                sarana_produktif TEXT,
                harapan_program TEXT,
                perubahan_diharapkan TEXT,
                rencana_setelah_program TEXT,
                dokumentasi_foto TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_jembatan (
                id VARCHAR(50) PRIMARY KEY,
                nama_jembatan VARCHAR(255) NOT NULL,
                lokasi TEXT NOT NULL,
                tanggal_kejadian VARCHAR(50),
                penyebab_kerusakan VARCHAR(255),
                material_jembatan VARCHAR(100),
                material_lainnya VARCHAR(100),
                fungsi_jembatan TEXT,
                tingkat_kerusakan VARCHAR(50),
                deskripsi_kerusakan TEXT,
                panjang VARCHAR(50),
                lebar VARCHAR(50),
                tinggi VARCHAR(50),
                jumlah_penduduk VARCHAR(100),
                wilayah_terisolasi TEXT,
                fungsi_terganggu TEXT,
                fungsi_lainnya TEXT,
                alternatif_jalur VARCHAR(50),
                keterangan_alternatif TEXT,
                sumber_daya TEXT,
                estimasi_biaya VARCHAR(100),
                nama_pj VARCHAR(255),
                nomor_kontak VARCHAR(50),
                email_pj VARCHAR(100),
                foto_jembatan TEXT,
                video_lokasi TEXT,
                foto_sekitar TEXT,
                foto_risiko TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_masjid (
                id VARCHAR(50) PRIMARY KEY,
                nama_masjid VARCHAR(255) NOT NULL,
                alamat TEXT NOT NULL,
                tanggal_kejadian VARCHAR(50),
                penyebab_kerusakan VARCHAR(255),
                penyebab_lainnya VARCHAR(255),
                jamaah_harian VARCHAR(100),
                jamaah_jumat VARCHAR(100),
                ukuran_masjid VARCHAR(100),
                kondisi_dinding VARCHAR(50),
                kondisi_atap VARCHAR(50),
                kondisi_lantai VARCHAR(50),
                mimbar_imam VARCHAR(50),
                karpet_sajadah VARCHAR(50),
                soundsystem VARCHAR(50),
                jumlah_mck VARCHAR(50),
                kondisi_mck VARCHAR(50),
                fasilitas_sanitasi VARCHAR(100),
                jumlah_keran VARCHAR(50),
                kondisi_keran VARCHAR(50),
                saluran_air VARCHAR(50),
                tangki_air VARCHAR(50),
                status_ibadah VARCHAR(100),
                hambatan_utama VARCHAR(255),
                hambatan_lainnya TEXT,
                fasilitas_dibutuhkan VARCHAR(255),
                fasilitas_lainnya TEXT,
                estimasi_biaya VARCHAR(100),
                prioritas_mendesak VARCHAR(100),
                nama_pj VARCHAR(255),
                nomor_kontak VARCHAR(50),
                email_pj VARCHAR(100),
                foto_masjid TEXT,
                foto_mck TEXT,
                foto_sekitar TEXT,
                foto_tambahan TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_sekolah (
                id VARCHAR(50) PRIMARY KEY,
                nama_sekolah VARCHAR(255) NOT NULL,
                alamat TEXT NOT NULL,
                tingkat_sekolah VARCHAR(50),
                tingkat_lainnya VARCHAR(100),
                jumlah_siswa VARCHAR(50),
                jumlah_guru VARCHAR(50),
                tanggal_kejadian VARCHAR(50),
                penyebab_kerusakan VARCHAR(255),
                penyebab_lainnya VARCHAR(255),
                jumlah_kelas_rusak VARCHAR(50),
                ukuran_kelas VARCHAR(100),
                luas_bangunan VARCHAR(100),
                kondisi_ruang_guru VARCHAR(50),
                toilet_sanitasi VARCHAR(50),
                sumber_air_bersih VARCHAR(50),
                meja_kursi_rusak VARCHAR(50),
                papan_tulis_rusak VARCHAR(50),
                buku_tersedia VARCHAR(50),
                perpustakaan VARCHAR(50),
                laboratorium VARCHAR(50),
                area_bermain VARCHAR(50),
                status_kbm VARCHAR(100),
                hambatan_utama VARCHAR(255),
                hambatan_lainnya TEXT,
                fasilitas_darurat TEXT,
                fasilitas_lainnya TEXT,
                logistik_siswa TEXT,
                logistik_lainnya TEXT,
                estimasi_biaya VARCHAR(100),
                nama_pj VARCHAR(255),
                nomor_kontak VARCHAR(50),
                email_pj VARCHAR(100),
                foto_bangunan TEXT,
                foto_penunjang TEXT,
                foto_lingkungan TEXT,
                foto_hambatan TEXT,
                status VARCHAR(50) DEFAULT 'Diajukan',
                status_note TEXT,
                created_by VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dashboard_activities (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                meta TEXT NOT NULL,
                time_ago VARCHAR(50) NOT NULL,
                icon VARCHAR(50) NOT NULL DEFAULT 'fileEdit',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dashboard_tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                program VARCHAR(255) NOT NULL,
                action VARCHAR(255) NOT NULL,
                due VARCHAR(50) NOT NULL,
                urgent INTEGER NOT NULL DEFAULT 0,
                completed INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS dss_evaluations (
                id VARCHAR(50) PRIMARY KEY,
                program_id VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                division VARCHAR(100),
                location VARCHAR(255) NOT NULL,
                province VARCHAR(100) NOT NULL,
                estimated_budget VARCHAR(100) DEFAULT 'Rp 0',
                beneficiaries VARCHAR(100) DEFAULT '0',
                score_urgency NUMERIC(5,2) DEFAULT 0,
                score_impact NUMERIC(5,2) DEFAULT 0,
                score_readiness NUMERIC(5,2) DEFAULT 0,
                score_budget NUMERIC(5,2) DEFAULT 0,
                score_sustainability NUMERIC(5,2) DEFAULT 0,
                final_score NUMERIC(5,2) NOT NULL DEFAULT 0,
                recommendation VARCHAR(100) NOT NULL DEFAULT 'Dalam telaah',
                rank_priority INTEGER DEFAULT 1,
                status VARCHAR(50) NOT NULL DEFAULT 'Dalam telaah',
                status_note VARCHAR(255) DEFAULT 'Menunggu peninjauan',
                action_text VARCHAR(100) DEFAULT 'Lihat detail',
                file_type VARCHAR(50) DEFAULT 'Excel/PDF',
                file_size VARCHAR(50) DEFAULT '3.4 MB',
                file_name TEXT,
                file_url TEXT,
                evaluator_name VARCHAR(255) DEFAULT 'Tim Analis Program',
                evaluation_notes TEXT,
                recommendation_action TEXT,
                date VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Ensure additional columns exist if table was already created
            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN division VARCHAR(100);
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN status_note VARCHAR(255);
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN action_text VARCHAR(100);
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN file_type VARCHAR(50) DEFAULT 'Excel/PDF';
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN file_size VARCHAR(50) DEFAULT '3.4 MB';
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN file_name TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE dss_evaluations ADD COLUMN file_url TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE proposals ADD COLUMN file_name TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE proposals ADD COLUMN file_url TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE mous ADD COLUMN file_name TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE mous ADD COLUMN file_url TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
            END $$;

            CREATE TABLE IF NOT EXISTS mipros (
                id VARCHAR(50) PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                subtype VARCHAR(50) NOT NULL,
                type_label VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                partner_name VARCHAR(255),
                campaign_id VARCHAR(100),
                category VARCHAR(100) NOT NULL DEFAULT 'Umum',
                location VARCHAR(255) DEFAULT 'Kab. Bandung',
                province VARCHAR(100) DEFAULT 'Jawa Barat',
                period VARCHAR(100) NOT NULL,
                disbursement_amount VARCHAR(100) DEFAULT 'Rp 0',
                beneficiaries VARCHAR(100) DEFAULT '100 Jiwa',
                description TEXT,
                desired_output TEXT,
                campaigns_data TEXT,
                updated_date VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS spks (
                id VARCHAR(50) PRIMARY KEY,
                spk_number VARCHAR(100) NOT NULL,
                program_name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL DEFAULT 'Umum',
                assignor_name VARCHAR(255) DEFAULT 'Divisi Program Relawan Nusantara',
                assignee_name VARCHAR(255) NOT NULL,
                assignee_role VARCHAR(100) DEFAULT 'Pelaksana Lapangan',
                assignee_contact VARCHAR(100),
                location TEXT NOT NULL,
                province VARCHAR(100) DEFAULT 'Jawa Barat',
                budget_amount VARCHAR(100) DEFAULT 'Rp 0',
                start_date VARCHAR(50),
                end_date VARCHAR(50),
                scope_of_work TEXT,
                payment_terms TEXT,
                target_output TEXT,
                notes TEXT,
                file_type VARCHAR(20) DEFAULT 'PDF',
                file_size VARCHAR(50) DEFAULT '2.5 MB',
                file_name TEXT,
                file_url TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'Dalam pelaksanaan',
                status_note VARCHAR(255),
                action_text VARCHAR(100) DEFAULT 'Lihat detail',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            DO $$
            BEGIN
                BEGIN
                    ALTER TABLE spks ADD COLUMN file_name TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
                BEGIN
                    ALTER TABLE spks ADD COLUMN file_url TEXT;
                EXCEPTION WHEN duplicate_column THEN END;
            END $$;

            CREATE TABLE IF NOT EXISTS monevs (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                mipro_id VARCHAR(50),
                assessment_id VARCHAR(50),
                request_id VARCHAR(50),
                location VARCHAR(255) NOT NULL,
                visit_date VARCHAR(50) NOT NULL,
                visit_date_full VARCHAR(100),
                next_visit VARCHAR(50),
                next_visit_iso VARCHAR(20),
                officer VARCHAR(255) NOT NULL DEFAULT 'Tim Program',
                progress INTEGER NOT NULL DEFAULT 0,
                status VARCHAR(50) NOT NULL DEFAULT 'Sesuai rencana',
                notes TEXT,
                indicators_json TEXT,
                issues_json TEXT,
                docs_json TEXT,
                photos_json TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            """)
            db.commit()
            cur.close()
            print("[OK] PostgreSQL tables verified.")
        else:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Tim Program',
                avatar TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS proposals (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                province TEXT NOT NULL,
                date TEXT NOT NULL,
                file_type TEXT NOT NULL DEFAULT 'PDF',
                file_size TEXT NOT NULL DEFAULT '2.4 MB',
                file_name TEXT,
                file_url TEXT,
                status TEXT NOT NULL DEFAULT 'Dalam tinjauan',
                status_note TEXT,
                action_text TEXT NOT NULL DEFAULT 'Lihat detail',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS mous (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                partner TEXT NOT NULL,
                partner_signer TEXT,
                partner_phone TEXT,
                partner_email TEXT,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                province TEXT NOT NULL,
                date TEXT NOT NULL,
                period TEXT NOT NULL,
                commitment_value TEXT NOT NULL DEFAULT 'Rp 0',
                file_type TEXT NOT NULL DEFAULT 'PDF',
                file_size TEXT NOT NULL DEFAULT '1.8 MB',
                file_name TEXT,
                file_url TEXT,
                status TEXT NOT NULL DEFAULT 'Dalam tinjauan',
                status_note TEXT,
                action_text TEXT NOT NULL DEFAULT 'Lihat detail',
                scope TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                pm_name TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'Umum',
                location TEXT NOT NULL,
                province TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Diajukan',
                status_note TEXT,
                data_json TEXT NOT NULL,
                photos_json TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS request_programs (
                id TEXT PRIMARY KEY,
                program_name TEXT NOT NULL,
                category TEXT NOT NULL,
                applicant_name TEXT NOT NULL,
                applicant_phone TEXT,
                applicant_email TEXT,
                location TEXT NOT NULL,
                estimated_budget TEXT,
                description TEXT,
                status TEXT NOT NULL DEFAULT 'Dalam antrean',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_pohon (
                id TEXT PRIMARY KEY,
                status_kepemilikan_lahan TEXT,
                surat_izin_kelurahan TEXT,
                persetujuan_kecamatan TEXT,
                persetujuan_dinas_terkait TEXT,
                dukungan_rt_rw TEXT,
                luas_area_tanam TEXT,
                titik_lintang TEXT,
                titik_bujur TEXT,
                kondisi_topografi TEXT,
                jarak_antar_titik_tanam TEXT,
                luas_area_berpotensi_tergenang TEXT,
                jenis_tanah TEXT,
                ph_tanah TEXT,
                tingkat_kelembapan TEXT,
                intensitas_genangan_air TEXT,
                curah_hujan TEXT,
                risiko_abrasi TEXT,
                risiko_banjir TEXT,
                risiko_kebakaran_lahan TEXT,
                risiko_gangguan_hewan_ternak TEXT,
                risiko_vandalisme TEXT,
                spesies_adaptif TEXT,
                luas_area_efektif TEXT,
                kerapatan_tanam TEXT,
                jalur_akses_distribusi_bibit TEXT,
                penanggung_jawab_perawatan TEXT,
                jadwal_penyiraman TEXT,
                jadwal_pemupukan TEXT,
                jadwal_monitoring_perawatan TEXT,
                kelompok_masyarakat_sekitar TEXT,
                karang_taruna TEXT,
                sekolah_sekitar TEXT,
                relawan_lokal TEXT,
                alat_tanam TEXT,
                pupuk TEXT,
                ajir_bambu TEXT,
                pagar_pelindung TEXT,
                indikator_keberhasilan TEXT,
                persentase_hidup_pohon TEXT,
                jadwal_monitoring_evaluasi TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_umkm (
                id TEXT PRIMARY KEY,
                nama_lengkap TEXT NOT NULL,
                nomor_ktp TEXT,
                nomor_kk TEXT,
                nomor_hp TEXT,
                jenis_kelamin TEXT,
                usia TEXT,
                pendidikan_terakhir TEXT,
                status_perkawinan TEXT,
                jumlah_anggota_keluarga TEXT,
                alamat_lengkap TEXT,
                pekerjaan_utama TEXT,
                pekerjaan_sampingan TEXT,
                pendapatan_rata_rata TEXT,
                pengeluaran_rata_rata TEXT,
                memiliki_kendaraan TEXT,
                memiliki_tabungan TEXT,
                terdaftar_dtks TEXT,
                nomor_dtks TEXT,
                desil_berapa TEXT,
                mendapat_pkh TEXT,
                mendapat_bpnt TEXT,
                mendapat_blt TEXT,
                mendapat_kis TEXT,
                mendapat_kip TEXT,
                bantuan_pemerintah_lain TEXT,
                produk_utama TEXT,
                pendapatan_perbulan TEXT,
                kendala_terbesar TEXT,
                modal_perbulan TEXT,
                sumber_modal TEXT,
                memiliki_hutang_usaha TEXT,
                hutang_kepada TEXT,
                memiliki_rekening_bank TEXT,
                bank_apa TEXT,
                menggunakan_mobile_banking TEXT,
                memiliki_qris TEXT,
                pernah_mengajukan_kur TEXT,
                mencatat_pemasukan TEXT,
                mencatat_pengeluaran TEXT,
                memiliki_buku_kas TEXT,
                mengetahui_hpp TEXT,
                memisahkan_uang_usaha TEXT,
                memiliki_nib TEXT,
                memiliki_pirt TEXT,
                memiliki_sertifikat_halal TEXT,
                memiliki_merek TEXT,
                memiliki_kemasan TEXT,
                memiliki_label TEXT,
                memiliki_media_sosial TEXT,
                menjual_online TEXT,
                produk_yang_dijual TEXT,
                bentuk_penjualan TEXT,
                memiliki_produk_olahan TEXT,
                memiliki_branding TEXT,
                kendala_pemasaran TEXT,
                target_usaha TEXT,
                menjual_kemana TEXT,
                ada_pelanggan_tetap TEXT,
                pernah_ikut_bazaar TEXT,
                pernah_promosi_online TEXT,
                memiliki_marketplace TEXT,
                memiliki_wa_business TEXT,
                jenis_bantuan TEXT,
                nilai_bantuan TEXT,
                rencana_penggunaan_bantuan TEXT,
                dampak_diharapkan TEXT,
                kesediaan_pendampingan TEXT,
                sarana_produktif TEXT,
                harapan_program TEXT,
                perubahan_diharapkan TEXT,
                rencana_setelah_program TEXT,
                dokumentasi_foto TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_petani (
                id TEXT PRIMARY KEY,
                nama_lengkap TEXT NOT NULL,
                nomor_ktp TEXT,
                nomor_kk TEXT,
                nomor_hp TEXT,
                jenis_kelamin TEXT,
                usia TEXT,
                pendidikan_terakhir TEXT,
                status_perkawinan TEXT,
                jumlah_anggota_keluarga TEXT,
                alamat_lengkap TEXT,
                nama_kelompok_tani TEXT,
                pekerjaan_utama TEXT,
                pekerjaan_sampingan TEXT,
                pendapatan_rata_rata TEXT,
                pengeluaran_rata_rata TEXT,
                memiliki_lahan TEXT,
                luas_lahan TEXT,
                status_lahan TEXT,
                komoditas_utama TEXT,
                lama_bertani TEXT,
                memiliki_ternak TEXT,
                memiliki_tabungan TEXT,
                terdaftar_dtks TEXT,
                nomor_dtks TEXT,
                desil_berapa TEXT,
                mendapat_pkh TEXT,
                mendapat_bpnt TEXT,
                mendapat_blt TEXT,
                mendapat_kis TEXT,
                mendapat_kip TEXT,
                bantuan_pemerintah_lain TEXT,
                produktivitas_panen TEXT,
                frekuensi_panen TEXT,
                pendapatan_perpanen TEXT,
                kendala_terbesar TEXT,
                modal_per_musim TEXT,
                sumber_modal TEXT,
                memiliki_hutang_usaha TEXT,
                hutang_kepada TEXT,
                memiliki_rekening_bank TEXT,
                bank_apa TEXT,
                menggunakan_mobile_banking TEXT,
                memiliki_qris TEXT,
                pernah_mengajukan_kur TEXT,
                mencatat_pemasukan TEXT,
                mencatat_pengeluaran TEXT,
                memiliki_buku_kas TEXT,
                mengetahui_hpp TEXT,
                memisahkan_uang_usaha TEXT,
                memiliki_nib TEXT,
                memiliki_pirt TEXT,
                memiliki_sertifikat_halal TEXT,
                memiliki_merek TEXT,
                memiliki_kemasan TEXT,
                memiliki_label TEXT,
                memiliki_media_sosial TEXT,
                menjual_online TEXT,
                produk_yang_dijual TEXT,
                bentuk_penjualan TEXT,
                memiliki_produk_olahan TEXT,
                memiliki_branding TEXT,
                kendala_pemasaran TEXT,
                target_usaha TEXT,
                menjual_kemana TEXT,
                ada_pelanggan_tetap TEXT,
                pernah_ikut_bazaar TEXT,
                pernah_promosi_online TEXT,
                memiliki_marketplace TEXT,
                memiliki_wa_business TEXT,
                jenis_bantuan TEXT,
                nilai_bantuan TEXT,
                rencana_penggunaan_bantuan TEXT,
                dampak_diharapkan TEXT,
                kesediaan_pendampingan TEXT,
                sarana_produktif TEXT,
                harapan_program TEXT,
                perubahan_diharapkan TEXT,
                rencana_setelah_program TEXT,
                dokumentasi_foto TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_jembatan (
                id TEXT PRIMARY KEY,
                nama_jembatan TEXT NOT NULL,
                lokasi TEXT NOT NULL,
                tanggal_kejadian TEXT,
                penyebab_kerusakan TEXT,
                material_jembatan TEXT,
                material_lainnya TEXT,
                fungsi_jembatan TEXT,
                tingkat_kerusakan TEXT,
                deskripsi_kerusakan TEXT,
                panjang TEXT,
                lebar TEXT,
                tinggi TEXT,
                jumlah_penduduk TEXT,
                wilayah_terisolasi TEXT,
                fungsi_terganggu TEXT,
                fungsi_lainnya TEXT,
                alternatif_jalur TEXT,
                keterangan_alternatif TEXT,
                sumber_daya TEXT,
                estimasi_biaya TEXT,
                nama_pj TEXT,
                nomor_kontak TEXT,
                email_pj TEXT,
                foto_jembatan TEXT,
                video_lokasi TEXT,
                foto_sekitar TEXT,
                foto_risiko TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_masjid (
                id TEXT PRIMARY KEY,
                nama_masjid TEXT NOT NULL,
                alamat TEXT NOT NULL,
                tanggal_kejadian TEXT,
                penyebab_kerusakan TEXT,
                penyebab_lainnya TEXT,
                jamaah_harian TEXT,
                jamaah_jumat TEXT,
                ukuran_masjid TEXT,
                kondisi_dinding TEXT,
                kondisi_atap TEXT,
                kondisi_lantai TEXT,
                mimbar_imam TEXT,
                karpet_sajadah TEXT,
                soundsystem TEXT,
                jumlah_mck TEXT,
                kondisi_mck TEXT,
                fasilitas_sanitasi TEXT,
                jumlah_keran TEXT,
                kondisi_keran TEXT,
                saluran_air TEXT,
                tangki_air TEXT,
                status_ibadah TEXT,
                hambatan_utama TEXT,
                hambatan_lainnya TEXT,
                fasilitas_dibutuhkan TEXT,
                fasilitas_lainnya TEXT,
                estimasi_biaya TEXT,
                prioritas_mendesak TEXT,
                nama_pj TEXT,
                nomor_kontak TEXT,
                email_pj TEXT,
                foto_masjid TEXT,
                foto_mck TEXT,
                foto_sekitar TEXT,
                foto_tambahan TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_sekolah (
                id TEXT PRIMARY KEY,
                nama_sekolah TEXT NOT NULL,
                alamat TEXT NOT NULL,
                tingkat_sekolah TEXT,
                tingkat_lainnya TEXT,
                jumlah_siswa TEXT,
                jumlah_guru TEXT,
                tanggal_kejadian TEXT,
                penyebab_kerusakan TEXT,
                penyebab_lainnya TEXT,
                jumlah_kelas_rusak TEXT,
                ukuran_kelas TEXT,
                luas_bangunan TEXT,
                kondisi_ruang_guru TEXT,
                toilet_sanitasi TEXT,
                sumber_air_bersih TEXT,
                meja_kursi_rusak TEXT,
                papan_tulis_rusak TEXT,
                buku_tersedia TEXT,
                perpustakaan TEXT,
                laboratorium TEXT,
                area_bermain TEXT,
                status_kbm TEXT,
                hambatan_utama TEXT,
                hambatan_lainnya TEXT,
                fasilitas_darurat TEXT,
                fasilitas_lainnya TEXT,
                logistik_siswa TEXT,
                logistik_lainnya TEXT,
                estimasi_biaya TEXT,
                nama_pj TEXT,
                nomor_kontak TEXT,
                email_pj TEXT,
                foto_bangunan TEXT,
                foto_penunjang TEXT,
                foto_lingkungan TEXT,
                foto_hambatan TEXT,
                status TEXT DEFAULT 'Diajukan',
                status_note TEXT,
                created_by TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dashboard_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                meta TEXT NOT NULL,
                time_ago TEXT NOT NULL,
                icon TEXT NOT NULL DEFAULT 'fileEdit',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dashboard_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                program TEXT NOT NULL,
                action TEXT NOT NULL,
                due TEXT NOT NULL,
                urgent INTEGER NOT NULL DEFAULT 0,
                completed INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS spks (
                id TEXT PRIMARY KEY,
                spk_number TEXT NOT NULL,
                program_name TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'Umum',
                assignor_name TEXT DEFAULT 'Divisi Program Relawan Nusantara',
                assignee_name TEXT NOT NULL,
                assignee_role TEXT DEFAULT 'Pelaksana Lapangan',
                assignee_contact TEXT,
                location TEXT NOT NULL,
                province TEXT DEFAULT 'Jawa Barat',
                budget_amount TEXT DEFAULT 'Rp 0',
                start_date TEXT,
                end_date TEXT,
                scope_of_work TEXT,
                payment_terms TEXT,
                target_output TEXT,
                notes TEXT,
                file_type TEXT DEFAULT 'PDF',
                file_size TEXT DEFAULT '2.5 MB',
                file_name TEXT,
                file_url TEXT,
                status TEXT NOT NULL DEFAULT 'Dalam pelaksanaan',
                status_note TEXT,
                action_text TEXT DEFAULT 'Lihat detail',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dss_evaluations (
                id TEXT PRIMARY KEY,
                program_id TEXT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                division TEXT,
                location TEXT NOT NULL,
                province TEXT NOT NULL,
                estimated_budget TEXT DEFAULT 'Rp 0',
                beneficiaries TEXT DEFAULT '0',
                score_urgency REAL DEFAULT 0,
                score_impact REAL DEFAULT 0,
                score_readiness REAL DEFAULT 0,
                score_budget REAL DEFAULT 0,
                score_sustainability REAL DEFAULT 0,
                final_score REAL NOT NULL DEFAULT 0,
                recommendation TEXT NOT NULL DEFAULT 'Dalam telaah',
                rank_priority INTEGER DEFAULT 1,
                status TEXT NOT NULL DEFAULT 'Dalam telaah',
                status_note TEXT DEFAULT 'Menunggu peninjauan',
                action_text TEXT DEFAULT 'Lihat detail',
                file_type TEXT DEFAULT 'Excel/PDF',
                file_size TEXT DEFAULT '3.4 MB',
                file_name TEXT,
                file_url TEXT,
                evaluator_name TEXT DEFAULT 'Tim Analis Program',
                evaluation_notes TEXT,
                recommendation_action TEXT,
                date TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS mipros (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                subtype TEXT NOT NULL,
                type_label TEXT NOT NULL,
                title TEXT NOT NULL,
                partner_name TEXT,
                campaign_id TEXT,
                category TEXT NOT NULL DEFAULT 'Umum',
                location TEXT DEFAULT 'Kab. Bandung',
                province TEXT DEFAULT 'Jawa Barat',
                period TEXT NOT NULL,
                disbursement_amount TEXT DEFAULT 'Rp 0',
                beneficiaries TEXT DEFAULT '100 Jiwa',
                description TEXT,
                desired_output TEXT,
                campaigns_data TEXT,
                updated_date TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS monevs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                mipro_id TEXT,
                assessment_id TEXT,
                request_id TEXT,
                location TEXT NOT NULL,
                visit_date TEXT NOT NULL,
                visit_date_full TEXT,
                next_visit TEXT,
                next_visit_iso TEXT,
                officer TEXT NOT NULL DEFAULT 'Tim Program',
                progress INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'Sesuai rencana',
                notes TEXT,
                indicators_json TEXT,
                issues_json TEXT,
                docs_json TEXT,
                photos_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            # Ensure SQLite schema migrations for new columns
            for table_name, col_name, col_type in [
                ('proposals', 'file_name', 'TEXT'),
                ('proposals', 'file_url', 'TEXT'),
                ('mous', 'file_name', 'TEXT'),
                ('mous', 'file_url', 'TEXT'),
                ('dss_evaluations', 'file_name', 'TEXT'),
                ('dss_evaluations', 'file_url', 'TEXT'),
                ('spks', 'file_name', 'TEXT'),
                ('spks', 'file_url', 'TEXT'),
            ]:
                try:
                    db.execute(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}")
                except Exception:
                    pass
            db.commit()
            print("[OK] SQLite tables verified.")
