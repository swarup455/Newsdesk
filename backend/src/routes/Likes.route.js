import express from 'express'
import { addLike, getLikedArticles, removeLike } from '../controllers/likes.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js';

const likesRouter = express.Router()

likesRouter.post("/set-like", authMiddleware, addLike)

likesRouter.post("/delete-like", authMiddleware, removeLike)

likesRouter.get("/get-liked-articles", authMiddleware, getLikedArticles)

export default likesRouter