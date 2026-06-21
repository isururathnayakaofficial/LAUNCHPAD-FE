import { useNavigate } from 'react-router-dom';

type DashboardUser = {
  id?: string;
  name?: string;
  email?: string;
};

type DashboardProps = {
  user: DashboardUser;
};

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const displayName = user.name?.trim() || 'Founder';

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">Startup Collaboration Platform</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="dashboard-copy">
              Your launch hub for team tasks, investor connections, and startup momentum.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-card dashboard-card-highlight">
          <p className="dashboard-card-label">Workspace Overview</p>
          <h2>{displayName}'s LaunchPad</h2>
          <p>{user.email ?? 'No email on file'} · Active since today</p>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card" onClick={() => navigate('/todos')} style={{ cursor: 'pointer' }}>
            <p className="dashboard-card-label">Team Todos</p>
            <h3>Manage tasks</h3>
            <p>Create, assign, and track tasks across your startup team.</p>
            <span className="dashboard-card-action">Open Todos →</span>
          </article>
          <article className="dashboard-card" onClick={() => navigate('/task-assign')} style={{ cursor: 'pointer' }}>
            <p className="dashboard-card-label">Task Assign</p>
            <h3>Assign work</h3>
            <p>Delegate responsibilities and monitor progress in real time.</p>
            <span className="dashboard-card-action">Open Task Assign →</span>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Network</p>
            <h3>12 active matches</h3>
            <p>Founders, investors, and collaborators aligned with your goals.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Messages</p>
            <h3>3 unread</h3>
            <p>Recent conversations with your network and team members.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Progress</p>
            <h3>68% complete</h3>
            <p>Your startup profile and onboarding checklist progress.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Resources</p>
            <h3>Startup Kit</h3>
            <p>Templates, pitch deck guides, and investor outreach tools.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
