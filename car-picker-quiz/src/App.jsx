import { useState } from 'react';
import { cars } from './data/cars.js';
import { questions, defaultAnswers } from './quiz/questions.js';
import { scoreCars } from './quiz/scoring.js';
import Intro from './components/Intro.jsx';
import QuizStep from './components/QuizStep.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import Results from './components/Results.jsx';

const SCREENS = { INTRO: 'intro', QUIZ: 'quiz', RESULTS: 'results' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers());
  const [scoreResult, setScoreResult] = useState(null);

  const question = questions[questionIndex];
  const isFirst = questionIndex === 0;
  const isLast = questionIndex === questions.length - 1;

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      const result = scoreCars(cars, answers);
      setScoreResult(result);
      setScreen(SCREENS.RESULTS);
      window.scrollTo({ top: 0 });
      return;
    }
    setQuestionIndex((i) => i + 1);
    window.scrollTo({ top: 0 });
  };

  const handleBack = () => {
    if (isFirst) {
      setScreen(SCREENS.INTRO);
      return;
    }
    setQuestionIndex((i) => i - 1);
    window.scrollTo({ top: 0 });
  };

  const handleStart = () => {
    setQuestionIndex(0);
    setScreen(SCREENS.QUIZ);
  };

  const handleTweak = () => {
    setQuestionIndex(0);
    setScreen(SCREENS.QUIZ);
    window.scrollTo({ top: 0 });
  };

  const handleRestart = () => {
    setAnswers(defaultAnswers());
    setScoreResult(null);
    setQuestionIndex(0);
    setScreen(SCREENS.INTRO);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-svh bg-zinc-950">
      {screen === SCREENS.INTRO && (
        <Intro onStart={handleStart} carCount={cars.length} questionCount={questions.length} />
      )}

      {screen === SCREENS.QUIZ && (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <ProgressBar current={questionIndex + 1} total={questions.length} />
          </div>

          <QuizStep question={question} answers={answers} onAnswer={handleAnswer} allCars={cars} />

          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-zinc-600 hover:border-zinc-400 text-white px-6 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-8 py-2.5 text-sm transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
            >
              {isLast ? 'See results' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {screen === SCREENS.RESULTS && scoreResult && (
        <Results scoreResult={scoreResult} answers={answers} onTweak={handleTweak} onRestart={handleRestart} />
      )}
    </div>
  );
}
