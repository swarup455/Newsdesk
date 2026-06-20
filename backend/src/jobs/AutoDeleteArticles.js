import cron from "node-cron";
import { Article } from "../models/articles.model.js";

const MAX_ARTICLES = 10000;

cron.schedule("0 0 * * *", async () => {
  try {
    const totalArticles = await Article.countDocuments();

    if (totalArticles <= MAX_ARTICLES) {
      console.log(`Article count: ${totalArticles}/${MAX_ARTICLES}!`);
      return;
    }

    const excess = totalArticles - MAX_ARTICLES;

    console.log(`Removing ${excess} oldest articles...`);

    const oldestArticles = await Article.find({})
      .sort({ createdAt: 1 })
      .limit(excess)
      .select("_id");

    const result = await Article.deleteMany({
      _id: { $in: oldestArticles.map(article => article._id) }
    });

    console.log(`Deleted ${result.deletedCount} old articles`);
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
});