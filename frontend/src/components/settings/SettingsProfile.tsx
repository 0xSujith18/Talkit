import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

interface SettingsProfileProps {
  onBack: () => void;
}

export default function SettingsProfile({ onBack }: SettingsProfileProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    bio: user?.bio || '',
    location: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.patch('/auth/profile', profileData);
      setMessage('✓ Profile updated');
      setTimeout(() => setMessage(''), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={onBack} 
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
        <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Edit Account</h2>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Username</label>
          <input 
            className="input" 
            value={profileData.username} 
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} 
            placeholder="username"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Name</label>
          <input 
            className="input" 
            value={profileData.name} 
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} 
            placeholder="Your Name"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Bio</label>
          <textarea 
            className="input" 
            value={profileData.bio} 
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} 
            placeholder="Tell us about yourself..."
            rows={3}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Location</label>
          <input 
            className="input" 
            value={profileData.location} 
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} 
            placeholder="City, Country"
          />
        </div>

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
          onClick={handleUpdate} 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', padding: '14px', fontWeight: 600 }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}
