import './g_style.css';
import { Link, useLocation } from "react-router-dom";
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const { toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <nav className="navigation-horizontal">
        <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>My Blog</Link></h1>
        <ul>
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>

          {user ? (
            <>
              {user.role === 'admin' && (
                <li><Link to="/create-post" className={isActive('/create-post') ? 'active' : ''}>Write</Link></li>
              )}
              <li><Link to="/profile" className={isActive('/profile') ? 'active' : ''}>Profile</Link></li>
              <li><button onClick={logout} className="logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link></li>
              <li><Link to="/register" className={isActive('/register') ? 'active' : ''}>Register</Link></li>
            </>
          )}

          <li><button onClick={toggleTheme}>Toggle Mode</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;