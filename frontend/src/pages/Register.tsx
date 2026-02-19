import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'citizen' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {error && <p style={{ color: 'var(--error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px', marginTop: '8px' }}>Sign up</button>
        </form>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px' }}>Have an account? </span>
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
