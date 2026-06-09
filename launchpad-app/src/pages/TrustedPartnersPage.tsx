import React from 'react';

const TrustedPartnersPage: React.FC = () => {
  return (
    <section id="trusted-partners" className="section-trusted">
      <div className="container">
        <div className="section-header">
          <h2>Trusted by innovative teams</h2>
          <p>Join the ecosystem of forward-thinking startups & investors</p>
        </div>
        <div className="trusted-logos">
          <div className="logo-item"><i className="fas fa-chart-simple"></i> <span>VentureLabs</span></div>
          <div className="logo-item"><i className="fas fa-cloud"></i> <span>NexusStart</span></div>
          <div className="logo-item"><i className="fas fa-brain"></i> <span>AlphaFounders</span></div>
          <div className="logo-item"><i className="fas fa-code"></i> <span>DevCollab</span></div>
          <div className="logo-item"><i className="fas fa-seedling"></i> <span>SeedSpark</span></div>
          <div className="logo-item"><i className="fas fa-rocket"></i> <span>LaunchBase</span></div>
        </div>
        <div className="testimonial-tip">
          <i className="fas fa-quote-left"></i> "LaunchPad connected us with our lead investor — within weeks!"<br /> — Emma R., Co-founder at GreenFuture
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnersPage;
