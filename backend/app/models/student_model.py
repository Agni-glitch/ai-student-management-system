# =====================================================
# Database Models using SQLAlchemy ORM
# =====================================================

from datetime import datetime
from app.extensions import db

class Student(db.Model):
    """Student model"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    roll_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    department = db.Column(db.String(100), nullable=False, index=True)
    email = db.Column(db.String(255), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    marks = db.relationship('Mark', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'roll_number': self.roll_number,
            'department': self.department,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Student {self.roll_number}: {self.name}>'


class Subject(db.Model):
    """Subject model"""
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    credits = db.Column(db.Integer, default=4)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    marks = db.relationship('Mark', backref='subject', lazy='dynamic')
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'credits': self.credits,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Subject {self.code}: {self.name}>'


class Mark(db.Model):
    """Mark model"""
    __tablename__ = 'marks'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    marks = db.Column(db.Numeric(5, 2), nullable=False)
    max_marks = db.Column(db.Numeric(5, 2), nullable=False, default=100.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite unique constraint
    __table_args__ = (
        db.UniqueConstraint('student_id', 'subject_id', 'semester', 
                          name='unique_student_subject_semester'),
        db.Index('idx_student_semester', 'student_id', 'semester'),
    )
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'subject_id': self.subject_id,
            'semester': self.semester,
            'marks': float(self.marks),
            'max_marks': float(self.max_marks),
            'subject_name': self.subject.name if self.subject else None,
            'subject_code': self.subject.code if self.subject else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @property
    def percentage(self):
        """Calculate percentage"""
        return (float(self.marks) / float(self.max_marks)) * 100 if self.max_marks > 0 else 0
    
    def __repr__(self):
        return f'<Mark Student:{self.student_id} Subject:{self.subject_id} Sem:{self.semester}>'
