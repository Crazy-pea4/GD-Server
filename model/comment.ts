import mongoose from "mongoose";

import commentSchema from "../schema/comment";

/* 创建comment模型 */
export default mongoose.model("Comment", commentSchema);
