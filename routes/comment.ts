import { Router } from "express";
const router = Router();

// 引入commentController
import commentController from "../controller/comment";

/* 引入中间件 */
import validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import checkExisted from "../middleware/checkExisted";

/* 引入创建评论校验工具 */
import { commentCreateValidator } from "../utils/validator";

// 创建评论（二级评论）
router.post(
  "/:answerId/comment/:id?",
  authenticate,
  validate(commentCreateValidator),
  commentController.createComment
);

// 修改评论
router.patch(
  "/:answerId/comment/:id/:sId?",
  authenticate,
  checkExisted.comment,
  checkExisted.commentator,
  commentController.updateComment
);

// 查询评论列表
router.get("/:answerId/comment/", commentController.getCommentList);

// 查询指定评论
router.get(
  "/:answerId/comment/:id",
  checkExisted.comment,
  commentController.getComment
);

// 删除指定评论
router.delete(
  "/:answerId/comment/:id/:sId?",
  authenticate,
  checkExisted.comment,
  checkExisted.commentator,
  commentController.deleteComment
);

export default router;
