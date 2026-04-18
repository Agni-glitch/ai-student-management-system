# =====================================================
# Student Routes - REST API Endpoints
# =====================================================

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.student_model import Student, Mark
from sqlalchemy.exc import IntegrityError

bp = Blueprint('students', __name__)

@bp.route('', methods=['GET'])
def get_all_students():
    """Get all students"""
    try:
        students = Student.query.all()
        return jsonify([student.to_dict() for student in students]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:id>', methods=['GET'])
def get_student(id):
    """Get student by ID"""
    try:
        student = Student.query.get_or_404(id)
        return jsonify(student.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@bp.route('', methods=['POST'])
def create_student():
    """Create new student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'roll_number', 'department']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create student
        student = Student(
            name=data['name'],
            roll_number=data['roll_number'],
            department=data['department'],
            email=data.get('email')
        )
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify(student.to_dict()), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Student with this roll number already exists'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:id>', methods=['PUT'])
def update_student(id):
    """Update student"""
    try:
        student = Student.query.get_or_404(id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            student.name = data['name']
        if 'roll_number' in data:
            student.roll_number = data['roll_number']
        if 'department' in data:
            student.department = data['department']
        if 'email' in data:
            student.email = data['email']
        
        db.session.commit()
        return jsonify(student.to_dict()), 200
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Roll number already exists'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:id>', methods=['DELETE'])
def delete_student(id):
    """Delete student"""
    try:
        student = Student.query.get_or_404(id)
        db.session.delete(student)
        db.session.commit()
        return jsonify({'message': 'Student deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:id>/complete', methods=['GET'])
def get_student_with_marks(id):
    """Get student with all marks"""
    try:
        student = Student.query.get_or_404(id)
        marks = Mark.query.filter_by(student_id=id).all()
        
        result = student.to_dict()
        result['marks'] = [mark.to_dict() for mark in marks]
        
        # Calculate CGPA
        if marks:
            total_percentage = sum(mark.percentage for mark in marks)
            cgpa = (total_percentage / len(marks)) / 10
            result['cgpa'] = round(cgpa, 2)
        else:
            result['cgpa'] = 0
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
