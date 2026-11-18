import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.db import init_db, close_db
from app.seed import seed_database
from app.routes import (
    auth_bp,
    dashboard_bp,
    proposals_bp,
    mous_bp,
    assessments_bp,
    request_program_bp,
    uploads_bp,
    dss_bp,
    mipro_bp,
    spk_bp,
    monev_bp,
)

def create_app(config_class=Config):
    """Application factory for Flask backend."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Ensure instance and upload folders exist
    os.makedirs(app.config['INSTANCE_PATH'], exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Enable Cross-Origin Resource Sharing (CORS) for Next.js frontend
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config['CORS_ORIGINS'] or "*"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # Register DB teardown
    app.teardown_appcontext(close_db)

    # Initialize tables and seed sample data
    init_db(app)
    seed_database(app)

    # Register API Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(proposals_bp)
    app.register_blueprint(mous_bp)
    app.register_blueprint(assessments_bp)
    app.register_blueprint(request_program_bp)
    app.register_blueprint(uploads_bp)
    app.register_blueprint(dss_bp)
    app.register_blueprint(mipro_bp)
    app.register_blueprint(spk_bp)
    app.register_blueprint(monev_bp)

    # Health check & root route
    @app.route('/')
    def index():
        return jsonify({
            'name': 'MADIPRO Backend API',
            'organization': 'Relawan Nusantara',
            'version': '1.0.0',
            'status': 'online',
            'docs': {
                'auth': '/api/auth/login',
                'dashboard': '/api/dashboard/summary',
                'proposals': '/api/proposals',
                'mous': '/api/mous',
                'assessments': '/api/assessments',
                'request_program': '/api/request-program',
                'dss': '/api/dss',
                'mipro': '/api/mipro',
                'spk': '/api/spk',
                'monev': '/api/monev',
                'uploads': '/api/uploads',
                'health': '/api/health'
            }
        })

    @app.route('/api/health')
    def health_check():
        from app.db import get_active_db_type
        return jsonify({
            'status': 'ok',
            'database': get_active_db_type(),
            'message': f'MADIPRO Flask Backend is healthy and operational (Database: {get_active_db_type()}).'
        }), 200

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Endpoint tidak ditemukan.'}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({'error': 'Ukuran berkas melebihi batas maksimal (50 MB).'}), 413

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({'error': 'Terjadi kesalahan internal pada server backend.'}), 500

    return app

