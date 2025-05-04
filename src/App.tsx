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

// Feature Pages
import InteractiveLessons from './pages/features/InteractiveLessons';
import MathGames from './pages/features/MathGames';
import ProgressTracking from './pages/features/ProgressTracking';
import PersonalizedLearning from './pages/features/PersonalizedLearning';
import MathsRanked from './pages/features/MathsRanked';

// Support Pages
import HelpCenter from './pages/support/HelpCenter';
import ContactUs from './pages/support/ContactUs';
import FAQ from './pages/support/FAQ';

// Legal Pages
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/parent" element={<RegisterParentPage />} />
        <Route path="/register/school" element={<RegisterSchoolPage />} />
        
        {/* Feature Pages */}
        <Route path="/features/interactive-lessons" element={<InteractiveLessons />} />
        <Route path="/features/math-games" element={<MathGames />} />
        <Route path="/features/progress-tracking" element={<ProgressTracking />} />
        <Route path="/features/personalized-learning" element={<PersonalizedLearning />} />
        <Route path="/features/maths-ranked" element={<MathsRanked />} />
        
        {/* Support Pages */}
        <Route path="/support/help-center" element={<HelpCenter />} />
        <Route path="/support/contact" element={<ContactUs />} />
        <Route path="/support/faq" element={<FAQ />} />
        
        {/* Legal Pages */}
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        
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