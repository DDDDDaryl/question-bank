import mongoose, { Document } from 'mongoose';

interface QuestionOption {
  content: string;
  isCorrect: boolean;
}

interface Question extends Document {
  title: string;
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options: QuestionOption[];
  explanation: string;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionOptionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    required: true
  },
  options: {
    type: [questionOptionSchema],
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// 更新时自动更新updatedAt字段
questionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Question = mongoose.models.Question || mongoose.model<Question>('Question', questionSchema);
export default Question; 