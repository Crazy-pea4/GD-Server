import { Router } from "express";
const router = Router();

// 引入topicController
import topicController from "../controller/topic";

/* 引入中间件 */
import validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import checkExisted from "../middleware/checkExisted";

/* 引入创建话题校验工具 */
import { topicCreateValidator } from "../utils/validator";

// 创建话题
router.post(
  "/",
  authenticate,
  validate(topicCreateValidator),
  topicController.createTopic
);

// 修改话题
router.patch(
  "/:id",
  authenticate,
  checkExisted.topic,
  topicController.updateTopic
);

// 查询话题列表
router.get("/", topicController.getTopicList);

// 查询指定话题
router.get("/:id", checkExisted.topic, topicController.getTopic);

// 查询话题粉丝列表
router.get(
  "/:id/followers",
  checkExisted.topic,
  topicController.getTopicFollowers
);

// 查询话题的问题列表
router.get(
  "/:id/questions",
  checkExisted.topic,
  topicController.getTopicQuestions
);

export default router;
