import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/trending', icon: '🔥', label: 'Trending' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '40px' }}>
        <img src="/logo.png" alt="Talkit" style={{ width: '50px', height: '50px', filter: 'brightness(0) invert(1)' }} />
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '12px' }}>Talkit</h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>Speak. Share. Solve.</p>
      </div>

      <nav>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 20px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'white',
              fontSize: '18px',
              fontWeight: isActive(item.path) ? 600 : 400,
              marginBottom: '8px',
              background: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !isActive(item.path) && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => !isActive(item.path) && (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: '24px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link
        to="/create"
        style={{
          display: 'block',
          width: '100%',
          padding: '16px',
          background: 'white',
          color: '#667eea',
          textAlign: 'center',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '18px',
          marginTop: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        ✍️ Create Post
      </Link>

      <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px' }}>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea', fontWeight: 'bold', fontSize: '20px' }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{user?.name}</div>
              <div style={{ opacity: 0.9, fontSize: '14px' }}>@{user?.username}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
