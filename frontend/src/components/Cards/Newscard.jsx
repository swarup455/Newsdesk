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
import { Heart, Bookmark, Share2 } from 'lucide-react';

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
        <article className='w-full py-5 sm:py-6 flex gap-4 sm:gap-6 items-start border-b border-neutral-200 dark:border-neutral-800'>
            <Link to={path} className='shrink-0 w-24 h-20 sm:w-40 sm:h-28 md:w-48 md:h-32 rounded-lg overflow-hidden'>
                <img
                    className='dark:brightness-90 h-full w-full object-cover'
                    src={thumbnail || "/default-thumbnail.png"}
                    alt="image" />
            </Link>

            <div className='flex-1 min-w-0 flex flex-col gap-2 sm:gap-3'>
                <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400'>
                    {logo ? (
                        <img className="h-4 w-4 sm:h-5 sm:w-5 rounded-full object-cover" src={logo} alt="logo" />
                    ) : null}
                    <p className='flex items-center text-xs sm:text-sm'>
                        {logotext}
                        <BsDot />
                        {timestamp}
                    </p>
                </div>

                <div className='flex flex-col gap-1'>
                    <Link to={path}>
                        <h1 className='text-gray-900 dark:text-gray-100 leading-snug text-sm sm:text-lg font-semibold line-clamp-2'>
                            {headline}
                        </h1>
                    </Link>
                    <Link to={path} className='hidden sm:block'>
                        <p className='leading-snug text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                            {description}
                        </p>
                    </Link>
                </div>

                <div className='flex items-center gap-1 -ml-1.5 text-neutral-500 dark:text-neutral-400'>
                    <button onClick={toggleLike} className='cursor-pointer flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'>
                        <Heart
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                            fill={like ? "currentColor" : "none"}
                            strokeWidth={1.75}
                            color={like ? "#ef4444" : "currentColor"}
                        />
                        <span className="text-xs sm:text-sm">{likedCount}</span>
                    </button>

                    <button onClick={toggleBookmark} className='cursor-pointer p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'>
                        <Bookmark
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                            fill={bookmark ? "currentColor" : "none"}
                            strokeWidth={1.75}
                        />
                    </button>

                    <button onClick={handleShare} className='cursor-pointer p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'>
                        <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={1.75} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default Newscard
