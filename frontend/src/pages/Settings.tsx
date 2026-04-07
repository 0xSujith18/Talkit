import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SettingsMain from '../components/settings/SettingsMain';
import SettingsActivity from '../components/settings/SettingsActivity';
import SettingsSaved from '../components/settings/SettingsSaved';
import SettingsPersonal from '../components/settings/SettingsPersonal';
import SettingsSecurity from '../components/settings/SettingsSecurity';
import SettingsProfile from '../components/settings/SettingsProfile';

export default function Settings() {
  const [view, setView] = useState('main');
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderView = () => {
    switch (view) {
      case 'activity':
        return <SettingsActivity onBack={() => setView('main')} />;
      case 'saved':
        return <SettingsSaved onBack={() => setView('main')} />;
      case 'personal':
        return <SettingsPersonal onBack={() => setView('main')} />;
      case 'security':
        return <SettingsSecurity onBack={() => setView('main')} />;
      case 'profile':
        return <SettingsProfile onBack={() => setView('main')} />;
      default:
        return (
          <SettingsMain
            onNavigate={setView}
            onLogout={handleLogout}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        );
    }
  };

  return (
    <div className="max-w-[800px] mx-auto pt-5 pb-10 px-6">
      {renderView()}
    </div>

  );
}
