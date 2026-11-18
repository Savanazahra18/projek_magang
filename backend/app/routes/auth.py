from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.db import query_one, execute_db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST'])
def login():
    """User login endpoint."""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email dan password wajib diisi.'}), 400

    user = query_one("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
    
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Email atau kata sandi tidak cocok. Hanya akun yang terdaftar di database yang dapat masuk.'}), 401

    user_info = {
        'id': user['id'],
        'email': user['email'],
        'name': user['name'],
        'role': user['role'],
        'avatar': user['avatar'] if 'avatar' in user.keys() else None,
    }

    # Simple session token (demo/stateless token)
    token = f"tok_rn_{user_info['id']}_{user_info['role'].replace(' ', '_').lower()}"

    return jsonify({
        'message': 'Login berhasil',
        'token': token,
        'user': user_info
    }), 200

@bp.route('/me', methods=['GET'])
def get_current_user():
    """Get active user profile."""
    # Default to first admin/staff user
    user = query_one("SELECT id, email, name, role, avatar, created_at FROM users LIMIT 1")
    if not user:
        return jsonify({'error': 'Pengguna belum terdaftar.'}), 404
    return jsonify({'user': user}), 200

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'Tim Program')

    if not name or not email or not password:
        return jsonify({'error': 'Nama, email, dan kata sandi wajib diisi.'}), 400

    existing = query_one("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    if existing:
        return jsonify({'error': 'Email sudah terdaftar di sistem.'}), 409

    pwd_hash = generate_password_hash(password)
    res = execute_db(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        (name, email, pwd_hash, role)
    )
    return jsonify({
        'message': 'Pendaftaran berhasil.',
        'user_id': res['last_id']
    }), 201

