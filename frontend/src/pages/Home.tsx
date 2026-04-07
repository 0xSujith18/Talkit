import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className="auth-layout">
      {/* Left side hero branding */}
      <div className={`auth-hero ${isDark ? 'auth-hero-dark' : ''}`}>
        <div style={{ textAlign: 'center', zIndex: 1, padding: '20px' }}>
          <img src="/logo white.png" alt="Talkit" style={{ width: 'min(350px, 80%)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />
        </div>
      </div>

      {/* Right side content */}
      <div className="auth-form-container" style={{ alignItems: 'flex-start', padding: '40px' }}>
        <div className="auth-form-wrapper" style={{ maxWidth: '600px', width: '100%' }}>
          {/* Mobile Logo */}
          <img
            src={isDark ? '/logo white.png' : '/logo.png'}
            alt="Talkit logo"
            className="w-[45px] mb-10 max-[900px]:block min-[900px]:hidden"
          />
          
          <h1 className="text-5xl lg:text-7xl font-black mb-10 leading-tight tracking-tight text-[var(--text-primary)]">
            Happening now
          </h1>
          <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-[var(--text-primary)]">
            Join today.
          </h2>
          
          <div className="flex flex-col gap-4 max-w-[300px]">
            <Link to="/register" className="btn btn-primary w-full text-[15px] py-3 text-center no-underline">
              Create account
            </Link>
            
            <div className="text-[15px] text-[var(--text-primary)] my-2 font-bold">
              Already have an account?
            </div>
            
            <Link to="/login" className="btn w-full text-[15px] py-3 text-center no-underline bg-transparent border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--hover)] transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
