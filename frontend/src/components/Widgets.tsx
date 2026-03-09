import { useNavigate } from 'react-router-dom';

export default function Widgets() {
  const navigate = useNavigate();

  return (
    <div className="widgets" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Primary CTA */}
      <button
        onClick={() => navigate('/create-report')}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(24, 119, 242, 0.25)'
        }}
      >
        <span style={{ fontSize: '20px' }}>⊕</span>
        Report an Issue
      </button>

      {/* Local Civic Body Card */}
      <div className="card" style={{ padding: '20px', margin: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '18px', color: 'var(--accent)' }}>🏛️</span>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Your Local Civic Body</h3>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: '#1e40af', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            BBMP
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>BBMP Ward 12</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Indiranagar Ward Office</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>👤</span>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>MLA</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>S. Raghu</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>📞</span>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>080-2222-1234</div>
          </div>
        </div>

        <button
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: '1.5px solid var(--accent)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(24, 119, 242, 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          View Ward Directory
        </button>
      </div>

      {/* Nearby Issues Map Card */}
      <div className="card" style={{ padding: '20px', margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Nearby Issues</h3>
          <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Expand</span>
        </div>

        {/* Placeholder Map Image styled to look like the mockup */}
        <div style={{
          width: '100%',
          height: '140px',
          background: 'radial-gradient(circle at center, #115e59 0%, #064e3b 100%)',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Mock dots for reports */}
          <div style={{ position: 'absolute', top: '30%', left: '40%', width: '8px', height: '8px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(251, 191, 36, 0.2)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)' }}></div>
          <div style={{ position: 'absolute', top: '70%', left: '30%', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}></div>

          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', zIndex: 1 }}>Map View Enabled</span>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', fontStyle: 'italic' }}>
          Showing 14 reports within 2km of your location.
        </p>
      </div>

      {/* Footer Links */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '0 16px', lineHeight: '1.8' }}>
        <a href="#" style={{ marginRight: '12px', color: 'inherit', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ marginRight: '12px', color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About us</a>
        <div style={{ marginTop: '4px' }}>© 2024 Talkit Inc.</div>
      </div>
    </div>
  );
}
