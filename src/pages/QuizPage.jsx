import Quiz from "../components/Quiz/Quiz";
import { jsQuizz } from "../constants";

function QuizPage() {

  return <Quiz questions={jsQuizz.questions}/>
}

export default QuizPage;
