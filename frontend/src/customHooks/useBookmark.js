import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../redux-toolkit/Bookmark/bookmarkSlice";
import { useState, useEffect } from "react";

export function useBookmark(articleId){
    const dispatch = useDispatch();
    //taking states from redux
    const {bookmarkedArticles, addBookmarkError, removeBookmarkError} = useSelector((state) => state.bookmark)

    //checking bookmarked articles contains articled id or not
        const isBookmark = bookmarkedArticles.some(article => article._id === articleId);
        //default value for bookmark is fetched from server
        const [bookmark, setBookmark] = useState(isBookmark);
    
        //setBookmark if isBookmark changes by adding isBookmark dependency
        useEffect(() => {
            setBookmark(isBookmark);
        }, [isBookmark]);
    
        //creating a function to toggle the bookmark
        const toggleBookmark = async () => {
            //if else statement to check current local state
            if (bookmark) {
                setBookmark(false);
                try {
                    //using unwarp() to get direct access to payload data (example-"error")
                    await dispatch(removeBookmark({ articleId })).unwrap();
                } catch (err) {
                    console.error("Remove like failed:", err || removeBookmarkError);
                    setBookmark(true); // rollback
                }
            } else {
                setBookmark(true);
                try {
                    await dispatch(addBookmark({ articleId })).unwrap();
                } catch (err) {
                    console.error("Add like failed:", err || addBookmarkError);
                    setBookmark(false); // rollback
                }
            }
        };
        //returning bookmark and toggleBookmark so that it can be destructured
        return { bookmark, toggleBookmark };
}