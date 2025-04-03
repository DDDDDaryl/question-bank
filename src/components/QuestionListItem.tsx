import type { Question } from '@/types/question';

interface QuestionListItemProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function QuestionListItem({ question, onEdit, onDelete }: QuestionListItemProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return '单选题';
      case 'MULTIPLE_CHOICE':
        return '多选题';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{question.title}</h3>
          <p className="text-gray-600 mb-4">{question.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getTypeLabel(question.type)}
            </span>
            {question.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-500 mr-2">{String.fromCharCode(65 + index)}.</span>
                <div className="flex items-center">
                  <span className="text-gray-700">{option.content}</span>
                  {option.isCorrect && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {question.explanation && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">解析：</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(question)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(question._id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
} 