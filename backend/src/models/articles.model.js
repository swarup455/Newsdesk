import mongoose, { Schema } from "mongoose"

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    aiSummary: {
        type: String
    },
    aiSentiment: {
        type: Object
    },
    author: {
        type: String,
        default: "Unknown"
    },
    thumbnail: {
        type: String,
        default: process.env.DEFAULT_THUMBNAIL || ""
    },
    logo: {
        type: String,
        default: ""
    },
    publishedAt: {
        type: Date,
        required: true,
        index: true,
    },
    category: {
        type: String,
        index: true,
        required: true
    },
    articleLink: {
        type: String,
        required: true,
        unique: true
    },
    likedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const Article = mongoose.model("Article", articleSchema);