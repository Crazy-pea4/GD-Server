import mongoose from "mongoose";

/* 定义music模型结构 */
const musicSchema = new mongoose.Schema({
  // 歌曲名称
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // 上传歌曲的人回答者
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // 音乐url
  url: {
    type: String,
    required: true,
  },
  // 封面url
  picUrl: {
    type: String,
    default: "https://ts1.cn.mm.bing.net/th/id/R-C.f90179b4fca8e235858c05ff29647471?rik=TUe6oXurJoPTxQ&riu=http%3a%2f%2fbpic.588ku.com%2felement_origin_min_pic%2f18%2f11%2f23%2fa9013d9e8c985e7f5685b39587ba1ed4.jpg&ehk=4M9nTT7TCLdKAJyo1aDAv%2feon%2bz6dw4yNN5lCK1RzAQ%3d&risl=&pid=ImgRaw&r=0"
  },
  likesList: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
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
