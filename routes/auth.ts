import { Router } from "express";
const router = Router();

/* 引入authController */
import authController from "../controller/auth";

/* 引入校验中间件 */
import validate from "../middleware/validate";

/* 引入登录校验工具 */
import { authLoginValidator } from "../utils/validator";

router.post("/", validate(authLoginValidator), authController.login);

router.get("/", authController.isValid);

export default router;
