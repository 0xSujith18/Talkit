import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Trending from './pages/Trending';
import CreatePost from './pages/CreatePost';
import CreateReport from './pages/CreateReport';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import AuthorityDashboard from './pages/AuthorityDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AppLayout from './components/AppLayout';

// Talkit - Civic Engagement Platform
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<PublicRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Protected Routes Wrapped in AppLayout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/feed" element={<AppLayout><Feed /></AppLayout>} />
              <Route path="/trending" element={<AppLayout><Trending /></AppLayout>} />
              <Route path="/create" element={<AppLayout><CreatePost /></AppLayout>} />
              <Route path="/create-report" element={<AppLayout><CreateReport /></AppLayout>} />
              <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
              <Route path="/reports/:id" element={<AppLayout><ReportDetail /></AppLayout>} />
              <Route path="/authority" element={<AppLayout><AuthorityDashboard /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
