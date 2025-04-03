'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Question } from '@/types/question';

interface QuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function QuestionList() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<QuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const queryString = searchParams.toString();
      const response = await fetch(`/api/questions${queryString ? `?${queryString}` : ''}`);
      if (!response.ok) {
        throw new Error('获取题目失败');
      }
      const data = await response.json();
      setData(data);
      setError('');
    } catch (err) {
      console.error('获取题目失败:', err);
      setError(err instanceof Error ? err.message : '获取题目失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  if (loading) {
    return (
      <div className="text-center">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">{error}</div>
    );
  }

  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <div className="text-center text-gray-500">暂无题目</div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {data.questions.map((question) => (
        <li key={question._id}>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {question.title}
              </h3>
              <div className="flex space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  question.difficulty === 'EASY'
                    ? 'bg-green-100 text-green-800'
                    : question.difficulty === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty === 'EASY' ? '简单' : question.difficulty === 'MEDIUM' ? '中等' : '困难'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {question.type === 'SINGLE_CHOICE' ? '单选题' : '多选题'}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {question.content}
            </div>
            <div className="mt-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            {question.createdAt && (
              <div className="mt-2 text-xs text-gray-400">
                创建时间：{new Date(question.createdAt).toLocaleString('zh-CN')}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <Suspense fallback={<div className="text-center p-4">加载中...</div>}>
            <QuestionList />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 