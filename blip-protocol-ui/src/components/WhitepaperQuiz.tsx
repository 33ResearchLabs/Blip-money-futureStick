import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

// 5 Easy questions based on the Blip.money whitepaper
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What blockchain is Blip.money built on?",
    options: ["Ethereum", "Solana", "Bitcoin", "Polygon"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What type of escrow does Blip.money use?",
    options: [
      "Custodial Escrow",
      "Non-Custodial Escrow",
      "Bank Escrow",
      "No Escrow",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Who is responsible for dispute resolution in Blip.money?",
    options: [
      "The Bank",
      "A Central Authority",
      "DAO (Decentralized Autonomous Organization)",
      "The Merchant Only",
    ],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "What must Merchants stake to participate in Blip.money?",
    options: [
      "Nothing",
      "A Cryptographic Bond",
      "Their Identity",
      "Fiat Currency",
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What auction mechanism does Blip.money use for fee discovery?",
    options: [
      "First-Price Auction",
      "Sealed-Bid Second-Price Auction",
      "Dutch Auction",
      "No Auction",
    ],
    correctAnswer: 1,
  },
];

interface WhitepaperQuizProps {
  onComplete: (score: number, answers: number[]) => void;
  onClose: () => void;
}

export default function WhitepaperQuiz({
  onComplete,
  onClose,
}: WhitepaperQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, show results
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = q.correctAnswer;
      const isCorrect = userAnswer !== undefined && userAnswer === correctAnswer;

      console.log(`Q${index + 1}: User answered ${userAnswer}, Correct is ${correctAnswer}, Match: ${isCorrect}`);

      if (isCorrect) {
        correct++;
      }
    });
    console.log(`Total correct: ${correct}/5`);
    return correct;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const score = calculateScore();
    console.log("Submitting quiz with score:", score, "answers:", selectedAnswers);
    // Send to parent which will call backend
    await onComplete(score, selectedAnswers);
    setSubmitting(false);
  };

  const score = calculateScore();
  const passed = score >= 4; // Need 4/5 to pass

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-8">
          <div className="text-center">
            {passed ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#39ff14]/20 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-[#39ff14]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Congratulations!
                </h2>
                <p className="text-zinc-400 mb-4">
                  You scored{" "}
                  <span className="text-[#39ff14] font-bold">{score}/5</span>
                </p>
                <p className="text-sm text-zinc-500 mb-8">
                  You've demonstrated your understanding of the Blip.money
                  protocol.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Not Quite!
                </h2>
                <p className="text-zinc-400 mb-4">
                  You scored{" "}
                  <span className="text-red-400 font-bold">{score}/5</span>
                </p>
                <p className="text-sm text-zinc-500 mb-8">
                  You need at least 4/5 correct answers to pass. Please read the
                  whitepaper again and try later.
                </p>
              </>
            )}

            {/* Show answer summary */}
            <div className="text-left mb-6 space-y-2">
              {QUIZ_QUESTIONS.map((q, index) => (
                <div key={q.id} className="flex items-center gap-2 text-sm">
                  {selectedAnswers[index] === q.correctAnswer ? (
                    <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-zinc-400 truncate">
                    Q{index + 1}: {q.question.slice(0, 40)}...
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {passed ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 px-6 rounded font-bold bg-[#39ff14] text-black hover:bg-[#2fe610] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Claim Points
                      <Trophy className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded font-bold bg-zinc-700 text-white hover:bg-zinc-600 transition"
                >
                  Close & Try Later
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const hasSelected = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-lg w-full p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {QUIZ_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                index < currentQuestion
                  ? "bg-[#39ff14]"
                  : index === currentQuestion
                  ? "bg-[#39ff14]/60"
                  : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Whitepaper Quiz
          </span>
          <span className="text-sm font-mono text-zinc-500">
            {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-6">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full text-left p-4 rounded border transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? "bg-[#39ff14]/10 border-[#39ff14] text-white"
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-[#39ff14] bg-[#39ff14] text-black"
                      : "border-zinc-600 text-zinc-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-500 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={!hasSelected}
            className="px-6 py-2 rounded font-bold bg-[#39ff14] text-black hover:bg-[#2fe610] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1
              ? "See Results"
              : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
