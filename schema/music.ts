import mongoose from "mongoose";

/* 定义music模型结构 */
const musicSchema = new mongoose.Schema({
    // 歌曲名称
    name: {
      type: String,
      required: true,
    },
    // 上传歌曲的人回答者
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  
  export default musicSchema;