import mongoose from "mongoose";

/* 定义auth模型结构 */
const authSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    maxLength: 11,
    minLength: 11,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
    select: false,
  },
});

/* 创建user模型 */
export default authSchema;
