import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center max-w-[600px] p-10">
        <img src={isDark ? '/logo white.png' : '/logo.png'} alt="Talkit" className="w-[200px] mb-10 mx-auto" />
        <h1 className="text-6xl font-black mb-5 leading-none">Happening now</h1>
        <h2 className="text-3xl font-bold mb-10">Join today.</h2>
        
        <div className="flex flex-col gap-4 max-w-[300px] mx-auto">
          <Link to="/register" className="py-3 px-6 rounded-3xl no-underline bg-[var(--accent)] text-white font-bold text-[15px] text-center">
            Create account
          </Link>
          
          <div className="text-[13px] text-[var(--text-secondary)] my-2">
            Already have an account?
          </div>
          
          <Link to="/login" className="py-3 px-6 border border-[var(--border)] rounded-3xl no-underline bg-transparent text-[var(--accent)] font-bold text-[15px] text-center">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );

}
