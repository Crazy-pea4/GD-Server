import { Router } from "express";
const router = Router();

/* 引入路由 */
import user from "./user";
import auth from "./auth";
import upload from "./upload";
import topic from "./topic";
import question from "./question";
import answer from "./answer";
import comment from "./comment";

/* 用户api */
router.use("/user", user);

/* 登录api */
router.use("/auth", auth);

/* 上传文件api */
router.use("/upload", upload);

/* 话题api */
router.use("/topic", topic);

/* 问题api */
router.use("/question", question);

/* 回答api（设计为question的二层api） */
router.use("/question", answer);

/* 评论api（嵌套路由 answer -> comment） */
router.use("/answer", comment);

export default router;
