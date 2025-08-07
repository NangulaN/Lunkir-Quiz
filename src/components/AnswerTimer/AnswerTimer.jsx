import "./AnswerTimer.scss";
import { useEffect, useState, useRef } from "react";

function AnswerTimer ({ duration, onTimeUp }) {
    const [counter, setCounter] = useState(0);
    const [progressLoaded, setProgressLoaded] = useState(0);
    const intervalRef = useRef();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCounter((cur) => cur + 0.1);
        }, 100);

        return () => clearInterval(intervalRef.current);
    }, []);
    
    useEffect(() => {
        setProgressLoaded(100 * (counter / duration));

        if (counter >= duration) {
            clearInterval(intervalRef.current);

            onTimeUp();
        }
    }, [counter]);


    return (
        <div className="answer-timer-container">
            <div 
                style={{
                    width: `${progressLoaded}%`,
                    backgroundColor: `${
                        progressLoaded < 40 
                        ? "lightgreen"
                        // : progressLoaded < 40 
                        // ? "#2bd945"
                        : progressLoaded < 70 
                        ? "orange"
                        : "red"
                    }`
                }}
            className="timer-progress"></div>
        </div>
    );
}

export default AnswerTimer;