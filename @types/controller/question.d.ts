import { RequestHandler } from "express";

export default interface QuestionController {
  createQuestion: RequestHandler;
  updateQuestion: RequestHandler;
  getQuestionList: RequestHandler;
  getQuestionCollectedList: RequestHandler;
  getQuestion: RequestHandler;
  getQuestionFollowers: RequestHandler;
  deleteQuestion: RequestHandler;
}
