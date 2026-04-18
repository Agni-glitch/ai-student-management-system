import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { studentAPI, subjectsAPI, marksAPI } from '../api/api';
import { Student, Subject, Mark } from '../types';

const ManageMarks: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [studentMarks, setStudentMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newMark, setNewMark] = useState({
    subject_id: '',
    semester: '1',
    marks: '',
    max_marks: '100',
  });
  
  useEffect(() => {
    loadInitialData();
  }, []);
  
  useEffect(() => {
    if (selectedStudent) {
      loadStudentMarks(selectedStudent);
    }
  }, [selectedStudent]);
  
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [studentsData, subjectsData] = await Promise.all([
        studentAPI.getAll(),
        subjectsAPI.getAll(),
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadStudentMarks = async (studentId: number) => {
    try {
      const marks = await marksAPI.getByStudentId(studentId);
      setStudentMarks(marks);
    } catch (error) {
      console.error('Error loading marks:', error);
    }
  };
  
  const handleAddMark = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !newMark.subject_id || !newMark.marks) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const markData = {
        student_id: selectedStudent,
        subject_id: parseInt(newMark.subject_id),
        semester: parseInt(newMark.semester),
        marks: parseFloat(newMark.marks),
        max_marks: parseFloat(newMark.max_marks),
      };
      
      await marksAPI.create(markData);
      
      // Reset form
      setNewMark({
        subject_id: '',
        semester: '1',
        marks: '',
        max_marks: '100',
      });
      
      // Reload marks
      loadStudentMarks(selectedStudent);
    } catch (error) {
      console.error('Error adding mark:', error);
      alert('Failed to add mark');
    }
  };
  
  const handleDeleteMark = async (markId: number) => {
    if (!confirm('Are you sure you want to delete this mark?')) {
      return;
    }
    
    try {
      await marksAPI.delete(markId);
      setStudentMarks(studentMarks.filter(m => m.id !== markId));
    } catch (error) {
      console.error('Error deleting mark:', error);
      alert('Failed to delete mark');
    }
  };
  
  const getSubjectName = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unknown';
  };
  
  const calculateSemesterGPA = (semester: number) => {
    const semesterMarks = studentMarks.filter(m => m.semester === semester);
    if (semesterMarks.length === 0) return 0;
    
    const totalPercentage = semesterMarks.reduce((sum, mark) => {
      return sum + (mark.marks / mark.max_marks) * 100;
    }, 0);
    
    return (totalPercentage / semesterMarks.length / 10).toFixed(2);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Manage Marks</h2>
        <p className="text-gray-600 mt-1">Add and update student marks for various subjects</p>
      </div>
      
      {/* Student Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label htmlFor="student" className="block text-sm font-semibold text-gray-700 mb-2">
          Select Student
        </label>
        <select
          id="student"
          value={selectedStudent || ''}
          onChange={(e) => setSelectedStudent(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose a student --</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.roll_number})
            </option>
          ))}
        </select>
      </div>
      
      {selectedStudent && (
        <>
          {/* Add New Mark Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Mark
            </h3>
            
            <form onSubmit={handleAddMark} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={newMark.subject_id}
                  onChange={(e) => setNewMark({ ...newMark, subject_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={newMark.semester}
                  onChange={(e) => setNewMark({ ...newMark, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Sem {sem}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                <input
                  type="number"
                  value={newMark.marks}
                  onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
                  min="0"
                  max={newMark.max_marks}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                <input
                  type="number"
                  value={newMark.max_marks}
                  onChange={(e) => setNewMark({ ...newMark, max_marks: e.target.value })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Add
                </button>
              </div>
            </form>
          </div>
          
          {/* Existing Marks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Student Marks</h3>
            
            {studentMarks.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No marks recorded yet</p>
            ) : (
              <>
                {/* Group by semester */}
                {Array.from(new Set(studentMarks.map(m => m.semester))).sort().map(semester => (
                  <div key={semester} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Semester {semester}
                      </h4>
                      <span className="text-sm font-semibold text-blue-600">
                        SGPA: {calculateSemesterGPA(semester)}
                      </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              Subject
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                              Code
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                              Marks
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                              Percentage
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentMarks
                            .filter(m => m.semester === semester)
                            .map(mark => {
                              const percentage = (mark.marks / mark.max_marks) * 100;
                              return (
                                <tr key={mark.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-gray-900">
                                    {mark.subject_name || getSubjectName(mark.subject_id)}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600 font-mono text-sm">
                                    {mark.subject_code}
                                  </td>
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
                                    <button
                                      onClick={() => handleDeleteMark(mark.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageMarks;
