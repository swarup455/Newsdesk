import { IoIosArrowBack } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchArticles, clearResults } from "../../redux-toolkit/Article/articleSlice";
import { ImSpinner8 } from "react-icons/im";
import Newscard from "../../components/Cards/Newscard";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const { searchResults, loading, error } = useSelector((state) => state.article);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            dispatch(clearResults());
        };
    }, [dispatch]);
    const handleSearch = () => {
        if (query) {
            dispatch(searchArticles(query));
        }
    };
    const removeQuery = () => {
        setQuery("");
    };
    const handleBack = () => {
        navigate("/");
    };
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-800">
            <div className="w-full flex flex-row gap-2 sticky top-0 z-40 bg-white dark:bg-neutral-800 p-5 border-b border-b-neutral-100 dark:border-b-neutral-700/30">
                <button
                    className="cursor-pointer text-neutral-400 dark:text-neutral-600"
                    onClick={handleBack}
                >
                    <IoIosArrowBack size={25} />
                </button>
                <div className="h-13 w-full max-w-md mx-auto rounded-xl p-2 flex flex-1 items-center bg-neutral-100/30 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700/30">
                    <GoSearch className="cursor-pointer text-gray-700 dark:text-gray-200" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        placeholder="Search here"
                        className="placeholder-gray-400 dark:text-white text-black w-full px-4 py-3 focus:outline-none"
                    />
                    <button
                        onClick={removeQuery}
                        className={`mx-3 cursor-pointer ${(!query || !query.trim()) && "hidden"}`}
                    >
                        <RxCross2 size={20} className="dark:text-neutral-300 text-neutral-700 " />
                    </button>
                </div>
            </div>
            <h2 className="my-5 lg:mx-30 md:mx-20 sm:mx-15 mx-5 text-xl sm:text-2xl font-semibold dark:text-neutral-100 text-neutral-700">
                Search Results
            </h2>

            <div className="lg:px-30 md:px-20 sm:px-15 px-5">
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <ImSpinner8 className="animate-spin text-violet-500" size={28} />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center mt-10">{error || error.message}</div>
                ) : searchResults.length > 0 ? (
                    searchResults.map((article) => (
                        <Newscard
                            key={article?._id}
                            articleId={article?._id}
                            logo={article?.logo}
                            logotext={(article?.author || "").split(".")[0].replace(/[\/\\]/g, "")}
                            thumbnail={article?.thumbnail || "/defaultThumbnail.png"}
                            headline={article?.title}
                            description={article?.summary}
                            timestamp={dayjs(article?.publishedAt).fromNow()}
                            path={article?._id ? `/article/${article._id}` : "#"}
                        />
                    ))
                ) : (
                    <p className="text-center text-neutral-500 mt-10">No results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;