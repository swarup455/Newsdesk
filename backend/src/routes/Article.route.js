import express from "express"
import { setCategories, getArticle, getAiSummary, searchArticles } from "../controllers/article.controller.js"

const articleRouter = express.Router()

articleRouter.post("/set-category", setCategories); 

articleRouter.get("/get-article", getArticle);

articleRouter.post("/get-ai-summary", getAiSummary);

articleRouter.post("/searched-articles", searchArticles)

export default articleRouter