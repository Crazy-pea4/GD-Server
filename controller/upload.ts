import fs from "fs";
import UploadController from "../@types/controller/upload";
// 引入Tencent Cos对象存储服务包
import Cos from "cos-nodejs-sdk-v5";
/* 引入upload模型 */
import userModel from "../model/user";

/* 引入config文件 */
import config from "../config/index";

const cos = new Cos({
  SecretId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  SecretKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
});

const uploadController: UploadController = {
  upload: (req, res, next) => {
    const id = req.params.id;
    if (req.file) {
      // const filepath = `public/uploads/${req.file.originalname}`; 服务器
      const filepath = `${config.app.baseUrl}/public/uploads/${req.file.originalname}`;
      console.log(filepath, req.file);
      
      // 查询用户先前是否已经上传过头像
      // cos.getBucket(
      //   {
      //     Bucket: "userinfo-1308742510",
      //     Region: "ap-guangzhou",
      //     Prefix: id,
      //   },
      //   (err, data) => {
      //     if (err) {
      //       res.status(500).json({
      //         code: 500,
      //         message: err.message,
      //       });
      //     }
      //     // 若用户存在之前上传过的图片，删除掉再添加新的
      //     if (data.Contents[0]) {
      //       cos.deleteObject(
      //         {
      //           Bucket: "userinfo-1308742510",
      //           Region: "ap-guangzhou",
      //           Key: data.Contents[0].Key,
      //         },
      //         (err, data) => {
      //           if (err) {
      //             res.status(500).json({
      //               code: 500,
      //               message: err.message,
      //             });
      //           }
      //         }
      //       );
      //     }
      //   }
      // );
      const Key = `${id}_${Date.now()}_avatar.jpg`;
      // 确保将用户的先前头像删除完毕，再添加新头像
      cos.uploadFile({
        Bucket: "userinfo-1308742510",
        Region: "ap-guangzhou",
        Key,
        FilePath: filepath,
        // Headers: {
        //   // 通过 imageMogr2 接口使用图片缩放功能：指定图片宽度为 256，宽度等比压缩
        //   "Pic-Operations": `{"is_pic_info": 1, "rules": [{"fileid": "${Key}", "rule": "imageMogr2/thumbnail/256x/"}]}`,
        // },
        onFileFinish: async function (err, data, options) {
          if (err) {
            res.status(500).json({ code: 500, message: err });
          }
          // 成功后设置userModel.avatar为图床的图片url
          await userModel.findByIdAndUpdate(id, {
            $set: {
              avatarUrl: `https://${data.Location}`,
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
    }
    // if (req.file) {
    //   res.status(200).json({
    //     code: 200,
    //     message: "上传成功",
    //     data: `http://localhost:${config.app.port}/uploads/${req.file.filename}`,
    //   });
    // }
  },
};

export default uploadController;
