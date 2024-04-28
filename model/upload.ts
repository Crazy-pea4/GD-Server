import mongoose from "mongoose";

import uploadSchema from "../schema/upload";

/* 创建upload模型 */
export default mongoose.model("Upload", uploadSchema);
