import mongoose from 'mongoose';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscribedTags: string[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscribedTags: [{ type: String }],
  lastLoginAt: { type: Date },
}, {
  timestamps: true
});

// 更新时自动更新updatedAt字段
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model<User>('User', userSchema); 