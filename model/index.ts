/* 引入配置文件 */
import config from "../config/index";

/* 引入数据库 */
import mongoose from "mongoose";

mongoose.connect(config.database.url);

mongoose.connection
  .on("open", () => {
    console.log("数据库连接成功");
  })
  .on("error", () => {
    console.log("数据库连接失败，请检查是否开启");
  });
