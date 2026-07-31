import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { isAuthenticated, email, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const tabClass = ({ isActive }) => 'tab' + (isActive ? ' active' : '');

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="brand">paste://</span>

        <nav className="tabs">
          <NavLink to="/" className={tabClass} end>home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/my-pastes" className={tabClass}>my_pastes</NavLink>
              <NavLink to="/create" className={tabClass}>new_paste</NavLink>
            </>
          )}
        </nav>

        <div className="topbar-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <span className="user-email">{email}</span>
              <button className="btn btn-ghost" onClick={logout}>sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">sign in</NavLink>
              <NavLink to="/register" className="btn btn-primary">sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
