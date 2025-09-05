import { asyncHandler } from "../utils/asyncHandler.js";
import { Article } from "../models/articles.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/article.category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import axios from "axios";

export const setCategories = asyncHandler(async (req, res) => {
    const { categoryList } = req.body;

    if (!categoryList || !Array.isArray(categoryList)) {
        throw new ApiError(400, "Categories must be an array");
    }

    const uniqueCategories = [
        ...new Set(categoryList.filter((c) => c && c.trim())),
    ];

    if (uniqueCategories.length === 0) {
        throw new ApiError(400, "At least one valid category is required");
    }

    await Category.deleteMany({});

    const docs = await Category.insertMany(
        uniqueCategories.map((c) => ({ name: c.trim() }))
    );

    res.status(200).json({
        message: "Categories updated",
        categories: docs,
    });
});

export const fetchAndSaveArticles = async () => {
    let totalArticlesProcessed = 0;
    const cats = await Category.find();
    const categories = cats.map((c) => c.name);
    if (categories.length === 0) {
        console.warn("No categories found in DB");
        return;
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    for (const cat of categories) {
        await delay(1500);
        const url = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWS_API_KEY}&category=${cat}&language=en&country=in`;
        try {
            const { data } = await axios.get(url);
            if (!data.results?.length) {
                console.warn(`No new articles from category: ${cat}`);
                continue;
            }
            const categoryDoc = await Category.findOne({ name: cat });
            if (!categoryDoc) {
                console.warn(`Category ${cat} not found in database`);
                continue;
            }
            const validArticles = data.results.filter(
                (news) => news.article_id && news.title && news.link
            );
            for (const news of validArticles) {
                try {
                    await Article.findOneAndUpdate(
                        { articleLink: news.link },
                        {
                            title: news.title || "No Title",
                            summary: news.description || "",
                            author: Array.isArray(news.creator)
                                ? news.creator.join(", ")
                                : news.creator || "Unknown",
                            thumbnail: news.image_url || "",
                            logo: news.source_icon || "",
                            publishedAt: news.pubDate || new Date(),
                            category: categoryDoc.name,
                            articleLink: news.link || "",
                        },
                        { upsert: true, new: true }
                    );
                    totalArticlesProcessed++;
                } catch (err) {
                    console.error(`Save failed for ${news.link}: ${err.message}`);
                }
            }
        } catch (err) {
            console.error(`Fetch failed for category ${cat}: ${err.message}`);
        }
    }
    console.log(`Processed ${totalArticlesProcessed} articles`);
};

export const getArticle = asyncHandler(async (req, res) => {
    const articles = await Article.find().sort({ publishedAt: -1 });
    return res.status(200).json(articles);
});

export const getAiSummary = asyncHandler(async (req, res) => {
    const { articleId } = req.body;
    const article = await Article.findById(articleId);
    if (!article) {
        throw new ApiError(404, "Article not found");
    }
    const textToSummarize = article.summary?.trim();
    if (!textToSummarize) {
        throw new ApiError(400, "Article has no summary text to process");
    }
    try {
        let response = "";
        if (textToSummarize.length < 250) {
            response = textToSummarize;
        } else {
            response = article.aiSummary?.trim();
            if (!response) {
                const generatedSummary = await axios.post(
                    "https://api.cohere.ai/v1/summarize",
                    {
                        text: textToSummarize,
                        length: "medium",
                        format: "paragraph",
                        model: "summarize-xlarge",
                        extractiveness: "auto"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        timeout: 30000,
                    }
                );
                const summaryText = generatedSummary.data.summary;
                const updatedArticle = await Article.findByIdAndUpdate(
                    articleId,
                    { aiSummary: summaryText },
                    { new: true }
                );
                response = updatedArticle.aiSummary;
            }
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                { aiSummary: response },
                "Article summary fetched/added successfully"
            )
        );
    } catch (err) {
        console.error("Cohere API Error:", err.response?.data || err.message);
        throw new ApiError(500, "Failed to summarize article");
    }
});

export const searchArticles = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
    }
    // Split query into words
    const words = query.trim().split(/\s+/);
    // Build regex array for each word
    const regexArray = words.map(word => ({
        $or: [
            { title: { $regex: word, $options: "i" } },
            { summary: { $regex: word, $options: "i" } },
            { author: { $regex: word, $options: "i" } },   // optional
            { category: { $regex: word, $options: "i" } }  // optional
        ]
    }));


    const articles = await Article.find({ $and: regexArray }).sort({ publishedAt: -1 });
    res.status(200).json(articles);
});