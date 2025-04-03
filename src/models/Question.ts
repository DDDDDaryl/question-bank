import mongoose from 'mongoose';
import type { Question, QuestionType, Difficulty } from '@/types/question';

const questionSchema = new mongoose.Schema<Question>({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  explanation: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  source: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Question || mongoose.model<Question>('Question', questionSchema);
export type { Question, QuestionType, Difficulty }; 