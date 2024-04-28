import { Router } from "express";
const router = Router();

/* 引入uploadController */
import uploadController from "../controller/upload";

/* upload中间件 */
import upload from "../middleware/upload";

router.post("/:id", upload.single("file"), uploadController.upload);

export default router;
