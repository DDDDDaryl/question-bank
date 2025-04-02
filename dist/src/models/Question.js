"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = exports.Difficulty = exports.QuestionType = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
// 定义题目类型枚举
var QuestionType;
(function (QuestionType) {
    QuestionType["SINGLE_CHOICE"] = "SINGLE_CHOICE";
    QuestionType["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
    QuestionType["TRUE_FALSE"] = "TRUE_FALSE";
    QuestionType["SHORT_ANSWER"] = "SHORT_ANSWER"; // 简答题
})(QuestionType || (exports.QuestionType = QuestionType = {}));
// 定义题目难度枚举
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
// 创建 Mongoose Schema
var QuestionSchema = new mongoose_1.default.Schema({
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
    source: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // 自动管理 createdAt 和 updatedAt
});
// 创建并导出模型
exports.Question = mongoose_1.default.models.Question || mongoose_1.default.model('Question', QuestionSchema);
exports.default = exports.Question;
