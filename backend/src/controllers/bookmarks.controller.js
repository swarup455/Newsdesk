import { Bookmarks } from "../models/bookmarks.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Article } from "../models/articles.model.js";

export const addBookmark = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    const { uid } = req.user;
    if (!uid) {
        throw new ApiError(401, "User not authenticated");
    }
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;
    try {
        await Bookmarks.create({ articleId, userId });
        const article = await Article.findById(articleId);

        return res.status(201).json(
            new ApiResponse(201, { article }, "Bookmark registered successfully")
        );
    } catch (error) {
        if (error.code === 11000) {
            const article = await Article.findById(articleId);
            return res.status(200).json(
                new ApiResponse(200, { article }, "Already bookmarked")
            );
        }
        throw error;
    }
});

export const removeBookmark = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    const { uid } = req.user;
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;

    const bookmark = await Bookmarks.findOneAndDelete({ articleId, userId });
    if (!bookmark) {
        throw new ApiError(404, "Bookmark not found to delete");
    }

    const article = await Article.findByIdAndUpdate(articleId);

    return res.status(200).json(
        new ApiResponse(200, { article }, "Bookmark deleted successfully")
    );
});

export const getBookmarkedArticles = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;

    const bookmarks = await Bookmarks.find({ userId })
        .populate("articleId")
        .sort({ createdAt: -1 });

    const bookmarkedArticles = bookmarks
        .map(bookmark => bookmark.articleId)
        .filter(article => article !== null);

    return res.status(200).json(
        new ApiResponse(200, bookmarkedArticles, "Fetched bookmarked articles")
    );
});