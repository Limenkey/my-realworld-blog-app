import { configureStore } from '@reduxjs/toolkit';
import articlesListReducer from '../Components/ArticlesList/articlesListSlice';
import fullArticleReducer from '../Components/FullArticle/FullArticleSlice'
import appReducer from '../Components/App/appSlice'


export default configureStore({
  reducer: {
    app: appReducer,
    articlesList: articlesListReducer,
    fullArticle: fullArticleReducer,
  },
  devTools: true,
})