import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addLike, removeLike } from "../redux-toolkit/Like/likeSlice.js";

export function useLike(articleId) {
    const dispatch = useDispatch();
    //taking liked articles details from state
    const { likedArticles, addLikeError, removeLikeError } = useSelector((state) => state.like);
    const { articles } = useSelector((state) => state.article);
    const currentArticle = articles.find((item) => item._id === articleId);
    //checking like articles contains articled id or not
    const isLiked = likedArticles.some(article => article._id === articleId);
    //default value for like is fetched from server
    const [like, setLike] = useState(isLiked);
    const [likedCount, setLikedCount] = useState(currentArticle ? currentArticle.likedCount : 0);;
    //setLiked if isLiked changes by adding isLiked dependency
    useEffect(() => {
        setLike(isLiked);
    }, [isLiked]);

    useEffect(() => {
        if (currentArticle) setLikedCount(currentArticle.likedCount);
    }, [currentArticle]);

    //creating a function to toggle the like and dislike
    const toggleLike = async () => {
        //if else statement to check current local state
        if (like) {
            setLike(false);
            setLikedCount(likedCount - 1);
            try {
                //using unwarp() to get direct access to payload data (example-"error")
                await dispatch(removeLike({ articleId })).unwrap();
            } catch (err) {
                console.error("Remove like failed:", err || removeLikeError);
                setLike(true); // rollback
            }
        } else {
            setLike(true);
            setLikedCount(likedCount + 1)
            try {
                await dispatch(addLike({ articleId })).unwrap();
            } catch (err) {
                console.error("Add like failed:", err || addLikeError);
                setLike(false); // rollback
            }
        }
    };
    //returning like and toggleLike so that it can be destructured
    return { like, likedCount, toggleLike };
}