export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionOption {
  content: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOption[];
  explanation: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionData {
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOption[];
  explanation: string;
  tags: string[];
  createdBy: string;
}

export interface UpdateQuestionData {
  title?: string;
  content?: string;
  type?: QuestionType;
  difficulty?: DifficultyLevel;
  options?: QuestionOption[];
  explanation?: string;
  tags?: string[];
}

export interface ImportQuestionData {
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options: QuestionOption[];
  explanation: string;
  tags: string[];
  createdBy: string;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  selectedAnswers: number[];
  correctAnswers: number[];
} 