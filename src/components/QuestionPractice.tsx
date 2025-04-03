'use client';

import { useState } from 'react';
import { Question, QuestionOption } from '@/types/question';

interface QuestionPracticeProps {
  questions: Question[];
  onComplete: (results: Array<{ questionId: string; correct: boolean }>) => void;
}

export default function QuestionPractice({ questions, onComplete }: QuestionPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<Array<{ questionId: string; correct: boolean }>>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (currentQuestion.type === 'SINGLE_CHOICE') {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(index) 
          ? prev.filter(a => a !== index)
          : [...prev, index]
      );
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion._id) {
      console.error('Question ID is missing');
      return;
    }

    const correctAnswers = currentQuestion.options
      .map((option, index) => option.isCorrect ? index : -1)
      .filter(index => index !== -1);

    const isCorrect = currentQuestion.type === 'SINGLE_CHOICE'
      ? selectedAnswers[0] === correctAnswers[0]
      : selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(a => correctAnswers.includes(a));

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

  const renderOptions = () => {
    if (!currentQuestion?.options) return null;
    return (
      <div className="flex flex-col gap-4 w-full mt-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={selectedAnswers.length > 0}
            className={`w-full p-4 text-left rounded-lg border ${
              selectedAnswers.includes(index)
                ? option.isCorrect
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-500'
                : 'hover:bg-gray-100 border-gray-200'
            } transition-colors duration-200`}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
            {option.content}
          </button>
        ))}
      </div>
    );
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
        
        {renderOptions()}
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
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">正确答案：</h4>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  option.isCorrect && (
                    <div key={index} className="text-green-700">
                      {String.fromCharCode(65 + index)}. {option.content}
                    </div>
                  )
                ))}
              </div>
            </div>
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