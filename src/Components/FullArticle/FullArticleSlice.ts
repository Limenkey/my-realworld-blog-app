import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import service from "../../Service/realworldService"
import avatar from '../Card/pictures/avatar.svg'

export const initialState: {
  loading:boolean,
  error: boolean,
  isFullArticle:boolean,
  serverErrors: false | {},
  mode:string,
  article: {
    title: string,
    slug: string,
    body: string,
    createdAt: string,
    tagList: string[],
    description: string,
    favorited: boolean,
    favoritesCount: number,
    author: {
      username: string,
      bio: null | string,
      image: string
    },
  }
} = {
    loading: true,
    error: false,
    isFullArticle: false,
    serverErrors: false,
    mode: 'closed',
    article: {
      title: 'Title',
      slug: 'initial-mockup',
      body: '#Some text ##More of that',
      createdAt: 'Sep 15 2021',
      tagList: [],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris  nisi ut aliquip ex ea commodo consequat. ',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'someone',
        bio: null,
        image: avatar,
      },
    },
  }

export const fetchFullArticle = createAsyncThunk('app/fullArticle', async (slug:string) => {
  const res = await service.getFullArticle(slug)
  return res
})

export const createNewArticle = createAsyncThunk('app/fullArticle/create', async (data:any) => {
  const res = await service.createNewArticle(data)
  return res
})

export const deleteArticle = createAsyncThunk('app/fullArticle/delete', async (slug:string) => {
  return await service.deleteArticle(slug)
})

export const updateArticle = createAsyncThunk('app/fullArticle/edit', async (data:any) => {
  return  await service.editArticle(data)
})

export const likeArticle = createAsyncThunk('app/fullArticle/like', async (slug:string) => {
  return await service.likeArticle(slug)
})

export const unlikeArticle = createAsyncThunk('app/fullArticle/unlike', async(slug:string) => {
  return await service.unlikeArticle(slug)
})

const fullArticleSlice = createSlice({
    name: 'fullArticle',
    initialState,
    reducers: {
      setFullArticle(state, action) {
        state.isFullArticle = true
        state.mode = 'browsing'
        state.loading = true
      },
      closeFullArticle(state, action) {
        state.isFullArticle = false
        state.mode = 'closed'
      },
      createNewArticle(state, action) {
        state.mode = 'new'
      },
      editArticle(state, action) {
        state.mode = 'editing'
      },
      toggleLikeArticle(state, action) {
        if (!state.article.favorited) {
          state.article.favorited = true
          state.article.favoritesCount += 1
        } else {
          state.article.favorited = false
          state.article.favoritesCount -= 1
        }
      }
    },
    extraReducers(builder) {
      builder
        .addCase(fetchFullArticle.fulfilled, (state, action) => {
          if (action.payload.errors) {
            state.loading = false
            state.serverErrors = {...action.payload}
          } else {
            state.loading = false
            state.error = false
            state.article = action.payload.article
            state.isFullArticle = true
          }
          
        })
        .addCase(fetchFullArticle.pending, (state, action) => {
          state.error = false
          state.isFullArticle = true
          state.loading = true
        })
        .addCase(fetchFullArticle.rejected, (state, action) => {
          state.loading = false
          state.error = true
        })
        .addCase(createNewArticle.pending, (state, action) => {
          state.error = false
          state.loading = true
        })
        .addCase(createNewArticle.fulfilled, (state, action) => {
          state.error = false
          state.loading = false
          state.isFullArticle = true
          state.article = action.payload.article
        })
        .addCase(createNewArticle.rejected, (state, action) => {
          state.loading = false
          state.error = true
        })
        .addCase(deleteArticle.pending, (state, action) => {
          state.error = false
          state.loading = true
        })
        .addCase(deleteArticle.fulfilled, (state, action) => {
          state.error = false
          state.loading = false
          state.isFullArticle = false
          state.article = initialState.article
        })
        .addCase(deleteArticle.rejected, (state, action) => {
          state.loading = false
          state.error = true
        })
        .addCase(updateArticle.pending, (state, action) => {
          state.error = false
          state.loading = true
        })
        .addCase(updateArticle.fulfilled, (state, action) => {
          state.error = false
          state.loading = false
          state.isFullArticle = true
          state.article = action.payload.article
        })
        .addCase(updateArticle.rejected, (state, action) => {
          state.loading = false
          state.error = true
        })

  
    }
  })


export const {setFullArticle, closeFullArticle, editArticle, toggleLikeArticle} = fullArticleSlice.actions
export default fullArticleSlice.reducer
 // ad-4eyb7h