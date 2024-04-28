import mongoose from "mongoose";

/* 定义question模型结构 */
import questionSchema from "../schema/question";

/* 创建question模型 */
export default mongoose.model("Question", questionSchema);
