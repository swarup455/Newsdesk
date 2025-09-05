import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import ProfileHeader from './ProfileBar';
import ProfileTabs from './ProfileTab';
import SquareCard from '../../components/Cards/Squarecard';
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { useEffect } from 'react';
import { fetchUserProfile} from '../../redux-toolkit/Auth/authSlice';
import { getLikedArticles } from '../../redux-toolkit/Like/likeSlice';
import { getBookmarkedArticles } from '../../redux-toolkit/Bookmark/bookmarkSlice';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../redux-toolkit/Auth/firebase';
import { ImSpinner8 } from "react-icons/im";
import ProfileEdit from '../../components/Popup/Profile/ProfileEdit';

dayjs.extend(relativeTime);

const Profile = () => {
    const [profileEditOpen, setProfileEditOpen] = useState(false);
    const dispatch = useDispatch();
    const { user, status }
        = useSelector((state) => state.auth);
    const { likedArticles, getLikedArticlesLoading, getLikedArticlesError }
        = useSelector((state) => state.like);
    const { bookmarkedArticles, getBookmarkedArticlesLoading, getBookmarkedArticlesError }
        = useSelector((state) => state.bookmark);
    const [activeTab, setActiveTab] = useState('liked');
    //dispatcjing user profile
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // ✅ Firebase restored session, now sync with backend
                dispatch(fetchUserProfile());
                dispatch(getLikedArticles());
                dispatch(getBookmarkedArticles());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);
    //dispatching liked and bookmarked articles
    useEffect(() => {
        if (user?._id) {
            dispatch(getLikedArticles(user?._id))
            dispatch(getBookmarkedArticles(user?._id))
        }
    }, [dispatch, user?._id])

    if (!user || status === "loading") {
        return <div className='h-screen w-full flex justify-center items-center'>
            <ImSpinner8 size={35} className='text-violet-600 animate-spin' />;
        </div>
    }

    return (
        <div className='w-full min-h-screen bg-neutral-100 dark:bg-neutral-800 transition-colors duration-300'>
            <ProfileEdit isOpen={profileEditOpen} onClose={() => setProfileEditOpen(false)} />
            <div className='lg:px-30 md:px-20 sm:px-15 px-5 lg:py-18 md:py-16 sm:py-13 py-10'>
                <ProfileHeader currOpen={setProfileEditOpen} user={user} />
                <div className='mt-8'>
                    <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                {getLikedArticlesLoading && activeTab === "liked" && (
                    <div className='w-full h-40 flex items-center justify-center'>
                        <AiOutlineLoading3Quarters
                            size={30}
                            className='animate-spin text-violet-500'
                        />
                    </div>
                )}
                {getBookmarkedArticlesLoading && activeTab === "bookmarked" && (
                    <div className='w-full h-40 flex items-center justify-center'>
                        <AiOutlineLoading3Quarters
                            size={30}
                            className='animate-spin text-violet-500'
                        />
                    </div>
                )}
                <main className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {activeTab === "liked" ? (
                            getLikedArticlesError ? (
                                <div className="text-red-500">Failed to load articles</div>
                            ) : (
                                Array.isArray(likedArticles) &&
                                likedArticles.map((item) => (
                                    <SquareCard
                                        key={item._id}
                                        logotext={item.author}
                                        logoImage={item.logo}
                                        image={item.thumbnail || "/defaultThumbnail.png"}
                                        title={item.title}
                                        description={item.summary}
                                        timestamp={dayjs(item.publishedAt).fromNow()}
                                        path={item?._id ? `/article/${item._id}` : '#'}
                                    />
                                ))
                            )
                        ) : (
                            getBookmarkedArticlesError ? (
                                <div className="text-red-500">Failed to load articles</div>
                            ) : (
                                Array.isArray(bookmarkedArticles) &&
                                bookmarkedArticles.map((item) => (
                                    <SquareCard
                                        key={item._id} // ✅ consistent with Mongo
                                        logotext={item.author}
                                        logoImage={item.logo}
                                        image={item.thumbnail || "/defaultThumbnail.png"}
                                        title={item.title}
                                        description={item.summary}
                                        timestamp={dayjs(item.publishedAt).fromNow()} // ✅ use consistent field
                                        path={item?._id ? `/article/${item._id}` : '#'}
                                    />
                                ))
                            ))}
                    </div>
                </main>
            </div >
        </div >
    );
}

export default Profile;