export default function Widgets() {
  return (
    <div className="widgets">
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px var(--shadow)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔥 What's Trending</h2>
        
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>TRENDING IN INDIA</div>
          <div style={{ fontWeight: 700, fontSize: '17px', margin: '4px 0' }}>#RoadSafety</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>2,847 posts</div>
        </div>

        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>CIVIC ISSUES</div>
          <div style={{ fontWeight: 700, fontSize: '17px', margin: '4px 0' }}>#CleanCity</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>1,523 posts</div>
        </div>

        <div style={{ padding: '16px 0', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>GOVERNMENT</div>
          <div style={{ fontWeight: 700, fontSize: '17px', margin: '4px 0' }}>#PublicServices</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>892 posts</div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '24px', marginBottom: '20px', color: 'white' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>💡 Did you know?</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>Your voice matters! Every post helps make your community better.</p>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '16px', lineHeight: '1.8' }}>
        <a href="#" style={{ marginRight: '12px', color: 'inherit', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ marginRight: '12px', color: 'inherit', textDecoration: 'none' }}>Privacy</a>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        <div style={{ marginTop: '8px' }}>© 2024 Talkit</div>
      </div>
    </div>
  );
}
