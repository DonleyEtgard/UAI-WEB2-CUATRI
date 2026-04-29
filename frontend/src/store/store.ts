import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/users/hooks'
import todosReducer from '../features/todos/todosSlice'
import postsReducer from '../features/posts/postsSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    posts: postsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch