from flask import Blueprint, request, jsonify
from app.db import query_db, query_one, execute_db
from datetime import datetime
import json

bp = Blueprint('mipro', __name__, url_prefix='/api/mipro')

def _enrich_mipro(item):
    """Parse campaigns_data JSON if present."""
    if not item:
        return item
    raw_campaigns = item.get('campaigns_data')
    if raw_campaigns and isinstance(raw_campaigns, str):
        try:
            item['campaigns'] = json.loads(raw_campaigns)
        except Exception:
            item['campaigns'] = []
    elif isinstance(raw_campaigns, list):
        item['campaigns'] = raw_campaigns
    else:
        item['campaigns'] = []
    return item

@bp.route('', methods=['GET'])
def list_mipro():
    """List MIPro records with search and type filter."""
    type_filter = request.args.get('type', 'Semua').strip()
    search_query = request.args.get('q', '').strip().lower()

    sql = "SELECT * FROM mipros WHERE 1=1"
    params = []

    if type_filter not in ('Semua', 'Semua tipe'):
        sql += " AND (type = ? OR subtype = ?)"
        params.extend([type_filter, type_filter])

    if search_query:
        sql += """ AND (
            LOWER(id) LIKE ? OR
            LOWER(title) LIKE ? OR
            LOWER(type) LIKE ? OR
            LOWER(subtype) LIKE ? OR
            LOWER(type_label) LIKE ? OR
            LOWER(COALESCE(partner_name, '')) LIKE ? OR
            LOWER(COALESCE(campaign_id, '')) LIKE ? OR
            LOWER(COALESCE(campaigns_data, '')) LIKE ? OR
            LOWER(category) LIKE ?
        )"""
        p = f"%{search_query}%"
        params.extend([p, p, p, p, p, p, p, p, p])

    sql += " ORDER BY id DESC"
    items = query_db(sql, params)
    items = [_enrich_mipro(it) for it in items]

    # Counts
    all_items = query_db("SELECT type FROM mipros")
    total_count = len(all_items)
    m1 = sum(1 for x in all_items if x.get('type') == 'MIPro 1')
    m2 = sum(1 for x in all_items if x.get('type') == 'MIPro 2')
    m3 = sum(1 for x in all_items if x.get('type') == 'MIPro 3')

    return jsonify({
        'mipros': items,
        'data': items,
        'counts': {
            'total': total_count,
            'mipro1': m1,
            'mipro2': m2,
            'mipro3': m3
        },
        'total_filtered': len(items)
    }), 200

@bp.route('/<mipro_id>', methods=['GET'])
def get_mipro_detail(mipro_id):
    """Get single MIPro detail."""
    item = query_one("SELECT * FROM mipros WHERE id = ?", (mipro_id,))
    if not item:
        return jsonify({'error': f'Data MIPro {mipro_id} tidak ditemukan.'}), 404
    return jsonify({'mipro': _enrich_mipro(item)}), 200

@bp.route('', methods=['POST'])
def create_mipro():
    """Create a new MIPro (MIPro 1 Kemitraan, MIPro 2 Aspirasi, or MIPro 3 Campaign)."""
    data = request.get_json() or {}
    subtype = (data.get('subtype') or 'Kemitraan').strip() # 'Kemitraan', 'Aspirasi', 'Campaign'
    title = (data.get('title') or '').strip()
    partner_name = (data.get('partner_name') or data.get('partnerName') or '').strip() if subtype == 'Kemitraan' else None
    campaign_id = (data.get('campaign_id') or data.get('campaignId') or '').strip() if subtype == 'Campaign' else None
    category = (data.get('category') or ('Sosial' if subtype == 'Campaign' else 'Umum')).strip()
    location = (data.get('location') or ('Nasional' if subtype == 'Campaign' else 'Kab. Bandung')).strip()
    province = (data.get('province') or ('Indonesia' if subtype == 'Campaign' else 'Jawa Barat')).strip()
    period = (data.get('period') or '').strip()
    disbursement_amount = str(data.get('disbursement_amount') or data.get('disbursementAmount') or 'Rp 0').strip()
    beneficiaries = (data.get('beneficiaries') or ('500 Jiwa' if subtype == 'Campaign' else '100 Jiwa')).strip()
    desired_output = (data.get('desired_output') or data.get('desiredOutput') or '').strip()
    description = (data.get('description') or desired_output or '').strip()
    campaigns_list = data.get('campaigns') or []
    campaigns_data_str = None

    # Multi-Campaign Logic
    if subtype == 'Campaign' and campaigns_list:
        campaigns_data_str = json.dumps(campaigns_list, ensure_ascii=False)
        first_c = campaigns_list[0]
        
        # Auto-compute title if not manually filled
        if not title:
            first_name = first_c.get('campaignName', '').strip() or 'Campaign Baru'
            if len(campaigns_list) > 1:
                title = f"{first_name} (+{len(campaigns_list) - 1} campaign)"
            else:
                title = first_name

        # IDs
        all_ids = [str(c.get('campaignId', '')).strip() for c in campaigns_list if str(c.get('campaignId', '')).strip()]
        if not campaign_id and all_ids:
            campaign_id = ', '.join(all_ids)

        # Period
        if not period:
            period = first_c.get('donationPeriod', '').strip()

        # Total DSS sum
        total_dss_num = 0
        for c in campaigns_list:
            amt_str = str(c.get('totalDss', '0'))
            digits = ''.join(ch for ch in amt_str if ch.isdigit())
            if digits:
                total_dss_num += int(digits)
        if total_dss_num > 0:
            disbursement_amount = f"Rp {total_dss_num:,}".replace(',', '.')

        # Description & Program
        if not description:
            description = first_c.get('keterangan', '').strip()
        if not desired_output:
            desired_output = first_c.get('program', '').strip()

    if not title:
        return jsonify({'error': 'Nama Program / Campaign wajib diisi.'}), 400

    if subtype == 'Kemitraan':
        mipro_type = 'MIPro 1'
        type_label = 'Program dengan mitra'
    elif subtype == 'Aspirasi':
        mipro_type = 'MIPro 2'
        type_label = 'Program tanpa mitra'
    else: # Campaign
        mipro_type = 'MIPro 3'
        num_c = len(campaigns_list) if campaigns_list else 1
        if num_c > 1:
            type_label = f"Campaign ({num_c} campaign) • ID {campaign_id}" if campaign_id else f"Campaign ({num_c} campaign)"
        else:
            type_label = f"Campaign • ID {campaign_id}" if campaign_id else 'Campaign'

    # Auto generate ID: MIPRO-2026-XXX
    count_row = query_one("SELECT COUNT(*) as c FROM mipros")
    new_num = (count_row['c'] if count_row else 0) + 1
    new_id = f"MIPRO-2026-{new_num:03d}"

    # Current date formatted (e.g. 05 Nov 2026)
    today = datetime.now()
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    date_formatted = f"{today.day:02d} {months[today.month - 1]} {today.year}"

    execute_db("""
        INSERT INTO mipros (
            id, type, subtype, type_label, title, partner_name, campaign_id,
            category, location, province, period, disbursement_amount,
            beneficiaries, description, desired_output, campaigns_data, updated_date
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?
        )
    """, (
        new_id, mipro_type, subtype, type_label, title, partner_name, campaign_id,
        category, location, province, period, disbursement_amount,
        beneficiaries, description, desired_output, campaigns_data_str, date_formatted
    ))

    # Audit log to dashboard_activities
    execute_db("""
        INSERT INTO dashboard_activities (title, meta, time_ago, icon)
        VALUES (?, ?, ?, ?)
    """, (
        f'MIPro Baru: {title} ({new_id})',
        f'{mipro_type} ({subtype}) • Periode: {period}',
        'Baru saja',
        'layers'
    ))

    created = query_one("SELECT * FROM mipros WHERE id = ?", (new_id,))
    return jsonify({
        'message': f'{mipro_type} ({subtype}) berhasil dibuat dan disimpan!',
        'mipro': _enrich_mipro(created)
    }), 201

@bp.route('/<mipro_id>', methods=['DELETE'])
def delete_mipro(mipro_id):
    """Delete a MIPro record."""
    res = execute_db("DELETE FROM mipros WHERE id = ?", (mipro_id,))
    if res['row_count'] == 0:
        return jsonify({'error': 'Data MIPro tidak ditemukan.'}), 404
    return jsonify({'message': f'MIPro {mipro_id} berhasil dihapus.'}), 200

