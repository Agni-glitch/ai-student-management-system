// API Layer - Mock implementation simulating Flask REST API
// In production, this would use Axios to communicate with Flask backend

import { Student, Subject, Mark, StudentWithMarks, PredictionResult, DashboardStats } from '../types';
import { mockStudents, mockSubjects, mockMarks } from './mockData';
import { generatePrediction, calculateCGPA } from './mlEngine';

// Local storage keys
const STORAGE_KEYS = {
  STUDENTS: 'sms_students',
  SUBJECTS: 'sms_subjects',
  MARKS: 'sms_marks',
};

// Initialize local storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(mockSubjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MARKS)) {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(mockMarks));
  }
};

// Helper to get data from storage
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to storage
const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== STUDENT APIS ====================

export const studentAPI = {
  // GET /students - Get all students
  getAll: async (): Promise<Student[]> => {
    initializeStorage();
    await delay();
    return getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
  },

  // GET /students/:id - Get student by ID
  getById: async (id: number): Promise<Student | null> => {
    initializeStorage();
    await delay();
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    return students.find(s => s.id === id) || null;
  },

  // POST /students - Create new student
  create: async (studentData: Omit<Student, 'id' | 'created_at'>): Promise<Student> => {
    initializeStorage();
    await delay();
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    
    const newStudent: Student = {
      ...studentData,
      id: Math.max(0, ...students.map(s => s.id)) + 1,
      created_at: new Date().toISOString().split('T')[0],
    };
    
    students.push(newStudent);
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  },

  // PUT /students/:id - Update student
  update: async (id: number, studentData: Partial<Student>): Promise<Student | null> => {
    initializeStorage();
    await delay();
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    students[index] = { ...students[index], ...studentData };
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    return students[index];
  },

  // DELETE /students/:id - Delete student
  delete: async (id: number): Promise<boolean> => {
    initializeStorage();
    await delay();
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    const filtered = students.filter(s => s.id !== id);
    
    if (filtered.length === students.length) return false;
    
    saveToStorage(STORAGE_KEYS.STUDENTS, filtered);
    
    // Also delete associated marks
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    const filteredMarks = marks.filter(m => m.student_id !== id);
    saveToStorage(STORAGE_KEYS.MARKS, filteredMarks);
    
    return true;
  },

  // GET /students/:id/complete - Get student with all marks
  getWithMarks: async (id: number): Promise<StudentWithMarks | null> => {
    initializeStorage();
    await delay();
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    const student = students.find(s => s.id === id);
    
    if (!student) return null;
    
    const marks = await marksAPI.getByStudentId(id);
    const cgpa = calculateCGPA(marks);
    
    return {
      ...student,
      marks,
      cgpa,
    };
  },
};

// ==================== SUBJECTS APIS ====================

export const subjectsAPI = {
  // GET /subjects - Get all subjects
  getAll: async (): Promise<Subject[]> => {
    initializeStorage();
    await delay();
    return getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
  },

  // GET /subjects/:id - Get subject by ID
  getById: async (id: number): Promise<Subject | null> => {
    initializeStorage();
    await delay();
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    return subjects.find(s => s.id === id) || null;
  },

  // POST /subjects - Create new subject
  create: async (subjectData: Omit<Subject, 'id'>): Promise<Subject> => {
    initializeStorage();
    await delay();
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    
    const newSubject: Subject = {
      ...subjectData,
      id: Math.max(0, ...subjects.map(s => s.id)) + 1,
    };
    
    subjects.push(newSubject);
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
    return newSubject;
  },
};

// ==================== MARKS APIS ====================

export const marksAPI = {
  // GET /marks/:student_id - Get all marks for a student
  getByStudentId: async (studentId: number): Promise<Mark[]> => {
    initializeStorage();
    await delay();
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    const subjects = getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
    
    return marks
      .filter(m => m.student_id === studentId)
      .map(mark => {
        const subject = subjects.find(s => s.id === mark.subject_id);
        return {
          ...mark,
          subject_name: subject?.name,
          subject_code: subject?.code,
        };
      });
  },

  // POST /marks - Create new mark entry
  create: async (markData: Omit<Mark, 'id'>): Promise<Mark> => {
    initializeStorage();
    await delay();
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    
    const newMark: Mark = {
      ...markData,
      id: Math.max(0, ...marks.map(m => m.id)) + 1,
    };
    
    marks.push(newMark);
    saveToStorage(STORAGE_KEYS.MARKS, marks);
    return newMark;
  },

  // PUT /marks/:id - Update mark
  update: async (id: number, markData: Partial<Mark>): Promise<Mark | null> => {
    initializeStorage();
    await delay();
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    const index = marks.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    marks[index] = { ...marks[index], ...markData };
    saveToStorage(STORAGE_KEYS.MARKS, marks);
    return marks[index];
  },

  // DELETE /marks/:id - Delete mark
  delete: async (id: number): Promise<boolean> => {
    initializeStorage();
    await delay();
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    const filtered = marks.filter(m => m.id !== id);
    
    if (filtered.length === marks.length) return false;
    
    saveToStorage(STORAGE_KEYS.MARKS, filtered);
    return true;
  },
};

// ==================== ML/PREDICTION APIS ====================

export const predictionAPI = {
  // GET /predict/:student_id - Get prediction for a student
  predict: async (studentId: number): Promise<PredictionResult | null> => {
    initializeStorage();
    await delay(500); // Longer delay to simulate ML processing
    
    const marks = await marksAPI.getByStudentId(studentId);
    
    if (marks.length === 0) return null;
    
    return generatePrediction({ student_id: studentId, marks });
  },

  // POST /train-model - Trigger model training (simulated)
  trainModel: async (): Promise<{ success: boolean; message: string }> => {
    initializeStorage();
    await delay(1000); // Simulate training time
    
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    
    return {
      success: true,
      message: `Model trained successfully on ${students.length} students with ${marks.length} data points`,
    };
  },
};

// ==================== DASHBOARD/STATS APIS ====================

export const dashboardAPI = {
  // GET /dashboard/stats - Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    initializeStorage();
    await delay();
    
    const students = getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
    const marks = getFromStorage<Mark>(STORAGE_KEYS.MARKS);
    
    // Calculate average CGPA
    const studentCGPAs = students.map(student => {
      const studentMarks = marks.filter(m => m.student_id === student.id);
      return calculateCGPA(studentMarks);
    }).filter(cgpa => cgpa > 0);
    
    const averageCGPA = studentCGPAs.length > 0
      ? studentCGPAs.reduce((sum, cgpa) => sum + cgpa, 0) / studentCGPAs.length
      : 0;
    
    // Count at-risk students (CGPA < 6.5)
    const atRiskStudents = studentCGPAs.filter(cgpa => cgpa < 6.5).length;
    
    // Count top performers (CGPA >= 8.5)
    const topPerformers = studentCGPAs.filter(cgpa => cgpa >= 8.5).length;
    
    return {
      total_students: students.length,
      average_cgpa: Math.round(averageCGPA * 100) / 100,
      at_risk_students: atRiskStudents,
      top_performers: topPerformers,
    };
  },
};
