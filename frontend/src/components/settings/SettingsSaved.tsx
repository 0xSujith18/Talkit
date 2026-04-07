interface SettingsSavedProps {
  onBack: () => void;
}

export default function SettingsSaved({ onBack }: SettingsSavedProps) {
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
        <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Saved Posts</h2>
      </div>

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
        <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>No saved posts yet</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Save posts to view them later
        </div>
      </div>
    </>
  );
}
