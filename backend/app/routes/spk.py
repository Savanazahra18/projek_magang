from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
from datetime import datetime

bp = Blueprint('spk', __name__, url_prefix='/api/spk')

def _enrich_spk(item):
    """Enrich SPK record with both camelCase and snake_case properties for compatibility."""
    if not item:
        return item
    item['first_party'] = item.get('assignor_name') or item.get('first_party') or 'Divisi Program Relawan Nusantara'
    item['second_party'] = item.get('assignee_name') or item.get('second_party') or ''
    item['second_party_role'] = item.get('assignee_role') or item.get('second_party_role') or 'Mitra Pelaksana Lapangan'
    item['contact_number'] = item.get('assignee_contact') or item.get('contact_number') or ''
    
    # Numeric budget for calculations and formatted string
    raw_b = str(item.get('budget_amount') or item.get('budget') or 0)
    digits = ''.join(c for c in raw_b if c.isdigit())
    budget_int = int(digits) if digits else 0
    item['budget'] = budget_int
    item['budget_raw'] = raw_b
    item['budget_formatted'] = f"Rp {budget_int:,}".replace(',', '.') if budget_int else raw_b
    item['budget_amount'] = item.get('budget_amount') or item['budget_formatted']
    
    # Ensure no legacy 'Menunggu TTD' status
    if item.get('status') == 'Menunggu TTD':
        item['status'] = 'Dalam pelaksanaan'
        item['status_note'] = 'Pekerjaan berjalan'
    return item

@bp.route('', methods=['GET'])
def list_spk():
    """List SPK records with filter, search, and KPI counts."""
    status_filter = request.args.get('status', 'Semua').strip()
    category_filter = request.args.get('category', 'Semua').strip()
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT * FROM spks WHERE 1=1"
    params = []

    if status_filter not in ('Semua', 'Semua status'):
        sql += " AND LOWER(status) = LOWER(?)"
        params.append(status_filter)

    if category_filter not in ('Semua', 'Semua kategori'):
        sql += " AND LOWER(category) = LOWER(?)"
        params.append(category_filter)

    if search_query:
        sql += """ AND (
            LOWER(id) LIKE ? OR
            LOWER(spk_number) LIKE ? OR
            LOWER(program_name) LIKE ? OR
            LOWER(assignee_name) LIKE ? OR
            LOWER(assignor_name) LIKE ? OR
            LOWER(location) LIKE ? OR
            LOWER(category) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p, p, p])

    sql += " ORDER BY id DESC"
    items = query_db(sql, params)

    # Ensure no legacy 'Menunggu TTD' status
    execute_db("UPDATE spks SET status = 'Dalam pelaksanaan', status_note = 'Pekerjaan berjalan' WHERE status = 'Menunggu TTD'")

    items = [_enrich_spk(it) for it in items]

    # Counts
    all_items = query_db("SELECT status FROM spks")
    total_count = len(all_items)
    dalam_pelaksanaan = sum(1 for x in all_items if x.get('status') == 'Dalam pelaksanaan')
    selesai = sum(1 for x in all_items if x.get('status') == 'Selesai')

    return jsonify({
        'spks': items,
        'data': items,
        'counts': {
            'total': total_count,
            'dalamPelaksanaan': dalam_pelaksanaan,
            'selesai': selesai
        },
        'total_filtered': len(items)
    }), 200

@bp.route('/<spk_id>', methods=['GET'])
def get_spk_detail(spk_id):
    """Get single SPK detail."""
    item = query_one("SELECT * FROM spks WHERE id = ?", (spk_id,))
    if not item:
        return jsonify({'error': f'Dokumen SPK {spk_id} tidak ditemukan.'}), 404
    enriched = _enrich_spk(item)
    return jsonify({'spk': enriched, 'data': enriched}), 200

@bp.route('', methods=['POST'])
def create_spk():
    """Create a new SPK document."""
    data = request.get_json() or {}
    program_name = (data.get('program_name') or data.get('programName') or '').strip()
    category = (data.get('category') or 'Umum').strip()
    assignor_name = (data.get('first_party') or data.get('assignorName') or 'Divisi Program Relawan Nusantara').strip()
    assignee_name = (data.get('second_party') or data.get('assigneeName') or '').strip()
    assignee_role = (data.get('second_party_role') or data.get('assigneeRole') or 'Pelaksana Lapangan').strip()
    assignee_contact = (data.get('contact_number') or data.get('assigneeContact') or '').strip()
    location = (data.get('location') or 'Kab. Bandung').strip()
    province = (data.get('province') or 'Jawa Barat').strip()

    # Handle budget (number, raw string with Rp, or digits)
    raw_budget = data.get('budget_raw') if data.get('budget_raw') is not None else (data.get('budget') if data.get('budget') is not None else data.get('budgetAmount'))
    if isinstance(raw_budget, (int, float)):
        budget_amount = f"Rp {int(raw_budget):,}".replace(',', '.')
    else:
        raw_str = str(raw_budget or 'Rp 0').strip()
        digits = ''.join(c for c in raw_str if c.isdigit())
        budget_amount = f"Rp {int(digits):,}".replace(',', '.') if digits else 'Rp 0'

    start_date = (data.get('start_date') or data.get('startDate') or '').strip()
    end_date = (data.get('end_date') or data.get('endDate') or '').strip()
    scope_of_work = (data.get('scope_of_work') or data.get('scopeOfWork') or '').strip()
    payment_terms = (data.get('payment_terms') or data.get('paymentTerms') or 'Termin 1 (50%), Termin 2 (40%), Termin 3 (10%)').strip()
    target_output = (data.get('target_output') or data.get('targetOutput') or '').strip()
    notes = (data.get('notes') or '').strip()
    file_type = (data.get('file_type') or data.get('fileType') or 'PDF').strip()
    file_size = (data.get('file_size') or data.get('fileSize') or '2.8 MB').strip()
    file_name = (data.get('file_name') or data.get('fileName') or '').strip() or None
    file_url = (data.get('file_url') or data.get('fileUrl') or '').strip() or None
    status = (data.get('status') or 'Dalam pelaksanaan').strip()
    if status == 'Menunggu TTD':
        status = 'Dalam pelaksanaan'

    if not program_name:
        return jsonify({'error': 'Nama program wajib diisi.'}), 400
    if not assignee_name:
        return jsonify({'error': 'Nama pelaksana / penerima tugas wajib diisi.'}), 400

    # Auto generate ID & Nomor SPK
    existing_ids = query_db("SELECT id FROM spks")
    max_num = 0
    for r in existing_ids:
        rid = str(r.get('id', ''))
        if '-' in rid:
            suffix = rid.rsplit('-', 1)[-1]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    new_num = max(max_num, len(existing_ids)) + 1
    new_id = f"SPK-2026-{new_num:03d}"

    today = datetime.now()
    roman_months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    cur_roman = roman_months[today.month - 1]
    spk_number = f"SPK/RN-PRG/{cur_roman}/{today.year}/{new_num:03d}"

    status_note = 'Dokumen SPK baru diterbitkan'
    action_text = 'Lihat detail'

    execute_db("""
        INSERT INTO spks (
            id, spk_number, program_name, category, assignor_name,
            assignee_name, assignee_role, assignee_contact, location, province,
            budget_amount, start_date, end_date, scope_of_work, payment_terms,
            target_output, notes, file_type, file_size, file_name, file_url, status, status_note, action_text
        ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    """, (
        new_id, spk_number, program_name, category, assignor_name,
        assignee_name, assignee_role, assignee_contact, location, province,
        budget_amount, start_date, end_date, scope_of_work, payment_terms,
        target_output, notes, file_type, file_size, file_name, file_url, status, status_note, action_text
    ))

    # Audit log to dashboard_activities
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f'SPK Diterbitkan: {program_name} ({new_id})',
        f'Pelaksana: {assignee_name} • Anggaran: {budget_amount}',
        'Baru saja',
        'checkCircle'
    ))

    created = query_one("SELECT * FROM spks WHERE id = ?", (new_id,))
    enriched = _enrich_spk(created)
    return jsonify({
        'message': f'Dokumen {new_id} ({spk_number}) berhasil dibuat dan disimpan!',
        'spk': enriched,
        'data': enriched
    }), 201

@bp.route('/<spk_id>/status', methods=['PUT'])
def update_spk_status(spk_id):
    """Update SPK status."""
    data = request.get_json() or {}
    new_status = data.get('status', '').strip()
    status_note = data.get('statusNote', '').strip()

    if not new_status:
        return jsonify({'error': 'Status baru wajib diisi.'}), 400

    execute_db("""
        UPDATE spks
        SET status = ?, status_note = COALESCE(?, status_note), updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (new_status, status_note if status_note else None, spk_id))

    updated = query_one("SELECT * FROM spks WHERE id = ?", (spk_id,))
    enriched = _enrich_spk(updated)
    return jsonify({
        'message': f'Status SPK {spk_id} berhasil diperbarui menjadi {new_status}.',
        'spk': enriched,
        'data': enriched
    }), 200

@bp.route('/<spk_id>', methods=['DELETE'])
def delete_spk(spk_id):
    """Delete an SPK record."""
    res = execute_db("DELETE FROM spks WHERE id = ?", (spk_id,))
    if res['row_count'] == 0:
        return jsonify({'error': 'Dokumen SPK tidak ditemukan.'}), 404
    return jsonify({'message': f'Dokumen SPK {spk_id} berhasil dihapus.'}), 200
