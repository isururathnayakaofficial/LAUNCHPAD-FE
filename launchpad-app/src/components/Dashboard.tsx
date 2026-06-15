type DashboardUser = {
  id?: string;
  name?: string;
  email?: string;
};

type DashboardProps = {
  user: DashboardUser;
  onLogout: () => void;
};

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const displayName = user.name?.trim() || 'Founder';

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">LaunchPad Dashboard</p>
            <h1>Welcome, {displayName}</h1>
            <p className="dashboard-copy">
              Your account is active. You can now access startup matches, messages, and collaboration tools.
            </p>
          </div>

          <button className="btn btn-secondary dashboard-logout" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-card dashboard-card-highlight">
          <p className="dashboard-card-label">Signed in as</p>
          <h2>{displayName}</h2>
          <p>{user.email ?? 'No email on file'}</p>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <p className="dashboard-card-label">Your network</p>
            <h3>12 active matches</h3>
            <p>People who match your founder profile and interests.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Messages</p>
            <h3>3 unread chats</h3>
            <p>Open conversations with collaborators and mentors.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Next step</p>
            <h3>Complete your profile</h3>
            <p>Add details to improve partner recommendations.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;