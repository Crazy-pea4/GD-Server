export default {
  // app端口
  app: {
    baseUrl: process.env.baseUrl || "D:/Program/H5C3-JS/Project/Blog/server",
    port: process.env.PORT || 3000,
  },
  // 数据库url
  database: {
    url: process.env.MONGODB || "mongodb://127.0.0.1:27017/MusicShared",
  },
  // javaWebToken
  jwt: {
    // jwt密钥
    secret: "e43c830d-687c-5850-8393-94d9d59d3bef-ym",
    timeout: "180 days",
  },
};
