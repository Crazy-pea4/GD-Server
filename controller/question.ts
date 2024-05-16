/* 引入声明文件 */
import QuestionController from "../@types/controller/question";

/* 引入question模型 */
import questionModel from "../model/question";
import answerModel from "../model/answer";

/* 引入工具 */
import Jwt from "../utils/jwt";
import handelResponse from "../utils/handelResponse";

const questionController: QuestionController = {
  // 创建问题
  createQuestion: async (req, res, next) => {
    try {
      const info = req.body;
      // 问题创建者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 将questioner整合进info中
      info.questioner = value;
      // 新建问题，问题可以重复
      const result = await questionModel.create(info);
      handelResponse(res, result, '创建评论成功');
    } catch (err) {
      next(err);
    }
  },
  // 修改问题
  updateQuestion: async (req, res, next) => {
    try {
      const id = req.params.id;
      const questionInfo = req.body;
      const question = await questionModel.findByIdAndUpdate(id, questionInfo);
      handelResponse(res, question, questionInfo);
    } catch (err) {
      next(err);
    }
  },
  // 查询问题列表
  getQuestionList: async (req, res, next) => {
    try {
      // 获取页数page
      let { page = 0, limit = 10, keyword = "" } = req.query;
      page = Math.max((page as any) * 1, 1) - 1;
      // 限制每页有多少条数据
      limit = Math.max((limit as any) * 1, 0);
      const questionList = await questionModel
        // 实现模糊搜索，忽略大小写
        .find({
          $or: [
            { title: new RegExp(keyword as string, "i") },
            { descriptions: new RegExp(keyword as string, "i") },
          ],
        })
        .populate("questioner")
        .populate("topics")
        .limit(limit)
        .skip(page * limit);
      handelResponse(res, questionList, "查询问题列表成功");
    } catch (err) {
      next(err);
    }
  },
  // 查询问题收藏列表
  getQuestionCollectedList: async (req, res, next) => {
    try {
      // 获取页数page
      let { page = 0, limit = 10 } = req.query;
      page = Math.max((page as any) * 1, 1) - 1;
      // 限制每页有多少条数据
      limit = Math.max((limit as any) * 1, 0);
      const questionList = await questionModel
        // 实现模糊搜索，忽略大小写
        .find({ isCollected: true })
        .populate("questioner")
        .populate("topics")
        .limit(limit)
        .skip(page * limit);
      handelResponse(res, questionList, "查询问题列表成功");
    } catch (err) {
      next(err);
    }
  },
  // 查询指定问题
  getQuestion: async (req, res, next) => {
    try {
      const id = req.params.id;
      // 获取用户详细信息时，使用?detail=xxx的形式
      let detail = req.query.detail as string;
      if (detail) {
        detail = detail
          .split(";")
          .map((item) => " +" + item)
          .join("");
      }
      const question = await questionModel
        .findById(id)
        .select(detail)
        .populate("questioner topics");
      handelResponse(res, question);
    } catch (err) {
      next(err);
    }
  },
  // 查询问题粉丝列表
  getQuestionFollowers: async (req, res, next) => {
    try {
      const id = req.params.id;
      const questionFollowersList = await questionModel
        .findById(id)
        .select("+topicFollowers")
        .populate("topicFollowers");
      handelResponse(res, questionFollowersList);
    } catch (err) {
      next(err);
    }
  },
  // 删除指定问题
  deleteQuestion: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await questionModel.findByIdAndDelete(id);
      // 删除问题下面的回答
      await answerModel.deleteMany({ questionId: id });
      handelResponse(res, data);
    } catch (err) {
      next(err);
    }
  },
};

export default questionController;
