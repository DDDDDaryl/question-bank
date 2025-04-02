import { useState, useEffect } from 'react';
import { QuestionType, Difficulty, IQuestion } from '@/models/Question';

interface QuestionFormProps {
  initialData?: IQuestion;
  onSubmit: (data: Omit<IQuestion, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [formData, setFormData] = useState<
    Omit<IQuestion, '_id' | 'createdAt' | 'updatedAt'>
  >({
    title: '',
    type: QuestionType.SINGLE_CHOICE,
    content: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    difficulty: Difficulty.MEDIUM,
    tags: [],
    source: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        content: initialData.content,
        options: initialData.options || ['', '', '', ''],
        answer: initialData.answer,
        explanation: initialData.explanation || '',
        difficulty: initialData.difficulty,
        tags: initialData.tags,
        source: initialData.source || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
    setFormData({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">标题</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      {/* 类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">类型</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as QuestionType,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={QuestionType.SINGLE_CHOICE}>单选题</option>
          <option value={QuestionType.MULTIPLE_CHOICE}>多选题</option>
        </select>
      </div>

      {/* 题目内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">题目内容</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      {/* 选项 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">选项</label>
        <div className="space-y-2">
          {formData.options?.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`选项 ${index + 1}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          ))}
        </div>
      </div>

      {/* 答案 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">答案</label>
        {formData.type === QuestionType.SINGLE_CHOICE ? (
          <select
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">请选择正确答案</option>
            {formData.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="space-y-2">
            {formData.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.answer.includes(option)}
                  onChange={(e) => {
                    const answers = formData.answer
                      ? formData.answer.split(',')
                      : [];
                    if (e.target.checked) {
                      answers.push(option);
                    } else {
                      const index = answers.indexOf(option);
                      if (index > -1) {
                        answers.splice(index, 1);
                      }
                    }
                    setFormData({
                      ...formData,
                      answer: answers.join(','),
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 解释 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">解释</label>
        <textarea
          value={formData.explanation}
          onChange={(e) =>
            setFormData({ ...formData, explanation: e.target.value })
          }
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* 难度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">难度</label>
        <select
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({
              ...formData,
              difficulty: e.target.value as Difficulty,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value={Difficulty.EASY}>简单</option>
          <option value={Difficulty.MEDIUM}>中等</option>
          <option value={Difficulty.HARD}>困难</option>
        </select>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          标签（用逗号分隔）
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="例如：时政热点, 政治理论"
        />
      </div>

      {/* 来源 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">来源</label>
        <input
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* 按钮 */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          保存
        </button>
      </div>
    </form>
  );
} 