import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    return connection;
  } catch (error) {
    throw error;
  }
}

export default dbConnect; 