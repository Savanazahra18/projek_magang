from flask import Blueprint, jsonify
from app.db import query_db, query_one

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/summary', methods=['GET'])
def get_summary():
    """Get dashboard summary metrics dynamically from live PostgreSQL tables."""
    asm_count = (query_one("SELECT COUNT(*) as c FROM assessments") or {}).get('c', 0)
    prop_count = (query_one("SELECT COUNT(*) as c FROM proposals") or {}).get('c', 0)
    mipro_count = (query_one("SELECT COUNT(*) as c FROM mipros") or {}).get('c', 0)
    dss_count = (query_one("SELECT COUNT(*) as c FROM dss_evaluations") or {}).get('c', 0)
    spk_count = (query_one("SELECT COUNT(*) as c FROM spks") or {}).get('c', 0)
    req_count = (query_one("SELECT COUNT(*) as c FROM request_programs") or {}).get('c', 0)

    # Active status queries
    prop_review = (query_one("SELECT COUNT(*) as c FROM proposals WHERE status = 'Dalam tinjauan'") or {}).get('c', 0)
    dss_review = (query_one("SELECT COUNT(*) as c FROM dss_evaluations WHERE status = 'Dalam telaah'") or {}).get('c', 0)
    spk_active = (query_one("SELECT COUNT(*) as c FROM spks WHERE status = 'Dalam pelaksanaan'") or {}).get('c', 0)

    summaries = [
        {
            'title': 'Total Assesment',
            'value': asm_count,
            'unit': 'Assesment',
            'note': f"+{asm_count} data tersimpan",
            'emoji': '🧑‍💼'
        },
        {
            'title': 'Total Proposal',
            'value': prop_count,
            'unit': 'Proposal',
            'note': f"{prop_review} proposal sedang diajukan",
            'emoji': '📝'
        },
        {
            'title': 'Total MIPro',
            'value': mipro_count,
            'unit': 'Memo Internal Project',
            'note': f"{mipro_count} proyek terdata",
            'emoji': '📂'
        },
        {
            'title': 'Total DSS',
            'value': dss_count,
            'unit': 'Decision Support System',
            'note': f"{dss_review} menunggu telaah",
            'emoji': '🧮'
        },
        {
            'title': 'Total SPK',
            'value': spk_count,
            'unit': 'Surat Perintah Kerja',
            'note': f"{spk_active} dalam pelaksanaan",
            'emoji': '🛠️'
        },
        {
            'title': 'Request Program',
            'value': req_count,
            'unit': 'Permohonan Masuk',
            'note': f"{req_count} antrean permohonan",
            'emoji': '📥'
        },
        {
            'title': 'Laporan & CA',
            'value': 0,
            'unit': 'Cash Advance & Realisasi',
            'note': '0 laporan berkala',
            'emoji': '📱'
        },
        {
            'title': 'Laporan Final',
            'value': 0,
            'unit': 'Dokumentasi Akhir',
            'note': '0 laporan akhir',
            'emoji': '📄'
        },
    ]

    return jsonify({'summaries': summaries}), 200

@bp.route('/programs', methods=['GET'])
def get_programs():
    """Get active programs list for dashboard."""
    # Pull dynamic list combining active proposals & SPKs if available
    proposals = query_db("SELECT id, title, category, location, status FROM proposals ORDER BY id DESC LIMIT 5")
    spks = query_db("SELECT id, program_name, category, location, status FROM spks ORDER BY id DESC LIMIT 5")
    
    programs = []
    for p in proposals:
        programs.append({
            'id': p.get('id'),
            'name': p.get('title'),
            'location': p.get('location', 'Jawa Barat'),
            'category': p.get('category', 'Umum'),
            'stage': 'Proposal',
            'progress': 30 if p.get('status') == 'Dalam tinjauan' else (100 if p.get('status') == 'Disetujui' else 20),
            'due': '10 Nov 2026',
            'status': 'Review' if p.get('status') == 'Dalam tinjauan' else ('Selesai' if p.get('status') == 'Disetujui' else 'Perlu revisi'),
            'group': 'pengajuan' if p.get('status') == 'Dalam tinjauan' else 'berjalan'
        })
    for s in spks:
        programs.append({
            'id': s.get('id'),
            'name': s.get('program_name'),
            'location': s.get('location', 'Jawa Barat'),
            'category': s.get('category', 'Umum'),
            'stage': 'SPK / Pelaksanaan',
            'progress': 75 if s.get('status') == 'Dalam pelaksanaan' else 100,
            'due': '30 Nov 2026',
            'status': 'Berjalan' if s.get('status') == 'Dalam pelaksanaan' else 'Selesai',
            'group': 'berjalan' if s.get('status') == 'Dalam pelaksanaan' else 'selesai'
        })
    
    return jsonify({'programs': programs}), 200

@bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Get pending tasks."""
    tasks = query_db("SELECT * FROM dashboard_tasks ORDER BY urgent DESC, id ASC")
    return jsonify({'tasks': tasks}), 200

@bp.route('/activities', methods=['GET'])
def get_activities():
    """Get audit activities."""
    activities = query_db("SELECT * FROM dashboard_activities ORDER BY id DESC LIMIT 10")
    formatted = []
    for a in activities:
        formatted.append({
            'id': a.get('id'),
            'title': a.get('title'),
            'meta': a.get('meta'),
            'time': a.get('time_ago', 'Baru saja'),
            'icon': a.get('icon', 'checkCircle')
        })
    return jsonify({'activities': formatted}), 200
