/* 引入声明文件 */
import AuthController from "../@types/controller/auth";

/* 引入user模型 */
import userModel from "../model/user";

/* 引入工具 */
import MD5_encrypt from "../utils/md5";
import Jwt from "../utils/jwt";

const authController: AuthController = {
  login: async (req, res, next) => {
    try {
      let { phoneNumber, password } = req.body;
      // 检查用户是否存在
      if (await userModel.findOne({ phoneNumber })) {
        // 检查密码是否正确（这里将密码再次加密，比对加密密码）
        password = MD5_encrypt(password);
        let data = await userModel.findOne({ password });
        if (data) {
          let _id = data._id as unknown as string;
          res.status(200).json({
            code: 200,
            message: "登陆成功",
            token: Jwt.sign(_id),
            userId: _id,
            data,
          });
        } else {
          res.status(400).json({
            code: 400,
            message: "密码错误，请重试",
          });
        }
      } else {
        res.status(400).json({
          code: 400,
          message: "用户不存在",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  isValid: async (req, res, next) => {
    try {
      const token = req.headers.token as string;
      // 检查用户是否存在
      Jwt.verify(token);
      res.status(201).json({
        code: 201,
        message: "token validate",
      });
    } catch (err) {
      res.status(401).json({
        code: 401,
        message: "token invalidate",
      });
    }
  },
};

export default authController;
