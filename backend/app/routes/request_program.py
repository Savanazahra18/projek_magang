from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db

bp = Blueprint('request_program', __name__, url_prefix='/api/request-program')

def _enrich_request(r):
    if not r:
        return r
    # Provide alias keys for frontend table compatibility
    r['title'] = r.get('program_name') or r.get('title') or ''
    r['requester'] = r.get('applicant_name') or r.get('requester') or ''
    r['type'] = r.get('category') or r.get('type') or 'Permohonan Bantuan'
    r['beneficiary'] = r.get('estimated_budget') or r.get('beneficiary') or 'Penerima Manfaat'
    r['pic'] = r.get('applicant_name') or r.get('pic') or 'Tim Program'
    if not r.get('priority'):
        r['priority'] = 'Sedang'
    if not r.get('status') or r.get('status') == 'Dalam antrean':
        r['status'] = 'Diproses'
    return r

@bp.route('', methods=['GET'])
def list_request_programs():
    """List program requests."""
    rows = query_db("SELECT * FROM request_programs ORDER BY id DESC")
    enriched = [_enrich_request(dict(r)) for r in rows]
    return jsonify({
        'requests': enriched,
        'data': enriched,
        'total': len(enriched)
    }), 200

@bp.route('', methods=['POST'])
def create_request_program():
    """Submit a new program request."""
    data = request.get_json() or {}
    program_name = (data.get('programName') or data.get('program_name') or data.get('title') or '').strip()
    category = (data.get('category') or data.get('type') or 'Pendidikan').strip()
    applicant_name = (data.get('applicantName') or data.get('applicant_name') or data.get('requester') or '').strip()
    applicant_phone = (data.get('applicantPhone') or data.get('applicant_phone') or '').strip()
    applicant_email = (data.get('applicantEmail') or data.get('applicant_email') or '').strip()
    location = (data.get('location') or 'Jawa Barat').strip()
    estimated_budget = str(data.get('estimatedBudget') or data.get('estimated_budget') or data.get('beneficiary') or 'Rp 0').strip()
    description = (data.get('description') or '').strip()
    status = (data.get('status') or 'Baru').strip()

    if not program_name or not applicant_name:
        return jsonify({'error': 'Nama program dan nama pemohon wajib diisi.'}), 400

    count_row = query_one("SELECT COUNT(*) as c FROM request_programs")
    new_id = f"REQ-2026-{(count_row['c'] + 1):03d}"

    execute_db("""
        INSERT INTO request_programs (
            id, program_name, category, applicant_name, applicant_phone,
            applicant_email, location, estimated_budget, description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id, program_name, category, applicant_name, applicant_phone,
        applicant_email, location, estimated_budget, description, status
    ))

    # Audit log
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f'Request Program Baru: {program_name} ({new_id})',
        f'Pengaju: {applicant_name} • Lokasi: {location}',
        'Baru saja',
        'file'
    ))

    created = query_one("SELECT * FROM request_programs WHERE id = ?", (new_id,))
    enriched = _enrich_request(dict(created))
    return jsonify({
        'message': f'Pengajuan program "{program_name}" ({new_id}) berhasil diajukan!',
        'request': enriched,
        'data': enriched
    }), 201
