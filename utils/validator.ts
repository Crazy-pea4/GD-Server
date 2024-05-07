/* 引入校验功能库 */
import Joi from "joi";

/* 引入声明文件 */
import {
  userRegisterData,
  authLoginData,
  topicCreateData,
  questionCreateData,
  answerCreateData,
  commentCreateData,
} from "../@types/utils/validator";

// 用户注册校验器
export function userRegisterValidator(data: userRegisterData) {
  const schema = Joi.object({
    nickname: Joi.string().trim().min(2).max(20).required().messages({
      "any.required": "缺少必选参数 nickname",
      "string.base": "nickname 类型错误 需要为string",
      "string.min": "nickname 最少2个字符",
      "string.max": "nickname 最多20个字符",
    }),
    phoneNumber: Joi.string().min(11).max(11).required().messages({
      "any.required": "缺少必选参数 phoneNumber",
      "string.base": "phoneNumber 类型错误 需要为string",
      "string.min": "phoneNumber 必须是11位",
      "string.max": "phoneNumber 必须是11位",
    }),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{6,16}$/)
      .required()
      .messages({
        "any.required": "缺少必选参数 password",
        "string.base": "password 类型错误 需要为string",
        "string.min": "password 最少6个字符",
        "string.max": "password 最多16个字符",
      }),
    avatarUrl: Joi.string().messages({
      "string.base": "avatarUrl 类型错误 需要为string",
    }),
    introduction: Joi.string().messages({
      "string.base": "introduction 类型错误 需要为string",
    })
  });

  return schema.validate(data);
}

// 登录校验器
export function authLoginValidator(data: authLoginData) {
  const schema = Joi.object({
    phoneNumber: Joi.string().min(11).max(11).required().messages({
      "any.required": "缺少必选参数 phoneNumber",
      "string.base": "phoneNumber 类型错误 需要为string",
      "string.min": "phoneNumber 必须是11位",
      "string.max": "phoneNumber 必须是11位",
    }),
    password: Joi.string()
      // .pattern(/^[a-zA-Z0-9]{6,16}$/)
      .required()
      .messages({
        "any.required": "缺少必选参数 password",
        "string.base": "password 类型错误 需要为string",
        "string.min": "password 最少6个字符",
        "string.max": "password 最多16个字符",
      }),
  });

  return schema.validate(data);
}

// 话题创建校验器
export function topicCreateValidator(data: topicCreateData) {
  const schema = Joi.object({
    musicUrl: Joi.string().required().messages({
      "any.required": "缺少必选参数 musicUrl",
      "string.base": "musicUrl 类型错误 需要为string",
    }),
    topicName: Joi.string().max(20).required().messages({
      "any.required": "缺少必选参数 topicName",
      "string.base": "topicName 类型错误 需要为string",
      "string.max": "topicName 不能大于20位",
    }),
    topicPic: Joi.string().messages({
      "string.base": "topicPic 类型错误 需要为string",
    }),
    topicIntroduction: Joi.string().max(200).required().messages({
      "any.required": "缺少必选参数 topicIntroduction",
      "string.base": "topicIntroduction 类型错误 需要为string",
      "string.max": "topicIntroduction 不能大于200位",
    }),
    createdAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 createdAt",
      "string.base": "createdAt 类型错误 需要为string",
    }),
    updatedAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 updatedAt",
      "string.base": "updatedAt 类型错误 需要为string",
    }),
  });

  return schema.validate(data);
}

// 问题创建校验器
export function questionCreateValidator(data: questionCreateData) {
  const schema = Joi.object({
    title: Joi.string().max(50).required().messages({
      "any.required": "缺少必选参数 title",
      "string.base": "title 类型错误 需要为string",
      "string.max": "title 长度不能超过50位",
    }),
    descriptions: Joi.string().max(500).required().messages({
      "any.required": "缺少必选参数 descriptions",
      "string.base": "descriptions 类型错误 需要为string",
      "string.max": "descriptions 长度不能超过500位",
    }),
    topics: Joi.array().required().messages({
      "any.required": "缺少必选参数 topics",
      "array.base": "topics 类型错误 需要为array",
    }),
    createdAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 createdAt",
      "string.base": "createdAt 类型错误 需要为string",
    }),
    updatedAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 updatedAt",
      "string.base": "updatedAt 类型错误 需要为string",
    }),
  });

  return schema.validate(data);
}

// 答案创建校验器
export function answerCreateValidator(data: answerCreateData) {
  const schema = Joi.object({
    content: Joi.string().required().messages({
      "any.required": "缺少必选参数 content",
      "string.base": "content 类型错误",
    }),
    createdAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 createdAt",
      "string.base": "createdAt 类型错误 需要为string",
    }),
    updatedAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 updatedAt",
      "string.base": "updatedAt 类型错误 需要为string",
    }),
  });
  return schema.validate(data);
}

// 评论创建校验器
export function commentCreateValidator(data: commentCreateData) {
  const schema = Joi.object({
    content: Joi.string().required().messages({
      "any.required": "缺少必选参数 content",
      "string.base": "content 类型错误",
    }),
    createdAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 createAdt",
      "string.base": "createdAt 类型错误 需要为string",
    }),
    updatedAt: Joi.string().required().messages({
      "any.required": "缺少必选参数 updatedAt",
      "string.base": "updatedAt 类型错误 需要为string",
    }),
  });
  return schema.validate(data);
}
