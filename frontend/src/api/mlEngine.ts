// Machine Learning Engine - Client-side implementation
// This simulates the ML prediction logic that would run on the Flask backend

import { Mark, PredictionResult } from '../types';

interface StudentMarksData {
  student_id: number;
  marks: Mark[];
}

// Calculate CGPA from marks
export const calculateCGPA = (marks: Mark[]): number => {
  if (marks.length === 0) return 0;
  
  const totalPercentage = marks.reduce((sum, mark) => {
    const percentage = (mark.marks / mark.max_marks) * 100;
    return sum + percentage;
  }, 0);
  
  const averagePercentage = totalPercentage / marks.length;
  
  // Convert percentage to 10-point CGPA scale
  // 90-100 -> 9-10, 80-90 -> 8-9, etc.
  const cgpa = averagePercentage / 10;
  return Math.round(cgpa * 100) / 100;
};

// Calculate semester-wise CGPA
export const calculateSemesterCGPA = (marks: Mark[]): { semester: number; cgpa: number }[] => {
  const semesterMap = new Map<number, Mark[]>();
  
  marks.forEach(mark => {
    if (!semesterMap.has(mark.semester)) {
      semesterMap.set(mark.semester, []);
    }
    semesterMap.get(mark.semester)!.push(mark);
  });
  
  const semesterTrend: { semester: number; cgpa: number }[] = [];
  
  semesterMap.forEach((semMarks, semester) => {
    const cgpa = calculateCGPA(semMarks);
    semesterTrend.push({ semester, cgpa });
  });
  
  return semesterTrend.sort((a, b) => a.semester - b.semester);
};

// Simple Linear Regression for CGPA prediction
export const predictFutureCGPA = (semesterTrend: { semester: number; cgpa: number }[]): number => {
  if (semesterTrend.length < 2) {
    return semesterTrend.length > 0 ? semesterTrend[0].cgpa : 0;
  }
  
  const n = semesterTrend.length;
  
  // Calculate means
  const meanX = semesterTrend.reduce((sum, d) => sum + d.semester, 0) / n;
  const meanY = semesterTrend.reduce((sum, d) => sum + d.cgpa, 0) / n;
  
  // Calculate slope (m) and intercept (b)
  let numerator = 0;
  let denominator = 0;
  
  semesterTrend.forEach(point => {
    numerator += (point.semester - meanX) * (point.cgpa - meanY);
    denominator += (point.semester - meanX) ** 2;
  });
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;
  
  // Predict for next semester
  const nextSemester = Math.max(...semesterTrend.map(d => d.semester)) + 1;
  const predictedCGPA = slope * nextSemester + intercept;
  
  // Clamp between 0 and 10
  return Math.max(0, Math.min(10, Math.round(predictedCGPA * 100) / 100));
};

// Random Forest-like classification for risk assessment
export const assessAcademicRisk = (
  currentCGPA: number,
  predictedCGPA: number,
  semesterTrend: { semester: number; cgpa: number }[]
): { risk_level: 'Low' | 'Medium' | 'High'; risk_score: number } => {
  let riskScore = 0;
  
  // Factor 1: Current CGPA (40% weight)
  if (currentCGPA < 5.0) riskScore += 40;
  else if (currentCGPA < 6.5) riskScore += 25;
  else if (currentCGPA < 7.5) riskScore += 10;
  
  // Factor 2: Trend (30% weight)
  if (semesterTrend.length >= 2) {
    const lastTwo = semesterTrend.slice(-2);
    const trend = lastTwo[1].cgpa - lastTwo[0].cgpa;
    
    if (trend < -0.5) riskScore += 30;
    else if (trend < 0) riskScore += 15;
    else if (trend > 0.5) riskScore -= 10;
  }
  
  // Factor 3: Predicted vs Current (30% weight)
  const cgpaDiff = predictedCGPA - currentCGPA;
  if (cgpaDiff < -0.3) riskScore += 30;
  else if (cgpaDiff < 0) riskScore += 15;
  else if (cgpaDiff > 0.3) riskScore -= 10;
  
  // Normalize risk score to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore));
  
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (riskScore >= 60) riskLevel = 'High';
  else if (riskScore >= 30) riskLevel = 'Medium';
  else riskLevel = 'Low';
  
  return { risk_level: riskLevel, risk_score: riskScore };
};

// Generate personalized recommendations
export const generateRecommendations = (
  _currentCGPA: number,
  riskLevel: 'Low' | 'Medium' | 'High',
  semesterTrend: { semester: number; cgpa: number }[]
): string[] => {
  const recommendations: string[] = [];
  
  if (riskLevel === 'High') {
    recommendations.push('⚠️ Immediate academic intervention required');
    recommendations.push('📚 Consider attending additional tutoring sessions');
    recommendations.push('👥 Join study groups for difficult subjects');
    recommendations.push('🎯 Focus on improving weak areas identified in assessments');
    recommendations.push('💬 Schedule a meeting with academic advisor');
  } else if (riskLevel === 'Medium') {
    recommendations.push('📈 Monitor performance closely in upcoming assessments');
    recommendations.push('⏰ Improve time management and study schedule');
    recommendations.push('📝 Practice more problems in challenging subjects');
    recommendations.push('🤝 Collaborate with peers for better understanding');
  } else {
    recommendations.push('✅ Maintain current study habits and performance');
    recommendations.push('🎓 Consider taking advanced or honors courses');
    recommendations.push('🔬 Explore research opportunities or projects');
    recommendations.push('👨‍🏫 Mentor students who need academic support');
  }
  
  // Trend-based recommendations
  if (semesterTrend.length >= 2) {
    const lastTwo = semesterTrend.slice(-2);
    const trend = lastTwo[1].cgpa - lastTwo[0].cgpa;
    
    if (trend > 0.5) {
      recommendations.push('📊 Excellent improvement trend - keep up the good work!');
    } else if (trend < -0.5) {
      recommendations.push('📉 Declining trend detected - identify and address challenges early');
    }
  }
  
  return recommendations;
};

// Main prediction function
export const generatePrediction = (studentData: StudentMarksData): PredictionResult => {
  const { student_id, marks } = studentData;
  
  // Calculate current CGPA
  const currentCGPA = calculateCGPA(marks);
  
  // Calculate semester-wise trend
  const semesterTrend = calculateSemesterCGPA(marks);
  
  // Predict future CGPA
  const predictedCGPA = predictFutureCGPA(semesterTrend);
  
  // Assess risk
  const { risk_level, risk_score } = assessAcademicRisk(currentCGPA, predictedCGPA, semesterTrend);
  
  // Generate recommendations
  const recommendations = generateRecommendations(currentCGPA, risk_level, semesterTrend);
  
  return {
    student_id,
    predicted_cgpa: predictedCGPA,
    current_cgpa: currentCGPA,
    risk_level,
    risk_score,
    recommendations,
    semester_trend: semesterTrend,
  };
};
