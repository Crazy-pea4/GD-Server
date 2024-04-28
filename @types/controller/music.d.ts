import { RequestHandler } from "express";

export default interface AuthController {
  getMusicList: RequestHandler;
  upload: RequestHandler;
}
