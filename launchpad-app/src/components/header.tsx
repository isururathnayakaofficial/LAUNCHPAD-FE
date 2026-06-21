import { useNavigate, useLocation } from 'react-router-dom';

type HeaderUser = {
  id?: string;
  name?: string;
  email?: string;
};

type HeaderProps = {
  user: HeaderUser;
  onLogout: () => void;
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Todos', path: '/todos' },
  { label: 'Task Assign', path: '/task-assign' },
];

const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = user.name?.trim() || 'Founder';

  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo-area" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-handshake logo-icon"></i>
          <span className="logo-text">Launch<span>Pad</span></span>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link${location.pathname === item.path ? ' nav-link-active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <span className="header-user-name">{displayName}</span>
          <button className="header-auth-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
