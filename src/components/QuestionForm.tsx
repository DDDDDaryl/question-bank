import { useState, useEffect } from 'react';
import type { Question, QuestionType, Difficulty } from '@/types/question';

interface QuestionFormProps {
  question?: Question;
  onSubmit: (data: Omit<Question, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function QuestionForm({ question, onSubmit, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState<Omit<Question, '_id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    type: 'SINGLE_CHOICE',
    content: '',
    options: [''],
    answer: '',
    explanation: '',
    difficulty: 'MEDIUM',
    tags: [],
    source: ''
  });

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        type: question.type,
        content: question.content,
        options: question.options,
        answer: question.answer,
        explanation: question.explanation || '',
        difficulty: question.difficulty,
        tags: question.tags,
        source: question.source || ''
      });
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">类型</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="SINGLE_CHOICE">单选题</option>
          <option value="MULTIPLE_CHOICE">多选题</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">内容</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">选项</label>
        <div className="space-y-2">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              {formData.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  删除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-indigo-600 hover:text-indigo-800"
          >
            添加选项
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">答案</label>
        {formData.type === 'SINGLE_CHOICE' ? (
          <select
            value={formData.answer as string}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            {formData.options.map((_, index) => (
              <option key={index} value={index.toString()}>
                选项 {index + 1}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-2">
            {formData.options.map((_, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(formData.answer as string[]).includes(index.toString())}
                  onChange={(e) => {
                    const newAnswer = e.target.checked
                      ? [...(formData.answer as string[]), index.toString()]
                      : (formData.answer as string[]).filter((a) => a !== index.toString());
                    setFormData({ ...formData, answer: newAnswer });
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">选项 {index + 1}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">解释</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">难度</label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="EASY">简单</option>
          <option value="MEDIUM">中等</option>
          <option value="HARD">困难</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">标签</label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="用逗号分隔多个标签"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">来源</label>
        <input
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          取消
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          保存
        </button>
      </div>
    </form>
  );
} 