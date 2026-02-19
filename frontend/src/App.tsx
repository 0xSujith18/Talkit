import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/home" />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/feed" /> : children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/feed" element={<PrivateRoute><><Navbar /><Feed /></></PrivateRoute>} />
            <Route path="/trending" element={<PrivateRoute><><Navbar /><Trending /></></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><><Navbar /><CreatePost /></></PrivateRoute>} />
            <Route path="/create-report" element={<PrivateRoute><><Navbar /><CreateReport /></></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><><Navbar /><Reports /></></PrivateRoute>} />
            <Route path="/reports/:id" element={<PrivateRoute><><Navbar /><ReportDetail /></></PrivateRoute>} />
            <Route path="/authority" element={<PrivateRoute><><Navbar /><AuthorityDashboard /></></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><><Navbar /><Profile /></></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><><Navbar /><Settings /></></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><><Navbar /><Admin /></></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
