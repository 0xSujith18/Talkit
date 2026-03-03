import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '120px', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '16px' }}>Page Not Found</h1>
      <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '500px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to={user ? '/feed' : '/home'} 
        style={{ 
          marginTop: '32px', 
          padding: '14px 32px', 
          background: 'var(--accent)', 
          color: 'white', 
          borderRadius: '12px', 
          textDecoration: 'none', 
          fontWeight: 700,
          fontSize: '16px'
        }}
      >
        {user ? 'Go to Feed' : 'Go to Home'}
      </Link>
    </div>
  );
}
