import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { studentAPI } from '../api/api';

const AddEditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    department: '',
    email: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEdit && id) {
      loadStudent(parseInt(id));
    }
  }, [id, isEdit]);
  
  const loadStudent = async (studentId: number) => {
    try {
      setLoading(true);
      const student = await studentAPI.getById(studentId);
      if (student) {
        setFormData({
          name: student.name,
          roll_number: student.roll_number,
          department: student.department,
          email: student.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading student:', error);
      alert('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.roll_number || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEdit && id) {
        await studentAPI.update(parseInt(id), formData);
      } else {
        await studentAPI.create(formData);
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update student information' : 'Register a new student in the system'}
          </p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student's full name"
            />
          </div>
          
          {/* Roll Number */}
          <div>
            <label htmlFor="roll_number" className="block text-sm font-semibold text-gray-700 mb-2">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roll_number"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CS2021001"
            />
          </div>
          
          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="student@university.edu"
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {submitting ? 'Saving...' : isEdit ? 'Update Student' : 'Add Student'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditStudent;
