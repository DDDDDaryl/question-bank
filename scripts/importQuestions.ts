import mongoose from 'mongoose';
import { QuestionType, Difficulty } from '../src/models/Question';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

// 定义题目模型的接口
interface IQuestion {
  title: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string;
  explanation?: string;
  difficulty: Difficulty;
  tags: string[];
  source?: string;
}

// 创建 Mongoose Schema
const QuestionSchema = new mongoose.Schema<IQuestion>({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(QuestionType),
    required: true 
  },
  content: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: String,
  difficulty: { 
    type: String,
    enum: Object.values(Difficulty),
    required: true 
  },
  tags: [{ type: String }],
  source: String
}, {
  timestamps: true
});

const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

const questions: IQuestion[] = [
  // 时政热点题目
  {
    title: "2024年政府工作报告GDP目标",
    type: QuestionType.SINGLE_CHOICE,
    content: "2024年政府工作报告中提出的GDP增长预期目标是多少？",
    options: ["4.5%左右", "5%左右", "5.5%左右", "6%左右"],
    answer: "5%左右",
    explanation: "2024年3月5日，李强总理作政府工作报告时提出，国内生产总值增长5%左右的预期目标。",
    difficulty: Difficulty.EASY,
    tags: ["时政热点", "政府工作报告"],
    source: "2024年政府工作报告"
  },
  {
    title: "中国式现代化",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "下列关于中国式现代化的特征，正确的有哪些？",
    options: [
      "人口规模巨大的现代化",
      "全体人民共同富裕的现代化",
      "物质文明和精神文明相协调的现代化",
      "人与自然和谐共生的现代化"
    ],
    answer: ["人口规模巨大的现代化", "全体人民共同富裕的现代化", "物质文明和精神文明相协调的现代化", "人与自然和谐共生的现代化"].join(","),
    explanation: "中国式现代化的本质特征包括：人口规模巨大的现代化、全体人民共同富裕的现代化、物质文明和精神文明相协调的现代化、人与自然和谐共生的现代化、走和平发展道路的现代化。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "中国特色社会主义"],
    source: "党的二十大报告"
  },
  {
    title: "2024年政府工作报告重点任务",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "2024年政府工作报告提出的重点任务包括哪些？",
    options: [
      "着力扩大国内需求",
      "深入推进高水平对外开放",
      "持续推动产业转型升级",
      "切实保障和改善民生"
    ],
    answer: ["着力扩大国内需求", "深入推进高水平对外开放", "持续推动产业转型升级", "切实保障和改善民生"].join(","),
    explanation: "2024年政府工作报告提出要着力扩大国内需求、深入推进高水平对外开放、持续推动产业转型升级、切实保障和改善民生等重点任务。",
    difficulty: Difficulty.MEDIUM,
    tags: ["时政热点", "政府工作报告"],
    source: "2024年政府工作报告"
  },
  {
    title: "马克思主义中国化时代化",
    type: QuestionType.SINGLE_CHOICE,
    content: "马克思主义中国化时代化的最新理论成果是什么？",
    options: [
      "邓小平理论",
      "三个代表重要思想",
      "科学发展观",
      "习近平新时代中国特色社会主义思想"
    ],
    answer: "习近平新时代中国特色社会主义思想",
    explanation: "习近平新时代中国特色社会主义思想是马克思主义中国化时代化的最新理论成果，是当代中国马克思主义、二十一世纪马克思主义。",
    difficulty: Difficulty.EASY,
    tags: ["政治理论", "马克思主义中国化"],
    source: "党的二十大报告"
  },
  {
    title: "2024年经济工作重点",
    type: QuestionType.SINGLE_CHOICE,
    content: "2024年中央经济工作会议提出的经济工作主基调是什么？",
    options: [
      "稳中求进",
      "改革创新",
      "扩大开放",
      "高质量发展"
    ],
    answer: "稳中求进",
    explanation: "2024年中央经济工作会议强调，明年要坚持稳中求进工作总基调，加快构建新发展格局，着力推动高质量发展。",
    difficulty: Difficulty.MEDIUM,
    tags: ["时政热点", "经济政策"],
    source: "2023年中央经济工作会议"
  },
  {
    title: "全过程人民民主",
    type: QuestionType.SINGLE_CHOICE,
    content: "关于全过程人民民主，下列说法正确的是？",
    options: [
      "仅指选举民主",
      "仅指协商民主",
      "是社会主义民主政治的本质属性",
      "与西方民主制度完全相同"
    ],
    answer: "是社会主义民主政治的本质属性",
    explanation: "全过程人民民主是社会主义民主政治的本质属性，是最广泛、最真实、最管用的民主。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "民主政治"],
    source: "党的二十大报告"
  },
  {
    title: "高质量发展",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "下列哪些属于高质量发展的内容？",
    options: [
      "创新驱动发展",
      "协调发展",
      "绿色发展",
      "开放发展"
    ],
    answer: ["创新驱动发展", "协调发展", "绿色发展", "开放发展"].join(","),
    explanation: "高质量发展包括创新驱动发展、协调发展、绿色发展、开放发展、共享发展等方面。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "发展理念"],
    source: "党的十九大报告"
  },
  {
    title: "2024年重要外交活动",
    type: QuestionType.SINGLE_CHOICE,
    content: "2024年3月，中国－中亚峰会机制化后的首次峰会在哪里举行？",
    options: [
      "北京",
      "上海",
      "西安",
      "乌鲁木齐"
    ],
    answer: "西安",
    explanation: "2024年3月，中国－中亚峰会机制化后的首次峰会在西安举行，这是今年中国主场外交的首场重要多边活动。",
    difficulty: Difficulty.MEDIUM,
    tags: ["时政热点", "外交政策"],
    source: "2024年重要时政"
  },
  {
    title: "共同富裕",
    type: QuestionType.SINGLE_CHOICE,
    content: "关于共同富裕，下列说法错误的是？",
    options: [
      "是全体人民共同富裕",
      "是物质生活和精神生活都富裕",
      "是一个长期历史过程",
      "要搞平均主义"
    ],
    answer: "要搞平均主义",
    explanation: "共同富裕不是平均主义，而是要通过合法途径和辛勤劳动创造财富，逐步实现全体人民共同富裕。",
    difficulty: Difficulty.EASY,
    tags: ["政治理论", "发展理念"],
    source: "党的二十大报告"
  },
  {
    title: "乡村振兴战略",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "实施乡村振兴战略的总要求包括哪些？",
    options: [
      "产业兴旺",
      "生态宜居",
      "乡风文明",
      "治理有效"
    ],
    answer: ["产业兴旺", "生态宜居", "乡风文明", "治理有效"].join(","),
    explanation: "实施乡村振兴战略的总要求是产业兴旺、生态宜居、乡风文明、治理有效、生活富裕。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "乡村振兴"],
    source: "乡村振兴战略规划"
  },
  {
    title: "中国式现代化的本质要求",
    type: QuestionType.SINGLE_CHOICE,
    content: "中国式现代化的本质要求是什么？",
    options: [
      "中国共产党领导",
      "高质量发展",
      "共同富裕",
      "人与自然和谐共生"
    ],
    answer: "中国共产党领导",
    explanation: "中国式现代化最本质的特征是中国共产党领导，这是中国式现代化的最大优势和根本保证。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "中国特色社会主义"],
    source: "党的二十大报告"
  },
  {
    title: "2024年经济发展主要预期目标",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "2024年政府工作报告提出的经济发展主要预期目标包括哪些？",
    options: [
      "国内生产总值增长5%左右",
      "城镇新增就业1200万人左右",
      "居民消费价格涨幅3%左右",
      "城镇调查失业率5.5%左右"
    ],
    answer: ["国内生产总值增长5%左右", "城镇新增就业1200万人左右", "居民消费价格涨幅3%左右", "城镇调查失业率5.5%左右"].join(","),
    explanation: "2024年政府工作报告提出，经济发展主要预期目标是：国内生产总值增长5%左右，城镇新增就业1200万人左右，居民消费价格涨幅3%左右，城镇调查失业率5.5%左右。",
    difficulty: Difficulty.MEDIUM,
    tags: ["时政热点", "政府工作报告"],
    source: "2024年政府工作报告"
  },
  {
    title: "全面深化改革",
    type: QuestionType.SINGLE_CHOICE,
    content: "全面深化改革的总目标是什么？",
    options: [
      "完善和发展中国特色社会主义制度",
      "推进国家治理体系和治理能力现代化",
      "以上两项都是",
      "以上都不是"
    ],
    answer: "以上两项都是",
    explanation: "全面深化改革的总目标是完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化。",
    difficulty: Difficulty.MEDIUM,
    tags: ["政治理论", "全面深化改革"],
    source: "党的十八届三中全会"
  },
  {
    title: "2024年重要会议",
    type: QuestionType.SINGLE_CHOICE,
    content: "2024年3月召开的全国两会，是第几届全国人大和全国政协的第几次会议？",
    options: [
      "十三届全国人大二次会议和全国政协十三届二次会议",
      "十四届全国人大一次会议和全国政协十四届一次会议",
      "十四届全国人大二次会议和全国政协十四届二次会议",
      "十三届全国人大三次会议和全国政协十三届三次会议"
    ],
    answer: "十四届全国人大二次会议和全国政协十四届二次会议",
    explanation: "2024年3月召开的是十四届全国人大二次会议和全国政协十四届二次会议。",
    difficulty: Difficulty.EASY,
    tags: ["时政热点", "重要会议"],
    source: "2024年重要时政"
  },
  {
    title: "新发展格局",
    type: QuestionType.MULTIPLE_CHOICE,
    content: "加快构建新发展格局的关键在于？",
    options: [
      "实施扩大内需战略",
      "深化供给侧结构性改革",
      "提高供给体系质量",
      "推动国内国际双循环"
    ],
    answer: ["实施扩大内需战略", "深化供给侧结构性改革", "提高供给体系质量", "推动国内国际双循环"].join(","),
    explanation: "加快构建新发展格局，要实施扩大内需战略，深化供给侧结构性改革，提高供给体系质量，推动国内国际双循环。",
    difficulty: Difficulty.HARD,
    tags: ["政治理论", "经济政策"],
    source: "党的二十大报告"
  }
  // ... 更多题目将在后续添加
];

async function importQuestions() {
  try {
    console.log('正在连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    // 清空现有题目
    console.log('正在清空现有题目...');
    await Question.deleteMany({});
    console.log('已清空现有题目');

    // 批量插入题目
    console.log('正在插入新题目...');
    const result = await Question.insertMany(questions);
    console.log(`成功导入 ${result.length} 道题目`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
}

importQuestions().catch(error => {
  console.error('导入过程中出现错误:', error);
  process.exit(1);
}); 