import HandelResponse from "../@types/utils/handelResponse";

const handelResponse: HandelResponse = function (
  res,
  result,
  message = "请求成功",
  data?
) {
  if (result) {
    res.status(200).json({
      code: 200,
      message,
      data: data ? data : result,
    });
  } else {
    res.status(400).json({
      code: 400,
      message: "请求失败",
      data: data ? data : result,
    });
  }
};

export default handelResponse;
