import { Link } from 'react-router-dom';
import { useState } from 'react';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import logo from '../assets/lunkirWhiteLogo.png'; // Update path to your logo
import './LeaderboardPage.scss';

const LeaderboardPage = () => {
  const [filterValue, setFilterValue] = useState(20);

  const handleFilterChange = (e) => {
    const value = e.target.value === 'all' ? 1000 : parseInt(e.target.value);
    setFilterValue(value);
  };

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <a 
          href="https://lunkir.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="logo-link"
        >
          <img src={logo} alt="Lunkir Logo" className="logo" />
          <span>Lunkir</span>
        </a>
        
        <div className="header-content">
          <div className="title-section">
            <h1>🏆 Quiz Leaderboard</h1>
            <p className="subtitle">See how everyone performed on our fintech quiz!</p>
          </div>
          
          <div className="filter-section">
            <label htmlFor="results-filter" className="filter-label">Show:</label>
            <select 
              id="results-filter"
              className="filter-select"
              onChange={handleFilterChange}
              value={filterValue === 1000 ? 'all' : filterValue}
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value="all">All Results</option>
            </select>
          </div>
        </div>
      </header>

      <div className="leaderboard-content">
        <Leaderboard showTitle={false} maxEntries={filterValue} />
      </div>

      <div className="leaderboard-footer">
        <div className="navigation-section">
          <div className="navigation-links">
            <Link to="/" className="nav-btn home-btn">
              🏠 Home
            </Link>
            <Link to="/quiz" className="nav-btn quiz-btn">
              🧠 Take Quiz
            </Link>
          </div>
        </div>
        
        <div className="encouragement-section">
          <p className="encouragement">
            Think you can make it to the top? 
            <Link to="/quiz" className="inline-quiz-link"> Take the quiz</Link> and find out!
          </p>
          
          <div className="stats-summary">
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;