import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLoginAt: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '用户名是必需的'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少需要3个字符'],
      maxlength: [20, '用户名不能超过20个字符']
    },
    email: {
      type: String,
      required: [true, '邮箱是必需的'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [6, '密码至少需要6个字符']
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default UserModel; 