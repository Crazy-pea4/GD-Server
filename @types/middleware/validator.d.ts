import Joi from "joi";

// 验证中间件
export default interface Validator {
  (body: any): Joi.ValidationResult;
}
