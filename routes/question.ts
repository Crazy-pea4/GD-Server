import { Router } from "express";
const router = Router();

// 引入questionController
import questionController from "../controller/question";

/* 引入中间件 */
import validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import checkExisted from "../middleware/checkExisted";

/* 引入创建问题校验工具 */
import { questionCreateValidator } from "../utils/validator";

// 创建问题
router.post(
  "/",
  authenticate,
  validate(questionCreateValidator),
  questionController.createQuestion
);

// 修改问题
router.patch(
  "/:id",
  authenticate,
  checkExisted.question,
  checkExisted.questioner,
  questionController.updateQuestion
);

// 查询问题列表
router.get("/", questionController.getQuestionList);

// 查询问题收藏列表
router.get("/collection", questionController.getQuestionCollectedList);

// 查询指定问题
router.get("/:id", checkExisted.question, questionController.getQuestion);

// 查询问题粉丝列表
router.get(
  "/:id/followers",
  checkExisted.question,
  questionController.getQuestionFollowers
);

// 删除指定问题
router.delete(
  "/:id",
  authenticate,
  checkExisted.question,
  checkExisted.questioner,
  questionController.deleteQuestion
);

export default router;
