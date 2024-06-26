import { Router } from "express";
const router = Router();

// 引入answerController
import musicController from "../controller/music";

/* upload中间件 */
import upload from "../middleware/upload";

router.get("/", musicController.getMusicList)

router.post("/:id/upload", upload.single("file"), musicController.upload);

router.post("/uploadCloud", musicController.uploadCloud);

export default router