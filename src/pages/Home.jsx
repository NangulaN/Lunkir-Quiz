// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import logo from '../assets/lunkirWhiteLogo.png';
import './Home.scss'; // You'll need to create this

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <a 
          href="https://lunkir.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="logo-link"
        >
          <img src={logo} alt="Lunkir Logo" className="logo" />
        </a>
        
        <h1>Lunkir Quiz</h1>
        <p className="subtitle">Test your knowledge and compete for the top spot!</p>
      </header>

      <div className="home-content">
        <div className="quiz-intro">
          <div className="quiz-stats">
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15</span>
              <span className="stat-label">Seconds</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Points Each</span>
            </div>
          </div>

          <Link to="/quiz" className="start-quiz-btn">
            🚀 Start Quiz
          </Link>
        </div>

        <div className="leaderboard-section">
          <Leaderboard showTitle={true} maxEntries={10} />
        </div>
      </div>

      <footer className="home-footer">
        <p>Challenge yourself and see if you can make it to the top! 🏆</p>
      </footer>
    </div>
  );
};

export default Home;