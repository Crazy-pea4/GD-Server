/* 引入声明文件 */
import MusicController from "../@types/controller/music";

/* 引入comment模型 */
import musicModel from "../model/music";

/** 引入工具 */
import handelResponse from "../utils/handelResponse";

const musicController: MusicController = {
  getMusicList: async (req, res, next) => {
    try {
      handelResponse(res, { success: "ok" });
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
};

export default musicController;
