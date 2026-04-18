-- =====================================================
-- AI-Powered Student Management System
-- MySQL Database Schema
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS student_management_system;
USE student_management_system;

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS students;

-- =====================================================
-- Students Table
-- =====================================================
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roll_number (roll_number),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Subjects Table
-- =====================================================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    credits INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Marks Table
-- =====================================================
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_student_semester (student_id, semester),
    INDEX idx_subject (subject_id),
    UNIQUE KEY unique_student_subject_semester (student_id, subject_id, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Sample Data Insertion
-- =====================================================

-- Insert sample subjects
INSERT INTO subjects (name, code, credits) VALUES
('Data Structures', 'CS101', 4),
('Database Systems', 'CS102', 4),
('Web Development', 'CS103', 3),
('Operating Systems', 'CS104', 4),
('Computer Networks', 'CS105', 3),
('Machine Learning', 'CS201', 4),
('Artificial Intelligence', 'CS202', 4),
('Software Engineering', 'CS203', 3),
('Compiler Design', 'CS204', 4),
('Cloud Computing', 'CS205', 3);

-- Insert sample students
INSERT INTO students (name, roll_number, department, email) VALUES
('Alice Johnson', 'CS2021001', 'Computer Science', 'alice.j@university.edu'),
('Bob Smith', 'CS2021002', 'Computer Science', 'bob.s@university.edu'),
('Carol Williams', 'CS2021003', 'Computer Science', 'carol.w@university.edu'),
('David Brown', 'CS2021004', 'Information Technology', 'david.b@university.edu'),
('Emma Davis', 'CS2021005', 'Computer Science', 'emma.d@university.edu');

-- Insert sample marks for Student 1 (Excellent student)
INSERT INTO marks (student_id, subject_id, semester, marks, max_marks) VALUES
(1, 1, 1, 92, 100), (1, 2, 1, 88, 100), (1, 3, 1, 95, 100), (1, 4, 1, 90, 100), (1, 5, 1, 87, 100),
(1, 6, 2, 94, 100), (1, 7, 2, 91, 100), (1, 8, 2, 89, 100), (1, 9, 2, 93, 100), (1, 10, 2, 88, 100);

-- Insert sample marks for Student 2 (Average student)
INSERT INTO marks (student_id, subject_id, semester, marks, max_marks) VALUES
(2, 1, 1, 72, 100), (2, 2, 1, 68, 100), (2, 3, 1, 75, 100), (2, 4, 1, 70, 100), (2, 5, 1, 73, 100),
(2, 6, 2, 74, 100), (2, 7, 2, 71, 100), (2, 8, 2, 69, 100), (2, 9, 2, 76, 100), (2, 10, 2, 72, 100);

-- Insert sample marks for Student 3 (At-risk student)
INSERT INTO marks (student_id, subject_id, semester, marks, max_marks) VALUES
(3, 1, 1, 58, 100), (3, 2, 1, 62, 100), (3, 3, 1, 55, 100), (3, 4, 1, 60, 100), (3, 5, 1, 57, 100),
(3, 6, 2, 52, 100), (3, 7, 2, 48, 100), (3, 8, 2, 51, 100), (3, 9, 2, 54, 100), (3, 10, 2, 50, 100);

-- Insert sample marks for Student 4 (Good student)
INSERT INTO marks (student_id, subject_id, semester, marks, max_marks) VALUES
(4, 1, 1, 82, 100), (4, 2, 1, 85, 100), (4, 3, 1, 80, 100), (4, 4, 1, 83, 100), (4, 5, 1, 81, 100),
(4, 6, 2, 84, 100), (4, 7, 2, 86, 100), (4, 8, 2, 82, 100), (4, 9, 2, 85, 100), (4, 10, 2, 83, 100);

-- Insert sample marks for Student 5 (Improving student)
INSERT INTO marks (student_id, subject_id, semester, marks, max_marks) VALUES
(5, 1, 1, 65, 100), (5, 2, 1, 68, 100), (5, 3, 1, 63, 100), (5, 4, 1, 67, 100), (5, 5, 1, 64, 100),
(5, 6, 2, 75, 100), (5, 7, 2, 78, 100), (5, 8, 2, 73, 100), (5, 9, 2, 76, 100), (5, 10, 2, 74, 100);

-- =====================================================
-- Useful Queries
-- =====================================================

-- Get student with CGPA
SELECT 
    s.id,
    s.name,
    s.roll_number,
    s.department,
    AVG((m.marks / m.max_marks) * 10) as cgpa
FROM students s
LEFT JOIN marks m ON s.id = m.student_id
GROUP BY s.id, s.name, s.roll_number, s.department;

-- Get semester-wise performance for a student
SELECT 
    semester,
    AVG((marks / max_marks) * 10) as sgpa,
    COUNT(*) as subjects_count
FROM marks
WHERE student_id = 1
GROUP BY semester
ORDER BY semester;

-- Get top performers (CGPA >= 8.5)
SELECT 
    s.name,
    s.roll_number,
    AVG((m.marks / m.max_marks) * 10) as cgpa
FROM students s
JOIN marks m ON s.id = m.student_id
GROUP BY s.id, s.name, s.roll_number
HAVING cgpa >= 8.5
ORDER BY cgpa DESC;

-- Get at-risk students (CGPA < 6.5)
SELECT 
    s.name,
    s.roll_number,
    AVG((m.marks / m.max_marks) * 10) as cgpa
FROM students s
JOIN marks m ON s.id = m.student_id
GROUP BY s.id, s.name, s.roll_number
HAVING cgpa < 6.5
ORDER BY cgpa ASC;
