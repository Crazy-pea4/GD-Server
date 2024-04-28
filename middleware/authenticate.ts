/* 引入Jwt工具 */
import Jwt from "../utils/jwt";

/* 引入express中间件函数声明 */
import { RequestHandler } from "express";

const authenticate: RequestHandler = function (req, res, next) {
  // 尝试从请求头部获取token
  const token = req.headers.token as string | undefined;
  if (token) {
    // 若token存在，校验其是否过期
    try {
      Jwt.verify(token);
      next();
    } catch (err) {
      res.status(401).json({
        code: 401,
        message: "Token无效，请重新登录",
      });
    }
  } else {
    res.status(400).json({
      code: 400,
      message: "Token not found",
    });
  }
};

export default authenticate;
