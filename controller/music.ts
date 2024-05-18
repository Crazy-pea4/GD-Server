import fs from "fs";
/* 引入声明文件 */
import MusicController from "../@types/controller/music";

/* 引入comment模型 */
import musicModel from "../model/music";
import userModel from "../model/user";

// 引入Tencent Cos对象存储服务包
import Cos from "cos-nodejs-sdk-v5";

const cos = new Cos({
  SecretId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  SecretKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
});

/** 引入工具 */
import handelResponse from "../utils/handelResponse";
import Jwt from "../utils/jwt";
import config from "../config";

const musicController: MusicController = {
  getMusicList: async (req, res, next) => {
    try {
      const { keyword = "" } = req.query;
      const musicList = await musicModel.find({
        $or: [
          { name: new RegExp(keyword as string, "i") },
          { author: new RegExp(keyword as string, "i") },
        ],
      });
      handelResponse(res, musicList, "查询音乐列表成功");
    } catch (err) {}
  },
  upload: async (req, res, next) => {
    try {
      if(!req.file) return;
      const name = req.body.name;
      const id = req.params.id;
      const filepath = `${config.app.baseUrl}/public/uploads/${req.file.originalname}`;
      console.log(id, req.file);
      const Key = `${id}_record_${Date.now()}.m4a`;
      cos.uploadFile({
        Bucket: "userinfo-1308742510",
        Region: "ap-guangzhou",
        Key,
        FilePath: filepath,
        onFileFinish: async function (err, data, options) {
          if (err) {
            res.status(500).json({ code: 500, message: err });
          }
          // 成功后设置userModel.avatar为图床的图片url
          await userModel.findByIdAndUpdate(id, {
            $push: {
              recordList: {
                name,
                url: `https://${data.Location}`
              },
            },
          });
          // 删除留在本地的图片
          fs.rmSync(filepath);
          res.status(200).json({
            code: 200,
            message: "上传成功！",
          });
        },
      });
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
      const result = await musicModel.create(info);

      handelResponse(res, result, info);
    } catch (err) {
      handelResponse(res, err);
    }
  },
};

export default musicController;
