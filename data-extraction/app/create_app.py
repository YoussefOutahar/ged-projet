from flask import Flask
from flask_cors import CORS
from config import Config
from app.log_config import setup_logger

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(config_class)
    
    logger = setup_logger(app)
    logger.info("Application startup...")
    
    from api import health_bp, indexation_bp, register_error_handlers
    
    app.register_blueprint(health_bp)
    app.register_blueprint(indexation_bp)
    
    register_error_handlers(app)
    
    logger.info("Application created and configured")
    return app

appInstance = create_app()