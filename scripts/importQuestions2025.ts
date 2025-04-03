import mongoose from 'mongoose';
import QuestionModel from '@/models/mongodb/Question';
import { questions2025 } from './questions2025';

async function importQuestions() {
  try {
    // 连接到 MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 删除旧的政治题目
    await QuestionModel.deleteMany({
      tags: { $in: ['时政要闻', '经济发展', '经济政策'] }
    });
    console.log('Deleted old political questions');

    // 导入新题目
    await QuestionModel.insertMany(questions2025);
    console.log('Successfully imported new questions');

  } catch (error) {
    console.error('Error importing questions:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

importQuestions(); 