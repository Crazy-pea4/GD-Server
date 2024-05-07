/* 引入声明文件 */
import MusicController from "../@types/controller/music";

/* 引入comment模型 */
import musicModel from "../model/music";

/** 引入工具 */
import handelResponse from "../utils/handelResponse";
import Jwt from "../utils/jwt";

const musicController: MusicController = {
  getMusicList: async (req, res, next) => {
    try {
      const { keyword = "" } = req.query
      const musicList = await musicModel.find({
        $or: [
          { name: new RegExp(keyword as string, "i") },
          { author: new RegExp(keyword as string, "i") },
        ],
      })
      handelResponse(res, musicList, "查询音乐列表成功");
    } catch (err) {}
  },
  upload: async (req, res, next) => {
    try {
      console.log(req.file);
      handelResponse(res, { success: "ok" });
    } catch (err) {
      handelResponse(res, err);
    }
  },
  uploadCloud: async (req, res, next) => {
    try {
      const info = req.body;
      // 音乐创建者id
      const token = req.headers.token as string;
      const { value } = Jwt.verify(token);
      // 将uploader整合进info中
      info.uploader = value;
      const result = await musicModel.create(info)

      handelResponse(res, result, info);
    } catch (err) {
      handelResponse(res, err);
    }
  },
};

export default musicController;
