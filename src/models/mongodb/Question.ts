import mongoose from 'mongoose';
import type { Question } from '@/types/question';

const questionOptionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { _id: false });

const questionSchema = new mongoose.Schema<Question>(
  {
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'],
      required: true 
    },
    content: { type: String, required: true },
    options: { type: [questionOptionSchema], required: true },
    explanation: { type: String },
    difficulty: { 
      type: String, 
      enum: ['EASY', 'MEDIUM', 'HARD'],
      required: true 
    },
    tags: { type: [String], required: true },
    createdBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Question || mongoose.model<Question>('Question', questionSchema); 