import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
}
