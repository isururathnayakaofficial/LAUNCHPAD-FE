type ProfileUser = {
  id?: string;
  name?: string;
  email?: string;
};

type Props = {
  user: ProfileUser;
};

const StartupProfile = ({ user }: Props) => {
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">Startup Profile</p>
            <h1>{user.name?.trim() || 'Founder'}</h1>
            <p className="dashboard-user-email">{user.email}</p>
            <p className="dashboard-copy">
              Your startup identity, milestones, and public presence.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <p className="dashboard-card-label">Company</p>
            <h3>Startup Name</h3>
            <p>Tell the world about your startup.</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Stage</p>
            <h3>Idea · MVP · Growth</h3>
            <p>Define where you are in the journey.</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Industry</p>
            <h3>Select sector</h3>
            <p>Fintech, Health, SaaS, AI, etc.</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Team Size</p>
            <h3>1-50+</h3>
            <p>How many are building with you.</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Funding</p>
            <h3>Bootstrapped · Pre-seed · Series A</h3>
            <p>Current funding stage and goals.</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-label">Pitch</p>
            <h3>One-liner</h3>
            <p>What problem are you solving?</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartupProfile;
