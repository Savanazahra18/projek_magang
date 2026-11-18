import os
import csv
import uuid
import zipfile
import xml.etree.ElementTree as ET
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename

bp = Blueprint('uploads', __name__, url_prefix='/api/uploads')

DEFAULT_ALLOWED = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'webp'}

def allowed_file(filename):
    allowed = current_app.config.get('ALLOWED_EXTENSIONS', DEFAULT_ALLOWED) | DEFAULT_ALLOWED
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

def format_file_size(size_bytes: int) -> str:
    if size_bytes >= 1024 * 1024:
        return f"{(size_bytes / (1024 * 1024)):.1f} MB"
    if size_bytes >= 1024:
        return f"{max(1, round(size_bytes / 1024))} KB"
    return f"{size_bytes} B"

def _parse_docx(file_path: str):
    """Extract ordered paragraphs and tables from a .docx file using stdlib zipfile + ElementTree."""
    blocks = []
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    with zipfile.ZipFile(file_path, 'r') as zf:
        if 'word/document.xml' not in zf.namelist():
            return blocks
        xml_bytes = zf.read('word/document.xml')
    root = ET.fromstring(xml_bytes)
    body = root.find('w:body', ns)
    if body is None:
        return blocks

    for child in body:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag == 'p':
            texts = [t.text for t in child.findall('.//w:t', ns) if t.text]
            full_text = ''.join(texts).strip()
            if not full_text:
                continue
            p_style = child.find('.//w:pStyle', ns)
            style_val = ''
            if p_style is not None:
                for k, v in p_style.attrib.items():
                    if k.endswith('val'):
                        style_val = v.lower()
            is_heading = 'heading' in style_val or 'judul' in style_val or 'title' in style_val
            blocks.append({
                'type': 'heading' if is_heading else 'paragraph',
                'text': full_text
            })
        elif tag == 'tbl':
            rows = []
            for tr in child.findall('.//w:tr', ns):
                row_cells = []
                for tc in tr.findall('./w:tc', ns):
                    cell_texts = []
                    for p in tc.findall('.//w:p', ns):
                        p_texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
                        if p_texts:
                            cell_texts.append(''.join(p_texts).strip())
                    row_cells.append('\n'.join(cell_texts).strip())
                if any(c for c in row_cells):
                    rows.append(row_cells)
            if rows:
                blocks.append({
                    'type': 'table',
                    'rows': rows
                })
    return blocks

def _col_letters_to_index(cell_ref: str) -> int:
    letters = ''.join(ch for ch in cell_ref if ch.isalpha()).upper()
    idx = 0
    for ch in letters:
        idx = idx * 26 + (ord(ch) - ord('A') + 1)
    return max(0, idx - 1)

def _parse_xlsx(file_path: str):
    """Extract sheets and rows from an .xlsx file using stdlib zipfile + ElementTree."""
    sheets = []
    with zipfile.ZipFile(file_path, 'r') as zf:
        names = set(zf.namelist())
        shared_strings = []
        if 'xl/sharedStrings.xml' in names:
            ss_root = ET.fromstring(zf.read('xl/sharedStrings.xml'))
            for si in ss_root.iter():
                tag = si.tag.split('}')[-1] if '}' in si.tag else si.tag
                if tag == 'si':
                    parts = [
                        el.text for el in si.iter()
                        if (el.tag.split('}')[-1] if '}' in el.tag else el.tag) == 't' and el.text
                    ]
                    shared_strings.append(''.join(parts))

        sheet_Names = []
        if 'xl/workbook.xml' in names:
            wb_root = ET.fromstring(zf.read('xl/workbook.xml'))
            for el in wb_root.iter():
                tag = el.tag.split('}')[-1] if '}' in el.tag else el.tag
                if tag == 'sheet' and 'name' in el.attrib:
                    sheet_Names.append(el.attrib['name'])

        sheet_files = sorted(
            [n for n in names if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')]
        )
        for idx, sf in enumerate(sheet_files):
            s_root = ET.fromstring(zf.read(sf))
            rows = []
            max_cols = 0
            raw_rows = []
            for r_el in s_root.iter():
                r_tag = r_el.tag.split('}')[-1] if '}' in r_el.tag else r_el.tag
                if r_tag == 'row':
                    row_dict = {}
                    for c_el in r_el:
                        c_tag = c_el.tag.split('}')[-1] if '}' in c_el.tag else c_el.tag
                        if c_tag != 'c':
                            continue
                        ref = c_el.attrib.get('r', '')
                        col_idx = _col_letters_to_index(ref) if ref else len(row_dict)
                        c_type = c_el.attrib.get('t', '')
                        val = ''
                        if c_type == 'inlineStr':
                            t_parts = [
                                t.text for t in c_el.iter()
                                if (t.tag.split('}')[-1] if '}' in t.tag else t.tag) == 't' and t.text
                            ]
                            val = ''.join(t_parts)
                        else:
                            v_el = next(
                                (ch for ch in c_el if (ch.tag.split('}')[-1] if '}' in ch.tag else ch.tag) == 'v'),
                                None
                            )
                            if v_el is not None and v_el.text is not None:
                                raw_v = v_el.text
                                if c_type == 's':
                                    try:
                                        s_idx = int(raw_v)
                                        val = shared_strings[s_idx] if 0 <= s_idx < len(shared_strings) else raw_v
                                    except ValueError:
                                        val = raw_v
                                else:
                                    val = raw_v
                        row_dict[col_idx] = val.strip() if isinstance(val, str) else str(val)
                    if any(v for v in row_dict.values()):
                        local_max = max(row_dict.keys()) + 1
                        if local_max > max_cols:
                            max_cols = local_max
                        raw_rows.append(row_dict)

            max_cols = min(max_cols, 15)
            for rd in raw_rows[:200]:
                rows.append([rd.get(c, '') for c in range(max_cols)])

            if rows:
                sheets.append({
                    'name': sheet_Names[idx] if idx < len(sheet_Names) else f"Sheet {idx + 1}",
                    'rows': rows
                })
    return sheets

@bp.route('', methods=['POST'])
def upload_file():
    """Upload a document, spreadsheet, or photo file."""
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada berkas yang diunggah (field name: "file").'}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({'error': 'Nama berkas kosong.'}), 400

    if allowed_file(file.filename):
        original_name = file.filename
        raw_ext = original_name.rsplit('.', 1)[1].lower() if '.' in original_name else 'bin'
        clean_base = secure_filename(original_name.rsplit('.', 1)[0]) or 'file'

        unique_name = f"{clean_base}_{uuid.uuid4().hex[:8]}.{raw_ext}"
        upload_folder = str(current_app.config['UPLOAD_FOLDER'])
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_name)

        file.save(file_path)

        size_bytes = os.path.getsize(file_path)
        size_str = format_file_size(size_bytes)
        file_url = f"/api/uploads/{unique_name}"

        return jsonify({
            'message': 'Berkas berhasil diunggah.',
            'filename': unique_name,
            'originalName': original_name,
            'extension': raw_ext.upper(),
            'size': size_str,
            'sizeBytes': size_bytes,
            'url': file_url
        }), 201

    return jsonify({'error': 'Format berkas tidak diizinkan. Gunakan PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, atau PNG.'}), 400

@bp.route('/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    """Serve uploaded document or image file (inline by default, or attachment with ?download=1)."""
    safe_name = secure_filename(filename)
    upload_folder = str(current_app.config['UPLOAD_FOLDER'])
    as_attachment = request.args.get('download') in ('1', 'true', 'yes')
    return send_from_directory(upload_folder, safe_name, as_attachment=as_attachment)

@bp.route('/<filename>/preview', methods=['GET'])
def preview_uploaded_file(filename):
    """Return structured preview content for DOCX, XLSX, CSV, TXT, PDF, or Image files."""
    safe_name = secure_filename(filename)
    upload_folder = str(current_app.config['UPLOAD_FOLDER'])
    file_path = os.path.join(upload_folder, safe_name)

    if not os.path.isfile(file_path):
        return jsonify({'error': 'Berkas tidak ditemukan di server.'}), 404

    ext = safe_name.rsplit('.', 1)[1].lower() if '.' in safe_name else ''
    size_bytes = os.path.getsize(file_path)
    file_url = f"/api/uploads/{safe_name}"

    try:
        if ext == 'pdf':
            return jsonify({
                'filename': safe_name,
                'extension': 'PDF',
                'size': format_file_size(size_bytes),
                'previewType': 'pdf',
                'url': file_url
            }), 200

        if ext in ('jpg', 'jpeg', 'png', 'webp'):
            return jsonify({
                'filename': safe_name,
                'extension': ext.upper(),
                'size': format_file_size(size_bytes),
                'previewType': 'image',
                'url': file_url
            }), 200

        if ext == 'docx':
            blocks = _parse_docx(file_path)
            return jsonify({
                'filename': safe_name,
                'extension': 'DOCX',
                'size': format_file_size(size_bytes),
                'previewType': 'docx',
                'blocks': blocks,
                'url': file_url
            }), 200

        if ext == 'xlsx':
            sheets = _parse_xlsx(file_path)
            return jsonify({
                'filename': safe_name,
                'extension': 'XLSX',
                'size': format_file_size(size_bytes),
                'previewType': 'xlsx',
                'sheets': sheets,
                'url': file_url
            }), 200

        if ext in ('csv', 'txt'):
            rows = []
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                if ext == 'csv':
                    reader = csv.reader(f)
                    for i, r in enumerate(reader):
                        if i >= 200:
                            break
                        if any(c.strip() for c in r):
                            rows.append(r[:15])
                else:
                    lines = [line.rstrip('\r\n') for line in f.readlines()[:300]]
                    return jsonify({
                        'filename': safe_name,
                        'extension': 'TXT',
                        'size': format_file_size(size_bytes),
                        'previewType': 'text',
                        'lines': lines,
                        'url': file_url
                    }), 200
            return jsonify({
                'filename': safe_name,
                'extension': 'CSV',
                'size': format_file_size(size_bytes),
                'previewType': 'xlsx',
                'sheets': [{'name': 'Data CSV', 'rows': rows}],
                'url': file_url
            }), 200

        return jsonify({
            'filename': safe_name,
            'extension': ext.upper(),
            'size': format_file_size(size_bytes),
            'previewType': 'download_only',
            'url': file_url
        }), 200
    except Exception as e:
        return jsonify({
            'filename': safe_name,
            'extension': ext.upper(),
            'size': format_file_size(size_bytes),
            'previewType': 'download_only',
            'error': str(e),
            'url': file_url
        }), 200
