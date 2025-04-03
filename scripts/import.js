const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Daryl:DarylAdmin@cluster0.xksf6hh.mongodb.net/questionbank?retryWrites=true&w=majority&appName=Cluster0';

const questionSchema = new mongoose.Schema({
  title: String,
  type: String,
  content: String,
  options: [String],
  answer: mongoose.Schema.Types.Mixed,
  explanation: String,
  difficulty: String,
  tags: [String],
  source: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);

const questions2025 = [
  {
    title: "2025年政府工作报告主要目标",
    type: "MULTIPLE_CHOICE",
    content: "2025年政府工作报告中提出的经济社会发展主要预期目标包括哪些？",
    options: [
      "国内生产总值增长5%左右",
      "城镇新增就业1200万人以上",
      "居民消费价格涨幅3%左右",
      "城镇调查失业率5.5%左右"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年政府工作报告设定的主要目标包括GDP增长、就业、物价和失业率等方面的具体指标。",
    difficulty: "MEDIUM",
    tags: ["时政要闻", "经济发展"],
    source: "2025年政府工作报告"
  },
  {
    title: "数字经济发展战略",
    type: "SINGLE_CHOICE",
    content: "关于2025年数字经济发展战略，下列说法正确的是：",
    options: [
      "加快数字技术创新和产业升级",
      "限制数字经济发展规模",
      "降低数字经济在GDP中的占比",
      "减少数字基础设施投资"
    ],
    answer: "0",
    explanation: "2025年数字经济发展战略强调加快数字技术创新和产业升级，推动数字经济健康发展。",
    difficulty: "EASY",
    tags: ["经济政策", "科技创新"],
    source: "国家数字经济发展规划"
  },
  {
    title: "乡村振兴战略实施",
    type: "MULTIPLE_CHOICE",
    content: "2025年乡村振兴战略的重点任务包括哪些？",
    options: [
      "提高农业现代化水平",
      "完善农村基础设施",
      "发展乡村特色产业",
      "加强农村人才培养"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "乡村振兴战略强调农业现代化、基础设施完善、产业发展和人才培养等多个方面的协同推进。",
    difficulty: "MEDIUM",
    tags: ["时政要闻", "乡村振兴"],
    source: "2025年乡村振兴战略实施方案"
  },
  {
    title: "绿色发展政策",
    type: "SINGLE_CHOICE",
    content: "2025年我国在绿色发展方面提出的主要目标是：",
    options: [
      "碳达峰目标如期实现",
      "延缓碳达峰时间",
      "放宽环保标准",
      "减少环保投入"
    ],
    answer: "0",
    explanation: "2025年我国继续坚持绿色发展理念，确保碳达峰目标如期实现，推动经济社会发展全面绿色转型。",
    difficulty: "EASY",
    tags: ["时政要闻", "环境保护"],
    source: "2025年环境保护工作要点"
  },
  {
    title: "科技创新政策",
    type: "MULTIPLE_CHOICE",
    content: "2025年科技创新政策的主要方向包括：",
    options: [
      "加大基础研究投入",
      "推进关键核心技术攻关",
      "完善科技创新体系",
      "加强国际科技合作"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年科技创新政策强调基础研究、核心技术、创新体系和国际合作等多个方面的全面发展。",
    difficulty: "HARD",
    tags: ["科技创新", "经济政策"],
    source: "2025年科技创新工作要点"
  },
  {
    title: "共同富裕示范区建设",
    type: "SINGLE_CHOICE",
    content: "关于2025年共同富裕示范区建设，下列说法正确的是：",
    options: [
      "扎实推进浙江高质量发展建设共同富裕示范区",
      "暂停共同富裕示范区建设",
      "降低共同富裕发展目标",
      "取消示范区建设计划"
    ],
    answer: "0",
    explanation: "2025年继续深入推进浙江高质量发展建设共同富裕示范区，为全国提供可复制可推广的经验。",
    difficulty: "MEDIUM",
    tags: ["时政要闻", "经济发展"],
    source: "2025年共同富裕示范区建设工作要点"
  },
  {
    title: "区域协调发展",
    type: "MULTIPLE_CHOICE",
    content: "2025年区域协调发展战略的重点包括：",
    options: [
      "推进京津冀协同发展",
      "推动长三角一体化发展",
      "支持粤港澳大湾区建设",
      "促进东北振兴"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年区域协调发展战略继续推进京津冀、长三角、粤港澳大湾区等重点区域发展，促进区域协调发展。",
    difficulty: "MEDIUM",
    tags: ["时政要闻", "区域发展"],
    source: "2025年区域协调发展工作要点"
  },
  {
    title: "就业优先政策",
    type: "SINGLE_CHOICE",
    content: "2025年就业优先政策的重点是：",
    options: [
      "强化就业优先导向，支持重点群体就业创业",
      "放松就业政策要求",
      "减少就业支持力度",
      "取消就业帮扶措施"
    ],
    answer: "0",
    explanation: "2025年就业优先政策继续强化就业优先导向，重点支持高校毕业生、农民工等重点群体就业创业。",
    difficulty: "EASY",
    tags: ["时政要闻", "民生政策"],
    source: "2025年就业工作要点"
  },
  {
    title: "教育改革发展",
    type: "MULTIPLE_CHOICE",
    content: "2025年教育改革发展的主要任务包括：",
    options: [
      "深化教育评价改革",
      "推进义务教育优质均衡发展",
      "加强高等教育内涵建设",
      "完善职业教育和培训体系"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年教育改革发展重点推进教育评价改革、义务教育均衡发展、高等教育建设和职业教育体系完善。",
    difficulty: "HARD",
    tags: ["时政要闻", "教育改革"],
    source: "2025年教育改革发展工作要点"
  },
  {
    title: "医疗卫生体系建设",
    type: "MULTIPLE_CHOICE",
    content: "2025年医疗卫生体系建设的重点任务包括：",
    options: [
      "深化医药卫生体制改革",
      "加强公共卫生体系建设",
      "提升基层医疗服务能力",
      "推进中医药传承创新"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年医疗卫生体系建设重点推进医改、公共卫生、基层医疗和中医药发展等多个方面的工作。",
    difficulty: "MEDIUM",
    tags: ["时政要闻", "医疗卫生"],
    source: "2025年医疗卫生工作要点"
  },
  {
    title: "文化建设发展",
    type: "SINGLE_CHOICE",
    content: "2025年文化建设的主要方向是：",
    options: [
      "推进社会主义文化强国建设",
      "减少文化建设投入",
      "放缓文化发展步伐",
      "降低文化建设标准"
    ],
    answer: "0",
    explanation: "2025年文化建设继续推进社会主义文化强国建设，促进文化事业和文化产业高质量发展。",
    difficulty: "EASY",
    tags: ["时政要闻", "文化建设"],
    source: "2025年文化建设工作要点"
  },
  {
    title: "社会保障体系建设",
    type: "MULTIPLE_CHOICE",
    content: "2025年社会保障体系建设的主要内容包括：",
    options: [
      "完善养老保险制度",
      "健全医疗保障体系",
      "加强社会救助体系",
      "发展社会福利事业"
    ],
    answer: ["0", "1", "2", "3"],
    explanation: "2025年社会保障体系建设重点完善养老保险、医疗保障、社会救助和社会福利等多个方面。",
    difficulty: "HARD",
    tags: ["时政要闻", "民生政策"],
    source: "2025年社会保障工作要点"
  },
  {
    title: "科技自立自强",
    type: "SINGLE_CHOICE",
    content: "2025年科技自立自强的重点任务是：",
    options: [
      "突破关键核心技术",
      "减少科技研发投入",
      "放缓技术创新步伐",
      "降低科技创新要求"
    ],
    answer: "0",
    explanation: "2025年继续加强科技自立自强，重点突破关键核心技术，提升科技创新能力。",
    difficulty: "MEDIUM",
    tags: ["科技创新", "经济政策"],
    source: "2025年科技创新工作要点"
  }
];

async function importQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 删除旧的时政相关问题
    await Question.deleteMany({
      tags: { $in: ['时政要闻', '经济发展', '经济政策'] }
    });
    console.log('Deleted old political questions');

    // 导入新问题
    await Question.insertMany(questions2025);
    console.log('Successfully imported new questions');

    process.exit(0);
  } catch (error) {
    console.error('Error importing questions:', error);
    process.exit(1);
  }
}

importQuestions(); 