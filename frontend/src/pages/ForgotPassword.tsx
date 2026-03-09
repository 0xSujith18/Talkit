import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDark } = useTheme();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-primary)' }}>
            <div style={{ width: '100%', maxWidth: '350px' }}>
                <div className="card" style={{ padding: '40px 40px 24px', textAlign: 'center', marginBottom: '10px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" style={{ width: '120px' }} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Trouble Logging In?</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Enter your email and we'll send you a link to get back into your account.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {error && <p style={{ color: 'var(--error)', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
                        {message && <p style={{ color: 'var(--success)', fontSize: '12px', marginBottom: '12px' }}>{message}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px', marginTop: '8px' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Login Link'}
                        </button>
                    </form>
                    <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>
                    <Link to="/register" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Create New Account</Link>
                </div>
                <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Back To Login</Link>
                </div>
            </div>
        </div>
    );
}
