# AI-Powered Student Management System
## Complete Setup Instructions

---

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [Backend Setup (Flask)](#backend-setup)
4. [Frontend Setup (React)](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [ML Model Training](#ml-model-training)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 System Requirements

### Software Requirements:
- **Python**: 3.8 or higher
- **Node.js**: 16.x or higher
- **MySQL**: 8.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

### Operating System:
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+ recommended)

---

## 🗄️ Database Setup

### Step 1: Install MySQL
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# macOS (using Homebrew)
brew install mysql

# Windows: Download from https://dev.mysql.com/downloads/installer/
```

### Step 2: Start MySQL Service
```bash
# Ubuntu/Linux
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql

# Windows: Use MySQL Workbench or Services
```

### Step 3: Create Database and User
```bash
# Login to MySQL
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE student_management_system;
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON student_management_system.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Import Database Schema
```bash
# Navigate to backend code directory
cd backend-code

# Import schema
mysql -u sms_user -p student_management_system < database-schema.sql
```

---

## 🐍 Backend Setup (Flask)

### Step 1: Create Project Structure
```
backend/
├── app.py
├── config/
│   └── config.py
├── models/
│   └── models.py
├── routes/
│   ├── student_routes.py
│   ├── marks_routes.py
│   ├── ml_routes.py
│   └── dashboard_routes.py
├── services/
│   └── ml_service.py
├── ml/
│   ├── train.py
│   ├── predict.py
│   └── models/
├── requirements.txt
└── .env
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create a `.env` file in the backend directory:
```env
# Database Configuration
DATABASE_URL=mysql+pymysql://sms_user:your_password@localhost/student_management_system

# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
DEBUG=True

# ML Configuration
ML_MODEL_PATH=ml/models/
```

### Step 5: Initialize Database Tables
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

---

## ⚛️ Frontend Setup (React)

### Step 1: Install Node.js Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 2: Configure API Endpoint
Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Update API Configuration
Edit `src/api/config.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🚀 Running the Application

### Start Backend Server
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Run Flask application
python app.py

# Server will start at: http://localhost:5000
```

### Start Frontend Development Server
```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Start development server
npm run dev

# Application will open at: http://localhost:5173
```

---

## 📚 API Documentation

### Student Endpoints

#### Get All Students
```
GET /api/students
Response: Array of student objects
```

#### Get Student by ID
```
GET /api/students/{id}
Response: Student object with details
```

#### Create Student
```
POST /api/students
Body: {
  "name": "John Doe",
  "roll_number": "CS2024001",
  "department": "Computer Science",
  "email": "john@university.edu"
}
```

#### Update Student
```
PUT /api/students/{id}
Body: { fields to update }
```

#### Delete Student
```
DELETE /api/students/{id}
```

### Marks Endpoints

#### Get Student Marks
```
GET /api/marks/student/{student_id}
```

#### Add Marks
```
POST /api/marks
Body: {
  "student_id": 1,
  "subject_id": 1,
  "semester": 1,
  "marks": 85,
  "max_marks": 100
}
```

### ML Endpoints

#### Generate Prediction
```
GET /api/ml/predict/{student_id}
Response: {
  "student_id": 1,
  "current_cgpa": 8.5,
  "predicted_cgpa": 8.7,
  "risk_level": "Low",
  "recommendations": [...]
}
```

#### Train Model
```
POST /api/ml/train
Response: {
  "success": true,
  "message": "Model trained successfully"
}
```

---

## 🤖 ML Model Training

### Initial Training
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Run training script
python ml/train.py
```

### Training via API
```bash
# Using curl
curl -X POST http://localhost:5000/api/ml/train

# Or use the frontend interface
# Navigate to: Settings > Train ML Model
```

### Model Files
Trained models are saved in:
```
backend/ml/models/
├── cgpa_model.pkl
└── risk_model.pkl
```

---

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL service status
sudo systemctl status mysql

# Test connection
mysql -u sms_user -p student_management_system
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Frontend (Port 5173)
lsof -ti:5173 | xargs kill -9
```

### Python Module Not Found
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
```

### CORS Issues
Ensure Flask-CORS is properly configured in `app.py`:
```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
```

### ML Model Not Found
```bash
# Train models first
python ml/train.py

# Or use API endpoint
curl -X POST http://localhost:5000/api/ml/train
```

---

## 📊 Sample Data

The database schema includes sample data for 5 students with marks across 2 semesters. You can:

1. **View Sample Data**: Check Students page after setup
2. **Add More Students**: Use "Add Student" form
3. **Enter Marks**: Use "Manage Marks" section
4. **Generate Predictions**: Use "ML Predictions" page

---

## 🎯 Features Overview

### ✅ Implemented Features:
- ✔️ Complete CRUD operations for students
- ✔️ Semester-wise marks management
- ✔️ CGPA calculation (overall and semester-wise)
- ✔️ ML-powered CGPA prediction
- ✔️ Academic risk assessment
- ✔️ Personalized recommendations
- ✔️ Interactive dashboards
- ✔️ Performance visualization
- ✔️ Responsive UI design

### 🔐 Security Best Practices:
- Use environment variables for sensitive data
- Never commit `.env` files to version control
- Use strong passwords for database
- Implement JWT authentication (production)
- Add input validation and sanitization

---

## 📈 Production Deployment

### Backend (Flask)
```bash
# Use production server (e.g., Gunicorn)
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (React)
```bash
# Build for production
npm run build

# Serve using nginx or similar
```

### Database
- Use managed MySQL service (AWS RDS, Google Cloud SQL)
- Enable SSL/TLS connections
- Regular backups
- Performance monitoring

---

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review troubleshooting section
- Check API logs in backend console
- Inspect browser console for frontend errors

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

**Built with ❤️ using React, Flask, and Machine Learning**
