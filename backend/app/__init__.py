from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    cors.init_app(app)

    # Register blueprints
    from app.routes.student_routes import bp as student_bp
    app.register_blueprint(student_bp, url_prefix='/api/students')

    try:
        from app.routes.prediction_routes import bp as ml_bp
        app.register_blueprint(ml_bp, url_prefix='/api/ml')
    except ImportError:
        pass # Handle placeholder gracefully

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Student Management System API is running'})

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return app
