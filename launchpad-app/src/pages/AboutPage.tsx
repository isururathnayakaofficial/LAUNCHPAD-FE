import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section id="about" className="section-about">
      <div className="container">
        <div className="section-header">
          <h2>About LaunchPad</h2>
          <div className="accent-line"></div>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p><strong>LaunchPad</strong> is a launchpad for ambitious founders, creators, and experts. Connect with co-founders, advisors, service providers, and funding opportunities.</p>
            <p>Our mission: help startups scale through meaningful collaboration and trusted partnerships.</p>
            <div className="stats-row">
              <div className="stat-item"><span>98%</span> satisfaction</div>
              <div className="stat-item"><span>120+</span> funded startups</div>
              <div className="stat-item"><span>45+</span> countries</div>
            </div>
          </div>
          <div className="about-illustration">
            <i className="fas fa-users fa-4x"></i>
            <i className="fas fa-chart-line fa-4x"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
