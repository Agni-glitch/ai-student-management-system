# =====================================================
# Machine Learning Service
# Prediction and Model Training
# =====================================================

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
from app.models.student_model import Student, Mark

class MLService:
    """Machine Learning service for student performance prediction"""
    
    def __init__(self, model_path='ml/models/'):
        self.model_path = model_path
        self.cgpa_model = None
        self.risk_model = None
        
        # Create model directory if not exists
        os.makedirs(model_path, exist_ok=True)
    
    def calculate_cgpa(self, marks):
        """Calculate CGPA from marks list"""
        if not marks:
            return 0
        
        total_percentage = sum((m.marks / m.max_marks * 100) for m in marks)
        average_percentage = total_percentage / len(marks)
        return round(average_percentage / 10, 2)
    
    def calculate_semester_cgpa(self, marks):
        """Calculate semester-wise CGPA"""
        semester_data = {}
        
        for mark in marks:
            if mark.semester not in semester_data:
                semester_data[mark.semester] = []
            semester_data[mark.semester].append(mark)
        
        semester_cgpa = []
        for semester, sem_marks in sorted(semester_data.items()):
            cgpa = self.calculate_cgpa(sem_marks)
            semester_cgpa.append({'semester': semester, 'cgpa': cgpa})
        
        return semester_cgpa
    
    def prepare_training_data(self):
        """Prepare data for model training"""
        students = Student.query.all()
        training_data = []
        
        for student in students:
            marks = Mark.query.filter_by(student_id=student.id).all()
            
            if len(marks) < 2:
                continue
            
            semester_cgpa = self.calculate_semester_cgpa(marks)
            
            if len(semester_cgpa) < 2:
                continue
            
            # Extract features
            current_cgpa = semester_cgpa[-1]['cgpa']
            prev_cgpa = semester_cgpa[-2]['cgpa']
            trend = current_cgpa - prev_cgpa
            avg_cgpa = np.mean([s['cgpa'] for s in semester_cgpa])
            
            # Determine risk level
            if current_cgpa < 5.0:
                risk = 2  # High
            elif current_cgpa < 6.5:
                risk = 1  # Medium
            else:
                risk = 0  # Low
            
            training_data.append({
                'current_cgpa': current_cgpa,
                'prev_cgpa': prev_cgpa,
                'trend': trend,
                'avg_cgpa': avg_cgpa,
                'num_semesters': len(semester_cgpa),
                'future_cgpa': current_cgpa + trend * 0.5,  # Simplified prediction
                'risk': risk
            })
        
        return pd.DataFrame(training_data)
    
    def train_models(self):
        """Train ML models"""
        df = self.prepare_training_data()
        
        if len(df) < 5:
            raise ValueError("Insufficient data for training. Need at least 5 students with multiple semesters.")
        
        # Features for prediction
        features = ['current_cgpa', 'prev_cgpa', 'trend', 'avg_cgpa', 'num_semesters']
        X = df[features].values
        
        # Train CGPA prediction model (Regression)
        y_cgpa = df['future_cgpa'].values
        self.cgpa_model = LinearRegression()
        self.cgpa_model.fit(X, y_cgpa)
        
        # Train risk classification model
        y_risk = df['risk'].values
        self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.risk_model.fit(X, y_risk)
        
        # Save models
        joblib.dump(self.cgpa_model, os.path.join(self.model_path, 'cgpa_model.pkl'))
        joblib.dump(self.risk_model, os.path.join(self.model_path, 'risk_model.pkl'))
        
        return {
            'success': True,
            'message': f'Models trained on {len(df)} student records',
            'students_count': len(df)
        }
    
    def load_models(self):
        """Load trained models"""
        cgpa_path = os.path.join(self.model_path, 'cgpa_model.pkl')
        risk_path = os.path.join(self.model_path, 'risk_model.pkl')
        
        if os.path.exists(cgpa_path) and os.path.exists(risk_path):
            self.cgpa_model = joblib.load(cgpa_path)
            self.risk_model = joblib.load(risk_path)
            return True
        return False
    
    def predict_student_performance(self, student_id):
        """Predict performance for a student"""
        # Load models if not loaded
        if not self.cgpa_model or not self.risk_model:
            if not self.load_models():
                # Use simple prediction if models not trained
                return self._simple_prediction(student_id)
        
        marks = Mark.query.filter_by(student_id=student_id).all()
        
        if len(marks) < 2:
            return {'error': 'Insufficient data for prediction'}
        
        semester_cgpa = self.calculate_semester_cgpa(marks)
        
        if len(semester_cgpa) < 2:
            return {'error': 'Need at least 2 semesters of data'}
        
        # Prepare features
        current_cgpa = semester_cgpa[-1]['cgpa']
        prev_cgpa = semester_cgpa[-2]['cgpa']
        trend = current_cgpa - prev_cgpa
        avg_cgpa = np.mean([s['cgpa'] for s in semester_cgpa])
        num_semesters = len(semester_cgpa)
        
        features = np.array([[current_cgpa, prev_cgpa, trend, avg_cgpa, num_semesters]])
        
        # Predict
        predicted_cgpa = float(self.cgpa_model.predict(features)[0])
        predicted_cgpa = max(0, min(10, predicted_cgpa))  # Clamp between 0-10
        
        risk_pred = int(self.risk_model.predict(features)[0])
        risk_level = ['Low', 'Medium', 'High'][risk_pred]
        
        # Generate recommendations
        recommendations = self._generate_recommendations(current_cgpa, risk_level, trend)
        
        return {
            'student_id': student_id,
            'current_cgpa': current_cgpa,
            'predicted_cgpa': round(predicted_cgpa, 2),
            'risk_level': risk_level,
            'risk_score': risk_pred * 33,  # Convert to 0-100 scale
            'semester_trend': semester_cgpa,
            'recommendations': recommendations
        }
    
    def _simple_prediction(self, student_id):
        """Simple prediction without trained models"""
        marks = Mark.query.filter_by(student_id=student_id).all()
        
        if not marks:
            return {'error': 'No marks found for student'}
        
        semester_cgpa = self.calculate_semester_cgpa(marks)
        current_cgpa = self.calculate_cgpa(marks)
        
        # Simple linear trend
        if len(semester_cgpa) >= 2:
            trend = semester_cgpa[-1]['cgpa'] - semester_cgpa[-2]['cgpa']
            predicted_cgpa = max(0, min(10, current_cgpa + trend))
        else:
            predicted_cgpa = current_cgpa
        
        # Assess risk
        if current_cgpa < 5.0:
            risk_level = 'High'
            risk_score = 80
        elif current_cgpa < 6.5:
            risk_level = 'Medium'
            risk_score = 50
        else:
            risk_level = 'Low'
            risk_score = 20
        
        recommendations = self._generate_recommendations(current_cgpa, risk_level, 
                                                        trend if len(semester_cgpa) >= 2 else 0)
        
        return {
            'student_id': student_id,
            'current_cgpa': current_cgpa,
            'predicted_cgpa': round(predicted_cgpa, 2),
            'risk_level': risk_level,
            'risk_score': risk_score,
            'semester_trend': semester_cgpa,
            'recommendations': recommendations
        }
    
    def _generate_recommendations(self, cgpa, risk_level, trend):
        """Generate personalized recommendations"""
        recommendations = []
        
        if risk_level == 'High':
            recommendations.extend([
                '⚠️ Immediate academic intervention required',
                '📚 Consider attending additional tutoring sessions',
                '👥 Join study groups for difficult subjects',
                '🎯 Focus on improving weak areas identified in assessments',
                '💬 Schedule a meeting with academic advisor'
            ])
        elif risk_level == 'Medium':
            recommendations.extend([
                '📈 Monitor performance closely in upcoming assessments',
                '⏰ Improve time management and study schedule',
                '📝 Practice more problems in challenging subjects',
                '🤝 Collaborate with peers for better understanding'
            ])
        else:
            recommendations.extend([
                '✅ Maintain current study habits and performance',
                '🎓 Consider taking advanced or honors courses',
                '🔬 Explore research opportunities or projects',
                '👨‍🏫 Mentor students who need academic support'
            ])
        
        if trend > 0.5:
            recommendations.append('📊 Excellent improvement trend - keep up the good work!')
        elif trend < -0.5:
            recommendations.append('📉 Declining trend detected - identify and address challenges early')
        
        return recommendations


# Global instance
ml_service = MLService()
