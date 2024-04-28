import { RequestHandler } from "express";

export default interface AnswerController {
  createAnswer: RequestHandler;
  updateAnswer: RequestHandler;
  getAnswerList: RequestHandler;
  getAnswerLikedList: RequestHandler;
  getAnswer: RequestHandler;
  deleteAnswer: RequestHandler;
}
