import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import service from "../../Service/realworldService"


export interface articlesList{
  loading: boolean,
  error: boolean,
  articlesTotal:number,
  list: any[],
  currentPage: number,
}

const initialState: articlesList = {
    loading: true,
    error: false,
    articlesTotal: 0,
    list: [],
    currentPage: 1,
  }

export const fetchArticlesList = createAsyncThunk('app/articlesList', async(num:number) => {
  const res = await service.getArticles(num)
  return res
})

const articlesListSlice = createSlice({
  name: 'articlesList',
  initialState,
  reducers: {
    changePage(state, action) {
      state.currentPage = action.payload
    },
    loadArticles(state, action) {
      state.loading = true
    },
    favouriteArticleInList (state, action) {
      state.list = state.list.map((article:any) => {
        if (article.slug === action.payload.slug) {
          action.payload.favorited ? article.favorited = false : article.favorited = true
          action.payload.favorited ? article.favoritesCount -= 1 : article.favoritesCount += 1
          return article
        } else return article
      })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchArticlesList.fulfilled, (state, action) => {
        state.loading = false
        state.error = false
        state.articlesTotal = action.payload.articlesCount
        state.list = action.payload.articles
      })
      .addCase(fetchArticlesList.pending, (state, action) => {
        state.error = false
        state.loading = true
      })
      .addCase(fetchArticlesList.rejected, (state, action) => {
        state.loading = false
        state.error = true
      })

  }
})

export const {changePage, loadArticles, favouriteArticleInList} = articlesListSlice.actions
export default articlesListSlice.reducer