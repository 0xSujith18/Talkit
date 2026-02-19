import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/feed" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" style={{ width: '40px', height: '40px' }} />
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>Talkit</span>
        </Link>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/feed" style={{ padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, background: isActive('/feed') ? 'var(--accent)' : 'transparent', color: isActive('/feed') ? 'white' : 'var(--text-primary)' }}>Home</Link>
          <Link to="/trending" style={{ padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, background: isActive('/trending') ? 'var(--accent)' : 'transparent', color: isActive('/trending') ? 'white' : 'var(--text-primary)' }}>Trending</Link>
          <Link to="/reports" style={{ padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, background: isActive('/reports') ? 'var(--accent)' : 'transparent', color: isActive('/reports') ? 'white' : 'var(--text-primary)' }}>Reports</Link>
          {(user?.role === 'authority' || user?.role === 'admin') && (
            <Link to="/authority" style={{ padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, background: isActive('/authority') ? 'var(--accent)' : 'transparent', color: isActive('/authority') ? 'white' : 'var(--text-primary)' }}>Dashboard</Link>
          )}
          <Link to="/create" style={{ padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', background: 'var(--accent)', color: 'white', fontWeight: 700, marginLeft: '8px' }}>+ Create</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/profile" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px' }}>
            {user?.name?.charAt(0)}
          </Link>
          <Link to="/settings" style={{ padding: '8px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/></svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
