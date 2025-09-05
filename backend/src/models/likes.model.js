import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, { timestamps: true });

likeSchema.index({ articleId: 1, userId: 1 }, { unique: true });

export const Likes = mongoose.model("Likes", likeSchema);