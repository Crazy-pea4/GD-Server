import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  res.status(500).json({
    code: 500,
    message: "服务器内部错误",
  });
  console.log(err);
};
export default errorHandler;
