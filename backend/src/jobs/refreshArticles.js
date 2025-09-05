import { fetchAndSaveArticles } from "../controllers/article.controller.js";
import cron from "node-cron"

cron.schedule("*/20 * * * *", async () => {
    try {
        await fetchAndSaveArticles();
    } catch (error) {
        console.log(error)
        console.log("Articles fetching error!!")
    }
})