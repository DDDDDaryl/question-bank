'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionPractice from '@/components/QuestionPractice';
import BackButton from '@/components/BackButton';
import { Question } from '@/types/question';

export default function MistakesPracticePage() {
  const router = useRouter();
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    try {
      const response = await fetch('/api/mistakes');
      const data = await response.json();
      if (data.success) {
        setMistakes(data.mistakes);
      }
    } catch (error) {
      console.error('Failed to fetch mistakes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startPractice = () => {
    // 随机选择错题进行练习
    const shuffled = [...mistakes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, mistakes.length));
    setSelectedQuestions(selected.map(m => m.questionId));
    setIsPracticing(true);
  };

  const handleComplete = async (results: Array<{ questionId: string; correct: boolean }>) => {
    // 更新错题库（如果有新的错题）
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
    
    // 刷新错题列表
    await fetchMistakes();
    setIsPracticing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton href="/practice" />
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (isPracticing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onClick={() => setIsPracticing(false)} />
        <QuestionPractice questions={selectedQuestions} onComplete={handleComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/practice" />
      <h1 className="text-3xl font-bold mb-8 text-center">错题练习</h1>
      
      {mistakes.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">暂无错题记录</p>
          <button
            onClick={() => router.push('/practice')}
            className="text-blue-500 hover:text-blue-600"
          >
            返回练习主页
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">错题统计</h2>
            <p className="text-gray-600">共有 {mistakes.length} 道错题</p>
          </div>
          
          <button
            onClick={startPractice}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            开始练习
          </button>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">错题列表</h2>
            <div className="space-y-4">
              {mistakes.map((mistake, index) => (
                <div
                  key={mistake._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{mistake.questionId.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(mistake.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{mistake.questionId.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 