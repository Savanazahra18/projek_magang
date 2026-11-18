from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
import json
from datetime import datetime

bp = Blueprint('assessments', __name__, url_prefix='/api/assessments')

@bp.route('', methods=['GET'])
def list_assessments():
    """List assessments with optional type filter, status filter, and keyword search."""
    asm_type = request.args.get('type')  # pohon | umkm | petani | masjid | sekolah | jembatan
    status_filter = request.args.get('status')
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT id, type, title, pm_name, category, location, province, status, status_note, created_by, created_at FROM assessments WHERE 1=1"
    params = []

    if asm_type:
        sql += " AND type = ?"
        params.append(asm_type.lower())

    if status_filter:
        sql += " AND status = ?"
        params.append(status_filter)

    if search_query:
        sql += " AND (LOWER(id) LIKE ? OR LOWER(title) LIKE ? OR LOWER(pm_name) LIKE ? OR LOWER(location) LIKE ?)"
        p = f"%{search_query}%"
        params.extend([p, p, p, p])

    sql += " ORDER BY id DESC"
    rows = query_db(sql, params)

    # Compute type counts
    all_rows = query_db("SELECT type, status FROM assessments")
    counts_by_type = {
        'all': len(all_rows),
        'pohon': sum(1 for r in all_rows if r['type'] == 'pohon'),
        'umkm': sum(1 for r in all_rows if r['type'] == 'umkm'),
        'petani': sum(1 for r in all_rows if r['type'] == 'petani'),
        'masjid': sum(1 for r in all_rows if r['type'] == 'masjid'),
        'sekolah': sum(1 for r in all_rows if r['type'] == 'sekolah'),
        'jembatan': sum(1 for r in all_rows if r['type'] == 'jembatan'),
    }

    return jsonify({
        'assessments': rows,
        'counts': counts_by_type,
        'total': len(rows)
    }), 200

@bp.route('/pohon', methods=['GET'])
def list_pohon():
    """List all assessments in dedicated assessment_pohon table."""
    rows = query_db("SELECT * FROM assessment_pohon ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/umkm', methods=['GET'])
def list_umkm():
    """List all assessments in dedicated assessment_umkm table."""
    rows = query_db("SELECT * FROM assessment_umkm ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/petani', methods=['GET'])
def list_petani():
    """List all assessments in dedicated assessment_petani table."""
    rows = query_db("SELECT * FROM assessment_petani ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/jembatan', methods=['GET'])
def list_jembatan():
    """List all assessments in dedicated assessment_jembatan table."""
    rows = query_db("SELECT * FROM assessment_jembatan ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/masjid', methods=['GET'])
def list_masjid():
    """List all assessments in dedicated assessment_masjid table."""
    rows = query_db("SELECT * FROM assessment_masjid ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/sekolah', methods=['GET'])
def list_sekolah():
    """List all assessments in dedicated assessment_sekolah table."""
    rows = query_db("SELECT * FROM assessment_sekolah ORDER BY id DESC")
    return jsonify({'data': rows, 'total': len(rows)}), 200

@bp.route('/<asm_id>', methods=['GET'])
def get_assessment_detail(asm_id):
    """Get single assessment with complete parsed data and photos."""
    row = query_one("SELECT * FROM assessments WHERE id = ?", (asm_id,))
    if not row:
        return jsonify({'error': f'Assessment dengan ID {asm_id} tidak ditemukan.'}), 404

    # Parse JSON fields safely
    data_dict = {}
    photos_list = []
    try:
        if row.get('data_json'):
            data_dict = json.loads(row['data_json'])
    except Exception:
        pass

    try:
        if row.get('photos_json'):
            photos_list = json.loads(row['photos_json'])
    except Exception:
        pass

    result = dict(row)
    result['data'] = data_dict
    result['photos'] = photos_list

    # Also include raw category table record if available
    asm_type = row.get('type')
    cat_record = None
    if asm_type == 'pohon':
        cat_record = query_one("SELECT * FROM assessment_pohon WHERE id = ?", (asm_id,))
    elif asm_type == 'umkm':
        cat_record = query_one("SELECT * FROM assessment_umkm WHERE id = ?", (asm_id,))
    elif asm_type == 'petani':
        cat_record = query_one("SELECT * FROM assessment_petani WHERE id = ?", (asm_id,))
    elif asm_type == 'jembatan':
        cat_record = query_one("SELECT * FROM assessment_jembatan WHERE id = ?", (asm_id,))
    elif asm_type == 'masjid':
        cat_record = query_one("SELECT * FROM assessment_masjid WHERE id = ?", (asm_id,))
    elif asm_type == 'sekolah':
        cat_record = query_one("SELECT * FROM assessment_sekolah WHERE id = ?", (asm_id,))

    result['category_record'] = cat_record

    return jsonify({'assessment': result}), 200

@bp.route('', methods=['POST'])
def create_assessment():
    """Create / submit a new assessment form, saving into its dedicated category table."""
    body = request.get_json() or {}
    asm_type = body.get('type', 'umum').lower()
    title = body.get('title', '').strip()
    pm_name = body.get('pmName', '').strip()
    category = body.get('category', 'Umum')
    location = body.get('location', '').strip()
    province = body.get('province', 'Jawa Barat')
    status = body.get('status', 'Diajukan')
    status_note = body.get('statusNote', 'Data survei lapangan tersimpan.')
    form_data = body.get('data', {})
    photos = body.get('photos', [])
    created_by = body.get('createdBy', 'Cikipi (Tim Program)')

    # Fallback title if empty
    if not title:
        type_labels = {
            'pohon': 'Assessment Kelayakan Reboisasi Pohon',
            'umkm': 'Assessment Profil & Kelayakan Usaha UMKM',
            'petani': 'Assessment Profil Petani & Kelompok Tani',
            'masjid': 'Assessment Renovasi Sarana Ibadah / Masjid',
            'sekolah': 'Assessment Sarana Pendidikan Sekolah',
            'jembatan': 'Assessment Pembangunan Jembatan Perintis',
        }
        title = type_labels.get(asm_type, f"Assessment {asm_type.upper()}")
        if pm_name:
            title += f" - {pm_name}"

    if not location and isinstance(form_data, dict):
        location = form_data.get('alamatLengkap', form_data.get('alamat', 'Jawa Barat'))
        if ',' in location:
            location = location.split(',')[-1].strip()

    # Generate ID: ASM-{TYPE}-{NUM} safely without collision
    existing_ids = query_db("SELECT id FROM assessments WHERE type = ?", (asm_type,))
    max_num = len(existing_ids)
    prefix = f"ASM-{asm_type.upper()}-"
    for r in existing_ids:
        rid = str(r.get('id') or '')
        if rid.startswith(prefix):
            try:
                n = int(rid.split('-')[-1])
                if n > max_num:
                    max_num = n
            except ValueError:
                pass
    new_num = max_num + 1
    new_id = f"{prefix}{new_num:03d}"

    def to_str(val):
        if isinstance(val, list):
            return ', '.join(str(v) for v in val)
        return str(val) if val is not None else ''

    data_json_str = json.dumps(form_data, ensure_ascii=False)
    photos_json_str = json.dumps(photos, ensure_ascii=False)

    # 1. Insert into general assessments table
    execute_db("""
        INSERT INTO assessments (
            id, type, title, pm_name, category, location, province,
            status, status_note, data_json, photos_json, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id, asm_type, title, pm_name or 'Penerima Manfaat', category,
        location or 'Jawa Barat', province, status, status_note,
        data_json_str, photos_json_str, created_by
    ))

    # 2. Insert into dedicated category table according to category
    if asm_type == 'pohon':
        execute_db("""
            INSERT INTO assessment_pohon (
                id, status_kepemilikan_lahan, surat_izin_kelurahan, persetujuan_kecamatan,
                persetujuan_dinas_terkait, dukungan_rt_rw, luas_area_tanam, titik_lintang,
                titik_bujur, kondisi_topografi, jarak_antar_titik_tanam, luas_area_berpotensi_tergenang,
                jenis_tanah, ph_tanah, tingkat_kelembapan, intensitas_genangan_air, curah_hujan,
                risiko_abrasi, risiko_banjir, risiko_kebakaran_lahan, risiko_gangguan_hewan_ternak,
                risiko_vandalisme, spesies_adaptif, luas_area_efektif, kerapatan_tanam,
                jalur_akses_distribusi_bibit, penanggung_jawab_perawatan, jadwal_penyiraman,
                jadwal_pemupukan, jadwal_monitoring_perawatan, kelompok_masyarakat_sekitar,
                karang_taruna, sekolah_sekitar, relawan_lokal, alat_tanam, pupuk, ajir_bambu,
                pagar_pelindung, indikator_keberhasilan, persentase_hidup_pohon,
                jadwal_monitoring_evaluasi, status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('statusKepemilikanLahan', ''),
            form_data.get('suratIzinKelurahan', ''),
            form_data.get('persetujuanKecamatan', ''),
            form_data.get('persetujuanDinasTerkait', ''),
            form_data.get('dukunganRTRW', ''),
            form_data.get('luasAreaTanam', ''),
            form_data.get('titikLintang', ''),
            form_data.get('titikBujur', ''),
            form_data.get('kondisiTopografi', ''),
            form_data.get('jarakAntarTitikTanam', ''),
            form_data.get('luasAreaBerpotensiTergenang', ''),
            form_data.get('jenisTanah', ''),
            form_data.get('pHTanah', ''),
            form_data.get('tingkatKelembapan', ''),
            form_data.get('intensitasGenanganAir', ''),
            form_data.get('curahHujan', ''),
            form_data.get('risikoAbrasi', ''),
            form_data.get('risikoBanjir', ''),
            form_data.get('risikoKebakaranLahan', ''),
            form_data.get('risikoGangguanHewanTernak', ''),
            form_data.get('risikoVandalisme', ''),
            form_data.get('spesiesAdaptif', ''),
            form_data.get('luasAreaEfektif', ''),
            form_data.get('kerapatanTanam', ''),
            form_data.get('jalurAksesDistribusiBibit', ''),
            form_data.get('penanggungJawabPerawatan', ''),
            form_data.get('jadwalPenyiraman', ''),
            form_data.get('jadwalPemupukan', ''),
            form_data.get('jadwalMonitoringPerawatan', ''),
            form_data.get('kelompokMasyarakatSekitar', ''),
            form_data.get('karangTaruna', ''),
            form_data.get('sekolahSekitar', ''),
            form_data.get('relawanLokal', ''),
            form_data.get('alatTanam', ''),
            form_data.get('pupuk', ''),
            form_data.get('ajirBambu', ''),
            form_data.get('pagarPelindung', ''),
            form_data.get('indikatorKeberhasilan', ''),
            form_data.get('persentaseHidupPohon', ''),
            form_data.get('jadwalMonitoringEvaluasi', ''),
            status,
            status_note,
            created_by
        ))

    elif asm_type == 'umkm':
        execute_db("""
            INSERT INTO assessment_umkm (
                id, nama_lengkap, nomor_ktp, nomor_kk, nomor_hp, jenis_kelamin, usia,
                pendidikan_terakhir, status_perkawinan, jumlah_anggota_keluarga, alamat_lengkap,
                pekerjaan_utama, pekerjaan_sampingan, pendapatan_rata_rata, pengeluaran_rata_rata,
                memiliki_kendaraan, memiliki_tabungan, terdaftar_dtks, nomor_dtks, desil_berapa,
                mendapat_pkh, mendapat_bpnt, mendapat_blt, mendapat_kis, mendapat_kip, bantuan_pemerintah_lain,
                produk_utama, pendapatan_perbulan, kendala_terbesar, modal_perbulan, sumber_modal,
                memiliki_hutang_usaha, hutang_kepada, memiliki_rekening_bank, bank_apa,
                menggunakan_mobile_banking, memiliki_qris, pernah_mengajukan_kur, mencatat_pemasukan,
                mencatat_pengeluaran, memiliki_buku_kas, mengetahui_hpp, memisahkan_uang_usaha,
                memiliki_nib, memiliki_pirt, memiliki_sertifikat_halal, memiliki_merek, memiliki_kemasan,
                memiliki_label, memiliki_media_sosial, menjual_online, produk_yang_dijual,
                bentuk_penjualan, memiliki_produk_olahan, memiliki_branding, kendala_pemasaran,
                target_usaha, menjual_kemana, ada_pelanggan_tetap, pernah_ikut_bazaar,
                pernah_promosi_online, memiliki_marketplace, memiliki_wa_business, jenis_bantuan,
                nilai_bantuan, rencana_penggunaan_bantuan, dampak_diharapkan, kesediaan_pendampingan,
                sarana_produktif, harapan_program, perubahan_diharapkan, rencana_setelah_program,
                dokumentasi_foto, status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('namaLengkap') or pm_name or '-',
            form_data.get('nomorKTP', ''),
            form_data.get('nomorKK', ''),
            form_data.get('nomorHP', ''),
            form_data.get('jenisKelamin', ''),
            form_data.get('usia', ''),
            form_data.get('pendidikanTerakhir', ''),
            form_data.get('statusPerkawinan', ''),
            form_data.get('jumlahAnggotaKeluarga', ''),
            form_data.get('alamatLengkap', ''),
            form_data.get('pekerjaanUtama', ''),
            form_data.get('pekerjaanSampingan', ''),
            form_data.get('pendapatanRataRata', ''),
            form_data.get('pengeluaranRataRata', ''),
            form_data.get('memilikiKendaraan', ''),
            form_data.get('memilikiTabungan', ''),
            form_data.get('terdaftarDTKS', ''),
            form_data.get('nomorDTKS', ''),
            form_data.get('desilBerapa', ''),
            form_data.get('mendapatPKH', ''),
            form_data.get('mendapatBPNT', ''),
            form_data.get('mendapatBLT', ''),
            form_data.get('mendapatKIS', ''),
            form_data.get('mendapatKIP', ''),
            form_data.get('bantuanPemerintahLain', ''),
            form_data.get('produkUtama', ''),
            form_data.get('pendapatanPerbulan', ''),
            form_data.get('kendalaTerbesar', ''),
            form_data.get('modalPerbulan', ''),
            form_data.get('sumberModal', ''),
            form_data.get('memilikiHutangUsaha', ''),
            to_str(form_data.get('hutangKepada', '')),
            form_data.get('memilikiRekeningBank', ''),
            to_str(form_data.get('bankApa', '')),
            form_data.get('menggunakanMobileBanking', ''),
            form_data.get('memilikiQRIS', ''),
            form_data.get('pernahMengajukanKUR', ''),
            form_data.get('mencatatPemasukan', ''),
            form_data.get('mencatatPengeluaran', ''),
            form_data.get('memilikiBukuKas', ''),
            form_data.get('mengetahuiHPP', ''),
            form_data.get('memisahkanUangUsaha', ''),
            form_data.get('memilikiNIB', ''),
            form_data.get('memilikiPIRT', ''),
            form_data.get('memilikiSertifikatHalal', ''),
            form_data.get('memilikiMerek', ''),
            form_data.get('memilikiKemasan', ''),
            form_data.get('memilikiLabel', ''),
            form_data.get('memilikiMediaSosial', ''),
            form_data.get('menjualOnline', ''),
            form_data.get('produkYangDijual', ''),
            form_data.get('bentukPenjualan', ''),
            form_data.get('memilikiProdukOlahan', ''),
            form_data.get('memilikiBranding', ''),
            form_data.get('kendalaPemasaran', ''),
            form_data.get('targetUsaha', ''),
            to_str(form_data.get('menjualKemana', '')),
            form_data.get('adaPelangganTetap', ''),
            form_data.get('pernahIkutBazaar', ''),
            form_data.get('pernahPromosiOnline', ''),
            form_data.get('memilikiMarketplace', ''),
            form_data.get('memilikiWABusiness', ''),
            to_str(form_data.get('jenisBantuan', '')),
            form_data.get('nilaiBantuan', ''),
            form_data.get('rencanaPenggunaanBantuan', ''),
            form_data.get('dampakDiharapkan', ''),
            form_data.get('kesediaanPendampingan', ''),
            to_str(form_data.get('saranaProduktif', '')),
            form_data.get('harapanProgram', ''),
            form_data.get('perubahanDiharapkan', ''),
            form_data.get('rencanaSetelahProgram', ''),
            photos_json_str,
            status,
            status_note,
            created_by
        ))

    elif asm_type == 'petani':
        execute_db("""
            INSERT INTO assessment_petani (
                id, nama_lengkap, nomor_ktp, nomor_kk, nomor_hp, jenis_kelamin, usia,
                pendidikan_terakhir, status_perkawinan, jumlah_anggota_keluarga, alamat_lengkap,
                nama_kelompok_tani, pekerjaan_utama, pekerjaan_sampingan, pendapatan_rata_rata,
                pengeluaran_rata_rata, memiliki_lahan, luas_lahan, status_lahan, komoditas_utama,
                lama_bertani, memiliki_ternak, memiliki_tabungan, terdaftar_dtks, nomor_dtks,
                desil_berapa, mendapat_pkh, mendapat_bpnt, mendapat_blt, mendapat_kis, mendapat_kip,
                bantuan_pemerintah_lain, produktivitas_panen, frekuensi_panen, pendapatan_perpanen,
                kendala_terbesar, modal_per_musim, sumber_modal, memiliki_hutang_usaha, hutang_kepada,
                memiliki_rekening_bank, bank_apa, menggunakan_mobile_banking, memiliki_qris,
                pernah_mengajukan_kur, mencatat_pemasukan, mencatat_pengeluaran, memiliki_buku_kas,
                mengetahui_hpp, memisahkan_uang_usaha, memiliki_nib, memiliki_pirt,
                memiliki_sertifikat_halal, memiliki_merek, memiliki_kemasan, memiliki_label,
                memiliki_media_sosial, menjual_online, produk_yang_dijual, bentuk_penjualan,
                memiliki_produk_olahan, memiliki_branding, kendala_pemasaran, target_usaha,
                menjual_kemana, ada_pelanggan_tetap, pernah_ikut_bazaar, pernah_promosi_online,
                memiliki_marketplace, memiliki_wa_business, jenis_bantuan, nilai_bantuan,
                rencana_penggunaan_bantuan, dampak_diharapkan, kesediaan_pendampingan, sarana_produktif,
                harapan_program, perubahan_diharapkan, rencana_setelah_program, dokumentasi_foto,
                status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('namaLengkap') or pm_name or '-',
            form_data.get('nomorKTP', ''),
            form_data.get('nomorKK', ''),
            form_data.get('nomorHP', ''),
            form_data.get('jenisKelamin', ''),
            form_data.get('usia', ''),
            form_data.get('pendidikanTerakhir', ''),
            form_data.get('statusPerkawinan', ''),
            form_data.get('jumlahAnggotaKeluarga', ''),
            form_data.get('alamatLengkap', ''),
            form_data.get('namaKelompokTani', ''),
            form_data.get('pekerjaanUtama', ''),
            form_data.get('pekerjaanSampingan', ''),
            form_data.get('pendapatanRataRata', ''),
            form_data.get('pengeluaranRataRata', ''),
            form_data.get('memilikiLahan', ''),
            form_data.get('luasLahan', ''),
            form_data.get('statusLahan', ''),
            form_data.get('komoditasUtama', ''),
            form_data.get('lamaBertani', ''),
            form_data.get('memilikiTernak', ''),
            form_data.get('memilikiTabungan', ''),
            form_data.get('terdaftarDTKS', ''),
            form_data.get('nomorDTKS', ''),
            form_data.get('desilBerapa', ''),
            form_data.get('mendapatPKH', ''),
            form_data.get('mendapatBPNT', ''),
            form_data.get('mendapatBLT', ''),
            form_data.get('mendapatKIS', ''),
            form_data.get('mendapatKIP', ''),
            form_data.get('bantuanPemerintahLain', ''),
            form_data.get('produktivitasPanen', ''),
            form_data.get('frekuensiPanen', ''),
            form_data.get('pendapatanPerpanen', ''),
            form_data.get('kendalaTerbesar', ''),
            form_data.get('modalPerMusim', ''),
            form_data.get('sumberModal', ''),
            form_data.get('memilikiHutangUsaha', ''),
            to_str(form_data.get('hutangKepada', '')),
            form_data.get('memilikiRekeningBank', ''),
            to_str(form_data.get('bankApa', '')),
            form_data.get('menggunakanMobileBanking', ''),
            form_data.get('memilikiQRIS', ''),
            form_data.get('pernahMengajukanKUR', ''),
            form_data.get('mencatatPemasukan', ''),
            form_data.get('mencatatPengeluaran', ''),
            form_data.get('memilikiBukuKas', ''),
            form_data.get('mengetahuiHPP', ''),
            form_data.get('memisahkanUangUsaha', ''),
            form_data.get('memilikiNIB', ''),
            form_data.get('memilikiPIRT', ''),
            form_data.get('memilikiSertifikatHalal', ''),
            form_data.get('memilikiMerek', ''),
            form_data.get('memilikiKemasan', ''),
            form_data.get('memilikiLabel', ''),
            form_data.get('memilikiMediaSosial', ''),
            form_data.get('menjualOnline', ''),
            form_data.get('produkYangDijual', ''),
            form_data.get('bentukPenjualan', ''),
            form_data.get('memilikiProdukOlahan', ''),
            form_data.get('memilikiBranding', ''),
            form_data.get('kendalaPemasaran', ''),
            form_data.get('targetUsaha', ''),
            to_str(form_data.get('menjualKemana', '')),
            form_data.get('adaPelangganTetap', ''),
            form_data.get('pernahIkutBazaar', ''),
            form_data.get('pernahPromosiOnline', ''),
            form_data.get('memilikiMarketplace', ''),
            form_data.get('memilikiWABusiness', ''),
            to_str(form_data.get('jenisBantuan', '')),
            form_data.get('nilaiBantuan', ''),
            form_data.get('rencanaPenggunaanBantuan', ''),
            form_data.get('dampakDiharapkan', ''),
            form_data.get('kesediaanPendampingan', ''),
            to_str(form_data.get('saranaProduktif', '')),
            form_data.get('harapanProgram', ''),
            form_data.get('perubahanDiharapkan', ''),
            form_data.get('rencanaSetelahProgram', ''),
            photos_json_str,
            status,
            status_note,
            created_by
        ))
    elif asm_type == 'jembatan':
        execute_db("""
            INSERT INTO assessment_jembatan (
                id, nama_jembatan, lokasi, tanggal_kejadian, penyebab_kerusakan,
                material_jembatan, material_lainnya, fungsi_jembatan, tingkat_kerusakan,
                deskripsi_kerusakan, panjang, lebar, tinggi, jumlah_penduduk,
                wilayah_terisolasi, fungsi_terganggu, fungsi_lainnya, alternatif_jalur,
                keterangan_alternatif, sumber_daya, estimasi_biaya, nama_pj, nomor_kontak,
                email_pj, foto_jembatan, video_lokasi, foto_sekitar, foto_risiko,
                status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('namaJembatan', title),
            form_data.get('lokasi', location),
            form_data.get('tanggalKejadian', ''),
            form_data.get('penyebabKerusakan', ''),
            form_data.get('materialJembatan', ''),
            form_data.get('materialLainnya', ''),
            to_str(form_data.get('fungsiJembatan', '')),
            form_data.get('tingkatKerusakan', ''),
            form_data.get('deskripsiKerusakan', ''),
            form_data.get('panjang', ''),
            form_data.get('lebar', ''),
            form_data.get('tinggi', ''),
            form_data.get('jumlahPenduduk', ''),
            form_data.get('wilayahTerisolasi', ''),
            to_str(form_data.get('fungsiTerganggu', '')),
            form_data.get('fungsiLainnya', ''),
            form_data.get('alternatifJalur', ''),
            form_data.get('keteranganAlternatif', ''),
            to_str(form_data.get('sumberDaya', '')),
            form_data.get('estimasiBiaya', ''),
            form_data.get('namaPJ', ''),
            form_data.get('nomorKontak', ''),
            form_data.get('emailPJ', ''),
            photos_json_str,
            '',
            '',
            '',
            status,
            status_note,
            created_by
        ))
    elif asm_type == 'masjid':
        execute_db("""
            INSERT INTO assessment_masjid (
                id, nama_masjid, alamat, tanggal_kejadian, penyebab_kerusakan,
                penyebab_lainnya, jamaah_harian, jamaah_jumat, ukuran_masjid,
                kondisi_dinding, kondisi_atap, kondisi_lantai, mimbar_imam,
                karpet_sajadah, soundsystem, jumlah_mck, kondisi_mck,
                fasilitas_sanitasi, jumlah_keran, kondisi_keran, saluran_air,
                tangki_air, status_ibadah, hambatan_utama, hambatan_lainnya,
                fasilitas_dibutuhkan, fasilitas_lainnya, estimasi_biaya,
                prioritas_mendesak, nama_pj, nomor_kontak, email_pj,
                foto_masjid, foto_mck, foto_sekitar, foto_tambahan,
                status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('namaMasjid', title),
            form_data.get('alamat', location),
            form_data.get('tanggalKejadian', ''),
            form_data.get('penyebabKerusakan', ''),
            form_data.get('penyebabLainnya', ''),
            form_data.get('jamaahHarian', ''),
            form_data.get('jamaahJumat', ''),
            form_data.get('ukuranMasjid', ''),
            form_data.get('kondisiDinding', ''),
            form_data.get('kondisiAtap', ''),
            form_data.get('kondisiLantai', ''),
            form_data.get('mimbarImam', ''),
            form_data.get('karpetSajadah', ''),
            form_data.get('soundsystem', ''),
            form_data.get('jumlahMCK', ''),
            form_data.get('kondisiMCK', ''),
            form_data.get('fasilitasSanitasi', ''),
            form_data.get('jumlahKeran', ''),
            form_data.get('kondisiKeran', ''),
            form_data.get('saluranAir', ''),
            form_data.get('tangkiAir', ''),
            form_data.get('statusIbadah', ''),
            form_data.get('hambatanUtama', ''),
            form_data.get('hambatanLainnya', ''),
            form_data.get('fasilitasDibutuhkan', ''),
            form_data.get('fasilitasLainnya', ''),
            form_data.get('estimasiBiaya', ''),
            form_data.get('prioritasMendesak', ''),
            form_data.get('namaPJ', ''),
            form_data.get('nomorKontak', ''),
            form_data.get('emailPJ', ''),
            photos_json_str,
            '',
            '',
            '',
            status,
            status_note,
            created_by
        ))
    elif asm_type == 'sekolah':
        execute_db("""
            INSERT INTO assessment_sekolah (
                id, nama_sekolah, alamat, tingkat_sekolah, tingkat_lainnya,
                jumlah_siswa, jumlah_guru, tanggal_kejadian, penyebab_kerusakan,
                penyebab_lainnya, jumlah_kelas_rusak, ukuran_kelas, luas_bangunan,
                kondisi_ruang_guru, toilet_sanitasi, sumber_air_bersih, meja_kursi_rusak,
                papan_tulis_rusak, buku_tersedia, perpustakaan, laboratorium,
                area_bermain, status_kbm, hambatan_utama, hambatan_lainnya,
                fasilitas_darurat, fasilitas_lainnya, logistik_siswa, logistik_lainnya,
                estimasi_biaya, nama_pj, nomor_kontak, email_pj,
                foto_bangunan, foto_penunjang, foto_lingkungan, foto_hambatan,
                status, status_note, created_by
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            new_id,
            form_data.get('namaSekolah', title),
            form_data.get('alamat', location),
            form_data.get('tingkatSekolah', ''),
            form_data.get('tingkatLainnya', ''),
            form_data.get('jumlahSiswa', ''),
            form_data.get('jumlahGuru', ''),
            form_data.get('tanggalKejadian', ''),
            form_data.get('penyebabKerusakan', ''),
            form_data.get('penyebabLainnya', ''),
            form_data.get('jumlahKelasRusak', ''),
            form_data.get('ukuranKelas', ''),
            form_data.get('luasBangunan', ''),
            form_data.get('kondisiRuangGuru', ''),
            form_data.get('toiletSanitasi', ''),
            form_data.get('sumberAirBersih', ''),
            form_data.get('mejaKursiRusak', ''),
            form_data.get('papanTulisRusak', ''),
            form_data.get('bukuTersedia', ''),
            form_data.get('perpustakaan', ''),
            form_data.get('laboratorium', ''),
            form_data.get('areaBermain', ''),
            form_data.get('statusKBM', ''),
            form_data.get('hambatanUtama', ''),
            form_data.get('hambatanLainnya', ''),
            to_str(form_data.get('fasilitasDarurat', '')),
            form_data.get('fasilitasLainnya', ''),
            to_str(form_data.get('logistikSiswa', '')),
            form_data.get('logistikLainnya', ''),
            form_data.get('estimasiBiaya', ''),
            form_data.get('namaPJ', ''),
            form_data.get('nomorKontak', ''),
            form_data.get('emailPJ', ''),
            photos_json_str,
            '',
            '',
            '',
            status,
            status_note,
            created_by
        ))

    # Add audit activity
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (f'Assessment {asm_type.upper()} baru: {new_id}', f'{title} • PM: {pm_name or "-"}', 'Baru saja', 'checkCircle'))

    created = query_one("SELECT * FROM assessments WHERE id = ?", (new_id,))
    res_dict = dict(created)
    res_dict['data'] = form_data
    res_dict['photos'] = photos

    return jsonify({
        'message': f'Assessment ({new_id}) berhasil disimpan ke tabel database kategori {asm_type.upper()}!',
        'assessment': res_dict
    }), 201

@bp.route('/<asm_id>', methods=['PUT'])
def update_assessment(asm_id):
    """Update assessment data or status."""
    body = request.get_json() or {}
    existing = query_one("SELECT * FROM assessments WHERE id = ?", (asm_id,))
    if not existing:
        return jsonify({'error': 'Assessment tidak ditemukan.'}), 404

    status = body.get('status', existing['status'])
    status_note = body.get('statusNote', existing['status_note'])
    form_data = body.get('data')
    photos = body.get('photos')

    data_json_str = json.dumps(form_data, ensure_ascii=False) if form_data is not None else existing['data_json']
    photos_json_str = json.dumps(photos, ensure_ascii=False) if photos is not None else existing['photos_json']

    execute_db("""
        UPDATE assessments
        SET status = ?, status_note = ?, data_json = ?, photos_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (status, status_note, data_json_str, photos_json_str, asm_id))

    updated = query_one("SELECT * FROM assessments WHERE id = ?", (asm_id,))
    return jsonify({
        'message': f'Assessment {asm_id} berhasil diperbarui.',
        'assessment': updated
    }), 200

@bp.route('/<asm_id>', methods=['DELETE'])
def delete_assessment(asm_id):
    """Delete an assessment from both general and category tables."""
    existing = query_one("SELECT type FROM assessments WHERE id = ?", (asm_id,))
    res = execute_db("DELETE FROM assessments WHERE id = ?", (asm_id,))
    if existing and existing.get('type') in ('pohon', 'umkm', 'petani', 'jembatan', 'masjid', 'sekolah'):
        cat_table = f"assessment_{existing['type']}"
        try:
            execute_db(f"DELETE FROM {cat_table} WHERE id = ?", (asm_id,))
        except Exception:
            pass
    if res['row_count'] == 0:
        return jsonify({'error': 'Assessment tidak ditemukan.'}), 404
    return jsonify({'message': f'Assessment {asm_id} berhasil dihapus.'}), 200
