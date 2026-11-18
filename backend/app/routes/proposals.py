from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
from datetime import datetime

bp = Blueprint('proposals', __name__, url_prefix='/api/proposals')

@bp.route('', methods=['GET'])
def list_proposals():
    """List proposals with filters and search query."""
    status_filter = request.args.get('status', 'Semua')
    category_filter = request.args.get('category', 'Semua program')
    location_filter = request.args.get('location', 'Semua lokasi')
    search_query = request.args.get('q', '').strip().lower()

    # Base query
    sql = "SELECT * FROM proposals WHERE 1=1"
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
            LOWER(category) LIKE ? OR
            LOWER(location) LIKE ? OR
            LOWER(province) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p])

    sql += " ORDER BY id DESC"
    proposals = query_db(sql, params)

    # Compute KPI counts
    all_proposals = query_db("SELECT status FROM proposals")
    counts = {
        'total': len(all_proposals),
        'dalamTinjauan': sum(1 for p in all_proposals if p['status'] == 'Dalam tinjauan'),
        'perluRevisi': sum(1 for p in all_proposals if p['status'] == 'Perlu revisi'),
        'disetujui': sum(1 for p in all_proposals if p['status'] == 'Disetujui'),
    }

    return jsonify({
        'proposals': proposals,
        'counts': counts,
        'total_filtered': len(proposals)
    }), 200

@bp.route('/<proposal_id>', methods=['GET'])
def get_proposal_detail(proposal_id):
    """Get single proposal by ID."""
    proposal = query_one("SELECT * FROM proposals WHERE id = ?", (proposal_id,))
    if not proposal:
        return jsonify({'error': f'Proposal dengan ID {proposal_id} tidak ditemukan.'}), 404
    return jsonify({'proposal': proposal}), 200

@bp.route('', methods=['POST'])
def create_proposal():
    """Submit a new proposal."""
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    category = data.get('category', 'Pendidikan')
    location = data.get('location', 'Kab. Bandung')
    province = data.get('province', 'Jawa Barat')
    file_type = data.get('fileType') or data.get('file_type') or 'PDF'
    file_size = data.get('fileSize') or data.get('file_size') or '2,4 MB'
    file_name = data.get('fileName') or data.get('file_name') or None
    file_url = data.get('fileUrl') or data.get('file_url') or None
    
    if not title:
        return jsonify({'error': 'Judul proposal wajib diisi.'}), 400

    # Auto-generate ID: PR-2026-XXX
    existing_ids = query_db("SELECT id FROM proposals")
    max_num = 0
    for r in existing_ids:
        rid = str(r.get('id', ''))
        if '-' in rid:
            suffix = rid.rsplit('-', 1)[-1]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))
    new_num = max(max_num, len(existing_ids)) + 1
    new_id = f"PR-2026-{new_num:03d}"

    # Current date formatted
    today = datetime.now()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    date_formatted = f"{today.day} {months[today.month - 1]} {today.year}"

    status = 'Dalam tinjauan'
    status_note = 'Menunggu peninjauan'
    action_text = 'Lihat detail'

    execute_db("""
        INSERT INTO proposals (
            id, title, category, location, province, date,
            file_type, file_size, file_name, file_url, status, status_note, action_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id, title, category, location, province, date_formatted,
        file_type, file_size, file_name, file_url, status, status_note, action_text
    ))

    # Add audit activity
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (f'Proposal baru diajukan: {title}', f'ID: {new_id} • Menunggu review', 'Baru saja', 'file'))

    created = query_one("SELECT * FROM proposals WHERE id = ?", (new_id,))
    return jsonify({
        'message': f'Proposal "{title}" ({new_id}) berhasil diajukan!',
        'proposal': created
    }), 201

@bp.route('/<proposal_id>/status', methods=['PUT'])
def update_proposal_status(proposal_id):
    """Update review status, notes, or attached file."""
    data = request.get_json() or {}
    existing = query_one("SELECT * FROM proposals WHERE id = ?", (proposal_id,))
    if not existing:
        return jsonify({'error': 'Proposal tidak ditemukan.'}), 404

    new_status = data.get('status') or existing['status']
    status_note = data.get('statusNote')
    file_url = data.get('fileUrl') or data.get('file_url') or existing.get('file_url')
    file_name = data.get('fileName') or data.get('file_name') or existing.get('file_name')
    file_type = data.get('fileType') or data.get('file_type') or existing.get('file_type')
    file_size = data.get('fileSize') or data.get('file_size') or existing.get('file_size')

    if new_status not in ['Dalam tinjauan', 'Perlu revisi', 'Disetujui']:
        return jsonify({'error': 'Status tidak valid.'}), 400

    action_text = 'Lihat catatan' if new_status == 'Perlu revisi' else 'Lihat detail'
    note = (status_note.strip() if status_note is not None else '') or existing.get('status_note') or ('Peninjauan selesai' if new_status == 'Disetujui' else 'Menunggu peninjauan')

    execute_db("""
        UPDATE proposals
        SET status = ?, status_note = ?, action_text = ?,
            file_url = ?, file_name = ?, file_type = ?, file_size = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (new_status, note, action_text, file_url, file_name, file_type, file_size, proposal_id))

    updated = query_one("SELECT * FROM proposals WHERE id = ?", (proposal_id,))
    return jsonify({
        'message': f'Status proposal {proposal_id} berhasil diperbarui menjadi "{new_status}".',
        'proposal': updated
    }), 200

@bp.route('/<proposal_id>', methods=['DELETE'])
def delete_proposal(proposal_id):
    """Delete a proposal."""
    res = execute_db("DELETE FROM proposals WHERE id = ?", (proposal_id,))
    if res['row_count'] == 0:
        return jsonify({'error': 'Proposal tidak ditemukan.'}), 404
    return jsonify({'message': f'Proposal {proposal_id} berhasil dihapus.'}), 200

