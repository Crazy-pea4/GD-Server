/* 引入声明文件 */
import Upload from "../@types/middleware/upload";
/* 引入multer库，创建upload中间件 */
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const ud = multer({ storage });

/* upload中间件 */
const upload: Upload = {
  single: (fieldName) => {
    return ud.single(fieldName);
  },
};

export default upload;
