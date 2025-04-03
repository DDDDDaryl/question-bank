export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  _id?: string;
  title: string;
  type: QuestionType;
  content: string;
  options: string[];
  answer: string | string[];
  explanation?: string;
  difficulty: Difficulty;
  tags: string[];
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 