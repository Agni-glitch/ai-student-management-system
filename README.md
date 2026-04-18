# 🎓 AI-Powered Student Management System

A production-ready full-stack web application that manages student academic records and integrates machine learning models to predict future CGPA and identify academic risk.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![Scikit-Learn](https://img.shields.io/badge/ScikitLearn-1.3-yellow?logo=scikit-learn)

---

## 🌟 Features

### Student Management (CRUD)
- ✅ Add, view, update, and delete student records
- ✅ Store personal information (name, roll number, department, email)
- ✅ Comprehensive student profiles with academic history

### Academic Records Management
- ✅ Semester-wise subject marks entry
- ✅ Support for multiple subjects per semester
- ✅ Automatic CGPA calculation (overall and semester-wise)
- ✅ Grade assignment based on performance

### Machine Learning Integration
- 🤖 **CGPA Prediction**: Linear Regression model predicts future semester performance
- ⚠️ **Risk Assessment**: Random Forest classifier identifies at-risk students
- 📊 **Trend Analysis**: Semester-wise performance tracking
- 💡 **Smart Recommendations**: Personalized suggestions based on academic status

### Interactive Dashboard
- 📈 Real-time statistics and analytics
- 🎯 Quick access to key metrics
- 👥 Student performance overview
- 🔴 At-risk student identification

### Visualization & Reports
- 📊 Performance trend charts using Recharts
- 📉 Semester-wise CGPA visualization
- 🎨 Color-coded grade indicators
- 📱 Responsive design for all devices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Routing**: React Router DOM
- **UI Library**: Tailwind CSS 4.1
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite 7.2

### Backend
- **Framework**: Flask 3.0
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Database**: MySQL 8.0
- **API**: RESTful architecture
- **CORS**: Flask-CORS

### Machine Learning
- **Framework**: Scikit-Learn 1.3
- **Data Processing**: Pandas, NumPy
- **Model Serialization**: Joblib
- **Algorithms**:
  - Linear Regression (CGPA Prediction)
  - Random Forest Classifier (Risk Assessment)

### Development Tools
- **Package Manager**: npm
- **Python Env**: virtualenv
- **Database Client**: MySQL Workbench
- **Version Control**: Git

---

## 📁 Project Structure

```
student-analytics-app/
│
├── frontend/                    # React Frontend
│   ├── public/                 # Static assets
│   ├── src/                    # Source code
│   │   ├── api/                # API calls (Axios)
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Screen components
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── index.html              # Vite entry html
│   ├── package.json            # Node.js dependencies
│   ├── tsconfig.json           # TS configurations
│   └── vite.config.ts          # Vite configurations
│
├── backend/                     # Flask Backend
│   ├── app/                    # Application module
│   │   ├── __init__.py         # Flask App factory
│   │   ├── config.py           # DB and app config
│   │   ├── extensions.py       # Flask extensions initialization
│   │   ├── models/             # Database ORM models
│   │   │   └── student_model.py
│   │   ├── routes/             # API blueprints
│   │   │   ├── student_routes.py
│   │   │   └── prediction_routes.py
│   │   ├── services/           # Business logic layer
│   │   │   ├── ml_service.py
│   │   │   └── student_service.py
│   │   └── utils/              # Helper utilities
│   ├── ml/                     # Machine Learning module
│   │   ├── data/               
│   │   ├── preprocessing/      
│   │   ├── models/             
│   │   ├── saved_models/       
│   │   └── inference.py        
│   ├── requirements.txt        # Python dependencies
│   └── run.py                  # Entry script for Flask
│
├── database/                    # Database Scripts
│   ├── schema.sql              # Database schemas
│   ├── seed.sql                # Initial data scaffolding
│   └── procedures.sql          
│
├── docs/                        # Architecture Documentation
│
├── .env                         # Secrets (DB URI, etc.)
├── docker-compose.yml           # MySQL + App orchestration
├── .gitignore                   # Ignore configurations
└── README.md                    # Project Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+

### 1. Clone Repository
```bash
git clone https://github.com/Agni-glitch/ai-student-management-system.git
cd ai-student-management-system
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE student_management_system;

# Import schema
mysql -u root -p student_management_system < database/schema.sql
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure .env file
cp .env.example .env
# Edit .env with your database credentials

# Run backend
python run.py
# Backend runs at http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
# Frontend runs at http://localhost:5173
```

### 5. Access Application
Open browser and navigate to: `http://localhost:5173`

---

## 📊 Database Schema

### Students Table
```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subjects Table
```sql
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    credits INT DEFAULT 4
);
```

### Marks Table
```sql
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
```

---

## 🤖 Machine Learning Models

### CGPA Prediction Model
- **Algorithm**: Linear Regression
- **Features**: Current CGPA, Previous CGPA, Trend, Average CGPA, Number of Semesters
- **Output**: Predicted CGPA for next semester (0-10 scale)

### Risk Classification Model
- **Algorithm**: Random Forest Classifier
- **Features**: Same as CGPA prediction
- **Output**: Risk Level (Low/Medium/High) + Risk Score (0-100)

### Model Training
```python
# Train models using API
POST /api/ml/train

# Or use Python script
python backend/ml/train.py
```

---

## 🔌 API Endpoints

### Student APIs
```
GET    /api/students           # Get all students
GET    /api/students/{id}      # Get student by ID
POST   /api/students           # Create student
PUT    /api/students/{id}      # Update student
DELETE /api/students/{id}      # Delete student
```

### Marks APIs
```
GET    /api/marks/student/{student_id}  # Get student marks
POST   /api/marks                        # Add marks
PUT    /api/marks/{id}                   # Update marks
DELETE /api/marks/{id}                   # Delete marks
```

### ML APIs
```
GET    /api/ml/predict/{student_id}     # Generate prediction
POST   /api/ml/train                     # Train models
```

### Dashboard APIs
```
GET    /api/dashboard/stats              # Get dashboard statistics
```

---

## 📸 Screenshots

### Dashboard
Comprehensive overview of student statistics, recent students, and ML predictions.

### Student Management
View, add, edit, and delete student records with search functionality.

### Marks Management
Semester-wise marks entry with automatic CGPA calculation.

### ML Predictions
AI-powered predictions with visualizations and personalized recommendations.

---

## 🎯 Future Enhancements

- [ ] JWT-based authentication
- [ ] Role-based access control (Admin/Faculty/Student)
- [ ] Email notifications for at-risk students
- [ ] Bulk import from CSV/Excel
- [ ] Export reports to PDF
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Attendance tracking integration
- [ ] Parent portal

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

---



## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Agni-glitch**
- GitHub: [@Agni-glitch](https://github.com/Agni-glitch)
- Email: [agniroybar@gmail.com]

---

## 🙏 Acknowledgments

- React Team for the amazing framework
- Flask community for excellent documentation
- Scikit-Learn for powerful ML tools
- All contributors and supporters

---

## 📞 Support

For support, email [agniroybar@gmail.com].

---

**Built with ❤️ using React, Flask, MySQL, and Machine Learning**
