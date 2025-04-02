// 定义题目类型枚举
export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',    // 单选题
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // 多选题
  TRUE_FALSE = 'TRUE_FALSE',          // 判断题
  SHORT_ANSWER = 'SHORT_ANSWER'       // 简答题
}

// 定义题目难度枚举
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// 定义题目模型的接口
export interface IQuestion {
  _id?: string;
  title: string;              // 题目标题
  type: QuestionType;         // 题目类型
  content: string;            // 题目内容
  options?: string[];         // 选项（选择题必填）
  answer: string;             // 答案
  explanation?: string;       // 解析
  difficulty: Difficulty;     // 难度
  tags: string[];            // 标签（用于分类和搜索）
  source?: string;           // 题目来源
  createdAt?: string;         // 创建时间
  updatedAt?: string;         // 更新时间
} 