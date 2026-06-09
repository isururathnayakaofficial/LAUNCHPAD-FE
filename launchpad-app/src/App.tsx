import React, { useState, useEffect } from 'react';
import './App.css';

// ---------- TypeScript Interfaces ----------
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  company: string;
}

// ---------- App Component ----------
const App: React.FC = () => {
  // UI state
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Login form fields
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Signup form fields
  const [signupName, setSignupName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupRole, setSignupRole] = useState<string>('');
  const [signupCompany, setSignupCompany] = useState<string>('');
  const [signupMessage, setSignupMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // ---------- localStorage Helpers ----------
  const STORAGE_KEY = 'collabhub_users';

  const getUsers = (): User[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const findUserByEmail = (email: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  // Initialize default demo user
  useEffect(() => {
    const users = getUsers();
    if (users.length === 0) {
      const demoUser: User = {
        id: '1',
        name: 'Demo Founder',
        email: 'demo@startup.com',
        password: 'demo123',
        role: 'Founder / Co-founder',
        company: 'Demo Startup Inc.'
      };
      saveUsers([demoUser]);
    }
  }, []);

  // ---------- Handlers ----------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);

    if (!loginEmail.trim()) {
      setLoginMessage({ text: '📧 Email address is required.', isError: true });
      return;
    }
    if (!loginPassword.trim()) {
      setLoginMessage({ text: '🔒 Password is required.', isError: true });
      return;
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginMessage({ text: '❌ Invalid email format.', isError: true });
      return;
    }

    const user = findUserByEmail(loginEmail);
    if (!user) {
      setLoginMessage({ text: '❌ No account found with this email.', isError: true });
      return;
    }
    if (user.password !== loginPassword) {
      setLoginMessage({ text: '❌ Incorrect password.', isError: true });
      return;
    }

    // Success
    setLoginMessage({ text: `✅ Welcome back, ${user.name}! Redirecting...`, isError: false });
    setLoginEmail('');
    setLoginPassword('');
    setTimeout(() => {
      alert(`Logged in as ${user.name} (demo dashboard would open)`);
      setLoginMessage(null);
    }, 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMessage(null);

    if (!signupName.trim()) {
      setSignupMessage({ text: 'Please enter your full name.', isError: true });
      return;
    }
    if (!signupEmail.trim()) {
      setSignupMessage({ text: 'Email address is required.', isError: true });
      return;
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(signupEmail)) {
      setSignupMessage({ text: 'Invalid email format.', isError: true });
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setSignupMessage({ text: 'Password must be at least 6 characters.', isError: true });
      return;
    }
    if (!signupRole) {
      setSignupMessage({ text: 'Please select your role.', isError: true });
      return;
    }
    if (!signupCompany.trim()) {
      setSignupMessage({ text: 'Company / Startup name is required.', isError: true });
      return;
    }

    const existing = findUserByEmail(signupEmail);
    if (existing) {
      setSignupMessage({ text: '⚠️ Email already registered. Please login.', isError: true });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      role: signupRole,
      company: signupCompany.trim()
    };
    const updatedUsers = [...getUsers(), newUser];
    saveUsers(updatedUsers);

    setSignupMessage({ text: '🎉 Account created! You can now login.', isError: false });
    // Reset signup form
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupRole('');
    setSignupCompany('');

    // Switch to login tab after 1.5s
    setTimeout(() => {
      setActiveTab('login');
      setSignupMessage(null);
      setLoginMessage({ text: '✅ Account created! Please log in.', isError: false });
      setTimeout(() => setLoginMessage(null), 3000);
    }, 1500);
  };

  // Smooth scroll for anchor links
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setAuthModalOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-wrapper">
      {/* ========== HEADER ========== */}
      <header className="main-header">
        <div className="container header-container">
          <div className="logo-area" onClick={() => handleScrollTo('home')}>
            <i className="fas fa-handshake logo-icon"></i>
            <span className="logo-text">Launch<span>Pad</span></span>
          </div>
          <nav className={`nav-links ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <button className="nav-link" onClick={() => handleScrollTo('home')}>Home</button>
            <button className="nav-link" onClick={() => handleScrollTo('about')}>About</button>
            <button className="nav-link" onClick={() => handleScrollTo('usage')}>Usage</button>
            <button className="nav-link" onClick={() => handleScrollTo('trusted')}>Trusted</button>
          </nav>
          <div className="header-actions">
            <button
              className="header-auth-btn header-auth-cta"
              onClick={() => {
                setAuthModalOpen(true);
                setActiveTab('login');
              }}
            >
              Login
            </button>
          </div>
          <button
            type="button"
            className="mobile-menu-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="menu-icon-lines" aria-hidden="true">
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </span>
          </button>
        </div>
      </header>

      <main>
        {/* Hero + Auth Section */}
        <section id="home" className="hero-auth">
          <div className="container hero-grid">
            <div className="hero-message">
              <h1>Where <span className="highlight">startups</span> meet & grow together</h1>
              <p>Collaborate with co-founders, mentors, and investors. Accelerate your venture in one trusted ecosystem.</p>
              <div className="trust-badge">
                <i className="fas fa-rocket"></i> <span>Join 5,000+ innovative teams</span>
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

        {authModalOpen && (
          <div className="auth-modal-overlay" onClick={() => setAuthModalOpen(false)}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <button className="auth-modal-close" onClick={() => setAuthModalOpen(false)} aria-label="Close login window">
                <i className="fas fa-xmark"></i>
              </button>

              {activeTab === 'login' ? (
                <form className="form-container" onSubmit={handleLogin}>
                  <div className="modal-header-copy">
                    <p className="hero-panel-kicker">Welcome back</p>
                    <h2>Login to LaunchPad</h2>
                    <p>Access your startup workspace in a few seconds.</p>
                  </div>
                  <div className="input-group">
                    <i className="fas fa-envelope"></i>
                    <input type="email" placeholder="Email address" value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Password" value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)} required />
                  </div>
                  {loginMessage && (
                    <div className="form-message" style={{ color: loginMessage.isError ? '#c62828' : '#2b7a3e' }}>
                      {loginMessage.text}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary full-width">Login to Dashboard</button>
                  <p className="form-footnote">Demo: demo@startup.com / demo123</p>
                  <p className="auth-switch-copy">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign up here
                    </button>
                  </p>
                </form>
              ) : (
                <form className="form-container" onSubmit={handleSignup}>
                  <div className="modal-header-copy">
                    <p className="hero-panel-kicker">Join LaunchPad</p>
                    <h2>Create your account</h2>
                    <p>Set up your profile so founders can discover your role and company.</p>
                  </div>
                  <div className="input-group">
                    <i className="fas fa-user"></i>
                    <input type="text" placeholder="Full name" value={signupName}
                      onChange={(e) => setSignupName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <i className="fas fa-envelope"></i>
                    <input type="email" placeholder="Email address" value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Password (min 6 characters)" value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <i className="fas fa-briefcase"></i>
                    <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)} required>
                      <option value="" disabled>Select your role</option>
                      <option>Founder / Co-founder</option>
                      <option>Investor</option>
                      <option>Developer / Engineer</option>
                      <option>Designer</option>
                      <option>Marketer / Growth</option>
                      <option>Mentor / Advisor</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <i className="fas fa-building"></i>
                    <input type="text" placeholder="Company / Startup name" value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)} required />
                  </div>
                  {signupMessage && (
                    <div className="form-message" style={{ color: signupMessage.isError ? '#c62828' : '#2b7a3e' }}>
                      {signupMessage.text}
                    </div>
                  )}
                  <button type="submit" className="btn btn-secondary full-width">Create free account</button>
                  <p className="auth-switch-copy">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => setActiveTab('login')}
                    >
                      Return to login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABOUT COMPONENT */}
        <section id="about" className="section-about">
          <div className="container">
            <div className="section-header">
              <h2>About LaunchPad</h2>
              <div className="accent-line"></div>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p><strong>LaunchPad</strong> is a launchpad for ambitious founders, creators, and experts. Connect with co‑founders, advisors, service providers, and funding opportunities.</p>
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

        {/* USAGE COMPONENT */}
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

        {/* TRUSTED COMPANIES COMPONENT */}
        <section id="trusted" className="section-trusted">
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
      </main>

      {/* FOOTER COMPONENT */}
      <footer className="main-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <i className="fas fa-handshake"></i> <strong>LaunchPad</strong>
            <p>Startup collaboration reimagined. Build, scale, succeed together.</p>
            <div className="social-icons">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><button onClick={() => handleScrollTo('about')}>About</button></li>
              <li><button onClick={() => handleScrollTo('usage')}>How it works</button></li>
              <li><button onClick={() => handleScrollTo('trusted')}>Trust & safety</button></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Startup guide</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h4>Stay updated</h4>
            <p>Get collaboration insights & startup news.</p>
            <div className="newsletter-group">
              <input type="email" placeholder="Your email" />
              <button className="btn-subscribe">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>&copy; 2025 LaunchPad — Empowering startup ecosystems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;