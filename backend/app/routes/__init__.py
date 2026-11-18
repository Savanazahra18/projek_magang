from app.routes.auth import bp as auth_bp
from app.routes.dashboard import bp as dashboard_bp
from app.routes.proposals import bp as proposals_bp
from app.routes.mous import bp as mous_bp
from app.routes.assessments import bp as assessments_bp
from app.routes.request_program import bp as request_program_bp
from app.routes.uploads import bp as uploads_bp
from app.routes.dss import bp as dss_bp
from app.routes.mipro import bp as mipro_bp
from app.routes.spk import bp as spk_bp
from app.routes.monev import bp as monev_bp

__all__ = [
    'auth_bp',
    'dashboard_bp',
    'proposals_bp',
    'mous_bp',
    'assessments_bp',
    'request_program_bp',
    'uploads_bp',
    'dss_bp',
    'mipro_bp',
    'spk_bp',
    'monev_bp',
]

