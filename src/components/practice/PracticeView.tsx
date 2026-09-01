import React, { useState } from 'react';
import { PRACTICE_QUESTIONS, getPracticeQuestionsByCategory } from '../../data/practiceBank';
import { CalculatorCategory, PracticeQuestion } from '../../types';
import { 
  Award, CheckCircle2, XCircle, HelpCircle, Sparkles, ChevronRight, RotateCcw, ArrowRight 
} from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';

interface PracticeViewProps {
  onSelectCalculator?: (id: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onSelectCalculator }) => {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const questions = selectedCategory === 'all' 
    ? PRACTICE_QUESTIONS 
    : getPracticeQuestionsByCategory(selectedCategory);

  const currentQ: PracticeQuestion | undefined = questions[currentIndex % questions.length];

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentQ) return;

    const numUser = parseFloat(userAnswer.trim());
    const expected = currentQ.correctAnswer;
    
    // Check match with tolerance for floating point
    let correct = false;
    if (typeof expected === 'number') {
      correct = Math.abs(numUser - expected) < 1e-4;
    } else {
      correct = userAnswer.trim().toLowerCase() === String(expected).trim().toLowerCase();
    }

    if (correct) {
      soundEngine.playSuccessChime();
    } else {
      soundEngine.playErrorSound();
    }

    setIsCorrect(correct);
    setSubmitted(true);
    setTotalAnswered(t => t + 1);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playKeypadClick('fn');
    setCurrentIndex(i => i + 1);
    setUserAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
    setRevealedHints(0);
  };

  const handleRevealHint = () => {
    soundEngine.playKeypadClick('fn');
    if (currentQ && revealedHints < currentQ.hints.length) {
      setRevealedHints(h => h + 1);
    }
  };

  const handleCategorySelect = (cat: CalculatorCategory | 'all') => {
    soundEngine.playKeypadClick('fn');
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setUserAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
    setRevealedHints(0);
  };

  if (!currentQ) {
    return <div className="text-center text-neutral-400">No practice questions available.</div>;
  }

  return (
    <div id="practice-mastery-page" className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Header & Scoreboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Practice & Mastery Mode</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Test and verify your mathematical, scientific, and financial problem-solving skills.
          </p>
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
          <span className="text-neutral-400">Score:</span>
          <span className="font-bold text-emerald-400 text-sm">{score}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-300 text-sm">{totalAnswered}</span>
        </div>
      </div>

      {/* Category Selection Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Categories' },
          { id: 'math', label: 'Math' },
          { id: 'science', label: 'Science' },
          { id: 'finance', label: 'Finance' },
          { id: 'programming', label: 'Programming' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? 'bg-violet-900/60 text-violet-200 border-violet-700'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-neutral-800/90 bg-neutral-900/90 p-6 shadow-xl space-y-5">
        
        {/* Meta / Difficulty */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-400 font-bold uppercase text-[10px] border border-violet-800/50">
              {currentQ.topic}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
              currentQ.difficulty === 'easy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>
          <span className="text-neutral-500 font-mono text-[11px]">
            Question {(currentIndex % questions.length) + 1} of {questions.length}
          </span>
        </div>

        {/* Question Text */}
        <div className="text-base font-semibold text-white leading-relaxed">
          {currentQ.question}
        </div>

        {/* Form / Answer Input */}
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                id="practice-user-answer-input"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={submitted}
                placeholder="Enter numerical answer..."
                className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-base font-mono text-white placeholder:text-neutral-600 focus:border-violet-600 focus:outline-none"
              />
              {currentQ.unit && (
                <span className="absolute right-4 top-3 text-xs font-mono text-neutral-400">
                  {currentQ.unit}
                </span>
              )}
            </div>

            {!submitted ? (
              <button
                id="practice-submit-answer-btn"
                type="submit"
                disabled={!userAnswer.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-900/40 disabled:opacity-40 transition-all"
              >
                Submit
              </button>
            ) : (
              <button
                id="practice-next-btn"
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-sm font-bold border border-neutral-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Hints Drawer */}
        {!submitted && currentQ.hints && currentQ.hints.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <button
                id="practice-reveal-hint-btn"
                onClick={handleRevealHint}
                disabled={revealedHints >= currentQ.hints.length}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-40 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {revealedHints === 0 ? 'Need a Hint?' : `Show Next Hint (${revealedHints}/${currentQ.hints.length})`}
                </span>
              </button>
            </div>

            {revealedHints > 0 && (
              <div className="space-y-1.5">
                {currentQ.hints.slice(0, revealedHints).map((hint, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-neutral-950 border border-amber-900/30 text-xs text-amber-200/90 font-mono">
                    💡 Hint {idx + 1}: {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Evaluation Banner & Full Step-by-Step Solution */}
        {submitted && (
          <div className="space-y-4 pt-2 border-t border-neutral-800 animate-in fade-in duration-200">
            <div className={`p-4 rounded-xl flex items-center justify-between ${
              isCorrect ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300' : 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                <span>{isCorrect ? 'Correct! Excellent work.' : `Incorrect. The correct answer is ${currentQ.correctAnswer} ${currentQ.unit || ''}.`}</span>
              </div>
            </div>

            {/* Complete Step Solution */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-neutral-300 uppercase tracking-wider text-[11px] block pb-1 border-b border-neutral-900">
                Detailed Verification & Solution Steps
              </span>
              {currentQ.solutionSteps.map((step, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-violet-300">{step.title}</div>
                  <div className="text-neutral-400">{step.detail}</div>
                </div>
              ))}
            </div>

            {/* Calculator Bridge */}
            {currentQ.relatedCalculatorId && onSelectCalculator && (
              <button
                onClick={() => onSelectCalculator(currentQ.relatedCalculatorId!)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-xs font-semibold text-violet-300 border border-violet-800/50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Verify in Calculator</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
