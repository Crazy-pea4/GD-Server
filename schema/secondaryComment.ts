import mongoose from "mongoose";

const secondaryCommentSchema = new mongoose.Schema({
  content: { type: String },
  commentator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },

  createdAt: {
    type: String,
    required: true,
  },

  updatedAt: {
    type: String,
    required: true,
  },
});

export default secondaryCommentSchema;
