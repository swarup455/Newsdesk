import Navbar from "./components/Header/Navbar"
import { Outlet } from "react-router-dom"
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserProfile } from "./redux-toolkit/Auth/authSlice.js"
import categories from "./components/Header/data.js"
import { setCategories } from "./redux-toolkit/Article/articleSlice.js"
import { fetchArticles } from "./redux-toolkit/Article/articleSlice.js"
import { useSelector } from "react-redux"
import { getLikedArticles } from "./redux-toolkit/like/likeSlice.js"
import { getBookmarkedArticles } from "./redux-toolkit/Bookmark/bookmarkSlice.js"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./redux-toolkit/Auth/firebase.js"

function Layout() {

  const { articles } = useSelector((state) => state.article)
  const defaultCategories = categories.map((c) => c.id);

  const dispatch = useDispatch();

  //to dispatch user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //Firebase restored session, now sync with backend
        dispatch(fetchUserProfile());
        dispatch(getLikedArticles());
        dispatch(getBookmarkedArticles())
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  //to dispatch set categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(setCategories(defaultCategories));
    }
  }, [dispatch, categories.length]);

  //to dispatch articles
  useEffect(() => {
    if (articles.length === 0) {
      dispatch(fetchArticles());
    }
  }, [dispatch, articles.length]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout