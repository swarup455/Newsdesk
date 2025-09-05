import { useParams } from 'react-router-dom';
import Newscard from '../../components/Cards/Newscard';
import { useSelector } from "react-redux"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { ImSpinner8 } from "react-icons/im";

dayjs.extend(relativeTime);

const Newsfeed = () => {
  const { categoryId } = useParams()
  const { articles, loading, error } = useSelector((state) => state.article);
  const filteredArticles = articles.filter(article => 
    String(article.category) === String(categoryId || "top"))

  if (loading) {
    return <div className='fixed top-0 h-screen w-full flex justify-center items-center'>
      <ImSpinner8 size={35} className='text-violet-600 animate-spin' />;
    </div>
  }
  {typeof error === "string" ? error : error?.message || "Failed to fetch articles..."}

  return (
    <div className='lg:px-30 md:px-20 sm:px-15 px-5'>
      {
        filteredArticles.map((article) => (
          <Newscard
            key={article?._id}
            articleId={article?._id}
            logo={article?.logo}
            logotext={(article?.author).split('.')[0].replace(/[\/\\]/g, "")}
            thumbnail={article?.thumbnail || "/defaultThumbnail.png"}
            headline={article?.title}
            description={article?.summary}
            timestamp={dayjs(article?.publishedAt).fromNow()}
            path={article?._id ? `/article/${article._id}` : '#'}
          />
        ))
      }

    </div>
  );
};

export default Newsfeed;