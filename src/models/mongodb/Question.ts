import mongoose from 'mongoose';
import { QuestionType, Difficulty } from '../Question';

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },
    content: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    explanation: String,
    difficulty: {
      type: String,
      enum: Object.values(Difficulty),
      required: true,
    },
    tags: [{ type: String }],
    source: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const Question =
  mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question; 