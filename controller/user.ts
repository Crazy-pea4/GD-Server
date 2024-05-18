/* 引入声明文件 */
import UserController from "../@types/controller/user";

/* 引入user模型、topic模型 question模型 */
import userModel from "../model/user";
import topicModel from "../model/topic";
import questionModel from "../model/question";
import answerModel from "../model/answer";

/* 引入加密工具 */
import MD5_encrypt from "../utils/md5";
import Jwt from "../utils/jwt";
import handelResponse from "../utils/handelResponse";

// 引入Tencent Cos对象存储服务包
import Cos from "cos-nodejs-sdk-v5";
import musicModel from "../model/music";
import mongoose from "mongoose";
const cos = new Cos({
  SecretId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  SecretKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
});

const userController: UserController = {
  // 注册
  register: async (req, res, next) => {
    try {
      let { phoneNumber, nickname, password, introduction } = req.body;
      // 查询数据库，以phoneNumber为唯一标识
      // 若找到则已被注册
      if (await userModel.findOne({ phoneNumber })) {
        return res.status(400).json({
          code: 400,
          message: "手机号已经被注册了，请重新输入",
        });
      } else {
        // 1.加密用户密码
        password = MD5_encrypt(password);
        // 2.添加用户数据进数据库
        await userModel.create({
          phoneNumber,
          nickname,
          password,
          introduction,
        });
        res.status(200).json({
          code: 200,
          message: "注册成功！",
        });
      }
    } catch (err: any) {
      next(err);
    }
  },
  // 查询用户列表
  getUserList: async (req, res, next) => {
    try {
      // 查询用户列表
      const userList = await userModel.find();
      handelResponse(res, userList);
    } catch (err: any) {
      next(err);
    }
  },
  // 查询指定用户
  getUser: async (req, res, next) => {
    try {
      let id = req.params.id;
      // 获取用户详细信息时，使用?detail=xxx的形式
      let detail = req.query.detail as string;
      if (detail) {
        detail = detail
          .split(";")
          .map((item) => " +" + item)
          .join("");
      }
      // .select()方法 https://mongoosejs.com/docs/api/query.html#query_Query-select
      let user = await userModel.findById(id).select(detail);
      handelResponse(res, user);
    } catch (err: any) {
      next(err);
    }
  },
  // 编辑指定用户
  editUser: async (req, res, next) => {
    try {
      const _id = req.params.id;
      const body = req.body;
      // 这里还需要把password加密一下，否则登陆时的加密比对会不成功，并且在数据库中也是明文存储
      if (body.password) body.password = MD5_encrypt(body.password);
      // 查询用户（返回的是旧值）
      const oldUser = await userModel.findByIdAndUpdate(_id, body);
      handelResponse(res, oldUser, "修改成功", body);
    } catch (err: any) {
      next(err);
    }
  },
  // 注销
  logOff: async (req, res, next) => {
    try {
      const { id } = req.params;
      // 注销不会清除创建的文章和点赞信息，但会清理cos中的头像
      cos.getBucket(
        {
          Bucket: "blog-user-avatar-1308742510",
          Region: "ap-guangzhou",
          Prefix: id,
        },
        (err, data) => {
          if (err) {
            res.status(500).json({
              code: 500,
              message: err.message,
            });
          }
          // 删除掉用户存在之前上传过的图片
          if (data.Contents[0]) {
            cos.deleteObject(
              {
                Bucket: "blog-user-avatar-1308742510",
                Region: "ap-guangzhou",
                Key: data.Contents[0].Key,
              },
              (err, data) => {
                if (err) {
                  res.status(500).json({
                    code: 500,
                    message: err.message,
                  });
                }
              }
            );
          }
        }
      );
      const user = await userModel.findByIdAndDelete(id);
      handelResponse(res, user);
    } catch (err) {
      next(err);
    }
  },
  // 获取用户录音列表
  getRecordList: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await userModel.findById(id);
      handelResponse(res, {author: result?.nickname, picUrl: result?.avatarUrl, recordList: result?.recordList});
    } catch (err) {
      next(err);
    }
  },
  // 喜欢音乐
  likeMusic: async (req, res, next) => {
    // 喜欢的音乐id
    const id = req.params.id;
    // 用户id
    const token = req.headers.token as string;
    const { value } = Jwt.verify(token);

    const music = await musicModel.findById(id).select("+likesList");

    console.log(music?.likesList, value);

    if (music?.likesList.includes(value)) {
      // 若已经喜欢了。删除用户数据模型的保存的喜欢者id
      await userModel.updateOne(
        { _id: value },
        {
          $pull: { likedMusicList: id },
        }
      );
      await musicModel.updateOne(
        { _id: id },
        {
          $pull: { likesList: value },
        }
      );
      handelResponse(res, {}, "取消喜欢成功");
    } else {
      // 列表中没有喜欢者id
      await userModel.updateOne(
        { _id: value },
        {
          $addToSet: { likedMusicList: id },
        }
      );
      await musicModel.updateOne(
        { _id: id },
        {
          $addToSet: { likesList: value },
        }
      );
      handelResponse(res, {}, "喜欢音乐");
    }
  },
  // 获取用户喜欢音乐列表
  getLikeMusicList: async (req, res, next) => {
    try {
      const id = req.params.id;
      const likedMusicList = await userModel
        .findById(id)
        .select("+likedMusicList")
        .populate("likedMusicList");
      handelResponse(res, likedMusicList?.likedMusicList);
    } catch (err) {
      next(err);
    }
  },
  // 关注（往被关注的人的粉丝列表添加关注者id）
  follow: async (req, res, next) => {
    try {
      // 被关注的人id
      const id = req.params.id;
      // 关注者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      /**
       * 若 被关注的人 的followers粉丝列表中没有关注者id，则可以关注，
       * 否则不能重复关注
       */
      // 获取 被关注的人 的粉丝列表
      const user = await userModel.findById(id).select("+followers");
      // 被关注的人 的粉丝列表已存在 关注者 则返回关注失败信息
      if (user?.followers.includes(value))
        return res.status(400).json({
          code: 400,
          message: "已关注用户，不能重复关注",
        });
      else {
        // 向 被关注的人 的粉丝列表添加 关注者id
        await userModel.updateOne(
          { _id: id },
          // $addToSet和$push的区别是：前者不会重复添加
          { $addToSet: { followers: value } }
        );
        // 向 关注者 的关注列表添加 被关注的人id
        await userModel.updateOne(
          { _id: value },
          { $addToSet: { following: id } }
        );
        res.status(200).json({
          code: 200,
          message: "关注用户成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 取消关注
  unfollow: async (req, res, next) => {
    try {
      // 被取消关注的人id
      const id = req.params.id;
      // 取消关注者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      /**
       * 若 被取消关注的人 的followers粉丝列表中没有关注者id，则不可以取消关注，
       * 否则可以取消关注
       */
      // 获取 被取消关注的人 的粉丝列表
      const user = await userModel.findById(id).select("+followers");
      // 被取消关注的人 的粉丝列表不存在 关注者 则返回取消关注失败信息
      if (!user?.followers.includes(value))
        return res.status(400).json({
          code: 400,
          message: "还未关注用户，不能取消关注",
        });
      else {
        // 向 被关注的人 的粉丝列表移除 关注者id
        await userModel.updateOne({ _id: id }, { $pull: { followers: value } });
        // 向 关注者 的关注列表移除 被关注的人id
        await userModel.updateOne({ _id: value }, { $pull: { following: id } });
        res.status(200).json({
          code: 200,
          message: "取消关注用户成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 查询关注列表
  getFollowing: async (req, res, next) => {
    try {
      const id = req.params.id;
      const followingList = await userModel
        .findById(id)
        .select("+following")
        .populate("following");
      handelResponse(res, followingList);
    } catch (err) {
      next(err);
    }
  },
  // 查询粉丝列表
  getFollowers: async (req, res, next) => {
    try {
      const id = req.params.id;
      const followersList = await userModel
        .findById(id)
        .select("+followers")
        .populate("followers");
      handelResponse(res, followersList);
    } catch (err) {
      next(err);
    }
  },
  // 关注话题
  followTopic: async (req, res, next) => {
    try {
      // 被关注的话题id
      const id = req.params.id;
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 获取 被关注话题的 粉丝列表
      const user = await topicModel.findById(id).select("+topicFollowers");
      // 被关注的话题 的粉丝列表已存在 关注者 则返回关注失败信息
      if (user?.topicFollowers.includes(value))
        return res.status(400).json({
          code: 400,
          message: "已关注话题，不能重复关注",
        });
      else {
        // 向 被关注的话题 的粉丝列表添加 关注者id
        await topicModel.updateOne(
          { _id: id },
          // $addToSet和$push的区别是：前者不会重复添加
          { $addToSet: { topicFollowers: value } }
        );
        // 向 关注者 的关注列表添加 被关注的话题id
        await userModel.updateOne(
          { _id: value },
          { $addToSet: { followingTopics: id } }
        );
        res.status(200).json({
          code: 200,
          message: "关注话题成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 取消关注话题
  unfollowTopic: async (req, res, next) => {
    try {
      // 被取消关注的话题id
      const id = req.params.id;
      // 取消关注者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 获取 被取消关注的话题 的粉丝列表
      const user = await topicModel.findById(id).select("+topicFollowers");
      // 被取消关注的话题 的粉丝列表不存在 关注者 则返回取消关注失败信息
      if (!user?.topicFollowers.includes(value))
        return res.status(400).json({
          code: 400,
          message: "还未关注话题，不能取消关注",
        });
      else {
        // 向 被关注的话题 的粉丝列表移除 关注者id
        await topicModel.updateOne(
          { _id: id },
          { $pull: { topicFollowers: value } }
        );
        // 向 关注者 的关注列表移除 被关注的话题id
        await userModel.updateOne(
          { _id: value },
          { $pull: { followingTopics: id } }
        );
        res.status(200).json({
          code: 200,
          message: "取消关注话题成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 查询关注话题列表
  getTopicFollowing: async (req, res, next) => {
    try {
      const id = req.params.id;
      const topicFollowingList = await userModel
        .findById(id)
        .select("+followingTopics")
        .populate("followingTopics");
      handelResponse(res, topicFollowingList);
    } catch (err) {
      next(err);
    }
  },
  // 查询用户的问题列表
  getUserQuestions: async (req, res, next) => {
    try {
      const id = req.params.id;
      const question = await questionModel.find({ questioner: id });
      handelResponse(res, question);
    } catch (err) {
      next(err);
    }
  },
  // 收藏问题（id为问题id）
  collectingQuestions: async (req, res, next) => {
    try {
      // 问题id
      const id = req.params.id;
      // 关注者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      /**
       * 若 被关注的问题 的followers粉丝列表中没有关注者id，则可以关注，
       * 否则不能重复关注
       */
      // 获取 被收藏的问题 的收藏列表
      const user = await questionModel
        .findById(id)
        .select("+questionCollector");
      // 被收藏的问题 的收藏列表已存在 收藏者 则返回收藏失败信息
      if (user?.questionCollector.includes(value))
        return res.status(400).json({
          code: 400,
          message: "已收藏问题，不能重复收藏",
        });
      else {
        // 向 被收藏的问题 的收藏列表添加 关注者id
        await questionModel.updateOne(
          { _id: id },
          // $addToSet和$push的区别是：前者不会重复添加
          {
            $addToSet: { questionCollector: value },
            $set: { isCollected: true },
          }
        );
        // 向 收藏者 的收藏列表添加 被关注的问题id
        await userModel.updateOne(
          { _id: value },
          { $addToSet: { collectingAnswers: id } }
        );
        res.status(200).json({
          code: 200,
          message: "收藏问题成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 取消收藏问题（id为问题id）
  uncollectingQuestions: async (req, res, next) => {
    try {
      // 问题id
      const id = req.params.id;
      // 关注者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      /**
       * 若 被关注的问题 的followers粉丝列表中没有关注者id，则可以关注，
       * 否则不能重复关注
       */
      // 获取 被收藏的问题 的收藏列表
      const user = await questionModel
        .findById(id)
        .select("+questionCollector");
      // 被收藏的问题 的收藏列表不存在 收藏者 则返回取消收藏失败信息
      if (!user?.questionCollector.includes(value))
        return res.status(400).json({
          code: 400,
          message: "还未收藏问题，不能取消收藏",
        });
      else {
        // 向 被收藏的问题 的收藏列表删除 关注者id
        await questionModel.updateOne(
          { _id: id },
          // $addToSet和$push的区别是：前者不会重复添加
          {
            $pull: { questionCollector: value },
            $set: { isCollected: false },
          }
        );
        // 向 收藏者 的收藏列表删除 被关注的问题id
        await userModel.updateOne(
          { _id: value },
          { $pull: { collectingAnswers: id } }
        );
        res.status(200).json({
          code: 200,
          message: "取消收藏问题成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 赞回答（取消）
  likeAnswer: async (req, res, next) => {
    try {
      // 回答id
      const id = req.params.id as any;
      // 获取token，解密获得用户id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      const method = req.method;
      // $inc操作符用于递增目标值
      const data = await answerModel.findByIdAndUpdate(id, {
        // 根据请求方法决定增加或是减少，此时歧义（踩）一定是-1
        $inc: { likes: method === "PUT" ? 1 : -1 },
        $set: {
          isLikes: method === "PUT" ? true : false,
          isHesitation: method === "PUT" ? false : true,
        },
      });
      // 对userModel的点赞回答字段处理
      if (method === "PUT") {
        await userModel.updateOne(
          { _id: value },
          { $addToSet: { likesAnswers: id } }
        );
      } else {
        await userModel.updateOne(
          { _id: value },
          { $pull: { likesAnswers: id } }
        );
      }
      if (data) {
        res.status(200).json({
          code: 200,
          message: method === "PUT" ? "赞同答案成功" : "取消赞同答案成功",
          data,
        });
      } else {
        res.status(400).json({
          code: 400,
          message: "赞同答案失败",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 歧义答案（取消）
  hesitateAnswer: async (req, res, next) => {
    try {
      // 回答id
      const id = req.params.id as any;
      // 获取token，解密获得用户id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      const method = req.method;
      // $inc操作符用于递增目标值
      const data = await answerModel.findByIdAndUpdate(id, {
        $inc: { hesitation: method === "PUT" ? 1 : -1 },
        $set: {
          isHesitation: method === "PUT" ? true : false,
          isLikes: method === "PUT" ? false : true,
        },
      });
      // 像userModel中的likesAnswers移除点赞的回答
      await userModel.updateOne(
        { _id: value },
        { $pull: { likesAnswers: id } }
      );
      if (data) {
        res.status(200).json({
          code: 200,
          message: method === "PUT" ? "歧义答案成功" : "取消歧义答案成功",
          data,
        });
      } else {
        res.status(400).json({
          code: 400,
          message: "歧义答案失败",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 清理isLikes和isHesitation
  clearIsLikesAndIsHesitation: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await answerModel.findByIdAndUpdate(id, {
        $set: {
          isLikes: false,
          isHesitation: false,
        },
      });
      res.status(200).json({
        code: 200,
        message: "取消成功",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
  // 收藏回答
  collectingAnswer: async (req, res, next) => {
    try {
      // 被收藏回答id
      const id = req.params.id as any;
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 获取 用户的收藏回答列表
      const answer = await userModel
        .findById(value)
        .select("+collectingAnswers");
      // 被收藏回答 的粉丝列表已存在 关注者 则返回关注失败信息
      if (answer?.collectingAnswers.includes(id))
        return res.status(400).json({
          code: 400,
          message: "已收藏回答，不能重复收藏",
        });
      else {
        // 向 关注者 的关注列表添加 被关注的话题id
        await userModel.updateOne(
          { _id: value },
          { $addToSet: { collectingAnswers: id } }
        );
        res.status(200).json({
          code: 200,
          message: "收藏回答成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 取消收藏回答
  uncollectingAnswer: async (req, res, next) => {
    try {
      // 被取消收藏回答id
      const id = req.params.id as any;
      // 取消收藏者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 获取 被取消收藏回答 的粉丝列表
      const answer = await userModel
        .findById(value)
        .select("+collectingAnswers");
      if (!answer?.collectingAnswers.includes(id))
        return res.status(400).json({
          code: 400,
          message: "还未收藏回答，不能取消收藏",
        });
      else {
        await userModel.updateOne(
          { _id: value },
          { $pull: { collectingAnswers: id } }
        );
        res.status(200).json({
          code: 200,
          message: "取消收藏回答成功",
          data: { id },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // 查询收藏回答列表
  getAnswerCollecting: async (req, res, next) => {
    try {
      const id = req.params.id;
      const answerFollowingList = await userModel
        .findById(id)
        .select("+collectingAnswers")
        .populate("collectingAnswers");
      handelResponse(res, answerFollowingList);
    } catch (err) {
      next(err);
    }
  },
};

export default userController;
