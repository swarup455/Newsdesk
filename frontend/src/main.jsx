import Layout from './Layout.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Newsfeed from './pages/Newsfeed/Newsfeed'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/ThemeSwitcher.jsx'
import Profile from './pages/ProfilePage/ProfilePage.jsx'
import NewsArticle from './pages/NewsArticle/NewsArticle.jsx'
import SearchResults from './pages/Newsfeed/Searchedfeed.jsx'
import SearchPage from './pages/Newsfeed/SearchPage.jsx'

//Creating routers for multi pages access
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<Newsfeed />} />
        <Route path='category/:categoryId' element={<Newsfeed />} />
        <Route path="/article/:articleId" element={<NewsArticle />} />
        <Route path="/category/:categoryId/article/:articleId" element={<NewsArticle />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
      <Route path='/profile/:userId' element={<Profile />} />
      <Route path="/search-page" element={<SearchPage />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
