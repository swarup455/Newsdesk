import cron from "node-cron";
import { Article } from "../models/articles.model.js";
import { Likes } from "../models/likes.model.js";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 Running cleanup job...");

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const likedArticleIds = await Likes.distinct("articleId");

    const result = await Article.deleteMany({
      createdAt: { $lt: threeDaysAgo },
      _id: { $nin: likedArticleIds },
    });

    console.log(`🗑️ Deleted ${result.deletedCount} old unliked articles.`);
  } catch (err) {
    console.error("❌ Cleanup job failed:", err);
  }
});