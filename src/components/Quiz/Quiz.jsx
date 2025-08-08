// src/components/Quiz/Quiz.jsx - Updated with admin controls
import { useState, useEffect } from "react";
import { resultInitialState } from "../../constants";
import AnswerTimer from "../AnswerTimer/AnswerTimer";
import Result from "../Result/Result";
import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";
import { supabase } from '../../supabase/config';
import logo from '../../assets/lunkirLogo.png';

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [savedUserData, setSavedUserData] = useState(null);
  const [quizStatus, setQuizStatus] = useState('loading'); // 'loading', 'active', 'closed'

  // Check quiz status on component mount
  useEffect(() => {
    checkQuizStatus();
  }, []);

  const checkQuizStatus = async () => {
    try {
      // Check if admin settings table exists and get status
      const { data, error } = await supabase
        .from('admin_settings')
        .select('quiz_active')
        .eq('id', 1)
        .single();

      if (error) {
        // If table doesn't exist or no settings, assume quiz is active
        console.log('No admin settings found, quiz is active');
        setQuizStatus('active');
      } else {
        setQuizStatus(data.quiz_active ? 'active' : 'closed');
      }
    } catch (error) {
      console.error('Error checking quiz status:', error);
      // Default to active if there's an error
      setQuizStatus('active');
    }
  };

  const { question, choices, correctAnswer } = questions[currentQuestion];

  const onAnswerClick = (answer, index) => {
    setAnswerIdx(index);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer) => {
    setAnswerIdx(null);
    setShowAnswerTimer(false);

    setResult((prev) =>
      finalAnswer
        ? {
          ...prev,
          score: prev.score + 10,
          correctAnswers: prev.correctAnswers + 1,
        }
        : {
          ...prev,
          wrongAnswers: prev.wrongAnswers + 1,
        }
    );

    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentQuestion(0);
      setShowForm(true);
    }

    setTimeout(() => {
      setShowAnswerTimer(true);
    }, 100);
  };

  const handleFormSubmitSuccess = (userData) => {
    setSavedUserData(userData);
    setShowForm(false);
    setShowResult(true);
  };

  const handleTimeUp = () => {
    setAnswer(false);
    onClickNext(false);
  };

  // Show loading state
  if (quizStatus === 'loading') {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <a 
            href="https://lunkir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="logo-link"
          >
            <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
          </a>
        </div>
        <div className="quiz-status loading">
          <h2>Loading Quiz...</h2>
          <p>Please wait while we prepare your quiz experience.</p>
        </div>
      </div>
    );
  }

  // Show quiz closed message
  if (quizStatus === 'closed') {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <a 
            href="https://lunkir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="logo-link"
          >
            <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
          </a>
        </div>
        <div className="quiz-status closed">
          <h2>🏁 Quiz Has Ended</h2>
          <p>Thank you to everyone who participated in our fintech quiz!</p>
          <p>The quiz has been closed, but you can still view the final results.</p>
          <div className="closed-actions">
            <a href="/" className="home-btn">🏠 Back to Home</a>
            <a href="/leaderboard" className="leaderboard-btn">🏆 View Final Results</a>
          </div>
        </div>
      </div>
    );
  }

  // Show form after quiz completion
  if (showForm) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <a 
            href="https://lunkir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="logo-link"
          >
            <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
          </a>
        </div>
        
        <UserDetailsForm
          score={result.score}
          totalQuestions={questions.length}
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </div>
    );
  }

  // Show results after form submission
  if (showResult) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <a 
            href="https://lunkir.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="logo-link"
          >
            <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
          </a>
        </div>
        
        <Result 
          result={result} 
          totalQuestions={questions.length}
          savedUserData={savedUserData}
        />
      </div>
    );
  }

  // Show quiz questions (normal quiz flow)
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <a 
          href="https://lunkir.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="logo-link"
        >
          <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
        </a>
      </div>

      {showAnswerTimer && (
        <AnswerTimer
          key={currentQuestion}
          duration={5}
          onTimeUp={handleTimeUp}
        />
      )}
      
      <span className="active-question-no">{currentQuestion + 1}</span>
      <span className="total-question">/{questions.length}</span>
      <h2>{question}</h2>
      
      <ul>
        {choices.map((answer, index) => (
          <li
            onClick={() => onAnswerClick(answer, index)}
            key={answer}
            className={answerIdx === index ? 'selected-answer' : null}
          >
            {answer}
          </li>
        ))}
      </ul>
      
      <div className="quiz-footer">
        <button
          onClick={() => onClickNext(answer)}
          disabled={answerIdx === null}
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;