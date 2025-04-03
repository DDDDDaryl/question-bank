'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Question } from '@/types/question';
import QuestionForm from '@/components/QuestionForm';
import QuestionListItem from '@/components/QuestionListItem';

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedType) params.append('type', selectedType);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, selectedDifficulty, selectedTag]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmit = async (data: Omit<Question, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const url = editingQuestion ? `/api/questions/${editingQuestion._id}` : '/api/questions';
      const method = editingQuestion ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save question');

      await fetchQuestions();
      setShowForm(false);
      setEditingQuestion(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这道题目吗？')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      await fetchQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(undefined);
  };

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">题目管理</h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">所有类型</option>
            <option value="SINGLE_CHOICE">单选题</option>
            <option value="MULTIPLE_CHOICE">多选题</option>
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">所有难度</option>
            <option value="EASY">简单</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困难</option>
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">所有标签</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            添加题目
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <QuestionForm
          question={editingQuestion}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">加载中...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无题目</p>
            </div>
          ) : (
            questions.map((question) => (
              <QuestionListItem
                key={question._id}
                question={question}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
} 