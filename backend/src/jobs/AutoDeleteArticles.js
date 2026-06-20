import cron from "node-cron";
import { Article } from "../models/articles.model.js";
import { Likes } from "../models/likes.model.js";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 Running cleanup job...");

    const totalArticles = await Article.countDocuments();

    if (totalArticles <= 100) {
      console.log("✅ Cleanup skipped: Less than or equal to 100 articles.");
      return;
    }

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const likedArticleIds = await Likes.distinct("articleId");

    // Never delete below a safe floor, regardless of how many qualify
    const minToKeep = 100;
    const eligibleCount = await Article.countDocuments({
      createdAt: { $lt: threeDaysAgo },
      _id: { $nin: likedArticleIds },
    });

    const maxDeletable = Math.max(0, totalArticles - minToKeep);
    const toDelete = Math.min(eligibleCount, maxDeletable);

    if (toDelete === 0) {
      console.log("✅ Cleanup skipped: would drop below safe floor.");
      return;
    }

    const idsToDelete = await Article.find({
      createdAt: { $lt: threeDaysAgo },
      _id: { $nin: likedArticleIds },
    })
      .sort({ createdAt: 1 }) // delete oldest first
      .limit(toDelete)
      .select("_id");

    const result = await Article.deleteMany({
      _id: { $in: idsToDelete.map((d) => d._id) },
    });

    console.log(`🗑️ Deleted ${result.deletedCount} old unliked articles.`);
  } catch (err) {
    console.error("❌ Cleanup job failed:", err);
  }
});