import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
import { FcLike } from "react-icons/fc";
import { FcLikePlaceholder } from "react-icons/fc";
import { MdOutlineShare } from "react-icons/md";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { useLike } from "../../customHooks/useLike";
import { useBookmark } from "../../customHooks/useBookmark";
import { ImSpinner8 } from "react-icons/im";
import { BsStars } from "react-icons/bs";
import { getAiSummary } from "../../redux-toolkit/Article/articleSlice";
import { toast } from "react-toastify"
import { useState } from "react";
import { useTypewriter } from "../../customHooks/useTypewriter";

dayjs.extend(relativeTime);

const NewsArticle = () => {
    const { articleId } = useParams()
    const { articles, aiSummary, summaryLoading, summaryError, loading, error } = useSelector((state) => state.article)
    const getArticle = articles.find(article => article._id === articleId);
    const { like, toggleLike } = useLike(articleId)
    const { bookmark, toggleBookmark } = useBookmark(articleId)
    
    const [summary, setSummary] = useState(false)

    const handleShare = async () => {
        const url = `${window.location.origin}${getArticle?._id ? `/article/${getArticle._id}` : '#'}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: getArticle.title, text: getArticle.description, url });
            } catch (err) {
                console.warn("Share canceled:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard✅");
            } catch (err) {
                toast.error("Failed to copy link❌");
            }
        }
    };
    const dispatch = useDispatch();
    const toggleAiSummary = (id) => {
        if (summary) {
            setSummary(false)
        } else {
            setSummary(true)
            dispatch(getAiSummary(id))
        }
    }
    const summaryText = useTypewriter(aiSummary, 10, summary)

    if (loading) {
        return <div className='h-screen fixed top-0 w-full flex justify-center items-center'>
            <ImSpinner8 size={35} className='text-violet-600 animate-spin' />
        </div>
    }
    if (error) {
        return <div>Error loading articles: {error.message || error}</div>;
    }
    if (!getArticle) {
        return <div> Article not found</div>;
    }
    return (
        <div className="lg:px-30 md:px-20 sm:px-15 px-5 ">
            <h1 className="underline text-xl sm:text-2xl md:text-3xl lg:text-4xl my-10 font-semibold dark:text-gray-300 text-gray-800">
                {getArticle.title}
            </h1>
            <p className="text-lg my-10 dark:text-gray-400 text-gray-700">
                {getArticle.summary}{" "}
                <a href={getArticle.sourceLink} target="_blank" className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400 font-semibold">Read More</a>
            </p>
            <div className="w-full sm:w-3/4 space-y-5">
                <button
                    className="cursor-pointer flex items-center gap-1 p-3 dark:text-neutral-100 text-neutral-700 border dark:border-neutral-700 border-neutral-300 rounded-xl"
                    onClick={() => toggleAiSummary(articleId)}
                >
                    <BsStars />
                    Ai Summary
                </button>
                {summary &&
                    <div className="border border-neutral-300 dark:border-neutral-700 rounded-xl">
                        {!summaryLoading && aiSummary &&
                            <p className="dark:text-neutral-300 text-neutral-700 text-sm sm:text-[16px] p-5">
                                {summaryText}
                            </p>
                        }
                        {summaryError &&
                            <p className="dark:text-neutral-300 text-neutral-700 text-sm sm:text-[16px] p-5">
                                {summaryError}
                            </p>
                        }
                        {summaryLoading &&
                            <div className="flex items-center  dark:text-neutral-200 text-neutral-700 gap-2 p-5 ">
                                <ImSpinner8 className="animate-spin" />
                                Generating Summary...
                            </div>
                        }
                    </div>
                }
            </div>
            <div className="w-full flex my-10 flex-col justify-start gap-3">
                <div className="flex items-center gap-3">
                    <img className="h-5 w-5 rounded-full" src={getArticle.logo} alt="logo" />
                    <p className="dark:text-gray-400 text-gray-400 my-4 text-sm">{(getArticle.author).split('.')[0].replace(/[\/\\]/g, "")}</p>
                    <p className="border-x-2 px-3 border-x-gray-600 dark:text-gray-400 text-gray-400 my-4 text-sm">{dayjs(getArticle.published_at).fromNow()}</p>
                    <button onClick={toggleLike}>
                        {like ?
                            <FcLike className=" cursor-pointer text-[13px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                            :
                            <FcLikePlaceholder className=" cursor-pointer text-[13px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                        }
                    </button>
                    <button onClick={toggleBookmark}>
                        {bookmark ?
                            <IoBookmark className=" dark:text-neutral-300 text-neutral-800 cursor-pointer text-[13px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                            :
                            <IoBookmarkOutline className=" dark:text-neutral-300 text-neutral-800 cursor-pointer text-[13px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                        }
                    </button>
                    <button onClick={handleShare}>
                        <MdOutlineShare className=" dark:text-neutral-300 text-neutral-800 cursor-pointer text-[13px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                    </button>
                </div>
                {getArticle?.thumbnail &&
                    <img
                        className="w-full rounded-lg dark:brightness-80 sm:w-3/4 aspect-video object-cover"
                        src={getArticle.thumbnail} alt="news thumbnail"
                    />
                }
            </div>
        </div>
    )
}

export default NewsArticle