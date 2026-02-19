import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: '350px' }}>
        <div className="card" style={{ padding: '40px 40px 24px', textAlign: 'center', marginBottom: '10px' }}>
          <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" style={{ width: '120px', margin: '0 auto 24px' }} />
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              placeholder="Email"
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
            {error && <p style={{ color: 'var(--error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px', marginTop: '8px' }}>Log in</button>
          </form>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
