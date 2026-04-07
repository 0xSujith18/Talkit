import { useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { useTheme } from '../context/ThemeContext';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-primary)' }}>
            <div style={{ width: '100%', maxWidth: '350px' }}>
                <div className="card" style={{ padding: '40px 40px 24px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" style={{ width: '120px' }} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Create New Password</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="input"
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <input
                            className="input"
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p style={{ color: 'var(--error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
                        {message && <p style={{ color: 'var(--success)', fontSize: '12px', marginBottom: '12px' }}>{message}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px', marginTop: '8px' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                    <div style={{ marginTop: '24px' }}>
                        <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Back To Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
