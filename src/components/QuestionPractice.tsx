'use client';

import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    let mounted = true;

    const initializeQuestion = async () => {
      if (!currentQuestion) return;
      
      try {
        setIsLoading(true);
        // 验证选项数据的完整性
        if (!Array.isArray(currentQuestion.options)) {
          console.error('选项数据格式错误:', currentQuestion);
          return;
        }

        const hasInvalidOptions = currentQuestion.options.some(
          option => !option || typeof option.content === 'undefined'
        );

        if (hasInvalidOptions) {
          console.error('存在无效的选项数据:', currentQuestion.options);
          return;
        }

        if (mounted) {
          setSelectedAnswers([]);
          setShowExplanation(false);
        }
      } catch (error) {
        console.error('初始化题目失败:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeQuestion();

    return () => {
      mounted = false;
    };
  }, [currentQuestion]);

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
    if (isLoading) {
      return <div className="text-center py-4">加载中...</div>;
    }

    if (!currentQuestion) {
      console.error('当前题目数据为空');
      return <div className="text-center py-4 text-red-500">题目数据错误</div>;
    }

    // 添加调试日志
    console.log('当前题目数据:', currentQuestion);

    if (!Array.isArray(currentQuestion.options)) {
      console.error('选项不是数组:', currentQuestion.options);
      return <div className="text-center py-4 text-red-500">选项数据格式错误</div>;
    }

    // 验证每个选项的格式
    const hasInvalidOptions = currentQuestion.options.some(option => {
      const isInvalid = !option || typeof option !== 'object' || !('content' in option);
      if (isInvalid) {
        console.error('无效的选项数据:', option);
      }
      return isInvalid;
    });

    if (hasInvalidOptions) {
      return <div className="text-center py-4 text-red-500">选项数据不完整</div>;
    }

    return (
      <div className="flex flex-col gap-4 w-full mt-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswers.includes(index);
          const showResult = showExplanation;
          const isCorrect = option.isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showExplanation && handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 flex items-center
                ${showResult 
                  ? isCorrect
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : isSelected
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 text-gray-700'
                  : isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="font-medium mr-4">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option.content}</span>
              {showResult && isCorrect && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {showResult && !isCorrect && isSelected && (
                <span className="ml-2 text-red-600">✗</span>
              )}
            </button>
          );
        })}
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
            {!results[results.length - 1].correct && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">正确答案：</h4>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    option.isCorrect && (
                      <div key={index} className="flex items-center text-green-700">
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span>{option.content}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
            {currentQuestion.explanation && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">解析：</h4>
                <p className="text-gray-600">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLastQuestion ? '完成练习' : '下一题'}
          </button>
        </div>
      )}
    </div>
  );
} 