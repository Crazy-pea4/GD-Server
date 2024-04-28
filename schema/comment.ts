import mongoose from "mongoose";

/* 引入二级评论Schema */
import secondaryCommentSchema from "../schema/secondaryComment";

/* 定义comment模型结构 */
const commentSchema = new mongoose.Schema({
  // 内容
  content: {
    type: String,
    required: true,
  },
  // 评论者
  commentator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 评论的回答id
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
  // 二级评论
  secondaryComment: {
    type: [
      {
        type: secondaryCommentSchema,
        required: true,
      },
    ],
    default: [],
    required: true,
  },
  // 二级评论--replyTo
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
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

/* 创建comment模型 */
export default commentSchema;
