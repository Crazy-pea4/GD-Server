/* 引入express中间件函数声明 */
import { RequestHandler } from "express";

/* 引入校验声明文件 */
import Validator from "../@types/middleware/validator";

export default function (validator: Validator): RequestHandler {
  return (req, res, next) => {
    const { error, value } = validator(req.body);
    // console.log(value);
    if (error) {
      return res.status(400).json({
        code: 400,
        value: error._original,
        message: error.message,
      });
    } else {
      // 将使用Joi库处理过的数据覆盖req.body，方便下一层中间件获取
      req.body = value;
      next();
    }
  };
}
