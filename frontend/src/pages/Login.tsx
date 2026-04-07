import { useState, FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/feed';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-layout">
      {/* Left side hero branding */}
      <div className={`auth-hero ${isDark ? 'auth-hero-dark' : ''}`}>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <img src={isDark ? '/logo white.png' : '/logo white.png'} alt="Talkit" style={{ width: '180px', marginBottom: '24px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 700, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            Your voice matters.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginTop: '8px' }}>
            Engage with your civic community today.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {/* Show logo only on mobile where left column is hidden */}
            <img
              src={isDark ? '/logo white.png' : '/logo.png'}
              alt="Talkit logo"
              style={{ width: '60px', marginBottom: '24px', display: 'block', margin: '0 auto 24px' }}
              className="mobile-only-logo"
            />
            <h1 className="auth-title">Happening now</h1>
            <p className="auth-subtitle">Welcome back. Please sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              className="input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(250, 56, 62, 0.1)',
                borderLeft: '4px solid var(--error)',
                borderRadius: '4px',
                color: 'var(--error)',
                fontSize: '13px',
                marginBottom: '8px'
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Sign In
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Sign up</Link>
            </div>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Join the platform as a:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge">👤 Citizen</span>
              <span className="badge">🏛️ Officer</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
