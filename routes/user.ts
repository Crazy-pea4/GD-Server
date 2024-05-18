import { Router } from "express";
const router = Router();

/* 引入userController */
import userController from "../controller/user";

/* 引入中间件 */
import validate from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import checkExisted from "../middleware/checkExisted";

/* 引入注册校验工具 */
import { userRegisterValidator } from "../utils/validator";

// 注册
router.post("/", validate(userRegisterValidator), userController.register);

// 获取用户列表
router.get("/", userController.getUserList);

// 获取指定用户
router.get("/:id", checkExisted.user, userController.getUser);

// 编辑修改指定用户，因为这里为了使用patch节省带宽，就无法使用validate中间件校验
router.patch("/:id", authenticate, checkExisted.user, userController.editUser);

// 注销
router.delete("/:id", authenticate, checkExisted.user, userController.logOff);

// 获取用户录音列表
router.get("/:id/record", authenticate, userController.getRecordList)

// 喜欢音乐
router.post("/:id/music", authenticate, userController.likeMusic)

// 获取用户喜欢音乐列表
router.get("/:id/music", authenticate, userController.getLikeMusicList)

// 关注（id为被关注人的id）
router.put(
  "/following/:id",
  authenticate,
  checkExisted.user,
  userController.follow
);

// 取消关注（id为被取消关注人的id）
router.delete(
  "/following/:id",
  authenticate,
  checkExisted.user,
  userController.unfollow
);

// 获取关注列表（id为当前用户）
router.get("/:id/following", checkExisted.user, userController.getFollowing);

// 获取粉丝列表（id为当前用户）
router.get("/:id/followers", checkExisted.user, userController.getFollowers);

// 关注话题（id为被关注话题的id）
router.put(
  "/topicFollowing/:id",
  authenticate,
  checkExisted.topic,
  userController.followTopic
);

// 取消关注话题（id为被取消关注话题的id）
router.delete(
  "/topicFollowing/:id",
  authenticate,
  checkExisted.topic,
  userController.unfollowTopic
);

// 获取关注话题列表（id为当前用户）
router.get(
  "/:id/topicFollowing",
  checkExisted.user,
  userController.getTopicFollowing
);

// 获取用户的问题列表（id为当前用户）
router.get(
  "/:id/questions",
  checkExisted.user,
  userController.getUserQuestions
);

// 收藏问题（id为回答id）
router.put(
  "/questionCollecting/:id",
  checkExisted.question,
  userController.collectingQuestions
);

// 取消收藏问题（id为回答id）
router.delete(
  "/questionCollecting/:id",
  checkExisted.question,
  userController.uncollectingQuestions
);

// 赞同回答（id为答案id）
router.put(
  "/likeAnswer/:questionId/:id",
  authenticate,
  checkExisted.answer,
  userController.likeAnswer
);

// 取消赞同回答
router.delete(
  "/likeAnswer/:questionId/:id",
  authenticate,
  checkExisted.answer,
  userController.likeAnswer
);

// 歧义回答（id为答案id）
router.put(
  "/hesitateAnswer/:questionId/:id",
  authenticate,
  checkExisted.answer,
  userController.hesitateAnswer
);

// 取消歧义回答
router.delete(
  "/hesitateAnswer/:questionId/:id",
  authenticate,
  checkExisted.answer,
  userController.hesitateAnswer
);

// 清理isLikes和isHesitation字段，注意是字段而不是赞和歧义的数量
router.get(
  "/clearIsLikesAndIsHesitation/:questionId/:id",
  authenticate,
  checkExisted.answer,
  userController.clearIsLikesAndIsHesitation
);

// 收藏回答（id为回答id）
router.put(
  "/answerCollecting/:id",
  authenticate,
  checkExisted.answer,
  userController.collectingAnswer
);

// 取消收藏回答（id为回答id）
router.delete(
  "/answerCollecting/:id",
  authenticate,
  checkExisted.answer,
  userController.uncollectingAnswer
);

// 查询收藏回答列表（id为用户id）
router.get(
  "/:id/answerCollecting",
  checkExisted.user,
  userController.getAnswerCollecting
);

export default router;
