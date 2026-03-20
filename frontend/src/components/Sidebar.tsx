import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/feed', icon: '🏠', label: 'Home' },
    { path: '/reports', icon: '📊', label: 'Reports' },
    { path: '/notifications', icon: '🔔', label: 'Notifications' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="sidebar" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      // Match the lighter background from the mockups if not dark mode
      background: 'transparent'
    }}>
      {/* Brand Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px' }}>
        <img
          src={isDark ? '/logo white.png' : '/logo.png'}
          alt="Talkit"
          style={{ width: '32px', height: '32px' }}
        />
        <h2 style={{
          fontSize: '22px',
          fontWeight: 800,
          margin: 0,
          color: 'var(--accent)',
          letterSpacing: '-0.5px'
        }}>
          Talkit
        </h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 10px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '16px',
                fontWeight: active ? 700 : 500,
                marginBottom: '4px',
                background: active ? 'rgba(24, 119, 242, 0.1)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: '22px', filter: active ? 'none' : 'grayscale(100%) opacity(0.7)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info Bottom */}
      <div style={{ marginTop: 'auto', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            @{user?.username || 'username'}
          </div>
        </div>
      </div>
    </div>
  );
}
