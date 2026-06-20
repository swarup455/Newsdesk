import { fetchAndSaveArticles } from "../controllers/article.controller.js";
import cron from "node-cron"

let consecutiveFailures = 0;

cron.schedule("*/20 * * * *", async () => {
    try {
        await fetchAndSaveArticles();
        consecutiveFailures = 0;
    } catch (error) {
        consecutiveFailures++;
        console.error(`Articles fetching error (failure #${consecutiveFailures}):`, error);

        if (consecutiveFailures >= 5) {
            console.error("🚨 ALERT: Fetch job has failed 5+ times in a row. Investigate immediately.");
            // send yourself an email/Slack/Discord webhook here
        }
    }
});