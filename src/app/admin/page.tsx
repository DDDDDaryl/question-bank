'use client';

import { useState, useEffect } from 'react';
import { QuestionType, Difficulty, IQuestion } from '@/models/Question';
import QuestionListItem from '@/components/QuestionListItem';
import QuestionForm from '@/components/QuestionForm';
import Modal from '@/components/Modal';

export default function AdminPage() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<QuestionType | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<IQuestion | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [searchQuery, selectedType, selectedDifficulty, selectedTag]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedType) params.append('type', selectedType);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedTag) params.append('tags', selectedTag);

      const response = await fetch(`/api/questions?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data.questions);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('获取题目列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<IQuestion, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const url = editingQuestion 
        ? `/api/questions/${editingQuestion._id}`
        : '/api/questions';
      
      const response = await fetch(url, {
        method: editingQuestion ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchQuestions();
        setIsModalOpen(false);
        setEditingQuestion(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('保存题目失败');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个题目吗？')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        fetchQuestions();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('删除题目失败');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">题库管理系统</h1>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          添加题目
        </button>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="搜索题目..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex gap-4">
          <select
            className="p-2 border rounded"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as QuestionType)}
          >
            <option value="">所有类型</option>
            {Object.values(QuestionType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            className="p-2 border rounded"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
          >
            <option value="">所有难度</option>
            {Object.values(Difficulty).map((difficulty) => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 题目列表 */}
      {loading ? (
        <div className="text-center py-4">加载中...</div>
      ) : (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  难度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标签
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map((question) => (
                <QuestionListItem
                  key={question._id}
                  question={question}
                  onEdit={(id) => {
                    setEditingQuestion(question);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onView={(id) => {
                    setViewingQuestion(question);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 编辑/创建模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
          setViewingQuestion(null);
        }}
        title={editingQuestion ? '编辑题目' : viewingQuestion ? '查看题目' : '添加题目'}
      >
        <QuestionForm
          initialData={editingQuestion || viewingQuestion || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingQuestion(null);
            setViewingQuestion(null);
          }}
        />
      </Modal>
    </div>
  );
} 