import "./Result.scss";
import { useState } from "react";
import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";
import Leaderboard from "../Leaderboard/Leaderboard";

const Result = ({totalQuestions, result, onTryAgain}) => {

  const [showForm, setShowForm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const formatPercentage = (value) => {
    const rounded = (100 * value).toFixed(2);
    return parseFloat(rounded); // Removes trailing zeros
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setShowLeaderboard(true);
  };

  const showLeaderboardOnly = () => {
    setShowLeaderboard(true);
  };

  const handleTryAgain = () => {
    setShowForm(false);
    setShowLeaderboard(false);
    onTryAgain();
  };

        // Show leaderboard view
  if (showLeaderboard) {
    return (
      <div className="result">
        <Leaderboard />
        <div className="result-actions">
          <button onClick={handleTryAgain} className="try-again-btn">
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  // Show form view
  if (showForm) {
    return (
      <div className="result">
        <UserDetailsForm
          score={result.score}
          totalQuestions={totalQuestions}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </div>
    );
  }

  // Show initial results view
  return (
    <div className="result">
      <h3>Quiz Complete! 🎉</h3>
      <div className="result-stats">
        <p>
          Total Questions: <span>{totalQuestions}</span>
        </p>
        <p>
          Total Score: <span>{formatPercentage(result.correctAnswers / totalQuestions)}%</span>
        </p>
        <p>
          Correct Answers: <span>{result.correctAnswers}</span>
        </p>
        <p>
          Wrong Answers: <span>{result.wrongAnswers}</span>
        </p>
      </div>

      <div className="result-actions">
        <button onClick={() => setShowForm(true)} className="save-score-btn">
          💾 Save Score to Leaderboard
        </button>
        <button onClick={showLeaderboardOnly} className="view-leaderboard-btn">
          🏆 View Leaderboard
        </button>
        <button onClick={handleTryAgain} className="try-again-btn">
          🔄 Try Again
        </button>
      </div>
    </div>

        // <div className="result">
        //   <h3>Result</h3>
        //   <p>
        //     Total Questions:  <span>{totalQuestions}</span>
        //   </p>
        //   <p>
        //     Total Score:  <span>{formatPercentage(result.correctAnswers / totalQuestions)}%</span>
        //   </p>
        //   <p>
        //     Correct Answers:  <span>{result.correctAnswers}</span>
        //   </p>
        //   <p>
        //     Wrong Answers:  <span>{result.wrongAnswers}</span>
        //   </p>
        //   <button onClick={onTryAgain}>Try Again</button>

        // <>
        //     <h3>Enter your name: </h3>
        //     {/* <input 
        //     placeholder="John"
        //     type="text" 
        //     value={name} onChange={(evt) => setName(evt.target.value)}  /> */}
        // </>
        // <button onClick={handleSave}>Save</button>

        // </div>
    );
}

export default Result;