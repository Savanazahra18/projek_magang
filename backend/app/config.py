import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key-madipro-2026')
    DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
    PORT = int(os.getenv('PORT', '5001'))
    
    # Database Configuration (PostgreSQL / SQLite)
    DB_TYPE = os.getenv('DB_TYPE', 'postgresql').lower()
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', '5432'))
    DB_NAME = os.getenv('DB_NAME', 'madipro_db')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DATABASE_URL = os.getenv('DATABASE_URL')
    FALLBACK_TO_SQLITE = os.getenv('FALLBACK_TO_SQLITE', '1') == '1'
    
    # Instance & SQLite fallback path
    INSTANCE_PATH = BASE_DIR / 'instance'
    INSTANCE_PATH.mkdir(parents=True, exist_ok=True)
    DATABASE_PATH = str(INSTANCE_PATH / 'madipro.db')
    
    # Uploads Path
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB max limit
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png', 'webp'}
    
    # CORS
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv('CORS_ORIGINS', 'http://localhost:3001,http://127.0.0.1:3001').split(',')
        if origin.strip()
    ]

