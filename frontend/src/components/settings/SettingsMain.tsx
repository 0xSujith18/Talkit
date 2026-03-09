import { useState } from 'react';
import ConfirmModal from '../ConfirmModal';

interface SettingsMainProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function SettingsMain({ onNavigate, onLogout, isDark, toggleTheme }: SettingsMainProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', letterSpacing: '-0.5px' }}>Settings</h1>

      <div className="card" style={{ padding: '0', marginBottom: '20px', overflow: 'hidden' }}>
        <MenuItem onClick={() => onNavigate('activity')} label="Your Activity" />
        <MenuItem onClick={() => onNavigate('saved')} label="Saved Posts" />
        <MenuItem onClick={() => onNavigate('personal')} label="Personal Details" />
        <MenuItem onClick={() => onNavigate('security')} label="Password & Security" />
        <MenuItem onClick={() => onNavigate('profile')} label="Edit Account" />
        
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>Theme</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{isDark ? 'Dark' : 'Light'}</div>
          </div>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'var(--bg-secondary)', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              fontSize: '16px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <MenuItem onClick={() => setShowLogoutModal(true)} label="Logout" />
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <MenuItem onClick={() => onNavigate('personal')} label="Delete Account" isDestructive />
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}

interface MenuItemProps {
  onClick: () => void;
  label: string;
  isDestructive?: boolean;
}

function MenuItem({ onClick, label, isDestructive }: MenuItemProps) {
  return (
    <div 
      onClick={onClick} 
      style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid var(--border)', 
        cursor: 'pointer', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        transition: 'background 0.15s',
        background: 'transparent'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: '16px', fontWeight: 500, color: isDestructive ? 'var(--error)' : 'inherit' }}>{label}</span>
      <span style={{ color: isDestructive ? 'var(--error)' : 'var(--text-secondary)', fontSize: '18px' }}>›</span>
    </div>
  );
}
