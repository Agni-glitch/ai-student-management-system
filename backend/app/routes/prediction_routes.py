from flask import Blueprint, jsonify
from app.services.ml_service import ml_service

bp = Blueprint('ml', __name__)

@bp.route('/predict/<int:student_id>', methods=['GET'])
def predict_student(student_id):
    """Predict performance for a specific student"""
    try:
        result = ml_service.predict_student_performance(student_id)
        if 'error' in result:
            return jsonify(result), 400
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/train', methods=['POST'])
def train_models():
    """Train the ML models manually"""
    try:
        result = ml_service.train_models()
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
