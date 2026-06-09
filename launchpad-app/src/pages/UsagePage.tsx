import React from 'react';

const UsagePage: React.FC = () => {
  return (
    <section id="usage" className="section-usage">
      <div className="container">
        <div className="section-header">
          <h2>How to use <span>LaunchPad</span></h2>
          <p>Simple steps to unlock collaboration</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <i className="fas fa-user-plus step-icon"></i>
            <h3>Create account</h3>
            <p>Sign up with your role, company, and expertise.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <i className="fas fa-search step-icon"></i>
            <h3>Discover partners</h3>
            <p>Explore founders, devs, designers & investors.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <i className="fas fa-comments step-icon"></i>
            <h3>Collaborate & grow</h3>
            <p>Launch joint projects, pitch sessions, mentorship calls.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsagePage;
