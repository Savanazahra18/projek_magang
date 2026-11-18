from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
import json
from datetime import datetime

bp = Blueprint('monev', __name__, url_prefix='/api/monev')

MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
MONTHS_FULL = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]


def _safe_json_list(val):
    if not val:
        return []
    if isinstance(val, list):
        return val
    try:
        parsed = json.loads(val)
        return parsed if isinstance(parsed, list) else []
    except Exception:
        return []


def _format_iso_short(iso_str):
    if not iso_str:
        return '-'
    try:
        dt = datetime.strptime(str(iso_str)[:10], '%Y-%m-%d')
        return f"{dt.day:02d} {MONTHS_SHORT[dt.month - 1]} {dt.year}"
    except Exception:
        return str(iso_str)


def _serialize_monev(row):
    if not row:
        return None
    indicators = _safe_json_list(row.get('indicators_json'))
    issues = _safe_json_list(row.get('issues_json'))
    docs = _safe_json_list(row.get('docs_json'))
    photos = _safe_json_list(row.get('photos_json'))

    return {
        'id': row.get('id'),
        'title': row.get('title', ''),
        'miproId': row.get('mipro_id') or '-',
        'mipro_id': row.get('mipro_id') or '-',
        'assessmentId': row.get('assessment_id') or '-',
        'assessment_id': row.get('assessment_id') or '-',
        'requestId': row.get('request_id') or '-',
        'request_id': row.get('request_id') or '-',
        'location': row.get('location', ''),
        'visitDate': row.get('visit_date', ''),
        'visit_date': row.get('visit_date', ''),
        'visitDateFull': row.get('visit_date_full') or row.get('visit_date', ''),
        'visit_date_full': row.get('visit_date_full') or row.get('visit_date', ''),
        'nextVisit': row.get('next_visit') or '-',
        'next_visit': row.get('next_visit') or '-',
        'nextVisitIso': row.get('next_visit_iso') or '',
        'next_visit_iso': row.get('next_visit_iso') or '',
        'officer': row.get('officer', 'Tim Program'),
        'progress': int(row.get('progress') or 0),
        'status': row.get('status', 'Sesuai rencana'),
        'notes': row.get('notes') or '',
        'indicators': indicators,
        'issues': issues,
        'docs': docs,
        'photos': photos,
        'created_at': str(row.get('created_at', '')),
        'updated_at': str(row.get('updated_at', '')),
    }


@bp.route('', methods=['GET'])
def list_monev():
    """List all Monitoring & Evaluasi (Monev) records with filters and KPI counts."""
    status_filter = request.args.get('status', 'Semua').strip()
    officer_filter = request.args.get('officer', 'Semua').strip()
    period_filter = request.args.get('period', 'Semua').strip()
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT * FROM monevs WHERE 1=1"
    params = []

    if status_filter and status_filter != 'Semua':
        sql += " AND status = ?"
        params.append(status_filter)

    if officer_filter and officer_filter != 'Semua':
        sql += " AND officer = ?"
        params.append(officer_filter)

    if period_filter and period_filter != 'Semua':
        if 'oktober' in period_filter.lower():
            sql += " AND (LOWER(visit_date) LIKE ? OR LOWER(visit_date_full) LIKE ?)"
            params.extend(['%okt%', '%oktober%'])
        elif 'november' in period_filter.lower():
            sql += " AND (LOWER(next_visit) LIKE ? OR LOWER(visit_date) LIKE ?)"
            params.extend(['%nov%', '%nov%'])

    if search_query:
        sql += """ AND (
            LOWER(id) LIKE ? OR
            LOWER(title) LIKE ? OR
            LOWER(mipro_id) LIKE ? OR
            LOWER(location) LIKE ? OR
            LOWER(officer) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p])

    sql += " ORDER BY id DESC"
    rows = query_db(sql, params)
    items = [_serialize_monev(r) for r in rows]

    all_rows = query_db("SELECT id, status FROM monevs")
    counts = {
        'total': len(all_rows),
        'sesuaiRencana': sum(1 for r in all_rows if r.get('status') == 'Sesuai rencana'),
        'terjadwal': sum(1 for r in all_rows if r.get('status') == 'Terjadwal'),
        'perluTindakLanjut': sum(1 for r in all_rows if r.get('status') == 'Perlu tindak lanjut'),
    }

    return jsonify({
        'monevs': items,
        'data': items,
        'counts': counts,
        'total_filtered': len(items),
    }), 200


@bp.route('/<monev_id>', methods=['GET'])
def get_monev_detail(monev_id):
    """Get a single Monev record by ID."""
    row = query_one("SELECT * FROM monevs WHERE id = ?", (monev_id,))
    if not row:
        return jsonify({'error': f'Data Monev {monev_id} tidak ditemukan.'}), 404
    return jsonify({'monev': _serialize_monev(row)}), 200


@bp.route('', methods=['POST'])
def create_monev():
    """Create a new Monitoring & Evaluasi record."""
    data = request.get_json() or {}

    title = (data.get('title') or '').strip()
    if not title:
        return jsonify({'error': 'Judul program monitoring wajib diisi!'}), 400

    mipro_id = (data.get('miproId') or data.get('mipro_id') or '-').strip()
    assessment_id = (data.get('assessmentId') or data.get('assessment_id') or '-').strip()
    request_id = (data.get('requestId') or data.get('request_id') or '-').strip()
    location = (data.get('location') or 'Jawa Barat').strip()
    officer = (data.get('officer') or 'Tim Program').strip()
    status = (data.get('status') or 'Sesuai rencana').strip()
    notes = (data.get('notes') or '').strip()

    now = datetime.now()
    default_visit_short = f"{now.day:02d} {MONTHS_SHORT[now.month - 1]} {now.year}"
    default_visit_full = f"{now.day:02d} {MONTHS_FULL[now.month - 1]} {now.year}"

    visit_date = (data.get('visitDate') or data.get('visit_date') or default_visit_short).strip()
    visit_date_full = (data.get('visitDateFull') or data.get('visit_date_full') or default_visit_full).strip()
    next_visit_iso = (data.get('nextVisitIso') or data.get('next_visit_iso') or '').strip()
    next_visit = (data.get('nextVisit') or data.get('next_visit') or _format_iso_short(next_visit_iso)).strip()

    indicators = data.get('indicators')
    if not isinstance(indicators, list) or len(indicators) == 0:
        indicators = [
            {
                'component': 'Realisasi kegiatan utama lapangan',
                'plan': '100%',
                'actual': int(data.get('progress') or 50),
                'note': 'Berjalan sesuai jadwal',
            }
        ]

    issues = data.get('issues') if isinstance(data.get('issues'), list) else []
    docs = data.get('docs') if isinstance(data.get('docs'), list) else []
    photos = data.get('photos') if isinstance(data.get('photos'), list) else []

    if 'progress' in data and data.get('progress') is not None:
        progress = int(data.get('progress') or 0)
    else:
        progress = round(
            sum(int(ind.get('actual') or 0) for ind in indicators) / max(1, len(indicators))
        )

    all_rows = query_db("SELECT id FROM monevs")
    max_num = 0
    for r in all_rows:
        rid = str(r.get('id') or '')
        if rid.startswith('MON-2026-'):
            try:
                num = int(rid.split('-')[-1])
                if num > max_num:
                    max_num = num
            except ValueError:
                pass
    new_num = max(len(all_rows), max_num) + 1
    new_id = (data.get('id') or '').strip() or f"MON-2026-{new_num:03d}"

    execute_db("""
        INSERT INTO monevs (
            id, title, mipro_id, assessment_id, request_id,
            location, visit_date, visit_date_full, next_visit, next_visit_iso,
            officer, progress, status, notes,
            indicators_json, issues_json, docs_json, photos_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        new_id, title, mipro_id, assessment_id, request_id,
        location, visit_date, visit_date_full, next_visit, next_visit_iso,
        officer, progress, status, notes,
        json.dumps(indicators, ensure_ascii=False),
        json.dumps(issues, ensure_ascii=False),
        json.dumps(docs, ensure_ascii=False),
        json.dumps(photos, ensure_ascii=False),
    ))

    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f"Monitoring lapangan {title} dicatat",
        f"{officer} • {new_id} ({location})",
        "Baru saja",
        "checkCircle"
    ))

    created = query_one("SELECT * FROM monevs WHERE id = ?", (new_id,))
    return jsonify({
        'message': f'Data monitoring {new_id} berhasil disimpan ke database.',
        'monev': _serialize_monev(created),
    }), 201


@bp.route('/<monev_id>', methods=['PUT'])
def update_monev(monev_id):
    """Update an existing Monitoring & Evaluasi record (indicators, issues, docs, notes, status, etc.)."""
    existing = query_one("SELECT * FROM monevs WHERE id = ?", (monev_id,))
    if not existing:
        return jsonify({'error': f'Data Monev {monev_id} tidak ditemukan.'}), 404

    data = request.get_json() or {}

    title = data.get('title', existing.get('title'))
    mipro_id = data.get('miproId', data.get('mipro_id', existing.get('mipro_id')))
    assessment_id = data.get('assessmentId', data.get('assessment_id', existing.get('assessment_id')))
    request_id = data.get('requestId', data.get('request_id', existing.get('request_id')))
    location = data.get('location', existing.get('location'))
    visit_date = data.get('visitDate', data.get('visit_date', existing.get('visit_date')))
    visit_date_full = data.get('visitDateFull', data.get('visit_date_full', existing.get('visit_date_full')))
    next_visit_iso = data.get('nextVisitIso', data.get('next_visit_iso', existing.get('next_visit_iso')))
    next_visit = data.get('nextVisit', data.get('next_visit'))
    if not next_visit:
        next_visit = _format_iso_short(next_visit_iso) if next_visit_iso else existing.get('next_visit')

    officer = data.get('officer', existing.get('officer'))
    notes = data.get('notes', existing.get('notes'))

    indicators = data.get('indicators')
    if not isinstance(indicators, list):
        indicators = _safe_json_list(existing.get('indicators_json'))

    issues = data.get('issues')
    if not isinstance(issues, list):
        issues = _safe_json_list(existing.get('issues_json'))

    docs = data.get('docs')
    if not isinstance(docs, list):
        docs = _safe_json_list(existing.get('docs_json'))

    photos = data.get('photos')
    if not isinstance(photos, list):
        photos = _safe_json_list(existing.get('photos_json'))

    if 'progress' in data and data.get('progress') is not None:
        progress = int(data.get('progress') or 0)
    elif indicators:
        progress = round(
            sum(int(ind.get('actual') or 0) for ind in indicators) / max(1, len(indicators))
        )
    else:
        progress = int(existing.get('progress') or 0)

    if 'status' in data and data.get('status'):
        status = data.get('status')
    else:
        has_open_issue = any(iss.get('status') == 'Perlu Tindak Lanjut' for iss in issues)
        status = 'Perlu tindak lanjut' if has_open_issue else 'Sesuai rencana'

    execute_db("""
        UPDATE monevs
        SET title = ?,
            mipro_id = ?,
            assessment_id = ?,
            request_id = ?,
            location = ?,
            visit_date = ?,
            visit_date_full = ?,
            next_visit = ?,
            next_visit_iso = ?,
            officer = ?,
            progress = ?,
            status = ?,
            notes = ?,
            indicators_json = ?,
            issues_json = ?,
            docs_json = ?,
            photos_json = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (
        title, mipro_id, assessment_id, request_id,
        location, visit_date, visit_date_full, next_visit, next_visit_iso,
        officer, progress, status, notes,
        json.dumps(indicators, ensure_ascii=False),
        json.dumps(issues, ensure_ascii=False),
        json.dumps(docs, ensure_ascii=False),
        json.dumps(photos, ensure_ascii=False),
        monev_id,
    ))

    updated = query_one("SELECT * FROM monevs WHERE id = ?", (monev_id,))
    return jsonify({
        'message': f'Perubahan monitoring {monev_id} berhasil disimpan.',
        'monev': _serialize_monev(updated),
    }), 200


@bp.route('/<monev_id>', methods=['DELETE'])
def delete_monev(monev_id):
    """Delete a Monitoring & Evaluasi record."""
    existing = query_one("SELECT * FROM monevs WHERE id = ?", (monev_id,))
    if not existing:
        return jsonify({'error': f'Data Monev {monev_id} tidak ditemukan.'}), 404

    execute_db("DELETE FROM monevs WHERE id = ?", (monev_id,))
    return jsonify({'message': f'Data Monev {monev_id} berhasil dihapus.'}), 200

