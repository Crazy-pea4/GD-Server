/* 引入声明文件 */
import CommentController from "../@types/controller/comment";

/* 引入comment模型 */
import commentModel from "../model/comment";

/* 引入工具 */
import Jwt from "../utils/jwt";
import handelResponse from "../utils/handelResponse";

const commentController: CommentController = {
  // 创建评论
  createComment: async (req, res, next) => {
    try {
      // 获取请求体和answerId
      const info = req.body;
      const { answerId, id: commentId } = req.params;
      // 评论创建者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 将commentator整合进info中
      info.commentator = value;
      info.answerId = answerId;

      // 如果不是创建二级评论
      if (!commentId) {
        const result = await commentModel.create(info);
        handelResponse(res, result, info);
      } else {
        info.replyTo = commentId;
        const result = await commentModel.findByIdAndUpdate(commentId, {
          $push: { secondaryComment: info },
        });
        handelResponse(res, result, info);
      }
    } catch (err) {
      next(err);
    }
  },
  // 修改评论
  updateComment: async (req, res, next) => {
    try {
      const { id, sId } = req.params;
      const info = req.body;
      // 如果不是修改二级评论
      if (!sId) {
        const answer = await commentModel.findByIdAndUpdate(id, info);
        handelResponse(res, answer, info);
      } else {
        const sAnswer = await commentModel.findOneAndUpdate(
          { secondaryComment: { $elemMatch: { _id: sId } } },
          { $set: { "secondaryComment.$.content": info.content } }
        );
        handelResponse(res, sAnswer, info);
      }
    } catch (err) {
      next(err);
    }
  },
  // 查询评论列表
  getCommentList: async (req, res, next) => {
    try {
      // 获取页数page
      let { page = 0, limit = 10 } = req.query;
      page = Math.max((page as any) * 1, 1) - 1;
      // 限制每页有多少条数据
      limit = Math.max((limit as any) * 1, 0);

      // 获取answerId commentId（为二级评论服务）
      const { answerId } = req.params;
      const commentList = await commentModel
        .find({ answerId })
        .limit(limit)
        .skip(page * limit)
        .populate("commentator")
        .populate({
          path: "secondaryComment",
          populate: { path: "commentator" },
          perDocumentLimit: 3,
          // options: { limit: 3 },
        });
      handelResponse(res, commentList);
    } catch (err) {
      next(err);
    }
  },
  // 查询指定评论下的二级评论列表
  getComment: async (req, res, next) => {
    try {
      // 获取页数page
      let { page = 0, limit = 10 } = req.query;
      page = Math.max((page as any) * 1, 1) - 1;
      // 限制每页有多少条数据
      limit = Math.max((limit as any) * 1, 0);

      const id = req.params.id;
      // 获取用户详细信息时，使用?detail=xxx的形式
      let detail = req.query.detail as string;
      if (detail) {
        detail = detail
          .split(";")
          .map((item) => " +" + item)
          .join("");
      }
      const comment = await commentModel
        .findById(id)
        .limit(limit)
        .skip(page * limit)
        .select(detail)
        .populate("commentator");
      handelResponse(res, comment);
    } catch (err) {
      next(err);
    }
  },
  // 删除指定评论
  deleteComment: async (req, res, next) => {
    try {
      const { id, sId } = req.params;
      // 如果不是二级评论
      if (!sId) {
        const data = await commentModel.findByIdAndDelete(id);
        handelResponse(res, data);
      } else {
        const sAnswer = await commentModel.findOneAndUpdate(
          { _id: id },
          { $pull: { secondaryComment: { _id: sId } } }
        );
        handelResponse(res, sAnswer);
      }
    } catch (err) {
      next(err);
    }
  },
};

export default commentController;
