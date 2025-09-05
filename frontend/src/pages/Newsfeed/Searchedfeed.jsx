import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { searchArticles } from "../../redux-toolkit/Article/articleSlice";
import { clearResults } from "../../redux-toolkit/Article/articleSlice";
import { ImSpinner8 } from "react-icons/im";
import Newscard from "../../components/Cards/Newscard";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

const SearchResults = () => {
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query");
    const { searchResults, loading, error } = useSelector((state) => state.article);

    const dispatch = useDispatch();
    useEffect(() => {
        if (query) {
            dispatch(searchArticles(query));
        }
        return () => {
            dispatch(clearResults());
        };
    }, [query, dispatch]);

    if (loading) {
        return <div className="inset-0"><ImSpinner8 className="animate-spin" /></div>;
    }
    if (error) {
        return <div className="text-red-500 sm:text-xl text-lg w-full text-center mt-10">{error}</div>;
    }
    
    return (
        <div className='lg:px-30 md:px-20 sm:px-15 px-5'>
            <h2 className="my-5 text-xl sm:text-2xl font-semibold dark:text-neutral-100 text-neutral-700">Search Results</h2>
            {searchResults.map((article) => (
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
            ))}
        </div>
    );
}

export default SearchResults