import mongoose from "mongoose";

import authSchema from "../schema/auth";

/* 创建user模型 */
export default mongoose.model("Auth", authSchema);
