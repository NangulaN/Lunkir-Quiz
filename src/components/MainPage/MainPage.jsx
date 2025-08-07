// src/components/MainPage/MainPage.jsx
import { useState } from 'react';
import Quiz from '../Quiz/Quiz';
import Leaderboard from '../Leaderboard/Leaderboard';
import './MainPage.scss';

const MainPage = ({ questions }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  const startQuiz = () => {
    setShowQuiz(true);
  };

  const backToMain = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <div className="main-page">
        <div className="back-to-main">
          <button onClick={backToMain} className="back-btn">
            ← Back to Main
          </button>
        </div>
        <Quiz questions={questions} />
      </div>
    );
  }

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>🧠 Quiz Challenge</h1>
        <p className="subtitle">Test your knowledge and compete for the top spot!</p>
      </header>

      <div className="main-content">
        <div className="quiz-intro">
          <div className="quiz-stats">
            <div className="stat-item">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Seconds per Q</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Points per Correct</span>
            </div>
          </div>

          <button onClick={startQuiz} className="start-quiz-btn">
            🚀 Start Quiz
          </button>
        </div>

        <div className="leaderboard-section">
          <Leaderboard showTitle={true} maxEntries={10} />
        </div>
      </div>

      <footer className="main-footer">
        <p>Challenge yourself and see if you can make it to the top! 🏆</p>
      </footer>
    </div>
  );
};

export default MainPage;