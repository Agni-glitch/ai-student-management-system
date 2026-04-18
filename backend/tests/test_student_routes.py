import json
from app.models.student_model import Student, Mark
from app.extensions import db

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_get_all_students_empty(client):
    response = client.get('/api/students')
    assert response.status_code == 200
    assert len(response.json) == 0

def test_create_student_success(client):
    student_data = {
        'name': 'John Doe',
        'roll_number': 'CS1001',
        'department': 'Computer Science',
        'email': 'john@example.com'
    }
    response = client.post('/api/students',
                           data=json.dumps(student_data),
                           content_type='application/json')
    assert response.status_code == 201
    assert response.json['name'] == 'John Doe'

    # Verify it exists in db
    response = client.get('/api/students')
    assert len(response.json) == 1

def test_create_student_missing_data(client):
    student_data = {
        'name': 'Jane Doe',
        # missing roll_number and department
    }
    response = client.post('/api/students',
                           data=json.dumps(student_data),
                           content_type='application/json')
    assert response.status_code == 400
    assert 'Missing required field' in response.json['error']

def test_get_student_with_marks(client, app):
    # Seed data
    with app.app_context():
        student = Student(name='Alice', roll_number='CS1002', department='CS')
        db.session.add(student)
        db.session.commit()
        
        mark1 = Mark(student_id=student.id, subject_id=1, semester=1, marks=85.0)
        mark2 = Mark(student_id=student.id, subject_id=2, semester=1, marks=92.0)
        db.session.add(mark1)
        db.session.add(mark2)
        db.session.commit()
    
        student_id = student.id

    response = client.get(f'/api/students/{student_id}/complete')
    assert response.status_code == 200
    assert response.json['name'] == 'Alice'
    assert len(response.json['marks']) == 2
    assert response.json['cgpa'] > 0
