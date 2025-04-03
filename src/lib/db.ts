import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionbank';

let isConnected = false;
let isConnecting = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  // 如果已经连接，直接返回
  if (isConnected) {
    return;
  }

  // 如果正在连接中，等待连接完成
  if (isConnecting && connectionPromise) {
    await connectionPromise;
    return;
  }

  try {
    isConnecting = true;
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 超时时间
      socketTimeoutMS: 45000, // Socket超时
    });

    const db = await connectionPromise;
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
}

// 确保在开发环境中重新连接
if (process.env.NODE_ENV === 'development') {
  mongoose.connection.on('disconnected', async () => {
    console.log('MongoDB disconnected, trying to reconnect...');
    isConnected = false;
    isConnecting = false;
    connectionPromise = null;
    await connectDB();
  });

  mongoose.connection.on('error', async (error) => {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    isConnecting = false;
    connectionPromise = null;
    await connectDB();
  });
}

// 导出mongoose实例以便在其他地方使用
export { mongoose }; 