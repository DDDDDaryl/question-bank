'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionPractice from '@/components/QuestionPractice';
import BackButton from '@/components/BackButton';
import { Question } from '@/types/question';

export default function TopicsPracticePage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticing, setIsPracticing] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('获取题目失败');
      }
      const data = await response.json();
      // 从所有题目中提取唯一的标签
      const allTags = data.questions.reduce((acc: string[], q: Question) => {
        q.tags.forEach(tag => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
        return acc;
      }, []);
      setTags(allTags.sort());
    } catch (error) {
      console.error('获取标签失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startPractice = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/questions?tag=${encodeURIComponent(selectedTag)}`);
      if (!response.ok) {
        throw new Error('获取题目失败');
      }
      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setIsPracticing(true);
      } else {
        alert('该主题下暂无题目');
      }
    } catch (error) {
      console.error('获取题目失败:', error);
      alert('获取题目失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (results: Array<{ questionId: string; correct: boolean }>) => {
    // 保存错题
    const wrongQuestions = results
      .filter(r => !r.correct)
      .map(r => r.questionId);
    
    if (wrongQuestions.length > 0) {
      try {
        const response = await fetch('/api/mistakes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questionIds: wrongQuestions }),
        });
        if (!response.ok) {
          throw new Error('保存错题失败');
        }
      } catch (error) {
        console.error('保存错题失败:', error);
      }
    }

    // 显示练习结果
    const correctCount = results.filter(r => r.correct).length;
    alert(`练习完成！\n正确率：${(correctCount / results.length * 100).toFixed(1)}%`);
    
    // 返回主题选择
    setIsPracticing(false);
    setSelectedTag('');
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
        <QuestionPractice questions={questions} onComplete={handleComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton href="/practice" />
      <h1 className="text-3xl font-bold mb-8 text-center">主题练习</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">选择练习主题</h2>
          {tags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`p-3 rounded-lg text-center transition-colors
                    ${selectedTag === tag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">暂无可用的练习主题</div>
          )}
        </div>
        
        {selectedTag && (
          <button
            onClick={startPractice}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            开始练习 {selectedTag}
          </button>
        )}
      </div>
    </div>
  );
} 