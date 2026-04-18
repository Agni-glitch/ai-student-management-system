import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  ArrowRight,
  Brain,
  Plus
} from 'lucide-react';
import { dashboardAPI, studentAPI, predictionAPI } from '../api/api';
import { DashboardStats, Student, PredictionResult } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, studentsData] = await Promise.all([
        dashboardAPI.getStats(),
        studentAPI.getAll(),
      ]);
      
      setStats(statsData);
      setRecentStudents(studentsData.slice(0, 5));
      
      // Load predictions for first 3 students
      const predictionPromises = studentsData.slice(0, 3).map(s => 
        predictionAPI.predict(s.id)
      );
      const predictionsData = await Promise.all(predictionPromises);
      setPredictions(predictionsData.filter(p => p !== null) as PredictionResult[]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of student performance and analytics</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.total_students || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Average CGPA</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.average_cgpa.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Top Performers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.top_performers || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">At-Risk Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.at_risk_students || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Students</h3>
            <Link 
              to="/students" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentStudents.map(student => (
              <Link
                key={student.id}
                to={`/students/${student.id}`}
                className="block p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.roll_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{student.department}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* ML Predictions Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              ML Predictions
            </h3>
            <Link 
              to="/predictions" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {predictions.map(prediction => {
              const riskColor = 
                prediction.risk_level === 'High' ? 'red' :
                prediction.risk_level === 'Medium' ? 'yellow' : 'green';
              
              return (
                <div key={prediction.student_id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">Student #{prediction.student_id}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${riskColor}-100 text-${riskColor}-700`}>
                      {prediction.risk_level} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current CGPA</p>
                      <p className="font-bold text-gray-900">{prediction.current_cgpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Predicted CGPA</p>
                      <p className="font-bold text-gray-900">{prediction.predicted_cgpa.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/add-student"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6" />
              <div>
                <p className="font-semibold">Add New Student</p>
                <p className="text-sm text-blue-100">Register a new student</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/marks"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <div>
                <p className="font-semibold">Manage Marks</p>
                <p className="text-sm text-blue-100">Add or update marks</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/predictions"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6" />
              <div>
                <p className="font-semibold">View Predictions</p>
                <p className="text-sm text-blue-100">ML-powered analytics</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
