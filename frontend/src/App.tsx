import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddEditStudent from './pages/AddEditStudent';
import StudentDetail from './pages/StudentDetail';
import ManageMarks from './pages/ManageMarks';
import Predictions from './pages/Predictions';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/add-student" element={<AddEditStudent />} />
          <Route path="/edit-student/:id" element={<AddEditStudent />} />
          <Route path="/marks" element={<ManageMarks />} />
          <Route path="/predictions" element={<Predictions />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
