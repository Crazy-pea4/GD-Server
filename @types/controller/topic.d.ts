import { RequestHandler } from "express";

export default interface TopicController {
  createTopic: RequestHandler;
  updateTopic: RequestHandler;
  getTopicList: RequestHandler;
  getTopic: RequestHandler;
  getTopicFollowers: RequestHandler;
  getTopicQuestions: RequestHandler;
}
