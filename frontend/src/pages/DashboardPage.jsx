const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <section>
      <div className="hero-card">
        <p className="brand-kicker">Dashboard</p>
        <h2>Welcome back, {user?.name || 'Admin'}</h2>
        <p className="muted-text">
          Yahan se aap admin panel ka overview dekh sakte ho aur users/lists modules open kar
          sakte ho.
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total Modules</span>
          <strong>3</strong>
          <p>Users, Lists aur Blogs management ready hai.</p>
        </article>
        <article className="stat-card">
          <span>Backend</span>
          <strong>Node API</strong>
          <p>JWT auth aur MySQL integration included hai.</p>
        </article>
        <article className="stat-card">
          <span>Frontend</span>
          <strong>React UI</strong>
          <p>Protected routes aur CRUD screens set hain.</p>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
