import mongoose from 'mongoose';
import type { Question } from '@/types/question';

const questionSchema = new mongoose.Schema<Question>({
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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 更新时自动更新updatedAt字段
questionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Question = mongoose.models.Question || mongoose.model<Question>('Question', questionSchema); 