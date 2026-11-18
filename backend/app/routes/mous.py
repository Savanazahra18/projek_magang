from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
from datetime import datetime

bp = Blueprint('mous', __name__, url_prefix='/api/mous')

@bp.route('', methods=['GET'])
def list_mous():
    """List MOUs with filters, search, and KPI counts."""
    status_filter = request.args.get('status', 'Semua')
    category_filter = request.args.get('category', 'Semua program')
    location_filter = request.args.get('location', 'Semua lokasi')
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT * FROM mous WHERE 1=1"
    params = []

    if status_filter != 'Semua':
        sql += " AND status = ?"
        params.append(status_filter)

    if category_filter != 'Semua program':
        sql += " AND category = ?"
        params.append(category_filter)

    if location_filter != 'Semua lokasi':
        sql += " AND (location LIKE ? OR province LIKE ?)"
        params.extend([f"%{location_filter}%", f"%{location_filter}%"])

    if search_query:
        sql += """ AND (
            LOWER(id) LIKE ? OR
            LOWER(title) LIKE ? OR
            LOWER(partner) LIKE ? OR
            LOWER(category) LIKE ? OR
            LOWER(location) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p])

    sql += " ORDER BY id DESC"
    mous = query_db(sql, params)

    # Compute KPI counts
    all_mous = query_db("SELECT status FROM mous")
    counts = {
        'total': len(all_mous),
        'dalamTinjauan': sum(1 for m in all_mous if m['status'] == 'Dalam tinjauan'),
        'perluRevisi': sum(1 for m in all_mous if m['status'] == 'Perlu revisi'),
        'disetujui': sum(1 for m in all_mous if m['status'] == 'Disetujui'),
    }

    return jsonify({
        'mous': mous,
        'counts': counts,
        'total_filtered': len(mous)
    }), 200

@bp.route('/<mou_id>', methods=['GET'])
def get_mou_detail(mou_id):
    """Get single MOU detail."""
    mou = query_one("SELECT * FROM mous WHERE id = ?", (mou_id,))
    if not mou:
        return jsonify({'error': f'MOU dengan ID {mou_id} tidak ditemukan.'}), 404
    return jsonify({'mou': mou}), 200

@bp.route('', methods=['POST'])
def create_mou():
    """Submit or draft a new MOU."""
    data = request.get_json() or {}
    as_draft = data.get('asDraft', False)
    
    title = data.get('title', '').strip()
    partner = data.get('partner', '').strip()
    partner_signer = data.get('partnerSigner', '-')
    partner_phone = data.get('partnerPhone', '-')
    partner_email = data.get('partnerEmail', '-')
    category = data.get('category', 'Pendidikan')
    location = data.get('location', 'Kab. Bandung')
    province = data.get('province', 'Jawa Barat')
    period = data.get('period', '1 Tahun (Terhitung TTD)')
    commitment_value = data.get('commitmentValue', 'Rp 0')
    file_type = data.get('fileType', 'PDF')
    file_size = data.get('fileSize', '1,8 MB')
    file_name = data.get('fileName') or data.get('file_name') or None
    file_url = data.get('fileUrl') or data.get('file_url') or None
    scope = data.get('scope', 'Kerja sama kemitraan pelaksanaan program Relawan Nusantara.')

    if not as_draft and (not title or not partner):
        return jsonify({'error': 'Judul kesepahaman dan nama mitra wajib diisi!'}), 400

    # Auto-generate ID: MOU-2026-XXX
    existing_ids = query_db("SELECT id FROM mous")
    max_num = 0
    for r in existing_ids:
        rid = str(r.get('id', ''))
        if '-' in rid:
            suffix = rid.rsplit('-', 1)[-1]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    new_num = max(max_num, len(existing_ids)) + 1
    new_id = data.get('id', '').strip() or f"MOU-2026-{new_num:03d}"

    today = datetime.now()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    date_formatted = f"{today.day} {months[today.month - 1]} {today.year}"

    status = 'Perlu revisi' if as_draft else 'Dalam tinjauan'
    status_note = (
        'Draf disimpan, lengkapi klausul dan lampiran'
        if as_draft
        else 'Menunggu peninjauan legal & tanda tangan mitra'
    )
    action_text = 'Lihat catatan' if as_draft else 'Lihat detail'

    execute_db("""
        INSERT INTO mous (
            id, title, partner, partner_signer, partner_phone, partner_email,
            category, location, province, date, period, commitment_value,
            file_type, file_size, file_name, file_url, status, status_note, action_text, scope
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id, title or 'Draf Kesepahaman Bersama', partner or 'Mitra Belum Ditentukan',
        partner_signer, partner_phone, partner_email, category, location, province,
        date_formatted, period, commitment_value, file_type, file_size, file_name, file_url,
        status, status_note, action_text, scope
    ))

    # Add audit activity
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (f'Dokumen MOU baru: {title or new_id}', f'Mitra: {partner} • Status: {status}', 'Baru saja', 'file'))

    created = query_one("SELECT * FROM mous WHERE id = ?", (new_id,))
    return jsonify({
        'message': f'Dokumen MOU {new_id} berhasil disimpan.',
        'mou': created
    }), 201

@bp.route('/<mou_id>/status', methods=['PUT'])
def update_mou_status(mou_id):
    """Update review status & notes for MOU."""
    data = request.get_json() or {}
    new_status = data.get('status')
    status_note = data.get('statusNote', '')

    if new_status not in ['Dalam tinjauan', 'Perlu revisi', 'Disetujui']:
        return jsonify({'error': 'Status tidak valid.'}), 400

    action_text = 'Lihat catatan' if new_status == 'Perlu revisi' else 'Lihat detail'
    note = status_note.strip() or ('MoU sah & aktif berjalan' if new_status == 'Disetujui' else 'Menunggu peninjauan')

    res = execute_db("""
        UPDATE mous
        SET status = ?, status_note = ?, action_text = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (new_status, note, action_text, mou_id))

    if res['row_count'] == 0:
        return jsonify({'error': 'MOU tidak ditemukan.'}), 404

    updated = query_one("SELECT * FROM mous WHERE id = ?", (mou_id,))
    return jsonify({
        'message': f'Status MOU {mou_id} berhasil diperbarui menjadi "{new_status}".',
        'mou': updated
    }), 200

@bp.route('/<mou_id>', methods=['DELETE'])
def delete_mou(mou_id):
    """Delete an MOU document."""
    res = execute_db("DELETE FROM mous WHERE id = ?", (mou_id,))
    if res['row_count'] == 0:
        return jsonify({'error': 'MOU tidak ditemukan.'}), 404
    return jsonify({'message': f'MOU {mou_id} berhasil dihapus.'}), 200

