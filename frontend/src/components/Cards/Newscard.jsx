import { FcLike } from "react-icons/fc";
import { FcLikePlaceholder } from "react-icons/fc";
import { MdOutlineShare } from "react-icons/md";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { BsDot } from "react-icons/bs";
import { useLike } from "../../customHooks/useLike";
import { useBookmark } from "../../customHooks/useBookmark";
import { toast } from "react-toastify"

function Newscard({ articleId, logo, logotext, thumbnail, headline, description, timestamp, path }) {
    const { like, likedCount, toggleLike } = useLike(articleId);
    const { bookmark, toggleBookmark } = useBookmark(articleId);

    const handleShare = async () => {
        const url = `${window.location.origin}${path}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: headline, text: description, url });
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
    return (
        <article className='h-35 sm:h-55 md:h-65 lg:h-75 w-full p-1.5 md:p-2 sm:my-5 my-3 rounded-xl overflow-hidden 
        flex justify-between items-center dark:bg-neutral-700/30 bg-white border border-neutral-200 dark:border-neutral-700'>
            <Link to={path} className='h-full aspect-[4/3] rounded-lg overflow-hidden mr-2'>
                <img
                    className='dark:brightness-90 h-full w-full object-cover'
                    src={thumbnail || "/default-thumbnail.png"}
                    alt="image" />
            </Link>
            <div className='h-full max-h-full flex flex-col flex-1 ml-2'>
                <div className='h-1/6 sm:h-1/5 w-full flex items-center justify-start gap-1 sm:gap-1.5 md:gap-2 lg:gap-4 xl:pb-2 md:pt-2'>
                    {logo ? (
                        <img className="h-1/2 aspect-square" src={logo} alt="logo" />
                    ) : null}
                    <p className='text-gray-500 dark:text-gray-400 flex items-end text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px]'>
                        {logotext}
                        <BsDot />
                        {timestamp}
                    </p>
                </div>
                <div className='overflow-hidden h-2/3 sm:h-3/5 w-full flex flex-col justify-baseline gap-2 items-start'>
                    <Link to={path}>
                        <h1 className='text-gray-900 dark:text-gray-300 leading-tight sm:text-[15px] lg:text-xl text-[11px] font-semibold'>{headline}</h1>
                    </Link>
                    <span className='hidden md:inline-block'>
                        <Link to={path}>
                            <p className='leading-tight xl:line-clamp-2 line-clamp-1 sm:text-sm text-[8px] text-gray-500 dark:text-gray-400'>{description}</p>
                        </Link>
                    </span>
                </div>
                <div className='h-1/6 sm:h-1/5 w-full flex justify-between items-center pr-2'>
                    <div className='h-full flex items-center dark:text-neutral-500 text-neutral-600'>
                        <button onClick={toggleLike}
                            className='cursor-pointer p-1 sm:p-3'>
                            {like ?
                                <FcLike className=" text-[10px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                                :
                                <FcLikePlaceholder className="text-[10px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                            }
                        </button>
                        <p className="text-[10px] sm:text-[13px] lg:text-[18px]">{likedCount}</p>
                    </div>
                    <div className='h-full flex items-center dark:text-neutral-500 text-neutral-600'>
                        <button onClick={toggleBookmark}
                            className='cursor-pointer p-1 sm:p-3'>
                            {bookmark ?
                                <IoBookmark className="text-[10px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                                :
                                <IoBookmarkOutline className="text-[10px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                            }
                        </button>
                        <button onClick={handleShare} className='cursor-pointer p-1 sm:p-3'>
                            <MdOutlineShare className="text-[10px] sm:text-[18px] md:text-[20px] lg:text-[22px]" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Newscard
