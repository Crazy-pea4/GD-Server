import jwt from "jsonwebtoken";

/* 引入配置文件 */
import config from "../config/index";

/* 引入声明文件 */
import JWT from "../@types/utils/jwt";

const Jwt: JWT = {
  sign: (value) => {
    return jwt.sign({ value }, config.jwt.secret, {
      expiresIn: config.jwt.timeout,
    });
  },
  verify(token) {
    return jwt.verify(token, config.jwt.secret);
  },
};

export default Jwt;
