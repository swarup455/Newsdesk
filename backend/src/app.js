import express from "express"
import cors from "cors"
import authRouter from "./routes/Auth.route.js"
import articleRouter from "./routes/Article.route.js"
import "./jobs/AutoDeleteArticles.js"
import "./jobs/refreshArticles.js"
import likesRouter from "./routes/Likes.route.js"
import bookmarksRouter from "./routes/Bookmarks.route.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))

app.use("/images", express.static("public/images"));

app.use(express.urlencoded({ extended: true, limit: "16kb" })) //configure to understand url data

app.use(express.static("public")) // configure to store temporary data in public folder 

app.use('/api/v1/auth', authRouter)

app.use('/api/v1/article', articleRouter)

app.use('/api/v1/likes', likesRouter)

app.use('/api/v1/bookmarks', bookmarksRouter)

export { app }