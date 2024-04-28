import mongoose from "mongoose";

import topicSchema from "../schema/topic";

/* 创建topic模型 */
export default mongoose.model("Topic", topicSchema);
