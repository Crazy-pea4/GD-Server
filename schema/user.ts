import mongoose from "mongoose";

/* 定义user模型结构 */
const userSchema = new mongoose.Schema({
  // 昵称
  nickname: {
    type: String,
    require: true,
    maxLength: 20,
  },
  // 电话号码
  phoneNumber: {
    type: String,
    require: true,
    unique: true,
    maxLength: 11,
    minLength: 11,
  },
  // 密码
  password: {
    type: String,
    require: true,
    minLength: 6,
    select: false,
  },
  // 头像地址
  avatarUrl: {
    type: String,
    default: "",
  },
  // 性别
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown",
    select: false,
  },
  // 自我介绍
  introduction: {
    type: String,
    default: "这个人很懒，没有留下介绍。。。",
    select: false,
  },
  // 工作领域
  area: {
    type: [{ type: String }],
    default: [],
    select: false,
  },
  // 关注列表
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    select: false,
  },
  // 粉丝列表
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    select: false,
  },
  // 关注话题列表
  followingTopics: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    select: false,
  },
  // 收藏问题列表
  collectingQuestions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    select: false,
  },
  // 赞回答列表
  likesAnswers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    select: false,
  },
  // 收藏回答列表
  collectingAnswers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    select: false,
  },
  // 隐藏__v版本信息
  __v: {
    type: Number,
    select: false,
  },
});

/* 创建user模型 */
export default userSchema;
