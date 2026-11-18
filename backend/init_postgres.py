"""CLI utility to test PostgreSQL connection, create the database, and verify tables."""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', '5432'))
DB_NAME = os.getenv('DB_NAME', 'madipro_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')

print("=" * 60)
print("MADIPRO - PostgreSQL Connection & Setup Test")
print("=" * 60)
print(f"Host     : {DB_HOST}:{DB_PORT}")
print(f"Database : {DB_NAME}")
print(f"User     : {DB_USER}")
print(f"Password : {'*' * len(DB_PASSWORD) if DB_PASSWORD else '(empty)'}")
print("-" * 60)

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("[ERROR] Pustaka 'psycopg2' belum terpasang. Jalankan: pip install psycopg2-binary")
    sys.exit(1)

# Step 1: Connect to maintenance db 'postgres'
print("[1/3] Menghubungkan ke PostgreSQL server...")
try:
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        dbname='postgres',
        connect_timeout=4
    )
    conn.autocommit = True
    cur = conn.cursor()
    print("    [OK] Berhasil terhubung ke server PostgreSQL!")
except Exception as e:
    print(f"    [GAGAL] Tidak dapat terhubung ke PostgreSQL: {e}")
    print("\n[PETUNJUK]:")
    print("1. Pastikan password user 'postgres' di file backend/.env sudah sesuai.")
    print("2. Contoh pada backend/.env:")
    print("   DB_PASSWORD=password_anda_disini")
    sys.exit(1)

# Step 2: Ensure database exists
print(f"[2/3] Memeriksa database '{DB_NAME}'...")
try:
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{DB_NAME}"')
        print(f"    [OK] Database '{DB_NAME}' berhasil dibuat!")
    else:
        print(f"    [OK] Database '{DB_NAME}' sudah ada.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"    [GAGAL] Gagal membuat/memeriksa database: {e}")
    sys.exit(1)

# Step 3: Connect to target database and initialize schema
print(f"[3/3] Menginisialisasi tabel-tabel pada database '{DB_NAME}'...")
try:
    from app import create_app
    app = create_app()
    with app.app_context():
        from app.db import get_db, query_one
        db = get_db()
        print("    [OK] Seluruh tabel (users, proposals, mous, assessments, dll.) siap digunakan!")
        
        # Test count
        users = query_one("SELECT COUNT(*) as c FROM users")
        props = query_one("SELECT COUNT(*) as c FROM proposals")
        mous = query_one("SELECT COUNT(*) as c FROM mous")
        asms = query_one("SELECT COUNT(*) as c FROM assessments")
        print(f"    [DATA] Users: {users['c']}, Proposals: {props['c']}, MOUs: {mous['c']}, Assessments: {asms['c']}")

    print("\n[SUKSES] Backend MADIPRO telah tersambung sepenuhnya dengan PostgreSQL!")
except Exception as e:
    print(f"    [GAGAL] {e}")
    sys.exit(1)

