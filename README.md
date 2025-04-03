# 题库系统

一个基于 Next.js 14 和 MongoDB 的在线题库系统。

## 环境要求

- Node.js 18+
- MongoDB

## 环境变量

在部署到 Vercel 之前，请确保设置以下环境变量：

- `MONGODB_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 加密密钥

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 部署

本项目可以直接部署到 Vercel：

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- JWT Authentication

## 功能特点

- 支持单选题和多选题
- 题目分类和标签管理
- 题目难度分级
- 题目搜索和筛选
- 完整的 CRUD 操作
- 响应式设计

## 开始使用

1. 克隆仓库

```bash
git clone https://github.com/yourusername/question-bank.git
cd question-bank
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```env
MONGODB_URI=mongodb://localhost:27017/question-bank
```

4. 启动开发服务器

```bash
npm run dev
```

5. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## API 文档

### 题目列表

- `GET /api/questions` - 获取题目列表
  - 查询参数：
    - `type` - 题目类型（SINGLE_CHOICE/MULTIPLE_CHOICE）
    - `difficulty` - 难度级别（EASY/MEDIUM/HARD）
    - `tag` - 标签
    - `search` - 搜索关键词

- `POST /api/questions` - 创建新题目

### 单个题目

- `GET /api/questions/[id]` - 获取单个题目
- `PATCH /api/questions/[id]` - 更新题目
- `DELETE /api/questions/[id]` - 删除题目

### 健康检查

- `GET /api/health` - 检查系统状态

## 开发规范

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Next.js 最佳实践

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 