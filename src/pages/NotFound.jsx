// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import logo from '../assets/lunkirWhiteLogo.png'; // Update path to your logo
import './NotFound.scss';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <header className="not-found-header">
          <a 
            href="https://lunkir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="logo-link"
          >
            <img src={logo} alt="Lunkir Logo" className="logo" />
          </a>
        </header>

        <div className="error-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-message">
            Oops! The page you're looking for seems to have vanished into the fintech void.
          </p>
          <p className="error-suggestion">
            Don't worry though - there's still plenty to explore!
          </p>

          <div className="navigation-options">
            <Link to="/" className="nav-btn primary-btn">
              🏠 Back to Home
            </Link>
            <Link to="/quiz" className="nav-btn quiz-btn">
              🧠 Take the Quiz
            </Link>
            <Link to="/leaderboard" className="nav-btn leaderboard-btn">
              🏆 View Leaderboard
            </Link>
          </div>

          <div className="helpful-links">
            <p className="links-title">Or try these popular pages:</p>
            <div className="link-grid">
              <Link to="/" className="helpful-link">
                <span className="link-icon">🏠</span>
                <span className="link-text">Home Page</span>
                <span className="link-desc">Quiz overview & leaderboard preview</span>
              </Link>
              <Link to="/quiz" className="helpful-link">
                <span className="link-icon">🧠</span>
                <span className="link-text">Quiz Challenge</span>
                <span className="link-desc">Test your fintech knowledge</span>
              </Link>
              <Link to="/leaderboard" className="helpful-link">
                <span className="link-icon">🏆</span>
                <span className="link-text">Leaderboard</span>
                <span className="link-desc">See top performers</span>
              </Link>
            </div>
          </div>
        </div>

        <footer className="not-found-footer">
          <p>Looking for something specific? Try to contact us.</p>
        </footer>
      </div>
    </div>
  );
};

export default NotFound;