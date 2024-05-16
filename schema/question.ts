import mongoose from "mongoose";

/* 定义question模型结构 */
const questionSchema = new mongoose.Schema({
  // 标题
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  // 描述
  descriptions: {
    type: String,
    maxLength: 500,
  },
  // 提出问题者
  questioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isCollected: {
    type: Boolean,
    required: true,
    default: false,
  },
  // 问题收藏粉丝列表
  questionCollector: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
    select: false,
  },
  // 问题所关联的话题
  topics: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    default: [],
    required: true,
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

/* 创建question模型 */
export default questionSchema;
