import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [view, setView] = useState('main');
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    phone: '',
    location: ''
  });
  const [personalData, setPersonalData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    birthday: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePersonalUpdate = async () => {
    try {
      await axios.patch('http://localhost:5000/api/auth/personal', personalData);
      setMessage('✓ Saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed');
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Deactivate account temporarily?')) {
      setMessage('Deactivation feature coming soon');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await axios.patch('http://localhost:5000/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('✓ Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to change password');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.patch('http://localhost:5000/api/auth/profile', profileData);
      setMessage('✓ Saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Delete account permanently?')) {
      try {
        await axios.delete('http://localhost:5000/api/auth/account');
        logout();
        navigate('/login');
      } catch (error) {
        setMessage('Failed');
      }
    }
  };

  if (view === 'personal') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Personal Details</h2>
        </div>
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Contact Info</div>
          <input className="input" type="tel" value={personalData.phone} onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })} placeholder="Phone Number" />
          <input className="input" type="email" value={personalData.email} onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })} placeholder="Email" />
          <input className="input" type="date" value={personalData.birthday} onChange={(e) => setPersonalData({ ...personalData, birthday: e.target.value })} placeholder="Birthday" />
          {message && <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>{message}</div>}
          <button onClick={handlePersonalUpdate} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Save</button>
        </div>
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Account Ownership</div>
          </div>
          <div onClick={handleDeactivate} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px' }}>Deactivate Account</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Temporarily disable your account</div>
          </div>
          <div onClick={handleDeleteAccount} style={{ padding: '16px 20px', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px', color: 'var(--error)' }}>Delete Account</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Permanently delete your account</div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'security') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Password & Security</h2>
        </div>
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Change Password</div>
          <input className="input" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="Current Password" />
          <input className="input" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="New Password" />
          <input className="input" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="Confirm New Password" />
          {message && <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>{message}</div>}
          <button onClick={handlePasswordChange} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Change Password</button>
        </div>
        <div className="card" style={{ padding: '0' }}>
          <div onClick={() => setMessage('Password reset link sent to email')} style={{ padding: '16px 20px', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px' }}>Forgot Password</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Reset your password via email</div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'activity') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Your Activity</h2>
        </div>
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px' }}>Likes</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Posts you liked</div>
          </div>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px' }}>Comments</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Your comments</div>
          </div>
          <div style={{ padding: '16px 20px', cursor: 'pointer' }}>
            <div style={{ fontSize: '16px' }}>Reposts</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Posts you shared</div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'saved') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Saved Posts</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No saved posts yet</div>
      </div>
    );
  }

  if (view === 'profile') {
    return (
      <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => setView('main')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Edit Account</h2>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <input className="input" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} placeholder="Username" />
          <input className="input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} placeholder="Name" />
          <input className="input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="Phone" />
          <input className="input" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} placeholder="Location" />
          {message && <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '12px', textAlign: 'center' }}>{message}</div>}
          <button onClick={handleProfileUpdate} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', paddingTop: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Settings</h1>

      <div className="card" style={{ padding: '0', marginBottom: '20px' }}>
        <div onClick={() => setView('activity')} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Your Activity</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        <div onClick={() => setView('saved')} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Saved Posts</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        <div onClick={() => setView('personal')} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Personal Details</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        <div onClick={() => setView('security')} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Password & Security</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        <div onClick={() => setView('profile')} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Edit Account</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>
        
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px' }}>Theme</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isDark ? 'Dark' : 'Light'}</div>
          </div>
          <button onClick={toggleTheme} className="btn" style={{ padding: '6px 12px', fontSize: '13px' }}>{isDark ? '☀️' : '🌙'}</button>
        </div>

        <div onClick={logout} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px' }}>Logout</span>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div onClick={handleDeleteAccount} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', color: 'var(--error)' }}>Delete Account</span>
          <span style={{ color: 'var(--error)' }}>›</span>
        </div>
      </div>
    </div>
  );
}
