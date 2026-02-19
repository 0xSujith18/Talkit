import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
        <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" style={{ width: '200px', marginBottom: '40px' }} />
        <h1 style={{ fontSize: '64px', fontWeight: 900, marginBottom: '20px', lineHeight: 1 }}>Happening now</h1>
        <h2 style={{ fontSize: '31px', fontWeight: 700, marginBottom: '40px' }}>Join today.</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
          <Link to="/register" style={{ padding: '12px 24px', borderRadius: '24px', textDecoration: 'none', background: 'var(--accent)', color: 'white', fontWeight: 700, fontSize: '15px', textAlign: 'center' }}>
            Create account
          </Link>
          
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0' }}>
            Already have an account?
          </div>
          
          <Link to="/login" style={{ padding: '12px 24px', borderRadius: '24px', textDecoration: 'none', background: 'transparent', color: 'var(--accent)', fontWeight: 700, fontSize: '15px', border: '1px solid var(--border)', textAlign: 'center' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
