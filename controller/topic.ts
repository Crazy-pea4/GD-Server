/* 引入声明文件 */
import TopicController from "../@types/controller/topic";

/* 引入topic模型 */
import topicModel from "../model/topic";
import questionModel from "../model/question";
import musicModel from "../model/music";

/* 引入工具 */
import handelResponse from "../utils/handelResponse";

const topicController: TopicController = {
  // 创建话题
  createTopic: async (req, res, next) => {
    try {
      /**
       * 1. 检查话题是否已经存在 --> 若存在则不创建
       * 2. 若不存在则创建话题
       */
      const info = req.body;
      const result = await topicModel.create(info);
      handelResponse(res, result, info);
    } catch (err) {
      next(err);
    }
  },
  // 修改话题
  updateTopic: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updateInfo = req.body;
      const topic = await topicModel.findByIdAndUpdate(id, updateInfo);
      handelResponse(res, topic, updateInfo);
    } catch (err) {
      next(err);
    }
  },
  // 查询话题列表
  getTopicList: async (req, res, next) => {
    try {
      // 获取页数page
      let { page = 0, limit = 10, keyword = "" } = req.query;
      page = Math.max((page as any) * 1, 1) - 1;
      // 限制每页有多少条数据
      limit = Math.max((limit as any) * 1, 0);
      const topicList = await topicModel
        // 实现模糊搜索，忽略大小写
        .find({ topicName: new RegExp(keyword as string, "i") })
        .limit(limit)
        .skip(page * limit);
      const List = topicList.map(async (item) => {
        const res = await musicModel.findById(item.musicId)
        return {...item.toObject(), musicAuthor: res?.author}
      });
      const finalList = await Promise.all(List)
      handelResponse(res, finalList);
    } catch (err) {
      next(err);
    }
  },
  // 查询指定话题
  getTopic: async (req, res, next) => {
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
      let topic = await topicModel.findById(id).select(detail);
      handelResponse(res, topic);
    } catch (err) {
      next(err);
    }
  },
  // 查询话题粉丝列表
  getTopicFollowers: async (req, res, next) => {
    try {
      const id = req.params.id;
      const topicFollowersList = await topicModel
        .findById(id)
        .select("+topicFollowers")
        .populate("topicFollowers");
      handelResponse(res, topicFollowersList);
    } catch (err) {
      next(err);
    }
  },
  // 查询话题的问题列表
  getTopicQuestions: async (req, res, next) => {
    try {
      const id = req.params.id;
      const questions = await questionModel.find({ topics: id });
      handelResponse(res, questions);
    } catch (err) {
      next(err);
    }
  },
};

export default topicController;
