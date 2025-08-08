import "./Result.scss";
import { useState, useEffect } from "react";
import Leaderboard from "../Leaderboard/Leaderboard";
import PersonalResult from "../PersonalResult/PersonalResult";

const Result = ({ totalQuestions, result, savedUserData }) => {
  const [currentView, setCurrentView] = useState('results'); // 'results', 'personal', 'leaderboard'

  const formatPercentage = (value) => {
    const rounded = (100 * value).toFixed(2);
    return parseFloat(rounded);
  };

  const handleBackToHome = () => {
    // If you want to navigate back to home page instead
    // This would need to be passed down as a prop from parent
    window.location.href = '/'; // Simple way to go back to home
  };

  // Show leaderboard view
  if (currentView === 'leaderboard') {
    return (
      <div className="result">
        <div className="result-header">
          <h3>🏆 Full Leaderboard</h3>
          <p className="view-info">See how everyone is performing!</p>
        </div>
        
        <Leaderboard showTitle={false} maxEntries={50} />
        
        <div className="result-actions">
          <button onClick={() => setCurrentView('personal')} className="personal-btn">
            📊 My Result
          </button>
          <button onClick={() => setCurrentView('results')} className="back-btn">
            ← Back to Results
          </button>
        </div>
      </div>
    );
  }

  // Show personal result view
  if (currentView === 'personal') {
    return (
      <div className="result">
        <div className="result-header">
          <h3>📊 Your Personal Result</h3>
          <p className="view-info">Here's how you performed, {savedUserData.name}!</p>
        </div>
        
        <PersonalResult 
          userData={savedUserData}
          totalQuestions={totalQuestions}
          result={result}
        />
        
        <div className="result-actions">
          <button onClick={() => setCurrentView('leaderboard')} className="view-leaderboard-btn">
            🏆 View Full Leaderboard
          </button>
          <button onClick={() => setCurrentView('results')} className="back-btn">
            ← Back to Results
          </button>
        </div>
      </div>
    );
  }

  // Show main results view (BIG REVEAL after form submission)
  return (
    <div className="result">
      <div className="result-header">
        <h3>🎉 Your Results Are In! 🎉</h3>
        <p className="big-reveal-message">
          Congratulations <span className="user-name">{savedUserData.name}</span>! 
          Here's how you performed:
        </p>
      </div>

      <div className="big-score-reveal">
        <div className="main-score">
          <span className="score-label">Your Final Score</span>
          <span className="score-value">{formatPercentage(result.correctAnswers / totalQuestions)}%</span>
          <span className="score-detail">{result.correctAnswers} out of {totalQuestions} correct</span>
        </div>
      </div>

      <div className="final-results">
        <div className="result-stats">
          <div className="stat-card">
            <span className="stat-label">Questions</span>
            <span className="stat-value">{totalQuestions}</span>
          </div>
          
          <div className="stat-card highlight">
            <span className="stat-label">Points Earned</span>
            <span className="stat-value">{result.score}</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Correct</span>
            <span className="stat-value">{result.correctAnswers}</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Wrong</span>
            <span className="stat-value">{result.wrongAnswers}</span>
          </div>
        </div>

        <div className="performance-message">
          {formatPercentage(result.correctAnswers / totalQuestions) >= 80 ? (
            <p className="excellent">🏆 Impressive! You're a fintech expert - great to meet you!</p>
          ) : formatPercentage(result.correctAnswers / totalQuestions) >= 60 ? (
            <p className="good">💼 Well done! You clearly know the fintech space!</p>
          ) : formatPercentage(result.correctAnswers / totalQuestions) >= 40 ? (
            <p className="okay">📈 Nice work! Hope you're enjoying the event!</p>
          ) : (
            <p className="needs-work">🎯 Thanks for playing! Enjoy exploring more at the event!</p>
          )}
        </div>
      </div>

      <div className="result-actions">
        <button onClick={() => setCurrentView('personal')} className="personal-btn">
          📊 See My Detailed Results
        </button>
        <button onClick={() => setCurrentView('leaderboard')} className="view-leaderboard-btn">
          🏆 View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Result;

// import "./Result.scss";
// import { useState } from "react";
// import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";
// import Leaderboard from "../Leaderboard/Leaderboard";

// const Result = ({totalQuestions, result, onTryAgain}) => {

//   const [showForm, setShowForm] = useState(false);
//   const [showLeaderboard, setShowLeaderboard] = useState(false);

//   const formatPercentage = (value) => {
//     const rounded = (100 * value).toFixed(2);
//     return parseFloat(rounded); // Removes trailing zeros
//   };

//   const handleFormSubmitSuccess = () => {
//     setShowForm(false);
//     setShowLeaderboard(true);
//   };

//   const showLeaderboardOnly = () => {
//     setShowLeaderboard(true);
//   };

//   const handleTryAgain = () => {
//     setShowForm(false);
//     setShowLeaderboard(false);
//     onTryAgain();
//   };

//         // Show leaderboard view
//   if (showLeaderboard) {
//     return (
//       <div className="result">
//         <Leaderboard />
//         <div className="result-actions">
//           <button onClick={handleTryAgain} className="try-again-btn">
//             Take Quiz Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Show form view
//   if (showForm) {
//     return (
//       <div className="result">
//         <UserDetailsForm
//           score={result.score}
//           totalQuestions={totalQuestions}
//           onSubmitSuccess={handleFormSubmitSuccess}
//         />
//       </div>
//     );
//   }

//   // Show initial results view
//   return (
//     <div className="result">
//       <h3>Quiz Complete! 🎉</h3>
//       <div className="result-stats">
//         <p>
//           Total Questions: <span>{totalQuestions}</span>
//         </p>
//         <p>
//           Total Score: <span>{formatPercentage(result.correctAnswers / totalQuestions)}%</span>
//         </p>
//         <p>
//           Correct Answers: <span>{result.correctAnswers}</span>
//         </p>
//         <p>
//           Wrong Answers: <span>{result.wrongAnswers}</span>
//         </p>
//       </div>

//       <div className="result-actions">
//         <button onClick={() => setShowForm(true)} className="save-score-btn">
//           💾 Save Score to Leaderboard
//         </button>
//         <button onClick={showLeaderboardOnly} className="view-leaderboard-btn">
//           🏆 View Leaderboard
//         </button>
//         <button onClick={handleTryAgain} className="try-again-btn">
//           🔄 Try Again
//         </button>
//       </div>
//     </div>

//         // <div className="result">
//         //   <h3>Result</h3>
//         //   <p>
//         //     Total Questions:  <span>{totalQuestions}</span>
//         //   </p>
//         //   <p>
//         //     Total Score:  <span>{formatPercentage(result.correctAnswers / totalQuestions)}%</span>
//         //   </p>
//         //   <p>
//         //     Correct Answers:  <span>{result.correctAnswers}</span>
//         //   </p>
//         //   <p>
//         //     Wrong Answers:  <span>{result.wrongAnswers}</span>
//         //   </p>
//         //   <button onClick={onTryAgain}>Try Again</button>

//         // <>
//         //     <h3>Enter your name: </h3>
//         //     {/* <input 
//         //     placeholder="John"
//         //     type="text" 
//         //     value={name} onChange={(evt) => setName(evt.target.value)}  /> */}
//         // </>
//         // <button onClick={handleSave}>Save</button>

//         // </div>
//     );
// }

// export default Result;