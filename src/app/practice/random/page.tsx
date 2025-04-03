'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionPractice from '@/components/QuestionPractice';
import BackButton from '@/components/BackButton';

export default function RandomPracticePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const startPractice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/questions/random?count=${questionCount}`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        setHasStarted(true);
      }
    } catch (error) {
      console.error('Failed to fetch random questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (results: Array<{ questionId: string; correct: boolean }>) => {
    // 保存错题到错题库
    const wrongQuestions = results
      .filter(r => !r.correct)
      .map(r => r.questionId);
    
    if (wrongQuestions.length > 0) {
      try {
        await fetch('/api/mistakes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionIds: wrongQuestions }),
        });
      } catch (error) {
        console.error('Failed to save mistakes:', error);
      }
    }

    // 显示练习结果
    const correctCount = results.filter(r => r.correct).length;
    alert(`练习完成！\n正确率：${(correctCount / results.length * 100).toFixed(1)}%`);
    
    // 返回练习主页
    router.push('/practice');
  };

  if (!hasStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton href="/practice" />
        <h1 className="text-3xl font-bold mb-8 text-center">随机练习</h1>
        
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              选择题目数量
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={startPractice}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white
              ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isLoading ? '准备题目中...' : '开始练习'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onClick={() => setHasStarted(false)} />
      <QuestionPractice questions={questions} onComplete={handleComplete} />
    </div>
  );
} 