import express from 'express'
import { addBookmark, getBookmarkedArticles, removeBookmark } from '../controllers/bookmarks.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const bookmarksRouter = express.Router()

bookmarksRouter.post("/set-bookmark", authMiddleware, addBookmark)

bookmarksRouter.post("/delete-bookmark", authMiddleware, removeBookmark)

bookmarksRouter.get("/get-bookmarked-articles", authMiddleware, getBookmarkedArticles)

export default bookmarksRouter