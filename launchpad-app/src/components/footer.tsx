import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
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
            <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            <li><button onClick={() => navigate('/todos')}>Todos</button></li>
            <li><button onClick={() => navigate('/task-assign')}>Task Assign</button></li>
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
  );
};

export default Footer;
