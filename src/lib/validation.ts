import { QuestionType, Difficulty } from '@/models/Question';

export interface ValidationError {
  [key: string]: string[];
}

export function validateQuestion(data: any): ValidationError | null {
  const errors: ValidationError = {};

  // 验证标题
  if (!data.title) {
    errors.title = ['标题不能为空'];
  } else if (typeof data.title !== 'string') {
    errors.title = ['标题必须是字符串'];
  }

  // 验证类型
  if (!data.type) {
    errors.type = ['类型不能为空'];
  } else if (!Object.values(QuestionType).includes(data.type)) {
    errors.type = ['无效的题目类型'];
  }

  // 验证内容
  if (!data.content) {
    errors.content = ['题目内容不能为空'];
  } else if (typeof data.content !== 'string') {
    errors.content = ['题目内容必须是字符串'];
  }

  // 验证选项
  if (!Array.isArray(data.options)) {
    errors.options = ['选项必须是数组'];
  } else if (data.options.length < 2) {
    errors.options = ['至少需要两个选项'];
  } else if (data.options.some((option: unknown) => typeof option !== 'string')) {
    errors.options = ['所有选项必须是字符串'];
  }

  // 验证答案
  if (!data.answer) {
    errors.answer = ['答案不能为空'];
  } else if (typeof data.answer !== 'string') {
    errors.answer = ['答案必须是字符串'];
  } else if (data.type === QuestionType.SINGLE_CHOICE) {
    if (!data.options?.includes(data.answer)) {
      errors.answer = ['答案必须是选项之一'];
    }
  } else if (data.type === QuestionType.MULTIPLE_CHOICE) {
    const answers = data.answer.split(',');
    if (answers.some((answer: string) => !data.options?.includes(answer))) {
      errors.answer = ['所有答案必须是选项之一'];
    }
  }

  // 验证难度
  if (!data.difficulty) {
    errors.difficulty = ['难度不能为空'];
  } else if (!Object.values(Difficulty).includes(data.difficulty)) {
    errors.difficulty = ['无效的难度级别'];
  }

  // 验证标签
  if (!Array.isArray(data.tags)) {
    errors.tags = ['标签必须是数组'];
  } else if (data.tags.length === 0) {
    errors.tags = ['至少需要一个标签'];
  } else if (data.tags.some((tag: unknown) => typeof tag !== 'string')) {
    errors.tags = ['所有标签必须是字符串'];
  }

  return Object.keys(errors).length > 0 ? errors : null;
} 