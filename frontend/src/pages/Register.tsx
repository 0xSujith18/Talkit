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
    { value: 'citizen', label: '👤 Citizen', desc: 'Report issues & engage' },
    { value: 'authority', label: '🏛️ Government Officer', desc: 'Manage civic reports' },
    { value: 'politician', label: '🎖️ MLA/CM/MP', desc: 'Public representative' },
    { value: 'developer', label: '💻 Developer', desc: 'Build & contribute' }
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
          
          <div style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Select Your Role</label>
            <div style={{ display: 'grid', gap: '8px' }}>
              {roles.map(role => (
                <div
                  key={role.value}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  style={{
                    padding: '12px',
                    border: `2px solid ${formData.role === role.value ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: formData.role === role.value ? 'var(--bg-secondary)' : 'transparent'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{role.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{role.desc}</div>
                </div>
              ))}
            </div>
          </div>

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
