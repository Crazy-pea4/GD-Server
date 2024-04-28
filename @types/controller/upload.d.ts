import { RequestHandler } from "express";

export default interface UploadController {
  upload: RequestHandler;
}
