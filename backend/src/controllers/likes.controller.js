import { Likes } from "../models/likes.model.js";
import { Article } from "../models/articles.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const addLike = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    const { uid } = req.user;
    if (!uid) {
        throw new ApiError(401, "User not authenticated");
    }
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;
    try {
        await Likes.create({ articleId, userId });
        const article = await Article.findByIdAndUpdate(
            articleId,
            { $inc: { likedCount: 1 } },
            { new: true }
        );
        return res.status(201).json(
            new ApiResponse(201, { article }, "Like registered successfully")
        );
    } catch (error) {
        if (error.code === 11000) {
            const article = await Article.findById(articleId);
            return res.status(200).json(
                new ApiResponse(200, { article }, "Already liked")
            );
        }
        throw error;
    }
});

export const removeLike = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    const { uid } = req.user;
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;

    const like = await Likes.findOneAndDelete({ articleId, userId });
    if (!like) {
        throw new ApiError(404, "Like not found to delete");
    }

    const article = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { likedCount: -1 } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, { article }, "Like deleted successfully")
    );
});

export const getLikedArticles = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const user = await User.findOne({ firebaseId: uid });
    const userId = user._id;

    const likes = await Likes.find({ userId })
        .populate("articleId")
        .sort({ createdAt: -1 });

    const likedArticles = likes
        .map(like => like.articleId)
        .filter(article => article !== null);

    return res.status(200).json(
        new ApiResponse(200, likedArticles, "Fetched liked articles")
    );
});