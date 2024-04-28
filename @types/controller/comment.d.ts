import { RequestHandler } from "express";

export default interface CommentController {
  createComment: RequestHandler;
  updateComment: RequestHandler;
  getCommentList: RequestHandler;
  getComment: RequestHandler;
  deleteComment: RequestHandler;
}
