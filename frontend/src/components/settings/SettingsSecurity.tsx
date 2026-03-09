import { useState } from 'react';
import api from '../../config/api';

interface SettingsSecurityProps {
  onBack: () => void;
}

export default function SettingsSecurity({ onBack }: SettingsSecurityProps) {
  const [step, setStep] = useState<'main' | 'change-password' | 'verify-email'>('main');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      await api.post('/auth/send-verification-code', { code });
      setMessage('✓ Verification code sent to your email');
      setStep('verify-email');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (verificationCode !== sentCode) {
      setMessage('Invalid verification code');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('✓ Password changed successfully');
      setTimeout(() => {
        setStep('main');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setVerificationCode('');
        setSentCode('');
        setMessage('');
      }, 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', {});
      setMessage('✓ Password reset link sent to your email');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={step === 'main' ? onBack : () => setStep('main')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            cursor: 'pointer', 
            marginRight: '16px',
            color: 'var(--text-primary)'
          }}
        >
          ←
        </button>
        <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Password & Security</h2>
      </div>

      {step === 'main' && (
        <>
          <div className="card" style={{ padding: '0', marginBottom: '20px', overflow: 'hidden' }}>
            <SecurityItem 
              onClick={() => setStep('change-password')} 
              title="Change Password" 
              subtitle="Update your password regularly for security"
            />
            <SecurityItem 
              onClick={handleForgotPassword} 
              title="Forgot Password" 
              subtitle="Reset your password via email"
            />
          </div>

          <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>🔒 Security Tips</div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
              <li>Use a strong, unique password</li>
              <li>Change your password every 3-6 months</li>
              <li>Never share your password with anyone</li>
            </ul>
          </div>
        </>
      )}

      {step === 'change-password' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Enter your current password and choose a new one
          </div>

          <input 
            className="input" 
            type="password" 
            value={passwordData.currentPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
            placeholder="Current Password"
            style={{ marginBottom: '12px' }}
          />
          <input 
            className="input" 
            type="password" 
            value={passwordData.newPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
            placeholder="New Password (min 6 characters)"
            style={{ marginBottom: '12px' }}
          />
          <input 
            className="input" 
            type="password" 
            value={passwordData.confirmPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
            placeholder="Confirm New Password"
            style={{ marginBottom: '20px' }}
          />

          {message && (
            <div style={{ 
              padding: '12px', 
              background: message.includes('✓') ? '#d4edda' : '#f8d7da', 
              color: message.includes('✓') ? '#155724' : '#721c24',
              borderRadius: '8px', 
              marginBottom: '16px', 
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <button 
            onClick={sendVerificationEmail} 
            className="btn btn-primary" 
            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            style={{ width: '100%', padding: '14px', fontWeight: 600 }}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      )}

      {step === 'verify-email' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Verify Your Email</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              We've sent a 6-digit code to your email. Enter it below to confirm the password change.
            </div>
          </div>

          <input 
            className="input" 
            type="text" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
            placeholder="Enter 6-digit code"
            maxLength={6}
            style={{ 
              marginBottom: '20px', 
              textAlign: 'center', 
              fontSize: '24px', 
              letterSpacing: '8px',
              fontWeight: 600
            }}
          />

          {message && (
            <div style={{ 
              padding: '12px', 
              background: message.includes('✓') ? '#d4edda' : '#f8d7da', 
              color: message.includes('✓') ? '#155724' : '#721c24',
              borderRadius: '8px', 
              marginBottom: '16px', 
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <button 
            onClick={handlePasswordChange} 
            className="btn btn-primary" 
            disabled={loading || verificationCode.length !== 6}
            style={{ width: '100%', padding: '14px', fontWeight: 600, marginBottom: '12px' }}
          >
            {loading ? 'Verifying...' : 'Verify & Change Password'}
          </button>

          <button 
            onClick={sendVerificationEmail} 
            className="btn" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            Resend Code
          </button>
        </div>
      )}
    </>
  );
}

interface SecurityItemProps {
  onClick: () => void;
  title: string;
  subtitle: string;
}

function SecurityItem({ onClick, title, subtitle }: SecurityItemProps) {
  return (
    <div 
      onClick={onClick} 
      style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid var(--border)', 
        cursor: 'pointer',
        transition: 'background 0.15s',
        background: 'transparent'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</div>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>›</span>
      </div>
    </div>
  );
}
