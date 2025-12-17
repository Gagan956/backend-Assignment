import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment_id: {
      type: String,
      required: true,
    },

    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    comment_text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
