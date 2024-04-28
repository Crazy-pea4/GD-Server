import express from "express";

/* 导入配置文件 */
import config from "./config/index";
import routes from "./routes/index";
import errorHandler from "./middleware/error";

/* 引入中间件 */
import cors from "cors";
import morgan from "morgan";

/* 引入数据库 */
import "./model/index";

const app = express();

/* 处理中间件 */
// 支持x-www-form-urlencoded格式
app.use(express.urlencoded({ extended: false }));
// 支持application/json
app.use(express.json());
// 处理跨域
app.use(cors());
// 处理日志 for nodejs
app.use(morgan("dev"));

/* 配置静态资源文件夹（静态资源文件夹不需要在url中显示） */
app.use(express.static("public"));

/* 路由中间件 */
app.use("/api", routes);

/* 错误处理中间件 */
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send({'data': 'hello'});
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("got");
});

app.listen(config.app.port, () => {
  console.log(`服务器启动成功: http://localhost:${config.app.port}。监听中...`);
});
