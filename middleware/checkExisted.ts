/* 引入声明文件 */
import CheckExisted from "../@types/middleware/checkExisted";

/* 引入模型 */
import userModel from "../model/user";
import topicModel from "../model/topic";
import questionModel from "../model/question";
import answerModel from "../model/answer";
import commentModel from "../model/comment";

/* 引入加密工具 */
import Jwt from "../utils/jwt";

const checkExisted: CheckExisted = {
  user: async (req, res, next) => {
    // 获取目标id
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user)
      return res.status(404).json({
        code: 404,
        message: "用户不存在",
      });
    else next();
  },
  topic: async (req, res, next) => {
    // 获取目标id
    const id = req.params.id;
    const topic = await topicModel.findById(id);
    if (!topic)
      return res.status(404).json({
        code: 404,
        message: "话题不存在",
      });
    else next();
  },
  question: async (req, res, next) => {
    // 获取目标id
    const id = req.params.id;
    const question = await questionModel.findById(id);
    if (!question)
      return res.status(404).json({
        code: 404,
        message: "问题不存在",
      });
    else next();
  },
  questioner: async (req, res, next) => {
    try {
      // 获取问题id
      const id = req.params.id;
      // 获取用户id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      const question = await questionModel.findById(id).select("+questioner");
      console.log("question value", question?.questioner?.valueOf(), value);
      if (question?.questioner?.valueOf() !== value)
        return res.status(400).json({
          code: 400,
          message: "不是话题创建者，没有操作权限",
        });
      else next();
    } catch (err) {
      res.status(500).json({
        code: 500,
        data: err,
      });
    }
  },
  answer: async (req, res, next) => {
    // 获取回答id、问题id
    const id = req.params.id;
    const questionId = req.params.questionId;
    const answer = await answerModel.findById(id);
    if (!answer) {
      res.status(404).json({
        code: 404,
        message: "回答不存在",
      });
    } else if (answer.questionId?.valueOf() !== questionId) {
      res.status(404).json({
        code: 404,
        message: "该问题下没有回答",
      });
    } else {
      next();
    }
  },
  answerer: async (req, res, next) => {
    // 获取回答id
    const id = req.params.id;
    // 获取当前用户id
    const token = req.headers.token as string;
    const { value } = Jwt.verify(token);
    const answer = await answerModel.findById(id);
    if (answer?.answerer?.valueOf() !== value)
      return res.status(400).json({
        code: 400,
        message: "不是回答创建者，没有操作权限",
      });
    else next();
  },
  comment: async (req, res, next) => {
    // 获取评论id、回答id
    const id = req.params.id;
    const answerId = req.params.answerId;
    const comment = await commentModel.findById(id);
    if (!comment) {
      res.status(404).json({
        code: 404,
        message: "评论不存在",
      });
    } else if (comment.answerId?.valueOf() !== answerId) {
      res.status(404).json({
        code: 404,
        message: "该回答下没有评论",
      });
    } else {
      next();
    }
  },
  commentator: async (req, res, next) => {
    // 获取评论id
    const id = req.params.id;
    // 获取当前用户id
    const token = req.headers.token as string;
    const { value } = Jwt.verify(token);
    const comment = await commentModel.findById(id);
    if (comment?.commentator?.valueOf() !== value)
      return res.status(400).json({
        code: 400,
        message: "不是评论创建者，没有操作权限",
      });
    else next();
  },
};

export default checkExisted;
