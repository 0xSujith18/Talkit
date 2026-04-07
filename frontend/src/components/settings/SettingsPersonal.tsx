import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import ConfirmModal from '../ConfirmModal';

interface SettingsPersonalProps {
  onBack: () => void;
}

export default function SettingsPersonal({ onBack }: SettingsPersonalProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [personalData, setPersonalData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    birthday: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.patch('/auth/personal', personalData);
      setMessage('✓ Changes saved');
      setTimeout(() => setMessage(''), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/auth/account');
      setShowDeleteModal(false);
      logout();
      navigate('/login');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to delete account');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
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
        <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Personal Details</h2>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Contact Information
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Phone Number</label>
          <input 
            className="input" 
            type="tel" 
            value={personalData.phone} 
            onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })} 
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Email</label>
          <input 
            className="input" 
            type="email" 
            value={personalData.email} 
            onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })} 
            placeholder="your@email.com"
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Email cannot be changed for security reasons
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Birthday</label>
          <input 
            className="input" 
            type="date" 
            value={personalData.birthday} 
            onChange={(e) => setPersonalData({ ...personalData, birthday: e.target.value })}
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

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Account Management</div>
        </div>
        
        <div 
          onClick={() => setShowDeleteModal(true)} 
          style={{ 
            padding: '16px 20px', 
            cursor: 'pointer',
            transition: 'background 0.15s',
            background: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--error)', marginBottom: '4px' }}>Delete Account</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Permanently delete your account and all data</div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="Are you sure you want to delete your account? This action cannot be undone. Your account will be permanently deleted in 7 days."
        confirmText="Delete Account"
        cancelText="Cancel"
        isDestructive
        loading={deleting}
      />
    </>
  );
}
