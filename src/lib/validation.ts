import { z } from 'zod';
import type { Question, QuestionType, Difficulty } from '@/types/question';

export const questionSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE'] as const),
  content: z.string().min(1, '题目内容不能为空'),
  options: z.array(z.string()).min(2, '至少需要两个选项'),
  answer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'] as const),
  tags: z.array(z.string()).min(1, '至少需要一个标签'),
  source: z.string().optional(),
});

export type QuestionInput = z.infer<typeof questionSchema>;

export function validateQuestion(data: unknown): QuestionInput {
  return questionSchema.parse(data);
} 