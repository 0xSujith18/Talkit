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

  const roles = [
    { value: 'citizen', label: 'Citizen', icon: '👤', desc: 'Report issues & engage' },
    { value: 'authority', label: 'Government', icon: '🏛️', desc: 'Manage civic reports' },
    { value: 'developer', label: 'Developer', icon: '💻', desc: 'Build & contribute' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/feed', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="auth-layout">
      {/* Left side hero branding */}
      <div className={`auth-hero ${isDark ? 'auth-hero-dark' : ''}`}>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <img src={isDark ? '/logo white.png' : '/logo white.png'} alt="Talkit" style={{ width: '180px', marginBottom: '24px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 700, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            Join the community.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginTop: '8px' }}>
            Be part of the change today.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="auth-form-container" style={{ padding: '20px' }}>
        <div className="auth-form-wrapper" style={{ maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Show logo only on mobile */}
            <img
              src={isDark ? '/logo white.png' : '/logo.png'}
              alt="Talkit logo"
              style={{ width: '60px', marginBottom: '20px', display: 'block', margin: '0 auto 20px' }}
              className="mobile-only-logo"
            />
            <h1 className="auth-title" style={{ fontSize: '28px' }}>Create an account</h1>
            <p className="auth-subtitle" style={{ marginBottom: '20px' }}>Sign up to get started.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                style={{ marginBottom: '0' }}
              />
              <input
                className="input"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ marginBottom: '0' }}
              />
            </div>

            <input
              className="input"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ marginBottom: '0' }}
              />
              <input
                className="input"
                type="password"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                style={{ marginBottom: '0' }}
              />
            </div>

            <input
              className="input"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div style={{ marginTop: '12px', marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Select Your Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {roles.map(role => (
                  <div
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    style={{
                      padding: '12px',
                      border: `1.5px solid ${formData.role === role.value ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: formData.role === role.value ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                      boxShadow: formData.role === role.value ? '0 0 0 2px rgba(24, 119, 242, 0.1)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>{role.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: formData.role === role.value ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {role.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {role.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
              Sign Up
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
