// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterParentPage from './pages/RegisterParentPage';
import RegisterSchoolPage from './pages/RegisterSchoolPage';
import AddChildPage from './pages/AddChildPage';
import ChildDashboardPage from './pages/ChildDashboardPage';
import AdminPage from './pages/AdminPage';
import ParentDashboard from './pages/ParentDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/parent" element={<RegisterParentPage />} />
        <Route path="/register/school" element={<RegisterSchoolPage />} />
        
        {/* Protected routes */}
        <Route path="/add-child" element={
          user?.role === 'parent' ? <AddChildPage /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          user ? (
            user.role === 'parent' ? <ParentDashboard /> :
            user.role === 'admin' ? <AdminPage /> :
            user.role === 'school' ? <SchoolDashboard /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />
        } />
        <Route path="/child/:username" element={
          user ? <ChildDashboardPage /> : <Navigate to="/login" />
        } />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </Router>
  );
}

export default App;