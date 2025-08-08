
import { useState } from "react";
import { resultInitialState } from "../../constants";
import AnswerTimer from "../AnswerTimer/AnswerTimer";
import Result from "../Result/Result";
import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";
import logo from '../../assets/lunkirLogo.png'; // Update path to your logo

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [savedUserData, setSavedUserData] = useState(null);

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
      // Quiz finished - show form immediately
      setCurrentQuestion(0);
      setShowForm(true);
    }

    setTimeout(() => {
      setShowAnswerTimer(true);
    }, 100);
  };

  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
    setShowForm(false);
    setSavedUserData(null);
    setCurrentQuestion(0);
    setAnswerIdx(null);
    setAnswer(null);
    setShowAnswerTimer(true);
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

  // Show quiz questions
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
          duration={20}
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


// import { useState, useRef } from "react";
// import { resultInitialState } from "../../constants";
// import AnswerTimer from "../AnswerTimer/AnswerTimer";
// import Result from "../Result/Result";
// import logo from "../../assets/lunkirLogo.png";

// const Quiz = ({ questions }) => {

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answerIdx, setAnswerIdx] = useState(null);
//   const [answer, setAnswer] = useState(null);
//   const [result, setResult] = useState(resultInitialState);
//   const [showResult, setShowResult] = useState(false);
//   const [showAnswerTimer, setShowAnswerTimer] = useState(true);

//   // const timeoutRef = useRef();


//   const { question, choices, correctAnswer } = questions[currentQuestion];

//   const onAnswerClick = (answer, index) => {
//     setAnswerIdx(index);
//     if (answer === correctAnswer) {
//       setAnswer(true);
//     } else {
//       setAnswer(false);
//     }
//   };

//   const onClickNext = (finalAnswer) => {
//     setAnswerIdx(null);
//     setShowAnswerTimer(false);

//     // if (timeoutRef.current) {
//     //   clearTimeout(timeoutRef.current);
//     // }

//     setResult((prev) =>
//       finalAnswer
//         ? {
//           ...prev,
//           score: prev.score + 5,
//           correctAnswers: prev.correctAnswers + 1,
//         }
//         : {
//           ...prev,
//           wrongAnswers: prev.wrongAnswers + 1,
//         }
//     );

//     if (currentQuestion !== questions.length - 1) {
//       setCurrentQuestion((prev) => prev + 1);
//     } else {
//       setCurrentQuestion(0);
//       setShowResult(true);
//     }

//     window.setTimeout(() => {
//       setShowAnswerTimer(true);
//     });
//   };

//   const onTryAgain = () => {
//     setResult(resultInitialState);
//     setShowResult(false);
//   };


//   const handleTimeUp = () => {
//     setAnswer(false);
//     onClickNext(false);


//     // timeoutRef.current = setTimeout(() => {
//     //   setShowAnswerTimer(true);
//     // });
//   };

//   const formatPercentage = (value) => {
//     const rounded = (100 * value).toFixed(2);
//     return parseFloat(rounded); // Removes trailing zeros
//   };

//   return (
//     <div className="quiz-container">
//       <div className="quiz-header">
//         <a 
//           href="https://lunkir.com/" 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="logo-link"
//         >
//           <img src={logo} alt="Lunkir Logo" className="quiz-logo" />
//         </a>
//       </div>
//       {!showResult ? (
//         <>
//           {showAnswerTimer && (
//             <AnswerTimer
//               key={currentQuestion}
//               duration={15}
//               onTimeUp={handleTimeUp}
//             />
//           )}
//           <span className="active-question-no">{currentQuestion + 1}</span>
//           <span className="total-question">/{questions.length}</span>
//           <h2>{question}</h2>
//           <ul>
//             {
//               choices.map((answer, index) => (
//                 <li
//                   onClick={() => onAnswerClick(answer, index)}
//                   key={answer}
//                   className={answerIdx === index ? 'selected-answer' : null}
//                 >
//                   {answer}
//                 </li>
//               ))
//             }
//           </ul>
//           <div className="quiz-footer">
//             <button
//               onClick={() => onClickNext(answer)}
//               disabled={answerIdx === null}>
//               {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
//             </button>
//           </div>
//         </>) : (
//           <Result result={result} onTryAgain={onTryAgain} totalQuestions={questions.length}/>
//       )}

//     </div>

//   );
// };

// export default Quiz; 