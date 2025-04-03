import { useState, useEffect } from 'react';
import type { Question, QuestionType, DifficultyLevel, QuestionOption } from '@/types/question';

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
    options: [{ content: '', isCorrect: false }],
    explanation: '',
    difficulty: 'MEDIUM',
    tags: [],
    createdBy: ''
  });

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        type: question.type,
        content: question.content,
        options: question.options,
        explanation: question.explanation,
        difficulty: question.difficulty,
        tags: question.tags,
        createdBy: question.createdBy
      });
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], content: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionCorrectChange = (index: number, isCorrect: boolean) => {
    const newOptions = [...formData.options];
    if (formData.type === 'SINGLE_CHOICE') {
      // 单选题时，只能有一个正确答案
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index ? isCorrect : false;
      });
    } else {
      // 多选题时，可以有多个正确答案
      newOptions[index] = { ...newOptions[index], isCorrect };
    }
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, { content: '', isCorrect: false }] });
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
                type={formData.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                checked={option.isCorrect}
                onChange={(e) => handleOptionCorrectChange(index, e.target.checked)}
                name="options"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={option.content}
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
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          保存
        </button>
      </div>
    </form>
  );
} 