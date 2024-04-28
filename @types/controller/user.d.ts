import { RequestHandler } from "express";

export default interface UserController {
  register: RequestHandler;
  getUserList: RequestHandler;
  getUser: RequestHandler;
  editUser: RequestHandler;
  logOff: RequestHandler;
  follow: RequestHandler;
  unfollow: RequestHandler;
  getFollowing: RequestHandler;
  getFollowers: RequestHandler;
  followTopic: RequestHandler;
  unfollowTopic: RequestHandler;
  getTopicFollowing: RequestHandler;
  getUserQuestions: RequestHandler;
  collectingQuestions: RequestHandler;
  uncollectingQuestions: RequestHandler;
  likeAnswer: RequestHandler;
  hesitateAnswer: RequestHandler;
  clearIsLikesAndIsHesitation: RequestHandler;
  collectingAnswer: RequestHandler;
  uncollectingAnswer: RequestHandler;
  getAnswerCollecting: RequestHandler;
}
