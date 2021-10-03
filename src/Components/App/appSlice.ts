import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import service from "../../Service/realworldService"
import { user } from '../../TypeScrtipt/types'
import avatar from '../Card/pictures/avatar.svg'

const initialState: {
  isLoggedIn: boolean,
  serverErrors: false | {},
  currentUser: user,
} = {
    isLoggedIn: false,
    serverErrors: false,
    currentUser: {
        error: false,
        loading: false,
        username: 'Someone',
        email: '',
        bio: null,
        password: null,
        image: avatar,
        token: ''
    }
  }

export const fetchLoginUser = createAsyncThunk('app/signin', async(data:{user:{email:string, password: string}}) => {
  const res = await service.signIn(data)
  return res
  })

export const fetchCurrentUser = createAsyncThunk('app/login', async() => {
  if (localStorage.getItem('token')) {
    const res = await service.getCurrentUser()
    return res
  }
})

export const updateUserData = createAsyncThunk('app/updateProfile', async(data:{user:user}) => {
  const res = await service.editProfile(data)
  return res
})

export const signUp = createAsyncThunk('app/signup', async (data:{user:user}) => {
  const res = await service.signUp(data)
  return res
})



const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    logOut(state, action) {
      state.isLoggedIn = false
      state.currentUser = initialState.currentUser
      localStorage.removeItem('token')
    },
    clearServerErrors(state, action) {
      state.serverErrors = false
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLoginUser.pending, (state, action) => {
        state.currentUser.loading = true
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        if (action.payload.errors) state.serverErrors = action.payload.errors
        else {
          state.currentUser.loading = false
          state.isLoggedIn = true
          state.currentUser.username = action.payload.user.username
          state.currentUser.image = action.payload.user.image ? action.payload.user.image : avatar
          state.currentUser.bio = action.payload.user.bio
          state.currentUser.email = action.payload.user.email
          localStorage.setItem('token', action.payload.user.token)
        }
        
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.currentUser.error = true
      })
      .addCase(fetchCurrentUser.pending, (state, action) => {
        state.currentUser.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser.loading = false
        state.isLoggedIn = true
        state.currentUser.username = action.payload.user.username
        state.currentUser.image = action.payload.user.image ? action.payload.user.image : avatar
        state.currentUser.bio = action.payload.user.bio
        state.currentUser.email = action.payload.user.email
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUser.loading = false
        state.currentUser.error = true
      })
      .addCase(updateUserData.pending, (state, action) => {
        state.currentUser.loading = true
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        if (action.payload.errors) state.serverErrors = action.payload.errors
        else {
          state.currentUser.loading = false
          state.currentUser.username = action.payload.user.username
          state.currentUser.image = action.payload.user.image ? action.payload.user.image : avatar
          state.currentUser.bio = action.payload.user.bio
          state.currentUser.email = action.payload.user.email
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.currentUser.loading = false
        state.currentUser.error = true
      })
      .addCase(signUp.pending, (state, action) => {
        state.currentUser.loading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload.errors) state.serverErrors = {...action.payload.errors}
        state.currentUser.loading = false
      })
      .addCase(signUp.rejected, (state, action) => {
        state.currentUser.loading = false
        state.currentUser.error = true
      })

  }
})

export const {logOut, clearServerErrors} = appSlice.actions
export default appSlice.reducer