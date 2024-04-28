import mongoose from "mongoose";

import userSchema from "../schema/user";

/* 创建user模型 */
export default mongoose.model("User", userSchema);
