import { IQuestion, QuestionType, Difficulty } from '@/models/Question';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface QuestionListItemProps {
  question: IQuestion;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function QuestionListItem({
  question,
  onEdit,
  onDelete,
  onView,
}: QuestionListItemProps) {
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-100 text-green-800';
      case Difficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case Difficulty.HARD:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return '单选题';
      case QuestionType.MULTIPLE_CHOICE:
        return '多选题';
      default:
        return '未知类型';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return '简单';
      case Difficulty.MEDIUM:
        return '中等';
      case Difficulty.HARD:
        return '困难';
      default:
        return '未知';
    }
  };

  if (!question._id) return null;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{question.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{getTypeLabel(question.type)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(
            question.difficulty
          )}`}
        >
          {getDifficultyLabel(question.difficulty)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onView(question._id!)}
            className="text-gray-600 hover:text-gray-900"
            title="查看"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(question._id!)}
            className="text-blue-600 hover:text-blue-900"
            title="编辑"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(question._id!)}
            className="text-red-600 hover:text-red-900"
            title="删除"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
} 