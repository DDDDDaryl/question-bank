import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global as any;
if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.mongoose.conn) {
      if (cached.mongoose.conn.readyState === 1) {
        return cached.mongoose.conn;
      }
      // 如果连接状态不是已连接，重置连接
      await cached.mongoose.conn.close();
      cached.mongoose.conn = null;
    }

    const opts = {
      bufferCommands: true, // 启用命令缓冲
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true,
    };

    mongoose.set('strictQuery', true);

    // 等待连接完成
    const conn = await mongoose.connect(MONGODB_URI, opts);
    console.log('MongoDB 连接成功');

    // 设置事件监听器
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
      cached.mongoose.conn = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 连接断开');
      cached.mongoose.conn = null;
    });

    // 更新缓存
    cached.mongoose.conn = conn;
    return conn;
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    cached.mongoose.conn = null;
    throw error;
  }
}

export default dbConnect; 