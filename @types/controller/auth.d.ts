import { RequestHandler } from "express";

export default interface AuthController {
  login: RequestHandler;
  isValid: RequestHandler;
}
