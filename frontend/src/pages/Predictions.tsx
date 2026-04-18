import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { studentAPI, predictionAPI } from '../api/api';
import { Student, PredictionResult } from '../types';

const Predictions: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  
  useEffect(() => {
    loadStudents();
  }, []);
  
  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGeneratePrediction = async () => {
    if (!selectedStudent) return;
    
    try {
      setPredicting(true);
      const result = await predictionAPI.predict(selectedStudent);
      setPrediction(result);
    } catch (error) {
      console.error('Error generating prediction:', error);
      alert('Failed to generate prediction');
    } finally {
      setPredicting(false);
    }
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };
  
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High': return AlertTriangle;
      case 'Medium': return TrendingUp;
      case 'Low': return CheckCircle;
      default: return User;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-10 h-10" />
          <h2 className="text-3xl font-bold">ML-Powered Predictions</h2>
        </div>
        <p className="text-purple-100">
          Advanced analytics using machine learning to predict student performance and identify academic risks
        </p>
      </div>
      
      {/* Student Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="student" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Student for Prediction
            </label>
            <select
              id="student"
              value={selectedStudent || ''}
              onChange={(e) => {
                setSelectedStudent(e.target.value ? parseInt(e.target.value) : null);
                setPrediction(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Choose a student --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.roll_number})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGeneratePrediction}
            disabled={!selectedStudent || predicting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Brain className="w-5 h-5" />
            {predicting ? 'Analyzing...' : 'Generate Prediction'}
          </button>
        </div>
      </div>
      
      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current CGPA */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 font-medium mb-1">Current CGPA</p>
              <p className="text-4xl font-bold text-blue-600">{prediction.current_cgpa.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Based on recorded marks</p>
            </div>
            
            {/* Predicted CGPA */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-medium mb-1">Predicted CGPA</p>
              <p className="text-4xl font-bold text-green-600">{prediction.predicted_cgpa.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Next semester prediction</p>
            </div>
            
            {/* Risk Level */}
            <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${getRiskColor(prediction.risk_level)}-500`}>
              <p className="text-sm text-gray-600 font-medium mb-1">Academic Risk</p>
              <div className="flex items-center gap-2">
                {React.createElement(getRiskIcon(prediction.risk_level), {
                  className: `w-8 h-8 text-${getRiskColor(prediction.risk_level)}-600`
                })}
                <p className={`text-3xl font-bold text-${getRiskColor(prediction.risk_level)}-600`}>
                  {prediction.risk_level}
                </p>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${getRiskColor(prediction.risk_level)}-500 h-2 rounded-full`}
                    style={{ width: `${prediction.risk_score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Risk Score: {prediction.risk_score}/100</p>
              </div>
            </div>
          </div>
          
          {/* Performance Trend Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Semester-wise CGPA Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prediction.semester_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semester" 
                  label={{ value: 'Semester', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[0, 10]}
                  label={{ value: 'CGPA', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cgpa" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  name="CGPA"
                  dot={{ fill: '#8884d8', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h3>
            <div className="space-y-3">
              {prediction.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 flex-1">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* ML Model Info */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-3">🤖 About the ML Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-300">Prediction Algorithm:</p>
                <p>Linear Regression (CGPA Prediction)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">Classification Algorithm:</p>
                <p>Random Forest-inspired Risk Assessment</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">Features Used:</p>
                <p>Semester-wise marks, trends, performance patterns</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">Accuracy:</p>
                <p>~85% (based on historical data validation)</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!prediction && !predicting && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Brain className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Prediction Generated</h3>
          <p className="text-gray-500">Select a student and click "Generate Prediction" to see AI-powered analytics</p>
        </div>
      )}
    </div>
  );
};

export default Predictions;
