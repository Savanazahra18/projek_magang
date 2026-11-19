from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
from datetime import datetime

bp = Blueprint('dss', __name__, url_prefix='/api/dss')

@bp.route('', methods=['GET'])
def list_dss():
    """List DSS RAB evaluations with filters and search query."""
    status_filter = request.args.get('status', 'Semua').strip()
    category_filter = request.args.get('category', 'Semua').strip()
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT * FROM dss_evaluations WHERE 1=1"
    params = []

    # Status filter
    if status_filter not in ('Semua', 'Semua (14)'):
        if 'telaah' in status_filter.lower():
            sql += " AND LOWER(status) LIKE ?"
            params.append('%telaah%')
        elif 'revisi' in status_filter.lower():
            sql += " AND LOWER(status) LIKE ?"
            params.append('%revisi%')
        elif 'setuju' in status_filter.lower():
            sql += " AND LOWER(status) LIKE ?"
            params.append('%setuju%')
        else:
            sql += " AND status = ?"
            params.append(status_filter)

    if category_filter not in ('Semua', 'Semua kategori program', 'Semua program'):
        sql += " AND (category = ? OR division = ?)"
        params.extend([category_filter, category_filter])

    if search_query:
        sql += """ AND (
            LOWER(id) LIKE ? OR
            LOWER(title) LIKE ? OR
            LOWER(category) LIKE ? OR
            LOWER(division) LIKE ? OR
            LOWER(location) LIKE ? OR
            LOWER(province) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p, p])

    sql += " ORDER BY id DESC"
    items = query_db(sql, params)

    # Compute KPI counts & amounts
    all_items = query_db("SELECT id, status, estimated_budget FROM dss_evaluations")
    
    def parse_nominal(budget_str):
        if not budget_str:
            return 0
        s = ''.join(c for c in str(budget_str) if c.isdigit())
        return int(s) if s else 0

    def format_nominal_short(amount):
        if not amount or amount <= 0:
            return 'Rp 0'
        if amount >= 1_000_000_000:
            val = f"{amount / 1_000_000_000:.1f}".replace('.', ',')
            return f"Rp {val} M"
        if amount >= 1_000_000:
            val = f"{amount / 1_000_000:.1f}".replace('.', ',')
            return f"Rp {val} Jt"
        return f"Rp {amount:,}".replace(',', '.')

    total_count = len(all_items)
    dalam_telaah = [p for p in all_items if 'telaah' in (p.get('status') or '').lower()]
    perlu_revisi = [p for p in all_items if 'revisi' in (p.get('status') or '').lower()]
    disetujui = [p for p in all_items if 'setuju' in (p.get('status') or '').lower()]

    total_sum = sum(parse_nominal(p.get('estimated_budget')) for p in all_items)
    telaah_sum = sum(parse_nominal(p.get('estimated_budget')) for p in dalam_telaah)
    revisi_sum = sum(parse_nominal(p.get('estimated_budget')) for p in perlu_revisi)
    setuju_sum = sum(parse_nominal(p.get('estimated_budget')) for p in disetujui)

    counts = {
        'total': total_count,
        'totalAmount': format_nominal_short(total_sum),
        'dalamTelaah': len(dalam_telaah),
        'dalamTelaahAmount': format_nominal_short(telaah_sum),
        'perluRevisi': len(perlu_revisi),
        'perluRevisiAmount': format_nominal_short(revisi_sum),
        'disetujui': len(disetujui),
        'disetujuiAmount': format_nominal_short(setuju_sum),
    }

    return jsonify({
        'evaluations': items,
        'data': items,
        'counts': counts,
        'total_filtered': len(items)
    }), 200

@bp.route('/<dss_id>', methods=['GET'])
def get_dss_detail(dss_id):
    """Get single DSS evaluation detail."""
    item = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (dss_id,))
    if not item:
        return jsonify({'error': f'Pengajuan RAB {dss_id} tidak ditemukan.'}), 404
    return jsonify({'evaluation': item}), 200

@bp.route('', methods=['POST'])
def create_dss():
    """Submit a new RAB application for DSS analysis."""
    data = request.get_json() or {}
    program_id = (data.get('program_id') or data.get('programId') or '').strip()
    title = data.get('title', '').strip()
    estimated_budget = str(data.get('estimated_budget') or data.get('estimatedBudget') or 'Rp 0').strip()
    notes = (data.get('notes') or data.get('evaluationNotes') or data.get('evaluation_notes') or '').strip()
    category = (data.get('category') or 'Divisi Program').strip()
    location = (data.get('location') or 'Kab. Bandung').strip()
    province = (data.get('province') or 'Jawa Barat').strip()
    file_name = (data.get('file_name') or data.get('fileName') or 'RAB_Pengajuan.xlsx').strip()
    file_size = (data.get('file_size') or data.get('fileSize') or '2.5 MB').strip()
    file_type = (data.get('file_type') or data.get('fileType') or '').strip()
    file_url = (data.get('file_url') or data.get('fileUrl') or '').strip() or None

    if not file_type:
        ext = file_name.rsplit('.', 1)[1].upper() if '.' in file_name else 'Excel/PDF'
        file_type = ext

    if not program_id and not title:
        return jsonify({'error': 'Program terkait wajib dipilih.'}), 400

    if not title:
        if ' - ' in program_id:
            parts = program_id.split(' - ', 1)
            title = f"RAB {parts[1].strip()}"
        elif '-' in program_id:
            parts = program_id.split('-', 1)
            title = f"RAB {parts[1].strip()}"
        else:
            title = f"RAB {program_id}"

    # Auto generate ID: RAB-2026-0XX
    existing_ids = query_db("SELECT id FROM dss_evaluations")
    max_num = 0
    for r in existing_ids:
        rid = str(r.get('id', ''))
        if '-' in rid:
            suffix = rid.rsplit('-', 1)[-1]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    new_num = max(max_num, len(existing_ids)) + 1
    new_id = f"RAB-2026-{new_num:03d}"

    # Date formatted
    today = datetime.now()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    date_formatted = f"{today.day:02d} {months[today.month - 1]} {today.year}"

    execute_db("""
        INSERT INTO dss_evaluations (
            id, program_id, title, category, division, location, province,
            estimated_budget, beneficiaries, status, status_note, action_text,
            file_type, file_size, file_name, file_url, date, evaluation_notes, recommendation, final_score
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?
        )
    """, (
        new_id, program_id, title, category, category, location, province,
        estimated_budget, '100 Jiwa', 'Dalam telaah', 'Menunggu peninjauan', 'Lihat detail',
        file_type, file_size, file_name, file_url, date_formatted, notes, 'Dalam telaah', 80.0
    ))

    # Audit log to dashboard_activities
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f'Pengajuan RAB Baru: {title} ({new_id})',
        f'Nominal: {estimated_budget} • Menunggu telaah komite',
        'Baru saja',
        'calc'
    ))

    created = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (new_id,))
    return jsonify({
        'message': f'Pengajuan RAB ({new_id}) berhasil dikirim untuk diproses oleh sistem DSS!',
        'evaluation': created
    }), 201

@bp.route('/<dss_id>/status', methods=['PUT'])
def update_dss_status(dss_id):
    """Update status or reviewer notes for a RAB submission."""
    data = request.get_json() or {}
    status = data.get('status')
    notes = data.get('evaluationNotes') or data.get('notes') or data.get('recommendationAction')

    existing = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (dss_id,))
    if not existing:
        return jsonify({'error': 'Data RAB tidak ditemukan.'}), 404

    new_status = status or existing['status']
    new_notes = notes if notes is not None else existing.get('evaluation_notes')
    file_url = data.get('fileUrl') or data.get('file_url') or existing.get('file_url')
    file_name = data.get('fileName') or data.get('file_name') or existing.get('file_name')
    file_type = data.get('fileType') or data.get('file_type') or existing.get('file_type')
    file_size = data.get('fileSize') or data.get('file_size') or existing.get('file_size')
    
    if new_status == 'Disetujui':
        status_note = 'Telaah selesai disahkan'
        action_text = 'Lihat detail'
    elif new_status == 'Perlu revisi':
        status_note = 'Catatan reviewer tersedia'
        action_text = 'Lihat catatan'
    else:
        status_note = 'Menunggu peninjauan'
        action_text = 'Tinjau RAB'

    execute_db("""
        UPDATE dss_evaluations
        SET status = ?, status_note = ?, action_text = ?, evaluation_notes = ?,
            file_url = ?, file_name = ?, file_type = ?, file_size = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (new_status, status_note, action_text, new_notes, file_url, file_name, file_type, file_size, dss_id))

    # Log activity for approval/revision
    title = existing.get('title', dss_id)
    budget = existing.get('estimated_budget', '')
    if new_status == 'Disetujui':
        execute_db("""
            INSERT INTO dashboard_activities (title, meta, time_ago, icon)
            VALUES (?, ?, ?, ?)
        """, (f'RAB {dss_id} disetujui Direktur Utama', f'{title} ({budget}) siap tahap SPK', 'Baru saja', 'checkCircle'))
    elif new_status == 'Perlu revisi':
        execute_db("""
            INSERT INTO dashboard_activities (title, meta, time_ago, icon)
            VALUES (?, ?, ?, ?)
        """, (f'RAB {dss_id} perlu revisi anggaran', f'Catatan: {new_notes[:60]}...' if new_notes else f'{title} dikembalikan', 'Baru saja', 'fileEdit'))

    updated = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (dss_id,))
    return jsonify({
        'message': f'Status RAB {dss_id} berhasil diperbarui.',
        'evaluation': updated
    }), 200

@bp.route('/<dss_id>/disbursement', methods=['POST', 'PUT'])
def update_dss_disbursement(dss_id):
    """Update disbursement status, proof of transfer, and bank details for DSS/RAB."""
    data = request.get_json() or {}
    disbursement_status = data.get('disbursement_status') or data.get('status') or 'Dicairkan'
    disbursed_amount = data.get('disbursed_amount') or data.get('disbursedAmount')
    termin = data.get('termin')
    source_bank = data.get('source_bank') or data.get('sourceBank')
    recipient_bank = data.get('recipient_bank') or data.get('recipientBank')
    transfer_ref = data.get('transfer_ref') or data.get('transferRef')
    transfer_date = data.get('transfer_date') or data.get('transferDate')
    transfer_proof_file = data.get('transfer_proof_file') or data.get('transferProofFile') or data.get('file')
    disbursement_notes = data.get('disbursement_notes') or data.get('notes')

    existing = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (dss_id,))
    if not existing:
        return jsonify({'error': f'Data RAB {dss_id} tidak ditemukan.'}), 404

    execute_db("""
        UPDATE dss_evaluations
        SET disbursement_status = ?,
            disbursed_amount = ?,
            termin = ?,
            source_bank = ?,
            recipient_bank = ?,
            transfer_ref = ?,
            transfer_date = ?,
            transfer_proof_file = ?,
            disbursement_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        disbursement_status,
        disbursed_amount or existing.get('estimated_budget'),
        termin or 'Pencairan Penuh (100%)',
        source_bank,
        recipient_bank,
        transfer_ref,
        transfer_date,
        transfer_proof_file,
        disbursement_notes,
        dss_id
    ))

    # Audit log to dashboard_activities
    title = existing.get('title', dss_id)
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f'Pencairan Anggaran {dss_id}: {disbursement_status}',
        f'{title} • {disbursed_amount or existing.get("estimated_budget")} via {source_bank or "Bank"}',
        'Baru saja',
        'checkCircle' if disbursement_status == 'Dicairkan' else 'clock'
    ))

    updated = query_one("SELECT * FROM dss_evaluations WHERE id = ?", (dss_id,))
    return jsonify({
        'message': f'Pencairan dana untuk RAB {dss_id} berhasil dicatat di database.',
        'evaluation': updated
    }), 200

@bp.route('/<dss_id>', methods=['DELETE'])
def delete_dss(dss_id):
    """Delete a DSS evaluation."""
    res = execute_db("DELETE FROM dss_evaluations WHERE id = ?", (dss_id,))
    if res['row_count'] == 0:
        return jsonify({'error': 'Data DSS tidak ditemukan.'}), 404
    return jsonify({'message': f'Pengajuan RAB {dss_id} berhasil dihapus.'}), 200
