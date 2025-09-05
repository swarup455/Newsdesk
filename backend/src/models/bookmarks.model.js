import mongoose, { Schema } from "mongoose";

const bookmarksSchema = new Schema({
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

bookmarksSchema.index({ articleId: 1, userId: 1 }, { unique: true });

export const Bookmarks = mongoose.model("Bookmarks", bookmarksSchema)