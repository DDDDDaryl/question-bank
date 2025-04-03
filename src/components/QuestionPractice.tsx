'use client';

import { useState } from 'react';
import { Question } from '@/types/question';

interface QuestionPracticeProps {
  questions: Question[];
  onComplete: (results: Array<{ questionId: string; correct: boolean }>) => void;
}

export default function QuestionPractice({ questions, onComplete }: QuestionPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<Array<{ questionId: string; correct: boolean }>>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = (option: string) => {
    if (currentQuestion.type === 'SINGLE_CHOICE') {
      setSelectedAnswers([option]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(option) 
          ? prev.filter(a => a !== option)
          : [...prev, option]
      );
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion._id) {
      console.error('Question ID is missing');
      return;
    }

    const isCorrect = currentQuestion.type === 'SINGLE_CHOICE'
      ? selectedAnswers[0] === currentQuestion.answer
      : Array.isArray(currentQuestion.answer) &&
        selectedAnswers.length === currentQuestion.answer.length &&
        selectedAnswers.every(a => currentQuestion.answer.includes(a));

    setResults([...results, { questionId: currentQuestion._id, correct: isCorrect }]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(results);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setShowExplanation(false);
    }
  };

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4 text-sm text-gray-600">
        题目 {currentIndex + 1}/{questions.length}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.title}</h2>
        <p className="mb-4">{currentQuestion.content}</p>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                ${selectedAnswers.includes(option)
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'}`}
            >
              <input
                type={currentQuestion.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                name="answer"
                checked={selectedAnswers.includes(option)}
                onChange={() => handleAnswerSelect(option)}
                className="mr-3"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {!showExplanation ? (
        <button
          onClick={checkAnswer}
          disabled={selectedAnswers.length === 0}
          className={`w-full py-3 rounded-lg font-medium text-white
            ${selectedAnswers.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          提交答案
        </button>
      ) : (
        <div>
          <div className={`p-4 rounded-lg mb-4 ${
            results[results.length - 1].correct ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h3 className={`font-medium ${
              results[results.length - 1].correct ? 'text-green-800' : 'text-red-800'
            }`}>
              {results[results.length - 1].correct ? '回答正确！' : '回答错误'}
            </h3>
            <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            {isLastQuestion ? '完成练习' : '下一题'}
          </button>
        </div>
      )}
    </div>
  );
} 