import { Router } from "express";
const router = Router();

// 引入answerController
import answerController from "../controller/answer";

/* 引入中间件 */
import validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import checkExisted from "../middleware/checkExisted";

/* 引入创建回答校验工具 */
import { answerCreateValidator } from "../utils/validator";

// 创建回答
router.post(
  "/:questionId/answer/",
  authenticate,
  validate(answerCreateValidator),
  answerController.createAnswer
);

// 修改回答
router.patch(
  "/:questionId/answer/:id",
  authenticate,
  checkExisted.answer,
  checkExisted.answerer,
  answerController.updateAnswer
);

// 查询回答列表
router.get("/:questionId/answer/", answerController.getAnswerList);

// 查询回答收藏列表
router.get("/answer/liked", answerController.getAnswerLikedList);

// 查询指定回答
router.get(
  "/:questionId/answer/:id",
  checkExisted.answer,
  answerController.getAnswer
);

// 删除指定回答
router.delete(
  "/:questionId/answer/:id",
  authenticate,
  checkExisted.answer,
  checkExisted.answerer,
  answerController.deleteAnswer
);

export default router;
