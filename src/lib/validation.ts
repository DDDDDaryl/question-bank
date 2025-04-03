import { z } from 'zod';
import type { Question, QuestionType, DifficultyLevel } from '@/types/question';

const questionOptionSchema = z.object({
  content: z.string().min(1, '选项内容不能为空'),
  isCorrect: z.boolean(),
});

export const questionSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE'] as const),
  content: z.string().min(1, '题目内容不能为空'),
  options: z.array(questionOptionSchema).min(2, '至少需要两个选项'),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'] as const),
  tags: z.array(z.string()).min(1, '至少需要一个标签'),
  createdBy: z.string(),
}).refine(data => {
  const correctOptions = data.options.filter(option => option.isCorrect);
  if (data.type === 'SINGLE_CHOICE' && correctOptions.length !== 1) {
    return false;
  }
  if (data.type === 'MULTIPLE_CHOICE' && correctOptions.length < 1) {
    return false;
  }
  return true;
}, {
  message: '单选题必须有且仅有一个正确答案，多选题必须至少有一个正确答案',
  path: ['options'],
});

export type QuestionInput = z.infer<typeof questionSchema>;

export function validateQuestion(data: unknown): QuestionInput {
  return questionSchema.parse(data);
} 