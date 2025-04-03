import mongoose from 'mongoose';
import type { Question as QuestionType } from '@/types/question';

const questionSchema = new mongoose.Schema<QuestionType>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'], required: true },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], required: true },
  options: [{ 
    content: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: { type: String, required: true },
  tags: [{ type: String }],
  createdBy: { type: String, required: true },
}, {
  timestamps: true
});

// 更新时自动更新updatedAt字段
questionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Question = mongoose.models.Question || mongoose.model<QuestionType>('Question', questionSchema); 