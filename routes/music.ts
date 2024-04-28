import { Router } from "express";
const router = Router();

// 引入answerController
import musicController from "../controller/music";

/* upload中间件 */
import upload from "../middleware/upload";

router.get("/", musicController.getMusicList)

router.post("/upload", upload.single("file"), musicController.upload);

export default router