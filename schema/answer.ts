import mongoose from "mongoose";

/* 定义answer模型结构 */
const answerSchema = new mongoose.Schema({
  // 内容
  content: {
    type: String,
    required: true,
  },
  // 回答者
  answerer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 对应问题的id
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  // 赞（喜欢）
  likes: {
    type: Number,
    default: 0,
  },
  isLikes: {
    type: Boolean,
    default: false,
  },
  // 有歧义（踩）
  hesitation: {
    type: Number,
    default: 0,
  },
  isHesitation: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    required: true,
    type: String,
  },

  updatedAt: {
    required: true,
    type: String,
  },
  // 隐藏__v版本信息
  __v: {
    type: Number,
    select: false,
  },
});

export default answerSchema;
