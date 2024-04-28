import mongoose from "mongoose";

import answerSchema from "../schema/answer";

/* 创建Answer模型 */
export default mongoose.model("Answer", answerSchema);
