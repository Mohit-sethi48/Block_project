import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Admin Portal</p>
          <h1 className="brand-title">Control Room</h1>
        </div>
        <nav className="nav-links">
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/blogs">Blogs</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/lists">Lists</NavLink>
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <p className="topbar-label">Logged in as</p>
            <h2>{user?.name || 'Admin'}</h2>
          </div>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
