import mongoose from "mongoose";

import musicSchema from "../schema/music";

/* 创建music模型 */
export default mongoose.model("Music", musicSchema);