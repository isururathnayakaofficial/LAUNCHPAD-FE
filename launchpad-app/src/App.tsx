import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { loginUser, registerUser } from './api/auth';
import Dashboard from './components/Dashboard';

type AuthenticatedUser = {
  id?: string;
  name?: string;
  email?: string;
};

// ---------- App Component ----------
const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // UI state
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);

  // Login form fields
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Signup form fields
  const [signupName, setSignupName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupMessage, setSignupMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('launchpad_auth_user');
    const storedToken = localStorage.getItem('launchpad_auth_token');

    if (storedUser && storedToken) {
      try {
        setAuthUser(JSON.parse(storedUser) as AuthenticatedUser);
      } catch {
        localStorage.removeItem('launchpad_auth_user');
        localStorage.removeItem('launchpad_auth_token');
      }
    }
  }, []);

  useEffect(() => {
    if (authUser && location.pathname !== '/dashboard') {
      navigate('/dashboard', { replace: true });
    }
  }, [authUser, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('launchpad_auth_token');
    localStorage.removeItem('launchpad_auth_user');
    setAuthUser(null);
    setAuthModalOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setLoginMessage(null);
    setSignupMessage(null);
  };

  if (authUser) {
    return <Dashboard user={authUser} onLogout={handleLogout} />;
  }

  // ---------- Handlers ----------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);

    if (!loginEmail.trim()) {
      setLoginMessage({ text: 'Email address is required.', isError: true });
      return;
    }
    if (!loginPassword.trim()) {
      setLoginMessage({ text: ' Password is required.', isError: true });
      return;
    }
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginMessage({ text: ' Invalid email format.', isError: true });
      return;
    }

    setLoginLoading(true);

    try {
      const response = await loginUser({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      const userName = response.user?.name ?? loginEmail.trim();
      setLoginMessage({ text: response.message ?? `✅ Welcome back, ${userName}!`, isError: false });
      setLoginEmail('');
      setLoginPassword('');

      if (response.token) {
        localStorage.setItem('launchpad_auth_token', response.token);
      }
      const nextUser = response.user ?? { name: userName, email: loginEmail.trim().toLowerCase() };
      localStorage.setItem('launchpad_auth_user', JSON.stringify(nextUser));
      setAuthUser(nextUser);
      navigate('/dashboard', { replace: true });

      window.setTimeout(() => {
        setAuthModalOpen(false);
        setLoginMessage(null);
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setLoginMessage({ text: message, isError: true });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
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

    setSignupLoading(true);

    try {
      const normalizedEmail = signupEmail.trim().toLowerCase();
      const response = await registerUser({
        name: signupName.trim(),
        email: normalizedEmail,
        password: signupPassword,
      });

      setSignupMessage({ text: response.message ?? '🎉 Account created successfully.', isError: false });
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      const nextUser = response.user ?? { name: signupName.trim(), email: normalizedEmail };
      localStorage.setItem('launchpad_auth_user', JSON.stringify(nextUser));
      setAuthUser(nextUser);
      navigate('/dashboard', { replace: true });

      if (response.token) {
        localStorage.setItem('launchpad_auth_token', response.token);
      }

      window.setTimeout(() => {
        setSignupMessage(null);
        setAuthModalOpen(false);
      }, 800);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setSignupMessage({ text: message, isError: true });
    } finally {
      setSignupLoading(false);
    }
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

  const landingPage = (
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
              Get started
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
              <p className="eyebrow-copy">Team collaboration for fast-moving startups</p>
              <h1>Build together in one focused <span className="highlight">workspace</span>.</h1>
              <p>
                LaunchPad brings founders, collaborators, and investors into one clean space for chat,
                planning, and momentum without the noise.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary hero-primary-action"
                  onClick={() => {
                    setAuthModalOpen(true);
                    setActiveTab('login');
                  }}
                >
                  Open workspace
                </button>
                <button
                  type="button"
                  className="btn btn-secondary hero-secondary-action"
                  onClick={() => handleScrollTo('usage')}
                >
                  See how it works
                </button>
              </div>
              <div className="trust-badge">
                <i className="fas fa-comments"></i> <span>Trusted by 5,000+ product teams</span>
              </div>
            </div>
            <div className="hero-panel">
              <div className="hero-panel-card">
                <p className="hero-panel-kicker">Workspace preview</p>
                <h2>Simple, sharp, and built for momentum.</h2>
                <p>Everything sits in one place so teams can move from idea to execution faster.</p>
                <div className="workspace-preview">
                  <div className="workspace-preview-item">
                    <span className="preview-dot preview-dot-yellow"></span>
                    <div>
                      <strong>Daily updates</strong>
                      <span>Share what shipped and what is next.</span>
                    </div>
                  </div>
                  <div className="workspace-preview-item">
                    <span className="preview-dot preview-dot-lime"></span>
                    <div>
                      <strong>Investor leads</strong>
                      <span>Track warm intros and follow-ups.</span>
                    </div>
                  </div>
                  <div className="workspace-preview-item">
                    <span className="preview-dot preview-dot-white"></span>
                    <div>
                      <strong>Launch tasks</strong>
                      <span>Keep priorities visible across the team.</span>
                    </div>
                  </div>
                </div>
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
                  <button type="submit" className="btn btn-primary full-width" disabled={loginLoading}>
                    {loginLoading ? 'Logging in...' : 'Login to Dashboard'}
                  </button>
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
                    <p>Set up your profile with your name, email, and password.</p>
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
                  {signupMessage && (
                    <div className="form-message" style={{ color: signupMessage.isError ? '#c62828' : '#2b7a3e' }}>
                      {signupMessage.text}
                    </div>
                  )}
                  <button type="submit" className="btn btn-secondary full-width" disabled={signupLoading}>
                    {signupLoading ? 'Creating account...' : 'Create free account'}
                  </button>
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
              <p className="section-kicker">Why teams pick LaunchPad</p>
              <h2>Designed for clear, high-velocity collaboration</h2>
              <div className="accent-line"></div>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p><strong>LaunchPad</strong> helps ambitious teams keep conversations, decisions, and next steps in one place.</p>
                <p>It is built for founders who want a cleaner, faster interface with a strong visual hierarchy.</p>
                <div className="stats-row">
                  <div className="stat-item"><span>98%</span> satisfaction</div>
                  <div className="stat-item"><span>120+</span> active teams</div>
                  <div className="stat-item"><span>45+</span> countries</div>
                </div>
              </div>
              <div className="about-illustration">
                <i className="fas fa-layer-group fa-4x"></i>
                <i className="fas fa-bolt fa-4x"></i>
              </div>
            </div>
          </div>
        </section>

        {/* USAGE COMPONENT */}
        <section id="usage" className="section-usage">
          <div className="container">
            <div className="section-header">
              <p className="section-kicker">How it works</p>
              <h2>Three steps from signup to shared progress</h2>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>
                <i className="fas fa-user-plus step-icon"></i>
                <h3>Create your account</h3>
                <p>Sign up with your name, email, and password.</p>
              </div>
              <div className="step-card">
                <div className="step-number">02</div>
                <i className="fas fa-search step-icon"></i>
                <h3>Find the right people</h3>
                <p>Explore founders, designers, developers, and investors.</p>
              </div>
              <div className="step-card">
                <div className="step-number">03</div>
                <i className="fas fa-comments step-icon"></i>
                <h3>Keep moving forward</h3>
                <p>Launch projects, share updates, and stay aligned.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED COMPANIES COMPONENT */}
        <section id="trusted" className="section-trusted">
          <div className="container">
            <div className="section-header">
              <p className="section-kicker">Social proof</p>
              <h2>Trusted by teams that ship fast</h2>
              <p>Join a network of founders and operators who value clear communication.</p>
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

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Navigate to="/dashboard" replace /> : landingPage}
      />
      <Route
        path="/dashboard"
        element={authUser ? <Dashboard user={authUser} onLogout={handleLogout} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to={authUser ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
};

export default App;