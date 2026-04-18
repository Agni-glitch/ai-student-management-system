import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, User, BookOpen, TrendingUp } from 'lucide-react';
import { studentAPI, marksAPI } from '../api/api';
import { Student, Mark } from '../types';
import { calculateCGPA, calculateSemesterCGPA } from '../api/mlEngine';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      loadStudentData(parseInt(id));
    }
  }, [id]);
  
  const loadStudentData = async (studentId: number) => {
    try {
      setLoading(true);
      const [studentData, marksData] = await Promise.all([
        studentAPI.getById(studentId),
        marksAPI.getByStudentId(studentId),
      ]);
      
      setStudent(studentData);
      setMarks(marksData);
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Student not found</p>
        <button
          onClick={() => navigate('/students')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Students
        </button>
      </div>
    );
  }
  
  const cgpa = calculateCGPA(marks);
  const semesterTrend = calculateSemesterCGPA(marks);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-600 mt-1">Student Details & Performance</p>
          </div>
        </div>
        <Link
          to={`/edit-student/${student.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Edit Student
        </Link>
      </div>
      
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Roll Number</p>
            <p className="text-lg font-semibold text-gray-900 font-mono">{student.roll_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Department</p>
            <p className="text-lg font-semibold text-gray-900">{student.department}</p>
          </div>
          {student.email && (
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {student.email}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Enrolled Since</p>
            <p className="text-lg font-semibold text-gray-900">{student.created_at}</p>
          </div>
        </div>
      </div>
      
      {/* Academic Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Overall CGPA</p>
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-5xl font-bold">{cgpa.toFixed(2)}</p>
          <p className="text-sm opacity-75 mt-2">Out of 10.00</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Total Subjects</p>
            <BookOpen className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-5xl font-bold">{marks.length}</p>
          <p className="text-sm opacity-75 mt-2">Across all semesters</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Semesters Completed</p>
            <User className="w-6 h-6 opacity-75" />
          </div>
          <p className="text-5xl font-bold">{semesterTrend.length}</p>
          <p className="text-sm opacity-75 mt-2">Academic progress</p>
        </div>
      </div>
      
      {/* Semester-wise Performance */}
      {semesterTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Semester-wise Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {semesterTrend.map(({ semester, cgpa: semCgpa }) => (
              <div
                key={semester}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200"
              >
                <p className="text-sm text-gray-600 font-medium mb-1">Semester {semester}</p>
                <p className="text-3xl font-bold text-blue-600">{semCgpa.toFixed(2)}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(semCgpa / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Detailed Marks */}
      {marks.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Marks</h3>
          
          {Array.from(new Set(marks.map(m => m.semester))).sort().map(semester => (
            <div key={semester} className="mb-8 last:mb-0">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-blue-200">
                Semester {semester}
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Code
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Percentage
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {marks
                      .filter(m => m.semester === semester)
                      .map(mark => {
                        const percentage = (mark.marks / mark.max_marks) * 100;
                        const grade = 
                          percentage >= 90 ? 'A+' :
                          percentage >= 80 ? 'A' :
                          percentage >= 70 ? 'B+' :
                          percentage >= 60 ? 'B' :
                          percentage >= 50 ? 'C' : 'F';
                        
                        return (
                          <tr key={mark.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{mark.subject_name}</td>
                            <td className="px-4 py-3 text-gray-600 font-mono text-sm">{mark.subject_code}</td>
                            <td className="px-4 py-3 text-center font-semibold">
                              {mark.marks}/{mark.max_marks}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-semibold ${
                                percentage >= 90 ? 'text-green-600' :
                                percentage >= 75 ? 'text-blue-600' :
                                percentage >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {percentage.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                percentage >= 80 ? 'bg-green-100 text-green-700' :
                                percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No marks recorded for this student</p>
          <Link
            to="/marks"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add Marks
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
