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

    </div>
  );
}
