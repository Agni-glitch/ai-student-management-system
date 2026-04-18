// Type definitions for the Student Management System

export interface Student {
  id: number;
  name: string;
  roll_number: string;
  department: string;
  email?: string;
  created_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
}

export interface Mark {
  id: number;
  student_id: number;
  subject_id: number;
  semester: number;
  marks: number;
  max_marks: number;
  subject_name?: string;
  subject_code?: string;
}

export interface StudentWithMarks extends Student {
  marks: Mark[];
  cgpa?: number;
}

export interface PredictionResult {
  student_id: number;
  predicted_cgpa: number;
  current_cgpa: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_score: number;
  recommendations: string[];
  semester_trend: {
    semester: number;
    cgpa: number;
  }[];
}

export interface DashboardStats {
  total_students: number;
  average_cgpa: number;
  at_risk_students: number;
  top_performers: number;
}

export interface SemesterData {
  semester: number;
  subjects: {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    marks: number;
    max_marks: number;
  }[];
  sgpa?: number;
}
