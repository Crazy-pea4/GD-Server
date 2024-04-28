import mongoose from "mongoose";

/* 定义topic模型结构 */
const topicSchema = new mongoose.Schema({
  // 话题名称
  topicName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  // 话题图片
  topicPic: {
    type: String,
    default: "",
  },
  // 话题简介
  topicIntroduction: {
    type: String,
    required: true,
    maxLength: 200,
    select: false,
  },
  // 话题粉丝
  topicFollowers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
    select: false,
  },
  createdAt: {
    required: true,
    type: String,
  },

  updatedAt: {
    required: true,
    type: String,
  },
  __v: {
    type: Number,
    select: false,
  },
});

/* 创建topic模型 */
export default topicSchema;
