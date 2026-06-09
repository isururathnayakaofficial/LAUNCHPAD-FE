import React from 'react';

interface HomePageProps {
  onOpenLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenLogin }) => {
  return (
    <section id="home" className="hero-auth">
      <div className="container hero-grid">
        <div className="hero-message">
          <h1>Where <span className="highlight">startups</span> meet & grow together</h1>
          <p>Collaborate with co-founders, mentors, and investors. Accelerate your venture in one trusted ecosystem.</p>
          <div className="trust-badge">
            <i className="fas fa-rocket"></i> <span>Join 5,000+ innovative teams</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-primary" onClick={onOpenLogin}>
              Open Login
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <p className="hero-panel-kicker">Private access</p>
            <h2>Built for founders who move fast.</h2>
            <p>Open the login window from the header to access your workspace, saved profiles, and collaboration tools.</p>
            <ul className="hero-panel-list">
              <li>Founder and investor matching</li>
              <li>Startup-ready collaboration tools</li>
              <li>Fast sign-in with account recovery path</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
