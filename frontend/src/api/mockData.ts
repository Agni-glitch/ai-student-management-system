// Mock data for demonstration and testing
import { Student, Subject, Mark } from '../types';

export const mockSubjects: Subject[] = [
  { id: 1, name: 'Data Structures', code: 'CS101', credits: 4 },
  { id: 2, name: 'Database Systems', code: 'CS102', credits: 4 },
  { id: 3, name: 'Web Development', code: 'CS103', credits: 3 },
  { id: 4, name: 'Operating Systems', code: 'CS104', credits: 4 },
  { id: 5, name: 'Computer Networks', code: 'CS105', credits: 3 },
  { id: 6, name: 'Machine Learning', code: 'CS201', credits: 4 },
  { id: 7, name: 'Artificial Intelligence', code: 'CS202', credits: 4 },
  { id: 8, name: 'Software Engineering', code: 'CS203', credits: 3 },
  { id: 9, name: 'Compiler Design', code: 'CS204', credits: 4 },
  { id: 10, name: 'Cloud Computing', code: 'CS205', credits: 3 },
];

export const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    roll_number: 'CS2021001',
    department: 'Computer Science',
    email: 'alice.j@university.edu',
    created_at: '2021-08-01',
  },
  {
    id: 2,
    name: 'Bob Smith',
    roll_number: 'CS2021002',
    department: 'Computer Science',
    email: 'bob.s@university.edu',
    created_at: '2021-08-01',
  },
  {
    id: 3,
    name: 'Carol Williams',
    roll_number: 'CS2021003',
    department: 'Computer Science',
    email: 'carol.w@university.edu',
    created_at: '2021-08-01',
  },
  {
    id: 4,
    name: 'David Brown',
    roll_number: 'CS2021004',
    department: 'Information Technology',
    email: 'david.b@university.edu',
    created_at: '2021-08-01',
  },
  {
    id: 5,
    name: 'Emma Davis',
    roll_number: 'CS2021005',
    department: 'Computer Science',
    email: 'emma.d@university.edu',
    created_at: '2021-08-01',
  },
];

export const mockMarks: Mark[] = [
  // Semester 1 - Alice (Excellent student)
  { id: 1, student_id: 1, subject_id: 1, semester: 1, marks: 92, max_marks: 100 },
  { id: 2, student_id: 1, subject_id: 2, semester: 1, marks: 88, max_marks: 100 },
  { id: 3, student_id: 1, subject_id: 3, semester: 1, marks: 95, max_marks: 100 },
  { id: 4, student_id: 1, subject_id: 4, semester: 1, marks: 90, max_marks: 100 },
  { id: 5, student_id: 1, subject_id: 5, semester: 1, marks: 87, max_marks: 100 },
  
  // Semester 2 - Alice
  { id: 6, student_id: 1, subject_id: 6, semester: 2, marks: 94, max_marks: 100 },
  { id: 7, student_id: 1, subject_id: 7, semester: 2, marks: 91, max_marks: 100 },
  { id: 8, student_id: 1, subject_id: 8, semester: 2, marks: 89, max_marks: 100 },
  { id: 9, student_id: 1, subject_id: 9, semester: 2, marks: 93, max_marks: 100 },
  { id: 10, student_id: 1, subject_id: 10, semester: 2, marks: 88, max_marks: 100 },
  
  // Semester 1 - Bob (Average student)
  { id: 11, student_id: 2, subject_id: 1, semester: 1, marks: 72, max_marks: 100 },
  { id: 12, student_id: 2, subject_id: 2, semester: 1, marks: 68, max_marks: 100 },
  { id: 13, student_id: 2, subject_id: 3, semester: 1, marks: 75, max_marks: 100 },
  { id: 14, student_id: 2, subject_id: 4, semester: 1, marks: 70, max_marks: 100 },
  { id: 15, student_id: 2, subject_id: 5, semester: 1, marks: 73, max_marks: 100 },
  
  // Semester 2 - Bob
  { id: 16, student_id: 2, subject_id: 6, semester: 2, marks: 74, max_marks: 100 },
  { id: 17, student_id: 2, subject_id: 7, semester: 2, marks: 71, max_marks: 100 },
  { id: 18, student_id: 2, subject_id: 8, semester: 2, marks: 69, max_marks: 100 },
  { id: 19, student_id: 2, subject_id: 9, semester: 2, marks: 76, max_marks: 100 },
  { id: 20, student_id: 2, subject_id: 10, semester: 2, marks: 72, max_marks: 100 },
  
  // Semester 1 - Carol (At-risk student)
  { id: 21, student_id: 3, subject_id: 1, semester: 1, marks: 58, max_marks: 100 },
  { id: 22, student_id: 3, subject_id: 2, semester: 1, marks: 62, max_marks: 100 },
  { id: 23, student_id: 3, subject_id: 3, semester: 1, marks: 55, max_marks: 100 },
  { id: 24, student_id: 3, subject_id: 4, semester: 1, marks: 60, max_marks: 100 },
  { id: 25, student_id: 3, subject_id: 5, semester: 1, marks: 57, max_marks: 100 },
  
  // Semester 2 - Carol (Declining)
  { id: 26, student_id: 3, subject_id: 6, semester: 2, marks: 52, max_marks: 100 },
  { id: 27, student_id: 3, subject_id: 7, semester: 2, marks: 48, max_marks: 100 },
  { id: 28, student_id: 3, subject_id: 8, semester: 2, marks: 51, max_marks: 100 },
  { id: 29, student_id: 3, subject_id: 9, semester: 2, marks: 54, max_marks: 100 },
  { id: 30, student_id: 3, subject_id: 10, semester: 2, marks: 50, max_marks: 100 },
  
  // Semester 1 - David (Good student)
  { id: 31, student_id: 4, subject_id: 1, semester: 1, marks: 82, max_marks: 100 },
  { id: 32, student_id: 4, subject_id: 2, semester: 1, marks: 85, max_marks: 100 },
  { id: 33, student_id: 4, subject_id: 3, semester: 1, marks: 80, max_marks: 100 },
  { id: 34, student_id: 4, subject_id: 4, semester: 1, marks: 83, max_marks: 100 },
  { id: 35, student_id: 4, subject_id: 5, semester: 1, marks: 81, max_marks: 100 },
  
  // Semester 2 - David
  { id: 36, student_id: 4, subject_id: 6, semester: 2, marks: 84, max_marks: 100 },
  { id: 37, student_id: 4, subject_id: 7, semester: 2, marks: 86, max_marks: 100 },
  { id: 38, student_id: 4, subject_id: 8, semester: 2, marks: 82, max_marks: 100 },
  { id: 39, student_id: 4, subject_id: 9, semester: 2, marks: 85, max_marks: 100 },
  { id: 40, student_id: 4, subject_id: 10, semester: 2, marks: 83, max_marks: 100 },
  
  // Semester 1 - Emma (Improving student)
  { id: 41, student_id: 5, subject_id: 1, semester: 1, marks: 65, max_marks: 100 },
  { id: 42, student_id: 5, subject_id: 2, semester: 1, marks: 68, max_marks: 100 },
  { id: 43, student_id: 5, subject_id: 3, semester: 1, marks: 63, max_marks: 100 },
  { id: 44, student_id: 5, subject_id: 4, semester: 1, marks: 67, max_marks: 100 },
  { id: 45, student_id: 5, subject_id: 5, semester: 1, marks: 64, max_marks: 100 },
  
  // Semester 2 - Emma (Improving)
  { id: 46, student_id: 5, subject_id: 6, semester: 2, marks: 75, max_marks: 100 },
  { id: 47, student_id: 5, subject_id: 7, semester: 2, marks: 78, max_marks: 100 },
  { id: 48, student_id: 5, subject_id: 8, semester: 2, marks: 73, max_marks: 100 },
  { id: 49, student_id: 5, subject_id: 9, semester: 2, marks: 76, max_marks: 100 },
  { id: 50, student_id: 5, subject_id: 10, semester: 2, marks: 74, max_marks: 100 },
];
